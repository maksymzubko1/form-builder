import { SubmissionData } from '@/types/submissions';

export function prepareSubmissions(submissions: SubmissionData) {
  const submissionKeys = [] as string[];
  return Object.entries(submissions).reduce(
    (previousValue, [key, value]) => {
      const name = getUniqueName(
        (value?.displayName as string) || (value.type as string) || key,
        submissionKeys,
      );
      submissionKeys.push(name);
      previousValue[name] = value.value;
      return previousValue;
    },
    {} as Record<string, string | null>,
  );
}

export function getUniqueName(name: string, keys: string[]) {
  let uniqueName = name;
  let index = 1;
  while (keys.includes(uniqueName)) {
    uniqueName = `${name}-${index}`;
    index++;
  }

  return uniqueName;
}
