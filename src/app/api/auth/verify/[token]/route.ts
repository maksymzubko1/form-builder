import { prisma } from '@/lib/prisma';
import { consumeToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { EVerifyResponseStatus } from '@/types/verify';

interface GetProps {
  params: Promise<{ token: string }>;
}

export async function GET(_req: Request, { params }: GetProps) {
  try {
    const { token } = await params;

    const userId = await consumeToken(token, 'verify');
    if (!userId) {
      return NextResponse.json({
        status: EVerifyResponseStatus.ERROR,
        message: 'Invalid or expired token',
      }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { emailVerified: true },
    });

    if (!user) {
      return NextResponse.json({ status: EVerifyResponseStatus.ERROR, message: 'User not found' }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({
        status: EVerifyResponseStatus.ALREADY_VERIFIED,
        message: 'Email already verified',
      }, { status: 200 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: new Date() },
    });

    return NextResponse.json({
      status: EVerifyResponseStatus.SUCCESS,
      message: 'Email successfully verified',
    }, { status: 200 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unhandled error';
    console.log('[API][Verify/[token]][GET]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }

}
