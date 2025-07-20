import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SubmissionsFilterSchema } from '@/app/admin/forms/[id]/submissions/types';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { Prisma } from '@prisma/client';

interface GetProps {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: GetProps) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const filter = {
      email: url.searchParams.get('email') || undefined,
      from: url.searchParams.get('from') || undefined,
      to: url.searchParams.get('to') || undefined,
    };

    const parse = SubmissionsFilterSchema.safeParse(filter);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.issues[0].message }, { status: 400 });
    }

    const id = (await params).id;

    const where: Prisma.FormSubmissionWhereInput = {
      formId: id,
      email: filter.email,
      submittedAt: {
        gte: filter.from,
        lte: filter.to,
      },
    };
    const whereFormView: Prisma.FormViewWhereInput = {
      formId: id,
      viewerEmail: filter.email,
      viewedAt: {
        gte: filter.from,
        lte: filter.to,
      },
    };

    const [total, submissions, totalViews] = await Promise.all([
      prisma.formSubmission.count({ where: { formId: (await params).id } }),
      prisma.formSubmission.findMany({
        where,
        orderBy: { submittedAt: 'asc' },
      }),
      prisma.formView.count({ where: whereFormView }),
    ]);
    return NextResponse.json({ data: submissions, total, totalViews });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unhandled error';
    console.log('[API][Forms/[id]/insights][GET]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
