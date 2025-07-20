import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface GetProps {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: GetProps) {
  try {
    const form = await prisma.form.findUnique({
      where: { id: (await params).id },
      select: {
        id: true,
        title: true,
        description: true,
        content: true,
        isPublished: true,
      },
    });

    if (!form || !form.isPublished) {
      return NextResponse.json({ error: 'Form not found or unpublished' }, { status: 404 });
    }

    return NextResponse.json({ form });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unhandled error';
    console.log('[API][Public forms/[id]][GET]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
