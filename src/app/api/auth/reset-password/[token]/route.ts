import { prisma } from '@/lib/prisma';
import { consumeToken } from '@/lib/auth';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';
import { ResetTokenSchema, ETokenResetCode } from '@/types/reset-password';

interface PostProps {
  params: Promise<{ token: string }>;
}

export async function POST(req: Request, { params }: PostProps) {
  try {
    const { token } = await params;
    const body = await req.json();
    const parse = ResetTokenSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
    }

    const { password } = body;
    const userId = await consumeToken(token, 'reset');
    if (!userId)
      return NextResponse.json({ error: ETokenResetCode.INVALID_TOKEN }, { status: 400 });

    const passwordHash = await hash(password, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unhandled error';
    console.log('[API][Reset password/[token]][POST]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
