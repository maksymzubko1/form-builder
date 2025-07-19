import { prisma } from '@/lib/prisma';
import { sendResetMail } from '@/lib/email';
import { createToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { ROUTES } from '@/constants/routes';
import { ResetSchema } from '@/types/reset-password';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parse = ResetSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
    }

    const { email } = body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const token = await createToken(user.id, 'reset');
      const resetPasswordLink = `${process.env.NEXTAUTH_URL}/${ROUTES.RESET_TOKEN(token)}`;
      await sendResetMail({
        to: email,
        resetUrl: resetPasswordLink,
      });
    }
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unhandled error';
    console.log('[API][Reset password][POST]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
