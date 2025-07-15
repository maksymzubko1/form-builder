import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; submissionId: string }> },
): Promise<NextResponse<{ ok: boolean } | { error: string }>> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { submissionId, id } = await params;

  await prisma.formSubmission.delete({
    where: { id: submissionId, formId: id },
  });
  return NextResponse.json({ ok: true });
}
