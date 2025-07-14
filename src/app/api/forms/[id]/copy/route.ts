import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await prisma.form.findUnique({ where: { id: params.id } });
  if (!form ) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if(form.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const newForm = await prisma.form.create({
    data: {
      userId: session.user.id,
      title: form.title + ' (Copy)',
      description: form.description,
      content: form.content,
      isPublished: false
    }
  });

  return NextResponse.json({ form: newForm });
}
