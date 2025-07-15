import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SubmissionsFilterSchema } from '@/app/admin/forms/[id]/submissions/types';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Submission } from '@/types/submissions';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<{ data: Submission[]; total: number } | { error: string }>> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const filter = {
    email: url.searchParams.get('email') || undefined,
    from: url.searchParams.get('from') || undefined,
    to: url.searchParams.get('to') || undefined,
    query: url.searchParams.get('query') || undefined,
  };

  const parse = SubmissionsFilterSchema.safeParse(filter);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
  }

  const page = Number(url.searchParams.get('page') ?? 1);
  const perPage = Number(url.searchParams.get('perPage') ?? 20);

  const where: Record<string, unknown> = { formId: (await params).id };
  if (filter.email) where.email = filter.email;
  if (filter.from || filter.to) where.submittedAt = {};
  if (filter.from) where.submittedAt.gte = new Date(filter.from);
  if (filter.to) where.submittedAt.lte = new Date(filter.to);

  const [total, submissions] = await Promise.all([
    prisma.formSubmission.count({ where }),
    prisma.formSubmission.findMany({
      where,
      orderBy: { submittedAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
  ]);
  return NextResponse.json({ data: submissions, total });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<{ ok: boolean } | { error: string }>> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.formSubmission.deleteMany({ where: { formId: (await params).id } });
  return NextResponse.json({ ok: true });
}
