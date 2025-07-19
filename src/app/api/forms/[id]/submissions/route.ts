import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SubmissionsFilterSchema } from '@/app/admin/forms/[id]/submissions/types';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Submission } from '@/types/submissions';
import { Prisma } from '@prisma/client';

interface GetProps {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: GetProps): Promise<NextResponse<{
  data: Submission[];
  total: number
} | { error: string }>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const filter = {
      email: url.searchParams.get('email') || undefined,
      from: url.searchParams.get('from') || undefined,
      to: url.searchParams.get('to') || undefined,
      query: url.searchParams.get('query') || undefined,
      order: url.searchParams.get('order') || undefined,
    };

    const parse = SubmissionsFilterSchema.safeParse(filter);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
    }

    const page = Number(url.searchParams.get('page') ?? 1);
    const perPage = Number(url.searchParams.get('perPage') ?? 20);

    const where: Prisma.FormSubmissionWhereInput = {
      formId: (await params).id,
      email: filter.email,
      submittedAt: {
        gte: filter.from,
        lte: filter.to,
      },
    };
    const orderBy: Prisma.FormSubmissionOrderByWithAggregationInput = filter.order
      ? { [filter.order.split('_')[0]]: filter.order.split('_')[1] } : { submittedAt: 'desc' };

    const [total, submissions] = await Promise.all([
      prisma.formSubmission.count({ where }),
      prisma.formSubmission.findMany({
        where,
        orderBy,
        skip: (page - 1) * perPage,
        take: perPage,
      }),
    ]);
    return NextResponse.json({ data: submissions, total });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unhandled error';
    console.log('[API][Submissions][GET]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

interface DeleteProps {
  params: Promise<{ id: string }>;
}

export async function DELETE(_req: Request, { params }: DeleteProps): Promise<NextResponse<{ ok: boolean } | {
  error: string
}>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await prisma.formSubmission.deleteMany({ where: { formId: (await params).id } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unhandled error';
    console.log('[API][Submissions][DELETE]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
