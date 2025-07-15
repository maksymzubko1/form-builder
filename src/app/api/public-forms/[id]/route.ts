import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const form = await prisma.form.findUnique({
    where: { id: (await params).id },
    select: {
      id: true,
      title: true,
      description: true,
      content: true,
      isPublished: true
    }
  });

  if (!form || !form.isPublished) {
    return NextResponse.json({ error: 'Form not found or unpublished' }, { status: 404 });
  }

  return NextResponse.json({ form });
}
