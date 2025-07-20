import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseAsync } from 'json2csv';
import { prepareSubmissions } from '@/lib/submissions/utils';
import { FormSubmission } from '@prisma/client';
import { SubmissionData } from '@/types/submissions';

interface GetProps {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: GetProps): Promise<NextResponse> {
  try {
    const { id } = await params;
    const submissions: FormSubmission[] = await prisma.formSubmission.findMany({
      where: { formId: id },
      orderBy: { submittedAt: 'desc' },
    });

    let data = submissions.map((s) => ({
      id: s.id,
      email: s.email,
      submittedAt: s.submittedAt,
      ...prepareSubmissions(s.data as SubmissionData),
    }));

    if (!data.length) {
      data = [
        {
          id: '-1',
          email: '',
          submittedAt: new Date(),
        },
      ];
    }

    let csv = await parseAsync(data, { defaultValue: 'null' });

    if (!data.length) {
      csv += '\n# No data found\n';
    }

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="submissions-${id}-${new Date().valueOf()}.csv"`,
      },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unhandled error';
    console.log('[API][Submissions/export][GET]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
