import { API_ROUTES } from '@/constants/routes';
import { toast } from 'sonner';
import { formDataToJson, Value } from '@/lib/utils';
import { FormFieldDef } from '@/types/public-forms';
import { InteractiveItems } from '@/components/shared/PuckEditor/config';

export type UploadFilesProps = { json: Value[]; data: FormData };

export async function uploadFiles(filesToUpload: UploadFilesProps, allFields: FormFieldDef[]): Promise<Record<string, {
  url: string;
  isFile: boolean
}> | null> {
  let presignedLinks = [];

  if (!filesToUpload.json.length) return null;

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
  })) as { key: string; url: string }[];

  return uploadedFiles.filter(Boolean).reduce((acc, item) => {
    const fieldItem = allFields.find((field) => field.id === item.key);
    let obj = { value: item.url };
    if (fieldItem) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { layout, ...rest } = fieldItem;
      obj = { ...obj, ...rest };
    }
    acc[item.key] = obj;
    return acc;
  }, {} as Record<string, { url: string; isFile: boolean }>);
}

export const validateAndPrepareData = async ({ data, schema, setError, needValidate, allFields, state }: {
  allFields: FormFieldDef[]
  data: FormData,
  schema: unknown,
  setError: (props: unknown, settings: unknown) => void,
  needValidate: boolean
  state: unknown
}) => {
  const formatedFormData = formDataToJson(data) as Record<string, Value>;

  if (needValidate) {
    const parse = schema.safeParse(formatedFormData);
    if (!parse.success) {
      parse.error.issues.map(err => setError(err.path[0] as string, { message: err.message }));
      return;
    }
  }

  const payloadData = { email: formatedFormData.email } as Record<string, unknown>;
  const filesToUpload = { json: [], data: new FormData() } as UploadFilesProps;

  ;
  allFields.forEach(field => {
    if (!InteractiveItems.includes(field.type)) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { layout, ...rest } = field;

    if (field.type === 'FileInput') {
      const file = data.get(rest.id) as File | undefined;
      if (file && file.size > 0) {
        const jsonFile = formatedFormData[rest.id];
        filesToUpload['json'].push({ key: rest.id, ...jsonFile });
        filesToUpload['data'].set(rest.id, file as File);
      } else {
        const prevFile = state[rest.id];
        payloadData[rest.id] = { ...rest, value: prevFile && typeof prevFile === 'string' ? prevFile : undefined };
      }
    } else {
      const item = data.get(rest.id);
      payloadData[rest.id] = { ...rest, value: item ? item : rest.value || undefined };
    }
  });

  const uploadedFiles = await uploadFiles(filesToUpload, allFields);
  return { ...payloadData, ...uploadedFiles ?? {} };
};