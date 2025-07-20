import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';
import { sendConfirmationMail } from '@/lib/email';
import { createToken } from '@/lib/auth';
import { ROUTES } from '@/constants/routes';
import { RegisterSchema, ERegisterResponseCode } from '@/types/auth/register';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parse = RegisterSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: ERegisterResponseCode.FIELDS_REQUIRED }, { status: 400 });
    }
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: ERegisterResponseCode.USER_EXIST }, { status: 409 });
    }

    const passwordHash = await hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash },
    });

    const token = await createToken(user.id, 'verify');
    const confirmUrl = `${process.env.NEXTAUTH_URL}/${ROUTES.VERIFY_TOKEN(token)}`;

    await sendConfirmationMail({ to: email, confirmUrl });

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unhandled error';
    console.log('[API][Register][POST]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
