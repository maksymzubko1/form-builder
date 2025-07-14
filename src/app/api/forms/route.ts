import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { FormSchema } from '@/types/forms';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const forms = await prisma.form.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true, title: true, description: true, isPublished: true, createdAt: true, updatedAt: true
    }
  });
  return NextResponse.json({ forms });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parse = FormSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
  }

  const { title, description, content } = body;

  const form = await prisma.form.create({
    data: {
      userId: session.user.id,
      title,
      description,
      content,
    },
    select: {
      id: true, title: true, description: true, isPublished: true, createdAt: true, updatedAt: true
    }
  });

  return NextResponse.json({ form });
}
