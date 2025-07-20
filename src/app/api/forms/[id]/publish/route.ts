import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/api/auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';

interface PostProps {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: PostProps) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { isPublished } = await req.json();

    const id = (await params).id;
    const form = await prisma.form.findUnique({ where: { id } });
    if (!form) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (form.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await prisma.form.update({
      where: { id },
      data: { isPublished: Boolean(isPublished), updatedAt: new Date() },
    });

    return NextResponse.json({ form: updated });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unhandled error';
    console.log('[API][Forms/[id]/publish][POST]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
