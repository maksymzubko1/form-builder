import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EmailSchema } from '@/types/forms';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { email } = await req.json();

    const parse = EmailSchema.safeParse({email});
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
      }
    });
    return NextResponse.json({ ok: true });
  } catch (e){
    console.log(e);
    return NextResponse.json({ error: 'Failed to register view' }, { status: 500 });
  }
}