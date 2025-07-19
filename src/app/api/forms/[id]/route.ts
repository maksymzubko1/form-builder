import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/api/auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import { FormSchema } from '@/types/forms';

interface GetProps {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: GetProps) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const form = await prisma.form.findUnique({ where: { id: (await params).id } });

    if (!form) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (form.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ form });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unhandled error';
    console.log('[API][Forms/[id]][GET]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

interface PatchProps {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: PatchProps) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const parse = FormSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
    }

    const id = (await params).id;
    const form = await prisma.form.findUnique({ where: { id } });
    if (!form) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (form.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { emailNotification, ...rest } = body;

    const updated = await prisma.form.update({
      where: { id },
      data: { ...rest, notifyOnSubmission: emailNotification, updatedAt: new Date() },
      select: { id: true, title: true, description: true, isPublished: true, updatedAt: true },
    });

    return NextResponse.json({ form: updated });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unhandled error';
    console.log('[API][Forms/[id]][PATCH]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

interface DeleteProps {
  params: Promise<{ id: string }>;
}

export async function DELETE(_req: NextRequest, { params }: DeleteProps) {
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

    await prisma.form.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unhandled error';
    console.log('[API][Forms/[id]][DELETE]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
