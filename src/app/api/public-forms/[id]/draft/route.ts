import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EmailSchema } from '@/types/forms';

interface GetProps {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: GetProps) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email') || undefined;

    const parse = EmailSchema.safeParse({ email });
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
    }

    const draft = await prisma.formSubmission.findFirst({
      where: { formId: (await params).id, email, isDraft: true },
      orderBy: { submittedAt: 'desc' },
    });

    return NextResponse.json({ draft: draft ? draft.data : null });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unhandled error';
    console.log('[API][Public forms/[id]/draft][GET]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

interface PostProps {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: PostProps) {
  try {
    const { email, data } = await req.json();

    const parse = EmailSchema.safeParse({ email });
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
    }

    const id = (await params).id;

    const draft = await prisma.formSubmission.findFirst({
      where: { formId: id, email, isDraft: true },
    });

    if (draft) {
      await prisma.formSubmission.update({
        where: { id: draft.id },
        data: { data, submittedAt: new Date() },
      });
    } else {
      await prisma.formSubmission.create({
        data: {
          formId: id,
          email,
          data,
          isDraft: true,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to save draft';
    console.log('[API][Public forms/[id]/draft][POST]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
