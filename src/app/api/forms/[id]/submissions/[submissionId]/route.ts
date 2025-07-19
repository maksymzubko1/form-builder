import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface DeleteProps {
  params: Promise<{ id: string; submissionId: string }>;
}

export async function DELETE(
  _req: Request,
  { params }: DeleteProps,
): Promise<
  NextResponse<
    | { ok: boolean }
    | {
        error: string;
      }
  >
> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { submissionId, id } = await params;

    await prisma.formSubmission.delete({
      where: { id: submissionId, formId: id },
    });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unhandled error';
    console.log('[API][Submissions/[id]][DELETE]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
