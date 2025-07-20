import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const files = body.files;

    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: 'Files is required (array)' }, { status: 400 });
    }

    const bucket = process.env.AWS_S3_BUCKET!;

    const results = await Promise.all(
      files.map(async ({ key: _payloadKey, name, type, folder = '' }) => {
        const key = `${folder}${Date.now()}-${Math.random().toString(36).slice(2)}-${name}`;
        const command = new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          ContentType: type,
        });
        const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
        return { url, _payloadKey, key, bucket };
      }),
    );
    return NextResponse.json(results);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unhandled error';
    console.log('[API][S3 presign][POST]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
