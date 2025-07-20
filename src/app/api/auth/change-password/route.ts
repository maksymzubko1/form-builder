import { getServerSession } from 'next-auth';
import { authOptions } from '@/api/auth/[...nextauth]/options';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { ChangePasswordSchema } from '@/types/auth/change-password';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const body = await req.json();
    const parse = ChangePasswordSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
    }

    const passwordHash = await hash(body.password, 10);
    await prisma.user.update({
      where: { email: session.user.email },
      data: { passwordHash },
    });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unhandled error';
    console.log('[API][Change password][POST]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
