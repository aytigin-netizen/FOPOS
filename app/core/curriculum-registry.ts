import type { SubjectDescriptor } from "./curriculum-catalog.ts";

export type CurriculumDatasetKey = `${string}@${string}`;

export type CurriculumDatasetDescriptor = Readonly<{
  key: CurriculumDatasetKey;
  subject: Readonly<SubjectDescriptor>;
  schemaVersion: "1.0.0";
  datasetVersion: string;
  source: string;
}>;

export type CurriculumRegistry = Readonly<{
  get: (key: CurriculumDatasetKey) => CurriculumDatasetDescriptor | undefined;
  find: (subjectCode: string, datasetVersion: string) => CurriculumDatasetDescriptor | undefined;
  values: () => readonly CurriculumDatasetDescriptor[];
}>;

const SUBJECT_CODE_PATTERN = /^[a-z][a-z0-9_-]{1,31}$/u;

export function curriculumDatasetKey(subjectCode: string, datasetVersion: string): CurriculumDatasetKey {
  return `${subjectCode.trim().toLocaleLowerCase("en-US")}@${datasetVersion.trim()}`;
}

export function createCurriculumRegistry(
  descriptors: readonly Omit<CurriculumDatasetDescriptor, "key">[],
): CurriculumRegistry {
  const entries = new Map<CurriculumDatasetKey, CurriculumDatasetDescriptor>();
  for (const candidate of descriptors) {
    const subjectCode = candidate.subject.code.trim().toLocaleLowerCase("en-US");
    const datasetVersion = candidate.datasetVersion.trim();
    const subjectName = candidate.subject.name.trim();
    const source = candidate.source.trim();
    if (!SUBJECT_CODE_PATTERN.test(subjectCode) || !datasetVersion || !subjectName || !source) {
      throw new Error("Müfredat kayıt tanımı geçersiz veya eksik alan içeriyor.");
    }
    const key = curriculumDatasetKey(subjectCode, datasetVersion);
    if (entries.has(key)) throw new Error(`Yinelenen müfredat kaydı: ${key}`);
    entries.set(key, Object.freeze({
      ...candidate,
      key,
      datasetVersion,
      source,
      subject: Object.freeze({ ...candidate.subject, code: subjectCode, name: subjectName }),
    }));
  }

  const values = Object.freeze([...entries.values()]);
  return Object.freeze({
    get: (key: CurriculumDatasetKey) => entries.get(key),
    find: (subjectCode: string, datasetVersion: string) => entries.get(curriculumDatasetKey(subjectCode, datasetVersion)),
    values: () => values,
  });
}

export const curriculumRegistry = createCurriculumRegistry([
  {
    subject: { code: "philosophy", name: "Felsefe", courseType: "independent" },
    schemaVersion: "1.0.0",
    datasetVersion: "2024.1",
    source: "felsefe_curriculum_2024.json",
  },
]);
