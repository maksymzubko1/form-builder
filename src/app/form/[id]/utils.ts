import { API_ROUTES } from '@/contants/routes';
import { toast } from 'sonner';
import { formDataToJson, Value } from '@/lib/utils';

export type UploadFilesProps = { json: Value[]; data: FormData }

export async function uploadFiles(filesToUpload: UploadFilesProps): Promise<Record<string, {
  url: string;
  isFile: boolean
}> | null> {
  let presignedLinks = [];

  if(!filesToUpload.json.length) return null;

  // get presigned links
  const resPresignedUrls = await fetch(`${API_ROUTES.S3_PRESIGNED}`, {
    method: 'POST',
    body: JSON.stringify({ files: filesToUpload.json }),
    headers: { 'Content-Type': 'application/json' },
  });
  if (resPresignedUrls.ok) {
    presignedLinks = (await resPresignedUrls.json());
  } else {
    const json = await resPresignedUrls.json();
    toast.error(json.error || 'Failed to retrieve data');
  }

  // upload files
  const uploadedFiles = await Promise.all(presignedLinks.map(async ({ _payloadKey, url }: {
    _payloadKey: string,
    url: string
  }) => {
    const file = filesToUpload.data.get(_payloadKey) as File | undefined;
    if (!file) return null;

    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });

    if (!res.ok) return null;

    return { key: _payloadKey, url: url.split('?')[0] };
  })) as { key: string, url: string }[];

  return uploadedFiles.filter(Boolean).reduce((acc, item) => {
    acc[item.key] = { url: item.url, isFile: true };
    return acc;
  }, {} as Record<string, { url: string; isFile: boolean }>);
}

export const validateAndPrepareData = async ({ data, schema, setError, needValidate }: {
  data: FormData,
  schema: unknown,
  setError: (props: unknown, settings: unknown) => void,
  needValidate: boolean
}) => {
  const formatedFormData = formDataToJson(data) as Record<string, Value>;

  if (needValidate) {
    const parse = schema.safeParse(formatedFormData);
    if (!parse.success) {
      parse.error.issues.map(err => setError(err.path[0] as string, { message: err.message }));
      return;
    }
  }

  const payloadData = {} as Record<string, Value>;
  const filesToUpload = { json: [], data: new FormData() } as UploadFilesProps;

  Object.entries(formatedFormData).forEach(([key, value]) => {
    if (value._isFile) {
      const file = data.get(key);
      filesToUpload['json'].push({ key, ...value });
      filesToUpload['data'].set(key, file as File);
    } else {
      payloadData[key] = value;
    }
  });

  const uploadedFiles = await uploadFiles(filesToUpload);
  return { ...payloadData, ...uploadedFiles ?? {} };
};