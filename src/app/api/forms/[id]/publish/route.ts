import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { isPublished } = await req.json();

  const form = await prisma.form.findUnique({ where: { id: params.id } });
  if (!form ) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if(form.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const updated = await prisma.form.update({
    where: { id: params.id },
    data: { isPublished: Boolean(isPublished), updatedAt: new Date() }
  });

  return NextResponse.json({ form: updated });
}
