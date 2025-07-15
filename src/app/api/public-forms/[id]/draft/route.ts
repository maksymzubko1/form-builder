import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EmailSchema } from '@/types/forms';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const email = req.nextUrl.searchParams.get('email');
  const parse = EmailSchema.safeParse({email});
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
  }

  const draft = await prisma.formSubmission.findFirst({
    where: { formId: (await params).id, email, isDraft: true },
    orderBy: { submittedAt: 'desc' }
  });

  return NextResponse.json({ draft: draft ? draft.data : null });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { email, data } = await req.json();

    const parse = EmailSchema.safeParse({email});
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
    }

    const id = (await params).id;

    const draft = await prisma.formSubmission.findFirst({
      where: { formId: id, email, isDraft: true }
    });

    if (draft) {
      await prisma.formSubmission.update({
        where: { id: draft.id },
        data: { data, submittedAt: new Date() }
      });
    } else {
      await prisma.formSubmission.create({
        data: {
          formId: id,
          email,
          data,
          isDraft: true
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 });
  }
}
