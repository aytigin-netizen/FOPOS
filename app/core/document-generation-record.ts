import type { GenerationProvenance } from "./opus-generation-bridge.ts";
import type { PedagogicalRecord } from "./pedagogical-record.ts";

export type DocumentGenerationRecord = GenerationProvenance & {
  readonly eventId: string;
  readonly generatedAt: string;
  readonly recordId: string;
  readonly revision: number;
  readonly curriculumDatasetVersion: string;
  readonly academicYear: string;
};

export function recordReference(decisionId: string) {
  const match = /^decision:(OPUS-PR-[A-Za-z0-9-]+):r([1-9]\d*)$/u.exec(decisionId);
  if (!match) throw new Error("OPUS karar kimliği doğrulanamadı.");
  return { recordId: match[1], revision: Number(match[2]) };
}

export function assertGenerationMatchesRecord(provenance: GenerationProvenance, record: PedagogicalRecord) {
  const { recordId, revision } = recordReference(provenance.decisionId);
  const expectedCurriculumId = `${record.curriculum.subjectCode}-tr-${record.curriculum.datasetVersion.split(".")[0]}`;
  if (recordId !== record.recordId || revision !== record.revision || record.status !== "approved" ||
      record.approval?.approvedAt !== provenance.approvedAt ||
      record.curriculum.outcomeCode !== provenance.curriculum.outcomeCode ||
      expectedCurriculumId !== provenance.curriculum.curriculumId) {
    throw new Error("Üretim izi pedagojik kararın onay veya müfredat kaynağıyla uyuşmuyor.");
  }
  return { recordId, revision };
}
