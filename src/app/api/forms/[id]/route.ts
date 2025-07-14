import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { FormSchema } from '@/types/forms';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await prisma.form.findUnique({ where: { id: params.id } });
  if (!form ) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if(form.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({ form });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parse = FormSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
  }

  const form = await prisma.form.findUnique({ where: { id: params.id } });
  if (!form ) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if(form.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const updated = await prisma.form.update({
    where: { id: params.id },
    data: { ...body, updatedAt: new Date() },
    select: { id: true, title: true, description: true, isPublished: true, updatedAt: true }
  });

  return NextResponse.json({ form: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await prisma.form.findUnique({ where: { id: params.id } });
  if (!form ) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if(form.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await prisma.form.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
