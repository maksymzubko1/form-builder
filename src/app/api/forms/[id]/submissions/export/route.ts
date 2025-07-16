import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseAsync } from 'json2csv';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const submissions = await prisma.formSubmission.findMany({
    where: { formId: id },
    orderBy: { submittedAt: 'desc' },
  });

  let data = submissions.map((s) => ({
    id: s.id,
    email: s.email,
    submittedAt: s.submittedAt,
    ...Object.entries(s.data).reduce((previousValue, [key, value]) => {
      previousValue[key] = value.value;
      return previousValue;
    }, {}),
  }));

  if (!data.length) {
    data = { id: '-1', email: '' };
  }

  let csv = await parseAsync(data);

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
}
