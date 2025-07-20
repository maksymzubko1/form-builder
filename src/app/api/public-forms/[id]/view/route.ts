import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EmailSchema } from '@/types/forms/forms';

interface PostProps {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: PostProps) {
  try {
    const { email } = await req.json();

    const parse = EmailSchema.safeParse({ email });
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
    }

    const id = (await params).id;

    const ip = req.headers.get('x-forwarded-for') || '';
    await prisma.formView.create({
      data: {
        formId: id,
        viewerIp: ip,
        viewerEmail: email,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unhandled error';
    console.log('[API][Public forms/[id]/view][POST]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
