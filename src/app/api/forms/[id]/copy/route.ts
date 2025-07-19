import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/api/auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';

interface PostProps {
  params: Promise<{ id: string }>;
}

export async function POST(_req: NextRequest, { params }: PostProps) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const id = (await params).id;
    const form = await prisma.form.findUnique({ where: { id } });
    if (!form) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (form.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const newForm = await prisma.form.create({
      data: {
        userId: session.user.id,
        title: form.title + ' (Copy)',
        description: form.description,
        content: form.content,
        isPublished: false,
      },
    });

    return NextResponse.json({ form: newForm });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unhandled error';
    console.log('[API][Forms/[id]/copy][POST]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
