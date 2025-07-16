import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PayloadSchema } from './types';
import { makeFormSchemaServer } from '@/types/public-forms';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
      select: { isPublished: true },
    });
    if (!form || !form.isPublished) {
      return NextResponse.json({ error: 'Form not found or unpublished' }, { status: 400 });
    }

    await prisma.formSubmission.deleteMany({
      where: { formId: id, email, isDraft: true }
    });

    await prisma.formSubmission.create({
      data: {
        formId: id,
        email,
        data: rest,
        isDraft: false
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
