import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PayloadSchema } from './types';
import { makeFormSchemaServer } from '@/lib/public-forms/utils';
import { sendNewSubmissionEmail } from '@/lib/email';

interface PostProps {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: PostProps) {
  try {
    const body = await req.json();
    const id = (await params).id;
    const { fields, data } = body;

    const schema = makeFormSchemaServer(fields);

    const parse = PayloadSchema(schema).safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
    }

    const { email, ...rest } = data;

    const form = await prisma.form.findUnique({
      where: { id },
      select: { isPublished: true, notifyOnSubmission: true, user: true, title: true },
    });
    if (!form || !form.isPublished) {
      return NextResponse.json({ error: 'Form not found or unpublished' }, { status: 400 });
    }

    await prisma.formSubmission.deleteMany({
      where: { formId: id, email, isDraft: true },
    });

    const submission = await prisma.formSubmission.create({
      data: {
        formId: id,
        email,
        data: rest,
        isDraft: false,
      },
    });

    const prepared = Object.entries(
      rest as Record<
        string,
        {
          label?: string;
          value: string;
        }
      >,
    ).map(([key, value]) => ({ label: value?.label || key, value: value.value }));

    if (form?.notifyOnSubmission && form.user?.email) {
      await sendNewSubmissionEmail({
        to: form.user.email,
        formTitle: form.title as string,
        submission: prepared,
        submittedAt: submission.submittedAt.toLocaleDateString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unhandled error';
    console.log('[API][Public forms/[id]/submit][POST]', message);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
