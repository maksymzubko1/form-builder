import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/api/auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import { FormSchema } from '@/types/forms/forms';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const search = url.searchParams.get('search') ?? '';
    const status = url.searchParams.get('status');
    const order = url.searchParams.get('order');
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 20;

    const where: Prisma.FormWhereInput = {
      userId: session.user.id,
      ...(search && { title: { contains: search, mode: 'insensitive' } }),
      ...(status === 'published'
        ? { isPublished: true }
        : status === 'draft'
          ? { isPublished: false }
          : {}),
    };

    const orderBy: Prisma.FormOrderByWithAggregationInput = {
      ...(order ? { [order.split('_')[0]]: order.split('_')[1] } : { updatedAt: 'desc' }),
    };

    const [forms, total] = await Promise.all([
      prisma.form.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          isPublished: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.form.count({ where }),
    ]);

    return NextResponse.json({ forms, total });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unhandled error';
    console.log('[API][Forms][GET]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const parse = FormSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
    }

    const { title, description, content, emailNotification } = body;

    const form = await prisma.form.create({
      data: {
        userId: session.user.id,
        title,
        description,
        notifyOnSubmission: emailNotification,
        content,
      },
      select: {
        id: true,
        title: true,
        description: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ form });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unhandled error';
    console.log('[API][Forms][POST]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
