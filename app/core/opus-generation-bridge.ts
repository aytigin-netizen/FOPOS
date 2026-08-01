import type { PedagogicalRecord } from "./pedagogical-record";

export const OPUS_GENERATION_CONTRACT_VERSION = "1.1.0" as const;

export const OPUS_DOCUMENT_TYPES = Object.freeze(["daily-plan", "annual-plan", "exam", "department-meeting-minutes"] as const);
export type OpusDocumentType = (typeof OPUS_DOCUMENT_TYPES)[number];

export type ApprovedGenerationDecision = {
  readonly id: string;
  readonly requestId: string;
  readonly intent: OpusDocumentType;
  readonly status: "ready-for-generation";
  readonly curriculum: {
    readonly moduleId: "fopos";
    readonly curriculumId: string;
    readonly gradeLevelId: string;
    readonly unitId: string;
    readonly outcomeCode: string;
  };
  readonly approval: {
    readonly status: "approved";
    readonly teacherId: "current-teacher";
    readonly decidedAt: string;
    readonly statement: string;
  };
};

export type GenerationProvenance = {
  readonly eventId: string;
  readonly contractVersion: typeof OPUS_GENERATION_CONTRACT_VERSION;
  readonly decisionId: string;
  readonly requestId: string;
  readonly documentType: OpusDocumentType;
  readonly teacherId: string;
  readonly approvedAt: string;
  readonly curriculum: ApprovedGenerationDecision["curriculum"];
};

export class OpusGenerationBridgeError extends Error {
  readonly code:
    | "DECISION_NOT_APPROVED"
    | "GENERATION_DECISION_MISMATCH"
    | "INVALID_GENERATION_REQUEST";

  constructor(
    code:
      | "DECISION_NOT_APPROVED"
      | "GENERATION_DECISION_MISMATCH"
      | "INVALID_GENERATION_REQUEST",
    message: string,
  ) {
    super(message);
    this.code = code;
    this.name = "OpusGenerationBridgeError";
  }
}

function curriculumId(record: PedagogicalRecord): string {
  const sourceYear = record.curriculum.datasetVersion.split(".")[0];
  return `${record.curriculum.subjectCode}-tr-${sourceYear}`;
}

export function toApprovedGenerationDecision(
  record: PedagogicalRecord,
  documentType: OpusDocumentType = "daily-plan",
): ApprovedGenerationDecision {
  if (record.status !== "approved" || !record.approval) {
    throw new OpusGenerationBridgeError(
      "DECISION_NOT_APPROVED",
      "Belge üretimi için öğretmen tarafından onaylanmış pedagojik karar gerekir.",
    );
  }

  return Object.freeze({
    id: `decision:${record.recordId}:r${record.revision}`,
    requestId: record.recordId,
    intent: documentType,
    status: "ready-for-generation" as const,
    curriculum: Object.freeze({
      moduleId: "fopos" as const,
      curriculumId: curriculumId(record),
      gradeLevelId: documentType === "department-meeting-minutes"
        ? "all-grades"
        : `grade-${record.curriculum.grade}`,
      unitId: documentType === "annual-plan"
        ? "annual-plan"
        : documentType === "exam"
          ? "exam"
          : documentType === "department-meeting-minutes"
            ? "department-meeting-minutes"
            : record.curriculum.unitCode.toLocaleLowerCase("en-US").replaceAll("_", "-"),
      outcomeCode: record.curriculum.outcomeCode,
    }),
    approval: Object.freeze({
      status: "approved" as const,
      teacherId: "current-teacher" as const,
      decidedAt: record.approval.approvedAt,
      statement: record.approval.statement,
    }),
  });
}

export async function generateApprovedDocument<TArtifact>(
  decision: ApprovedGenerationDecision,
  request: {
    readonly id: string;
    readonly decisionId: string;
    readonly documentType: OpusDocumentType;
  },
  generator: (decision: ApprovedGenerationDecision) => Promise<TArtifact>,
): Promise<{ readonly artifact: TArtifact; readonly provenance: GenerationProvenance }> {
  if (decision.status !== "ready-for-generation") {
    throw new OpusGenerationBridgeError(
      "DECISION_NOT_APPROVED",
      "Belge üretimi için öğretmen onaylı pedagojik karar gerekir.",
    );
  }
  if (request.decisionId !== decision.id) {
    throw new OpusGenerationBridgeError(
      "GENERATION_DECISION_MISMATCH",
      `Belge üretim isteği farklı bir karara ait: ${request.decisionId}`,
    );
  }
  if (!OPUS_DOCUMENT_TYPES.includes(request.documentType)) {
    throw new OpusGenerationBridgeError(
      "INVALID_GENERATION_REQUEST",
      `Desteklenmeyen belge türü: ${request.documentType}`,
    );
  }
  if (decision.intent !== request.documentType) {
    throw new OpusGenerationBridgeError(
      "GENERATION_DECISION_MISMATCH",
      "Belge türü onaylanan karar amacıyla uyuşmuyor.",
    );
  }
  if (!request.id.trim()) {
    throw new OpusGenerationBridgeError(
      "INVALID_GENERATION_REQUEST",
      "Belge üretim isteği kimliği boş olamaz.",
    );
  }

  const artifact = await generator(decision);
  return Object.freeze({
    artifact,
    provenance: Object.freeze({
      eventId: crypto.randomUUID(),
      contractVersion: OPUS_GENERATION_CONTRACT_VERSION,
      decisionId: decision.id,
      requestId: request.id,
      documentType: request.documentType,
      teacherId: decision.approval.teacherId,
      approvedAt: decision.approval.decidedAt,
      curriculum: decision.curriculum,
    }),
  });
}
