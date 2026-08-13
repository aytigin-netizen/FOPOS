"use client";

import {
  Archive,
  CheckCircle2,
  Database,
  Download,
  FileJson,
  History,
  LoaderCircle,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Upload,
  UserX,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PedagogicalRecord, RecordStatus } from "../../core/pedagogical-record";
import type { GenerationProvenance } from "../../core/opus-generation-bridge";
import { sha256Hex } from "../../core/artifact-integrity";
import {
  GENERATION_AUDIT_PACKAGE_MAX_EVENT_COUNT,
  GENERATION_AUDIT_PACKAGE_MAX_FILE_SIZE_BYTES,
  createGenerationAuditPackage,
  isGenerationAuditPackageFileSizeAllowed,
  rejectedGenerationAuditPackageResult,
  validateGenerationAuditPackage,
  type GenerationAuditPackageValidationResult,
} from "../../core/generation-audit-package";
import {
  createGenerationAuditVerificationEvidence,
  validateGenerationAuditVerificationEvidence,
  type GenerationAuditVerificationEvidence,
  type GenerationAuditVerificationEvidenceValidationResult,
} from "../../core/generation-audit-verification-evidence";
import {
  matchGenerationAuditPackageToVerificationEvidence,
  type GenerationAuditPackageEvidenceMatchResult,
} from "../../core/generation-audit-package-evidence-match";
import {
  matchGenerationArtifactToAuditPackage,
  type GenerationAuditPackageArtifactMatchResult,
} from "../../core/generation-audit-package-artifact-match";
import { createPortableAuditResult } from "../../core/portable-audit-result";
import {
  inspectRecordArchive,
  readRecordArchiveRecords,
  type RecordArchiveStatus,
} from "../../core/pedagogical-record-store";

const statusLabels: Record<RecordStatus, string> = {
  draft: "Taslak",
  in_review: "İncelemede",
  approved: "Öğretmen onaylı",
  superseded: "Önceki sürüm",
};

type AccountDataPolicy = {
  activeRevisionCount: number;
  trashedRevisionCount: number;
  lastDeletedAt: string | null;
  trashRetentionDays: number;
  policies: {
    accountAndProfile: string;
    pedagogicalRecords: string;
    studentData: string;
    exportedFiles: string;
  };
};

type AccountClosureSummary = {
  profileExists: boolean;
  recordRevisionCount: number;
};

type AcademicYearArchiveSummary = {
  academicYear: string;
  recordCount: number;
  revisionCount: number;
};

type DocumentGenerationRecord = Omit<GenerationProvenance, "artifactIntegrity" | "contractVersion"> & {
  contractVersion: "1.1.0" | "1.2.0";
  artifactIntegrity?: GenerationProvenance["artifactIntegrity"];
  eventId: string;
  generatedAt: string;
  recordId: string;
  revision: number;
  curriculumDatasetVersion: string;
  academicYear: string;
};

type DocumentGenerationPage = {
  items: DocumentGenerationRecord[];
  nextCursor: string | null;
  hasMore: boolean;
  pageSize: 20 | 50 | 100;
};

export default function RecordArchiveModule() {
  const [records, setRecords] = useState<PedagogicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [localStatus, setLocalStatus] = useState<RecordArchiveStatus | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exportConfirmed, setExportConfirmed] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [policy, setPolicy] = useState<AccountDataPolicy | null>(null);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [accountEmail, setAccountEmail] = useState("");
  const [closureSummary, setClosureSummary] =
    useState<AccountClosureSummary | null>(null);
  const [accountDeleteConfirmed, setAccountDeleteConfirmed] = useState(false);
  const [accountConfirmationText, setAccountConfirmationText] = useState("");
  const [accountEmailConfirmation, setAccountEmailConfirmation] = useState("");
  const [closingAccount, setClosingAccount] = useState(false);
  const [activeAcademicYear, setActiveAcademicYear] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [academicYearArchives, setAcademicYearArchives] = useState<
    AcademicYearArchiveSummary[]
  >([]);
  const [generations, setGenerations] = useState<DocumentGenerationRecord[]>([]);
  const [generationSearch, setGenerationSearch] = useState("");
  const [generationDocumentType, setGenerationDocumentType] = useState("all");
  const [generationCurriculum, setGenerationCurriculum] = useState("all");
  const [generationNextCursor, setGenerationNextCursor] = useState<string | null>(null);
  const [generationHasMore, setGenerationHasMore] = useState(false);
  const [generationPageSize, setGenerationPageSize] = useState<20 | 50 | 100>(50);
  const [loadingMoreGenerations, setLoadingMoreGenerations] = useState(false);
  const [generationExporting, setGenerationExporting] = useState(false);
  const [generationQueryScope, setGenerationQueryScope] = useState({
    search: "",
    documentType: "all",
    curriculumId: "all",
  });
  const [generationCurriculumSources, setGenerationCurriculumSources] = useState<string[]>([]);
  const [generationSearchHint, setGenerationSearchHint] = useState<string | null>(null);
  const [openGenerationEventId, setOpenGenerationEventId] = useState<string | null>(null);
  const generationFetchRequestId = useRef(0);
  const generationSearchDebounce = useRef<number | null>(null);
  const [verifyingEventId, setVerifyingEventId] = useState<string | null>(null);
  const [integrityResults, setIntegrityResults] = useState<Record<string, "match" | "mismatch">>({});
  const [auditPackageValidating, setAuditPackageValidating] = useState(false);
  const [auditPackageValidation, setAuditPackageValidation] =
    useState<GenerationAuditPackageValidationResult | null>(null);
  const [auditPackageEvidence, setAuditPackageEvidence] =
    useState<GenerationAuditVerificationEvidence | null>(null);
  const [evidenceValidating, setEvidenceValidating] = useState(false);
  const [evidenceValidation, setEvidenceValidation] =
    useState<GenerationAuditVerificationEvidenceValidationResult | null>(null);
  const [evidenceValidationError, setEvidenceValidationError] = useState<string | null>(null);
  const [evidenceFileName, setEvidenceFileName] = useState<string | null>(null);
  const [matchPackagePayload, setMatchPackagePayload] = useState<unknown>(null);
  const [matchEvidencePayload, setMatchEvidencePayload] = useState<unknown>(null);
  const [matchPackageFileName, setMatchPackageFileName] = useState<string | null>(null);
  const [matchEvidenceFileName, setMatchEvidenceFileName] = useState<string | null>(null);
  const [packageEvidenceMatching, setPackageEvidenceMatching] = useState(false);
  const [packageEvidenceMatch, setPackageEvidenceMatch] =
    useState<GenerationAuditPackageEvidenceMatchResult | null>(null);
  const [packageEvidenceMatchError, setPackageEvidenceMatchError] = useState<string | null>(null);
  const [guidedPackageValidation, setGuidedPackageValidation] =
    useState<GenerationAuditPackageValidationResult | null>(null);
  const [artifactMatchFileName, setArtifactMatchFileName] = useState<string | null>(null);
  const [artifactMatchDigest, setArtifactMatchDigest] = useState<string | null>(null);
  const [artifactMatchReading, setArtifactMatchReading] = useState(false);
  const [artifactMatching, setArtifactMatching] = useState(false);
  const [artifactMatchResult, setArtifactMatchResult] =
    useState<GenerationAuditPackageArtifactMatchResult | null>(null);
  const [artifactMatchError, setArtifactMatchError] = useState<string | null>(null);

  async function verifyGenerationFile(eventId: string, expectedDigest: string, file: File) {
    setVerifyingEventId(eventId);
    try {
      const digest = await sha256Hex(await file.arrayBuffer());
      setIntegrityResults((current) => ({ ...current, [eventId]: digest === expectedDigest ? "match" : "mismatch" }));
    } finally {
      setVerifyingEventId(null);
    }
  }

  async function verifyGenerationAuditPackageFile(file: File) {
    setAuditPackageValidating(true);
    setAuditPackageValidation(null);
    setAuditPackageEvidence(null);
    try {
      if (!isGenerationAuditPackageFileSizeAllowed(file.size)) {
        setAuditPackageValidation(
          rejectedGenerationAuditPackageResult(
            `Dosya ${GENERATION_AUDIT_PACKAGE_MAX_FILE_SIZE_BYTES / (1024 * 1024)} MiB sınırını aşıyor; daha küçük bir denetim paketi seçin.`,
          ),
        );
        return;
      }
      let payload: unknown;
      try {
        payload = JSON.parse(await file.text());
      } catch {
        setAuditPackageValidation(
          rejectedGenerationAuditPackageResult("Dosya geçerli JSON içermiyor."),
        );
        return;
      }
      const validation = await validateGenerationAuditPackage(payload);
      setAuditPackageValidation(validation);
      setAuditPackageEvidence(await createGenerationAuditVerificationEvidence({
        sourcePackage: payload,
        validation,
        verifiedAt: new Date().toISOString(),
      }));
    } catch (error) {
      setAuditPackageEvidence(null);
      setAuditPackageValidation(
        rejectedGenerationAuditPackageResult(
          error instanceof Error ? error.message : "Denetim paketi doğrulanamadı.",
        ),
      );
    } finally {
      setAuditPackageValidating(false);
    }
  }


  async function validateGenerationAuditVerificationEvidenceFile(file: File) {
    setEvidenceValidating(true);
    setEvidenceValidation(null);
    setEvidenceValidationError(null);
    setEvidenceFileName(file.name);
    try {
      if (file.size > GENERATION_AUDIT_PACKAGE_MAX_FILE_SIZE_BYTES) {
        setEvidenceValidationError(
          `Dosya ${GENERATION_AUDIT_PACKAGE_MAX_FILE_SIZE_BYTES / (1024 * 1024)} MiB sınırını aşıyor; daha küçük bir doğrulama kanıtı seçin.`,
        );
        return;
      }
      let payload: unknown;
      try {
        payload = JSON.parse(await file.text());
      } catch {
        setEvidenceValidationError("Dosya geçerli JSON içermiyor.");
        return;
      }
      setEvidenceValidation(await validateGenerationAuditVerificationEvidence(payload));
    } catch (error) {
      setEvidenceValidationError(
        error instanceof Error ? error.message : "Doğrulama kanıtı incelenemedi.",
      );
    } finally {
      setEvidenceValidating(false);
    }
  }

  async function readPackageEvidenceMatchFile(
    file: File,
    kind: "package" | "evidence",
  ) {
    setPackageEvidenceMatch(null);
    setPackageEvidenceMatchError(null);
    if (!isGenerationAuditPackageFileSizeAllowed(file.size)) {
      setPackageEvidenceMatchError(
        `Dosya ${GENERATION_AUDIT_PACKAGE_MAX_FILE_SIZE_BYTES / (1024 * 1024)} MiB sınırını aşıyor.`,
      );
      return;
    }
    try {
      const payload: unknown = JSON.parse(await file.text());
      if (kind === "package") {
        const validation = await validateGenerationAuditPackage(payload);
        setGuidedPackageValidation(validation);
        setMatchPackagePayload(payload);
        setMatchPackageFileName(file.name);
        if (validation.status !== "rejected" && matchEvidencePayload !== null) {
          await matchSelectedPackageAndEvidence(payload, matchEvidencePayload);
        }
      } else {
        setMatchEvidencePayload(payload);
        setMatchEvidenceFileName(file.name);
        if (matchPackagePayload !== null) {
          await matchSelectedPackageAndEvidence(matchPackagePayload, payload);
        }
      }
    } catch {
      setPackageEvidenceMatchError(`${file.name} geçerli JSON içermiyor.`);
    }
  }

  async function matchSelectedPackageAndEvidence(
    packagePayload: unknown = matchPackagePayload,
    evidencePayload: unknown = matchEvidencePayload,
  ) {
    if (packagePayload === null || evidencePayload === null) {
      setPackageEvidenceMatchError("Denetim paketi ve doğrulama kanıtı birlikte seçilmelidir.");
      return;
    }
    setPackageEvidenceMatching(true);
    setPackageEvidenceMatch(null);
    setPackageEvidenceMatchError(null);
    try {
      setPackageEvidenceMatch(
        await matchGenerationAuditPackageToVerificationEvidence({
          sourcePackage: packagePayload,
          evidence: evidencePayload,
        }),
      );
    } catch (error) {
      setPackageEvidenceMatchError(
        error instanceof Error ? error.message : "Paket ve kanıt eşleştirilemedi.",
      );
    } finally {
      setPackageEvidenceMatching(false);
    }
  }

  async function readArtifactMatchFile(file: File) {
    setArtifactMatchReading(true);
    setArtifactMatchResult(null);
    setArtifactMatchError(null);
    setArtifactMatchFileName(file.name);
    setArtifactMatchDigest(null);
    try {
      if (file.size > GENERATION_AUDIT_PACKAGE_MAX_FILE_SIZE_BYTES) {
        setArtifactMatchError(
          `Belge ${GENERATION_AUDIT_PACKAGE_MAX_FILE_SIZE_BYTES / (1024 * 1024)} MiB sınırını aşıyor.`,
        );
        return;
      }
      const digest = await sha256Hex(await file.arrayBuffer());
      setArtifactMatchDigest(digest);
      if (matchPackagePayload !== null && matchEvidencePayload !== null) {
        await matchSelectedArtifactToPackage(digest);
      }
    } catch (error) {
      setArtifactMatchError(
        error instanceof Error ? error.message : "Belge SHA-256 özeti hesaplanamadı.",
      );
    } finally {
      setArtifactMatchReading(false);
    }
  }

  async function matchSelectedArtifactToPackage(
    artifactDigest: string | null = artifactMatchDigest,
  ) {
    if (
      matchPackagePayload === null ||
      matchEvidencePayload === null ||
      artifactDigest === null
    ) {
      setArtifactMatchError(
        "Denetim paketi, doğrulama kanıtı ve DOCX belge birlikte seçilmelidir.",
      );
      return;
    }
    setArtifactMatching(true);
    setArtifactMatchResult(null);
    setArtifactMatchError(null);
    try {
      setArtifactMatchResult(
        await matchGenerationArtifactToAuditPackage({
          sourcePackage: matchPackagePayload,
          evidence: matchEvidencePayload,
          artifactDigest,
        }),
      );
    } catch (error) {
      setArtifactMatchError(
        error instanceof Error ? error.message : "Belge denetim paketiyle eşleştirilemedi.",
      );
    } finally {
      setArtifactMatching(false);
    }
  }

  function resetGuidedAuditSession() {
    setGuidedPackageValidation(null);
    setMatchPackagePayload(null);
    setMatchEvidencePayload(null);
    setMatchPackageFileName(null);
    setMatchEvidenceFileName(null);
    setPackageEvidenceMatch(null);
    setPackageEvidenceMatchError(null);
    setArtifactMatchFileName(null);
    setArtifactMatchDigest(null);
    setArtifactMatchResult(null);
    setArtifactMatchError(null);
  }

  async function downloadPortableAuditResult() {
    if (
      matchPackagePayload === null ||
      matchEvidencePayload === null ||
      artifactMatchDigest === null ||
      artifactMatchResult?.status !== "matched" ||
      artifactMatchResult.matches.length !== 1
    ) return;
    try {
      const result = await createPortableAuditResult({
        sourcePackage: matchPackagePayload,
        evidence: matchEvidencePayload,
        artifactDigest: artifactMatchDigest,
        createdAt: new Date().toISOString(),
      });
      const blob = new Blob([JSON.stringify(result, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `FOPOS_OPUS_Denetim_Sonucu_${result.match.eventId}_${result.schemaVersion}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      setMessage("Taşınabilir denetim sonucu indirildi. Dosya, doğrulanmış zincirin özetlerini taşır; öğrenci kişisel verisi ile kaynak dosya adlarını içermez.");
    } catch (error) {
      setArtifactMatchError(
        error instanceof Error ? error.message : "Taşınabilir denetim sonucu oluşturulamadı.",
      );
    }
  }

  function downloadGenerationAuditVerificationEvidence() {
    if (!auditPackageEvidence) return;
    const blob = new Blob([JSON.stringify(auditPackageEvidence, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download =
      `FOPOS_OPUS_Dogrulama_Kaniti_${auditPackageEvidence.result.status}_${auditPackageEvidence.schemaVersion}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage(
      "Bütünlük korumalı doğrulama kanıtı indirildi. Kanıt öğrenci kişisel verisi veya olay içeriği taşımaz.",
    );
  }

  async function loadRecords(academicYear?: string) {
    setLoading(true);
    try {
      const query = new URLSearchParams({ scope: "archive" });
      if (academicYear) query.set("academicYear", academicYear);
      const response = await fetch(`/api/pedagogical-records?${query.toString()}`);
      const payload = (await response.json()) as {
        records?: PedagogicalRecord[];
        activeAcademicYear?: string;
        selectedAcademicYear?: string;
        years?: AcademicYearArchiveSummary[];
        generationPage?: DocumentGenerationPage;
        generationCurriculumSources?: string[];
        error?: string;
      };
      if (
        !response.ok ||
        !payload.records ||
        !payload.activeAcademicYear ||
        !payload.selectedAcademicYear
      ) {
        throw new Error(payload.error ?? "Kayıt arşivi açılamadı.");
      }
      setRecords(payload.records);
      setActiveAcademicYear(payload.activeAcademicYear);
      setSelectedAcademicYear(payload.selectedAcademicYear);
      setAcademicYearArchives(payload.years ?? []);
      setGenerationCurriculumSources(payload.generationCurriculumSources ?? []);
      setGenerations(payload.generationPage?.items ?? []);
      setGenerationNextCursor(payload.generationPage?.nextCursor ?? null);
      setGenerationHasMore(payload.generationPage?.hasMore ?? false);
      setGenerationPageSize(payload.generationPage?.pageSize ?? 50);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kayıt arşivi açılamadı.");
    } finally {
      setLoading(false);
    }
  }

  const fetchGenerationPage = useCallback(async (options: {
    academicYear: string;
    documentType: string;
    curriculumId: string;
    search: string;
    cursor?: string;
    append?: boolean;
    pageSize?: 20 | 50 | 100;
  }) => {
    const requestId = ++generationFetchRequestId.current;
    setLoadingMoreGenerations(true);
    try {
      const query = new URLSearchParams({
        academicYear: options.academicYear,
        pageSize: String(options.pageSize ?? generationPageSize),
        scope: "search-results",
      });
      if (options.documentType !== "all") query.set("documentType", options.documentType);
      if (options.curriculumId !== "all") query.set("curriculumId", options.curriculumId);
      if (options.search.trim()) query.set("search", options.search.trim());
      if (options.cursor) query.set("cursor", options.cursor);
      const response = await fetch(`/api/document-generations?${query.toString()}`);
      const payload = (await response.json()) as {
        page?: DocumentGenerationPage;
        curriculumSources?: string[];
        error?: string;
      };
      if (!response.ok || !payload.page) throw new Error(payload.error ?? "Üretim arşivi açılamadı.");
      if (requestId !== generationFetchRequestId.current) return;
      setGenerationCurriculumSources(payload.curriculumSources ?? []);
      setGenerations((current) => options.append ? [...current, ...payload.page!.items] : payload.page!.items);
      setGenerationNextCursor(payload.page.nextCursor);
      setGenerationHasMore(payload.page.hasMore);
      setGenerationPageSize(payload.page.pageSize);
    } catch (error) {
      if (requestId !== generationFetchRequestId.current) return;
      setMessage(error instanceof Error ? error.message : "Üretim arşivi açılamadı.");
    } finally {
      if (requestId !== generationFetchRequestId.current) return;
      setLoadingMoreGenerations(false);
    }
  }, [generationPageSize]);

  async function loadPolicy() {
    try {
      const response = await fetch("/api/account-data-management");
      const payload = (await response.json()) as {
        policy?: AccountDataPolicy;
        error?: string;
      };
      if (!response.ok || !payload.policy) {
        throw new Error(payload.error ?? "Saklama politikası okunamadı.");
      }
      setPolicy(payload.policy);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Saklama politikası okunamadı.",
      );
    }
  }

  async function loadAccountClosureSummary() {
    try {
      const response = await fetch("/api/account-closure");
      const payload = (await response.json()) as {
        accountEmail?: string;
        summary?: AccountClosureSummary;
        error?: string;
      };
      if (!response.ok || !payload.accountEmail || !payload.summary) {
        throw new Error(payload.error ?? "Hesap kapatma kapsamı okunamadı.");
      }
      setAccountEmail(payload.accountEmail);
      setClosureSummary(payload.summary);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Hesap kapatma kapsamı okunamadı.",
      );
    }
  }

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void loadRecords();
      void loadPolicy();
      void loadAccountClosureSummary();
      setLocalStatus(inspectRecordArchive(window.localStorage));
    }, 0);
    return () => window.clearTimeout(initialLoad);
  }, []);

  const histories = useMemo(() => {
    const grouped = new Map<string, PedagogicalRecord[]>();
    for (const record of records) {
      grouped.set(record.recordId, [...(grouped.get(record.recordId) ?? []), record]);
    }
    return [...grouped.values()].map((history) =>
      history.sort((a, b) => b.revision - a.revision),
    );
  }, [records]);

  const generationCurricula = useMemo(
    () => [...generationCurriculumSources].sort(),
    [generationCurriculumSources],
  );

  const filteredGenerations = useMemo(() => {
    const search = generationSearch.trim().toLocaleLowerCase("tr-TR");
    return generations.filter((item) =>
      (generationDocumentType === "all" || item.documentType === generationDocumentType) &&
      (generationCurriculum === "all" || item.curriculum.curriculumId === generationCurriculum) &&
      (!search || [item.decisionId, item.recordId, item.requestId, item.eventId]
        .some((value) => value.toLocaleLowerCase("tr-TR").startsWith(search) || value.toLocaleLowerCase("tr-TR") === search)),
    );
  }, [generationCurriculum, generationDocumentType, generationSearch, generations]);

  async function downloadGenerationAuditPackage(
    events: DocumentGenerationRecord[],
    scope: "search-results" | "academic-year",
    queryScope: unknown,
  ) {
    const payload = await createGenerationAuditPackage({
      exportedAt: new Date().toISOString(),
      academicYear: selectedAcademicYear,
      exportScope: scope,
      queryScope: queryScope as
        | { type: "academic-year"; academicYear: string }
        | {
            type: "search-results";
            academicYear: string;
            documentType?: string;
            curriculumSource?: string;
            eventId?: string;
            decisionId?: string;
            requestId?: string;
            recordId?: string;
          },
      containsStudentPersonalData: false,
      events: events.map((event) => ({
        eventId: event.eventId,
        requestId: event.requestId,
        decisionId: event.decisionId,
        recordId: event.recordId,
        revision: event.revision,
        documentType: event.documentType,
        contractVersion: event.contractVersion,
        approvedAt: event.approvedAt,
        generatedAt: event.generatedAt,
        curriculum: event.curriculum,
        curriculumDatasetVersion: event.curriculumDatasetVersion,
        academicYear: event.academicYear,
        artifactIntegrity: event.artifactIntegrity ?? null,
      })),
    });
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `FOPOS_OPUS_Denetim_Paketi_${selectedAcademicYear || "arsiv"}_${scope === "search-results" ? "arama-sonuclari" : "tam"}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage(`${events.length} üretim olayı içeren SHA-256 korumalı denetim paketi indirildi.`);
  }

  async function exportVisibleGenerationAuditPackage() {
    setGenerationExporting(true);
    try {
      const events: DocumentGenerationRecord[] = [];
      let cursor: string | undefined;
      do {
        const query = new URLSearchParams({
          academicYear: selectedAcademicYear,
          pageSize: "100",
          scope: "search-results",
        });
        if (generationQueryScope.documentType !== "all") {
          query.set("documentType", generationQueryScope.documentType);
        }
        if (generationQueryScope.curriculumId !== "all") {
          query.set("curriculumId", generationQueryScope.curriculumId);
        }
        if (generationQueryScope.search.trim()) {
          query.set("search", generationQueryScope.search.trim());
        }
        if (cursor) query.set("cursor", cursor);
        const response = await fetch(`/api/document-generations?${query.toString()}`);
        const payload = (await response.json()) as {
          page?: DocumentGenerationPage;
          error?: string;
        };
        if (!response.ok || !payload.page) throw new Error(payload.error ?? "Arama sonuçları dışa aktarılamadı.");
        events.push(...payload.page.items);
        cursor = payload.page.nextCursor ?? undefined;
      } while (cursor);
      await downloadGenerationAuditPackage(events, "search-results", {
        type: "search-results",
        academicYear: selectedAcademicYear,
        ...(generationQueryScope.documentType !== "all" ? { documentType: generationQueryScope.documentType } : {}),
        ...(generationQueryScope.curriculumId !== "all" ? { curriculumSource: generationQueryScope.curriculumId } : {}),
        ...(generationQueryScope.search.trim() ? {
          eventId: generationQueryScope.search.trim(),
          decisionId: generationQueryScope.search.trim(),
          requestId: generationQueryScope.search.trim(),
          recordId: generationQueryScope.search.trim(),
        } : {}),
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Arama sonuçları dışa aktarılamadı.");
    } finally {
      setGenerationExporting(false);
    }
  }

  async function exportAcademicYearGenerationAuditPackage() {
    setGenerationExporting(true);
    try {
      const events: DocumentGenerationRecord[] = [];
      let cursor: string | undefined;
      do {
        const query = new URLSearchParams({
          academicYear: selectedAcademicYear,
          pageSize: "100",
          scope: "academic-year",
        });
        if (cursor) query.set("cursor", cursor);
        const response = await fetch(`/api/document-generations?${query.toString()}`);
        const payload = (await response.json()) as {
          page?: DocumentGenerationPage;
          error?: string;
        };
        if (!response.ok || !payload.page) throw new Error(payload.error ?? "Öğretim yılı denetim paketi hazırlanamadı.");
        events.push(...payload.page.items);
        cursor = payload.page.nextCursor ?? undefined;
      } while (cursor);
      await downloadGenerationAuditPackage(events, "academic-year", {
        type: "academic-year",
        academicYear: selectedAcademicYear,
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Öğretim yılı denetim paketi hazırlanamadı.");
    } finally {
      setGenerationExporting(false);
    }
  }

  async function importLocalArchive() {
    if (!confirmed || localStatus?.state !== "ready") return;
    setImporting(true);
    setMessage("v46 yerel kayıtları doğrulanıyor ve hesabınıza kopyalanıyor…");
    try {
      const localRecords = readRecordArchiveRecords(window.localStorage);
      const response = await fetch("/api/pedagogical-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records: localRecords }),
      });
      const payload = (await response.json()) as {
        imported?: number;
        records?: PedagogicalRecord[];
        error?: string;
      };
      if (!response.ok || !payload.records) {
        throw new Error(payload.error ?? "Yerel kayıtlar içe aktarılamadı.");
      }
      await loadRecords(activeAcademicYear || undefined);
      setConfirmed(false);
      setMessage(
        `${payload.imported ?? 0} revizyon hesabınıza kopyalandı. v46 yerel arşivi silinmedi.`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Yerel kayıtlar içe aktarılamadı.");
    } finally {
      setImporting(false);
    }
  }

  async function exportAccountData() {
    if (!exportConfirmed) return;
    setExporting(true);
    setMessage("Hesap verileriniz güvenli pakete hazırlanıyor…");
    try {
      const response = await fetch("/api/account-export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmed: true }),
      });
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Hesap verileri dışa aktarılamadı.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      const disposition = response.headers.get("content-disposition") ?? "";
      const filename =
        /filename="([^"]+)"/u.exec(disposition)?.[1] ??
        "FOPOS_Hesap_Verileri.json";
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
      setExportConfirmed(false);
      setMessage(
        "Hesap verileri indirildi. Paket öğrenci kişisel verisi ve oturum bilgisi içermez.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Hesap verileri dışa aktarılamadı.",
      );
    } finally {
      setExporting(false);
    }
  }

  async function deleteAccountRecords() {
    if (
      !policy ||
      !deleteConfirmed ||
      confirmationText !== "KAYITLARIMI SİL"
    ) {
      return;
    }
    setDeleting(true);
    setMessage("Pedagojik kayıtlar güvenli silme alanına taşınıyor…");
    try {
      const response = await fetch("/api/account-data-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_records",
          confirmed: true,
          confirmationText,
          expectedRevisionCount: policy.activeRevisionCount,
        }),
      });
      const payload = (await response.json()) as {
        policy?: AccountDataPolicy;
        error?: string;
      };
      if (!response.ok || !payload.policy) {
        throw new Error(payload.error ?? "Kayıtlar silinemedi.");
      }
      setPolicy(payload.policy);
      setRecords([]);
      setDeleteConfirmed(false);
      setConfirmationText("");
      setMessage(
        `Pedagojik kayıtlar silme alanına taşındı. ${payload.policy.trashRetentionDays} gün içinde geri yükleyebilirsiniz.`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kayıtlar silinemedi.");
    } finally {
      setDeleting(false);
    }
  }

  async function restoreAccountRecords() {
    setRestoring(true);
    setMessage("Silinen pedagojik kayıtlar geri yükleniyor…");
    try {
      const response = await fetch("/api/account-data-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore_records" }),
      });
      const payload = (await response.json()) as {
        policy?: AccountDataPolicy;
        error?: string;
      };
      if (!response.ok || !payload.policy) {
        throw new Error(payload.error ?? "Kayıtlar geri yüklenemedi.");
      }
      setPolicy(payload.policy);
      await loadRecords(selectedAcademicYear || undefined);
      setMessage("Pedagojik kayıtlar hesabınıza geri yüklendi.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Kayıtlar geri yüklenemedi.",
      );
    } finally {
      setRestoring(false);
    }
  }

  async function closeAccountPermanently() {
    if (
      !closureSummary ||
      !accountDeleteConfirmed ||
      accountConfirmationText !== "HESABIMI KALICI OLARAK SİL" ||
      accountEmailConfirmation.trim().toLocaleLowerCase("en-US") !== accountEmail
    ) {
      return;
    }
    setClosingAccount(true);
    setMessage("Hesabınız ve bağlı veriler kalıcı olarak siliniyor…");
    try {
      const response = await fetch("/api/account-closure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmed: true,
          confirmationText: accountConfirmationText,
          accountEmail: accountEmailConfirmation,
          expectedProfileExists: closureSummary.profileExists,
          expectedRecordRevisionCount: closureSummary.recordRevisionCount,
        }),
      });
      const payload = (await response.json()) as {
        deleted?: boolean;
        signOutPath?: string;
        error?: string;
      };
      if (!response.ok || !payload.deleted || !payload.signOutPath) {
        throw new Error(payload.error ?? "Hesap kalıcı olarak silinemedi.");
      }
      window.location.assign(payload.signOutPath);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Hesap kalıcı olarak silinemedi.",
      );
      setClosingAccount(false);
    }
  }

  return (
    <section className="record-archive-module">
      <header className="record-archive-hero">
        <div>
          <span className="eyebrow"><Archive size={15} /> Güvenli Öğretmen Çalışma Alanı</span>
          <h1>Kayıt Arşivi</h1>
          <p>
            Ders tasarımlarınız ve revizyonları doğrulanmış öğretmen hesabınıza
            bağlı tutulur. Önceki sürümler değişmeden kalır.
          </p>
        </div>
        <div className="archive-security-seal">
          <ShieldCheck size={34} />
          <strong>Hesaba bağlı</strong>
          <span>Öğrenci kişisel verisi içermez</span>
        </div>
      </header>

      <div className="archive-summary-grid">
        <article><Database size={20} /><strong>{histories.length}</strong><span>Pedagojik kayıt</span></article>
        <article><History size={20} /><strong>{records.length}</strong><span>Toplam revizyon</span></article>
        <article><CheckCircle2 size={20} /><strong>{records.filter((item) => item.status === "approved").length}</strong><span>Onaylı revizyon</span></article>
        <article><FileJson size={20} /><strong>{generations.length}</strong><span>Üretilen belge izi</span></article>
      </div>

      <section className="generation-audit-list" aria-labelledby="generation-audit-title">
        <div className="archive-list-heading">
          <div>
            <span className="section-kicker"><ShieldCheck size={14} /> OPUS denetim zinciri</span>
            <h2 id="generation-audit-title">Kalıcı belge üretim izleri</h2>
          </div>
          <span>{filteredGenerations.length} / {generations.length} yüklenen olay</span>
        </div>
        <div className="generation-audit-filters">
          <label>Olay, karar, istek veya kayıt kimliği<input value={generationSearch} onChange={(event) => {
            const search = event.target.value;
            setGenerationSearch(search);
            setGenerationQueryScope((current) => ({ ...current, search }));
            setGenerationNextCursor(null);
            setGenerationHasMore(false);
            generationFetchRequestId.current += 1;
            if (generationSearchDebounce.current) {
              window.clearTimeout(generationSearchDebounce.current);
            }
            if (search.trim().length > 0 && search.trim().length < 3 && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(search.trim())) {
              setGenerationSearchHint("En az 3 karakter girin ya da tam olay kimliğini kullanın.");
              setGenerations([]);
              setLoadingMoreGenerations(false);
              return;
            }
            setGenerationSearchHint(null);
            const documentType = generationQueryScope.documentType;
            const curriculumId = generationQueryScope.curriculumId;
            generationSearchDebounce.current = window.setTimeout(() => {
              if (!selectedAcademicYear) return;
              void fetchGenerationPage({
                academicYear: selectedAcademicYear,
                documentType,
                curriculumId,
                search,
              });
            }, 260);
          }} placeholder="Karar, kayıt, istek veya olay kimliği" /></label>
          {generationSearchHint ? <small className="field-hint">{generationSearchHint}</small> : null}
          <label>Belge türü<select value={generationDocumentType} disabled={loadingMoreGenerations} onChange={(event) => {
            const documentType = event.target.value;
            setGenerationDocumentType(documentType);
            setGenerationQueryScope({
              search: "",
              documentType,
              curriculumId: "all",
            });
            setGenerationCurriculum("all");
            setGenerationSearch("");
            void fetchGenerationPage({
              academicYear: selectedAcademicYear,
              documentType,
              curriculumId: "all",
              search: "",
            });
          }}><option value="all">Tüm belge türleri</option><option value="daily-plan">Günlük plan</option><option value="annual-plan">Yıllık plan</option><option value="exam">Sınav paketi</option><option value="department-meeting-minutes">Zümre tutanağı</option></select></label>
          <label>Müfredat kaynağı<select value={generationCurriculum} onChange={(event) => {
            const curriculumId = event.target.value;
            setGenerationCurriculum(curriculumId);
            setGenerationQueryScope((current) => ({ ...current, curriculumId }));
            setGenerationNextCursor(null);
            setGenerationHasMore(false);
            generationFetchRequestId.current += 1;
            if (selectedAcademicYear) {
              void fetchGenerationPage({
                academicYear: selectedAcademicYear,
                documentType: generationQueryScope.documentType,
                curriculumId,
                search: generationSearch,
              });
            }
          }}><option value="all">Tüm müfredatlar</option>{generationCurricula.map((curriculumId) => <option key={curriculumId} value={curriculumId}>{curriculumId}</option>)}</select></label>
          <div className="generation-export-buttons">
            <button className="secondary-button" disabled={!selectedAcademicYear || loadingMoreGenerations || generationSearchHint !== null} onClick={exportVisibleGenerationAuditPackage}><Download size={16} /> JSON denetim paketi — Arama sonuçları</button>
            <button className="secondary-button" disabled={generationExporting || !selectedAcademicYear} onClick={() => void exportAcademicYearGenerationAuditPackage()}><Download size={16} /> {generationExporting ? "Hazırlanıyor…" : "Öğretim yılının tamamı"}</button>
          </div>
        </div>
        <section className="generation-package-validation" aria-labelledby="generation-package-validation-title">
          <div>
            <span className="section-kicker"><Upload size={14} /> Pilot 2.2 • Salt okunur doğrulama</span>
            <h3 id="generation-package-validation-title">Denetim paketini doğrula</h3>
            <p>
              İndirdiğiniz JSON paketi yalnızca bu tarayıcıda incelenir; arşiv kayıtları değiştirilmez.
              En fazla {GENERATION_AUDIT_PACKAGE_MAX_EVENT_COUNT.toLocaleString("tr-TR")} olay ve{" "}
              {GENERATION_AUDIT_PACKAGE_MAX_FILE_SIZE_BYTES / (1024 * 1024)} MiB kabul edilir.
            </p>
          </div>
          <label className="secondary-button">
            {auditPackageValidating ? "Doğrulanıyor…" : "JSON denetim paketini seç"}
            <input
              type="file"
              accept=".json,application/json"
              hidden
              disabled={auditPackageValidating}
              onChange={(event) => {
                const selectedFile = event.target.files?.[0];
                if (selectedFile) void verifyGenerationAuditPackageFile(selectedFile);
                event.target.value = "";
              }}
            />
          </label>
          {auditPackageValidation ? (
            <div
              role="status"
              aria-live="polite"
              className={
                auditPackageValidation.status === "valid"
                  ? "operation-success"
                  : auditPackageValidation.status === "warning"
                    ? "operation-warning"
                    : "operation-error"
              }
            >
              <strong>
                {auditPackageValidation.status === "valid"
                  ? "Geçerli"
                  : auditPackageValidation.status === "warning"
                    ? "Uyarı"
                    : "Reddedildi"}
              </strong>
              <span>
                {auditPackageValidation.eventCount} olay • Şema {auditPackageValidation.schemaVersion ?? "bilinmiyor"}
              </span>
              {[...auditPackageValidation.errors, ...auditPackageValidation.warnings].length > 0 ? (
                <ul>
                  {[...auditPackageValidation.errors, ...auditPackageValidation.warnings].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>Şema, kapsam, olay sayısı, kişisel veri sınırı ve SHA-256 özeti doğrulandı.</p>
              )}
              {auditPackageEvidence ? (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={downloadGenerationAuditVerificationEvidence}
                >
                  <Download size={16} /> Doğrulama kanıtını indir
                </button>
              ) : null}
            </div>
          ) : null}
          <div className="generation-evidence-revalidation">
            <div>
              <span className="section-kicker">
                <ShieldCheck size={14} /> Pilot 2.6 • Bağımsız kanıt doğrulama
              </span>
              <h4>İndirilen doğrulama kanıtını yeniden doğrula</h4>
              <p>
                Daha önce indirdiğiniz JSON kanıtı yalnızca bu tarayıcıda incelenir.
                Dosya sunucuya gönderilmez ve arşiv kayıtları değiştirilmez.
              </p>
            </div>
            <label className="secondary-button">
              {evidenceValidating ? "Kanıt doğrulanıyor…" : "JSON doğrulama kanıtını seç"}
              <input
                type="file"
                accept=".json,application/json"
                hidden
                disabled={evidenceValidating}
                onChange={(event) => {
                  const selectedFile = event.target.files?.[0];
                  if (selectedFile) void validateGenerationAuditVerificationEvidenceFile(selectedFile);
                  event.target.value = "";
                }}
              />
            </label>
            {evidenceValidationError ? (
              <div role="status" aria-live="polite" className="operation-error">
                <strong>Reddedildi</strong>
                <span>{evidenceFileName ?? "Seçilen dosya"}</span>
                <p>{evidenceValidationError}</p>
              </div>
            ) : null}
            {evidenceValidation ? (
              <div
                role="status"
                aria-live="polite"
                className={evidenceValidation.status === "valid" ? "operation-success" : "operation-error"}
              >
                <strong>{evidenceValidation.status === "valid" ? "Kanıt geçerli" : "Kanıt reddedildi"}</strong>
                <span>{evidenceFileName ?? "Seçilen dosya"}</span>
                <dl>
                  <div><dt>Kanıt şeması</dt><dd>{evidenceValidation.schemaVersion ?? "bilinmiyor"}</dd></div>
                  <div><dt>Kanıt sonucu</dt><dd>{evidenceValidation.evidenceStatus ?? "bilinmiyor"}</dd></div>
                  <div><dt>Olay sayısı</dt><dd>{evidenceValidation.eventCount}</dd></div>
                  <div><dt>Kaynak paket şeması</dt><dd>{evidenceValidation.sourcePackageSchemaVersion ?? "bilinmiyor"}</dd></div>
                  <div><dt>Politika</dt><dd>{evidenceValidation.policyVersion ?? "bilinmiyor"}</dd></div>
                  <div><dt>Doğrulama zamanı</dt><dd>{evidenceValidation.verifiedAt ? new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(evidenceValidation.verifiedAt)) : "bilinmiyor"}</dd></div>
                </dl>
                {evidenceValidation.errors.length > 0 ? (
                  <ul>
                    {evidenceValidation.errors.map((item, index) => (
                      <li key={`${index}-${item}`}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Şema, politika, kişisel veri sınırı ve SHA-256 bütünlük özeti doğrulandı.</p>
                )}
              </div>
            ) : null}
          </div>
          <div className="generation-evidence-revalidation">
            <div>
              <span className="section-kicker">
                <ShieldCheck size={14} /> Pilot 2.9 • Yönlendirmeli denetim oturumu
              </span>
              <h4>1. Denetim paketini seç</h4>
              <p>
                Kayıt Arşivi’nden indirdiğiniz özgün JSON denetim paketini seçin. Paket
                geçerliliği otomatik doğrulanır. Dosyalar sunucuya gönderilmez, arşiv ve veritabanı değiştirilmez.
              </p>
            </div>
            <div className="generation-audit-actions">
              <label className="secondary-button">
                {matchPackageFileName ?? "JSON denetim paketini seç"}
                <input
                  type="file"
                  accept=".json,application/json"
                  hidden
                  disabled={packageEvidenceMatching}
                  onChange={(event) => {
                    const selectedFile = event.target.files?.[0];
                    if (selectedFile) void readPackageEvidenceMatchFile(selectedFile, "package");
                    event.target.value = "";
                  }}
                />
              </label>
            </div>
            {guidedPackageValidation ? (
              <div className={guidedPackageValidation.status === "rejected" ? "operation-error" : "operation-success"}>
                <strong>{guidedPackageValidation.status === "rejected" ? "1. adım reddedildi" : "1. adım tamamlandı"}</strong>
                <span>{guidedPackageValidation.eventCount} olay • Şema {guidedPackageValidation.schemaVersion ?? "bilinmiyor"}</span>
                {guidedPackageValidation.errors.length > 0 ? <ul>{guidedPackageValidation.errors.map((item) => <li key={item}>{item}</li>)}</ul> : <p>Denetim paketi geçerli.</p>}
              </div>
            ) : null}
            <div>
              <h4>2. Doğrulama kanıtını seç</h4>
              <p>Paket doğrulandıktan sonra indirilen JSON kanıtını seçin. Paket–kanıt eşleşmesi otomatik yapılır.</p>
            </div>
            <div className="generation-audit-actions">
              <label className="secondary-button">
                {matchEvidenceFileName ?? "JSON doğrulama kanıtını seç"}
                <input
                  type="file"
                  accept=".json,application/json"
                  hidden
                  disabled={packageEvidenceMatching}
                  onChange={(event) => {
                    const selectedFile = event.target.files?.[0];
                    if (selectedFile) void readPackageEvidenceMatchFile(selectedFile, "evidence");
                    event.target.value = "";
                  }}
                />
              </label>
              {packageEvidenceMatching ? <span><LoaderCircle className="spin" size={16} /> Otomatik eşleştiriliyor…</span> : null}
            </div>
            {packageEvidenceMatchError ? (
              <div role="status" aria-live="polite" className="operation-error">
                <strong>Eşleştirme yapılamadı</strong>
                <p>{packageEvidenceMatchError}</p>
              </div>
            ) : null}
            {packageEvidenceMatch ? (
              <div
                role="status"
                aria-live="polite"
                className={
                  packageEvidenceMatch.status === "matched"
                    ? "operation-success"
                    : "operation-error"
                }
              >
                <strong>
                  {packageEvidenceMatch.status === "matched"
                    ? "2. adım tamamlandı — Paket ve kanıt eşleşti"
                    : "2. adım reddedildi — Paket ve kanıt eşleşmedi"}
                </strong>
                <span>
                  {matchPackageFileName ?? "Denetim paketi"} •{" "}
                  {matchEvidenceFileName ?? "Doğrulama kanıtı"}
                </span>
                <dl>
                  <div>
                    <dt>Paket şeması</dt>
                    <dd>{packageEvidenceMatch.packageValidation.schemaVersion ?? "bilinmiyor"}</dd>
                  </div>
                  <div>
                    <dt>Kanıttaki paket şeması</dt>
                    <dd>{packageEvidenceMatch.evidenceValidation.sourcePackageSchemaVersion ?? "bilinmiyor"}</dd>
                  </div>
                  <div>
                    <dt>Olay sayısı</dt>
                    <dd>{packageEvidenceMatch.packageValidation.eventCount}</dd>
                  </div>
                  <div>
                    <dt>Kanıttaki olay sayısı</dt>
                    <dd>{packageEvidenceMatch.evidenceValidation.eventCount}</dd>
                  </div>
                  <div>
                    <dt>Paket sonucu</dt>
                    <dd>{packageEvidenceMatch.packageValidation.status}</dd>
                  </div>
                  <div>
                    <dt>Kanıt sonucu</dt>
                    <dd>{packageEvidenceMatch.evidenceValidation.evidenceStatus ?? "bilinmiyor"}</dd>
                  </div>
                </dl>
                {packageEvidenceMatch.errors.length > 0 ? (
                  <ul>
                    {packageEvidenceMatch.errors.map((item, index) => (
                      <li key={`${index}-${item}`}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>SHA-256 özeti, şema sürümü, olay sayısı ve doğrulama sonucu eşleşti.</p>
                )}
              </div>
            ) : null}
          </div>
          <div className="generation-evidence-revalidation">
            <div>
              <h4>3. Özgün DOCX’i seç</h4>
              <p>
                Paketin kapsadığı üretim olaylarından birine ait özgün FOPOS çıktısını seçin.
                SHA-256 özeti tarayıcıda hesaplanır ve belge eşleşmesi otomatik yapılır.
              </p>
            </div>
            <div className="generation-audit-actions">
              <label className="secondary-button">
                {artifactMatchReading
                  ? "Belge özeti hesaplanıyor…"
                  : artifactMatchFileName ?? "Özgün DOCX belgeyi seç"}
                <input
                  type="file"
                  accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  hidden
                  disabled={artifactMatchReading || artifactMatching}
                  onChange={(event) => {
                    const selectedFile = event.target.files?.[0];
                    if (selectedFile) void readArtifactMatchFile(selectedFile);
                    event.target.value = "";
                  }}
                />
              </label>
              {artifactMatching ? <span><LoaderCircle className="spin" size={16} /> Belge otomatik doğrulanıyor…</span> : null}
            </div>
            {artifactMatchDigest ? (
              <small>Belge özeti: SHA-256 • {artifactMatchDigest}</small>
            ) : null}
            {artifactMatchError ? (
              <div role="status" aria-live="polite" className="operation-error">
                <strong>Belge doğrulanamadı</strong>
                <p>{artifactMatchError}</p>
              </div>
            ) : null}
            {artifactMatchResult ? (
              <div
                role="status"
                aria-live="polite"
                className={
                  artifactMatchResult.status === "matched"
                    ? "operation-success"
                    : artifactMatchResult.status === "ambiguous"
                      ? "operation-warning"
                      : "operation-error"
                }
              >
                <strong>
                  {artifactMatchResult.status === "matched"
                    ? "3. adım tamamlandı — Belge denetim paketiyle eşleşti"
                    : artifactMatchResult.status === "ambiguous"
                      ? "Belge için birden fazla üretim olayı bulundu"
                      : "Belge denetim paketiyle eşleşmedi"}
                </strong>
                <span>{artifactMatchFileName ?? "Seçilen DOCX"}</span>
                {artifactMatchResult.matches.length > 0 ? (
                  <dl>
                    {artifactMatchResult.matches.map((match) => (
                      <div key={match.eventId}>
                        <dt>{match.documentType} • {match.eventId}</dt>
                        <dd>
                          {match.outcomeCode} •{" "}
                          {new Intl.DateTimeFormat("tr-TR", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(match.generatedAt))}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                {artifactMatchResult.errors.length > 0 ? (
                  <ul>
                    {artifactMatchResult.errors.map((item, index) => (
                      <li key={`${index}-${item}`}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Paket, kanıt ve DOCX bütünlük zinciri doğrulandı.</p>
                )}
              </div>
            ) : null}
            {(packageEvidenceMatch || artifactMatchResult || packageEvidenceMatchError || artifactMatchError) ? (
              <div className="guided-audit-summary" role="status" aria-live="polite">
                <div>
                  <span className="section-kicker"><ShieldCheck size={14} /> 4. Denetim sonucu</span>
                  <h4>{artifactMatchResult?.status === "matched" ? "Bütünlük zinciri doğrulandı" : "Denetim oturumu tamamlanmadı"}</h4>
                </div>
                <dl>
                  <div><dt>Denetim paketi</dt><dd>{guidedPackageValidation && guidedPackageValidation.status !== "rejected" ? "Geçerli" : "Bekliyor / reddedildi"}</dd></div>
                  <div><dt>Paket–kanıt</dt><dd>{packageEvidenceMatch?.status === "matched" ? "Eşleşti" : "Bekliyor / eşleşmedi"}</dd></div>
                  <div><dt>DOCX–üretim olayı</dt><dd>{artifactMatchResult?.status === "matched" ? "Eşleşti" : artifactMatchResult?.status === "ambiguous" ? "Belirsiz" : "Bekliyor / eşleşmedi"}</dd></div>
                </dl>
                {artifactMatchResult?.status === "matched" && artifactMatchResult.matches[0] ? (
                  <>
                    <p>{artifactMatchResult.matches[0].documentType} • {artifactMatchResult.matches[0].eventId} • {artifactMatchResult.matches[0].outcomeCode}</p>
                    <button type="button" className="primary-button" onClick={downloadPortableAuditResult}>
                      <Download size={16} /> Taşınabilir denetim sonucunu indir
                    </button>
                  </>
                ) : <p>Reddedilen veya eksik adımı yukarıdaki açıklamadan kontrol edin.</p>}
                <button type="button" className="secondary-button" onClick={resetGuidedAuditSession}>
                  <RotateCcw size={16} /> Dosyaları temizle ve yeniden başla
                </button>
              </div>
            ) : null}
          </div>
        </section>
        {filteredGenerations.length === 0 ? (
          <div className="archive-empty">
            <FileJson size={28} />
            <strong>{generations.length === 0 ? "Bu öğretim yılında belge üretim izi yok" : "Filtrelerle eşleşen üretim olayı yok"}</strong>
            <span>{generations.length === 0 ? "Onaylı bir günlük plan, yıllık plan veya sınav paketi indirildiğinde karar ve müfredat kaynağı burada saklanır." : "Arama veya filtreleri değiştirin."}</span>
          </div>
        ) : filteredGenerations.map((generation) => {
          const decision = records.find((record) => record.recordId === generation.recordId && record.revision === generation.revision);
          const isOpen = openGenerationEventId === generation.eventId;
          return <article className="generation-audit-card" key={generation.eventId}>
            <div>
              <strong>{generation.documentType === "daily-plan" ? "Günlük plan" : generation.documentType === "annual-plan" ? "Yıllık plan" : generation.documentType === "exam" ? "Sınav paketi" : generation.documentType === "department-meeting-minutes" ? "Zümre tutanağı" : generation.documentType}</strong>
              <span>Olay {generation.eventId}</span>
            </div>
            <dl>
              <div><dt>Revizyon</dt><dd>{generation.revision}</dd></div>
              <div><dt>Öğretmen onayı</dt><dd>{new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(generation.approvedAt))}</dd></div>
              <div><dt>Üretim zamanı</dt><dd>{new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(generation.generatedAt))}</dd></div>
              <div><dt>Müfredat kaynağı</dt><dd>{generation.curriculum.curriculumId} • {generation.curriculumDatasetVersion}</dd></div>
              <div><dt>Öğrenme çıktısı</dt><dd>{generation.curriculum.outcomeCode}</dd></div>
              <div><dt>Sözleşme</dt><dd>{generation.contractVersion}</dd></div>
              <div><dt>Dosya bütünlüğü</dt><dd>{generation.artifactIntegrity ? `${generation.artifactIntegrity.algorithm} • ${generation.artifactIntegrity.digest}` : "Özet yok (eski üretim)"}</dd></div>
            </dl>
            <div className="generation-audit-actions">
              <span>{generation.decisionId}</span>
              <button className="secondary-button" onClick={() => setOpenGenerationEventId(isOpen ? null : generation.eventId)}>{isOpen ? "Karar ayrıntısını kapat" : "Bu belge hangi karardan üretildi?"}</button>
              {generation.artifactIntegrity ? <label className="secondary-button">
                {verifyingEventId === generation.eventId ? "Doğrulanıyor…" : "Elimdeki DOCX’i doğrula"}
                <input type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" hidden disabled={verifyingEventId === generation.eventId} onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void verifyGenerationFile(generation.eventId, generation.artifactIntegrity!.digest, file);
                  event.target.value = "";
                }} />
              </label> : null}
            </div>
            {integrityResults[generation.eventId] ? <p role="status" className={integrityResults[generation.eventId] === "match" ? "operation-success" : "operation-error"}>
              {integrityResults[generation.eventId] === "match"
                ? "Bütünlük doğrulandı: seçilen dosya bu üretim olayıyla aynıdır."
                : "Bütünlük doğrulanamadı: seçilen dosya bu üretim olayıyla eşleşmiyor."}
            </p> : null}
            {isOpen ? <section className="generation-decision-detail" aria-label="Bağlı pedagojik kararın salt okunur ayrıntısı">
              <strong>Salt okunur pedagojik karar • Revizyon {generation.revision}</strong>
              {decision ? <dl>
                <div><dt>Durum</dt><dd>{statusLabels[decision.status]}</dd></div>
                <div><dt>Öğrenme çıktısı</dt><dd>{decision.curriculum.outcomeCode}</dd></div>
                <div><dt>Strateji</dt><dd>{decision.pedagogicalDecision.strategy}</dd></div>
                <div><dt>Öğrenme kanıtı</dt><dd>{decision.pedagogicalDecision.learningEvidence}</dd></div>
                <div><dt>Hafta / süre</dt><dd>{decision.lessonContext.week}. hafta • {decision.lessonContext.durationMinutes} dk.</dd></div>
                <div><dt>Onay</dt><dd>{decision.approval?.statement ?? "Onay beyanı yok"}</dd></div>
              </dl> : <p>Bağlı karar bu öğretim yılı arşivinde bulunamadı.</p>}
            </section> : null}
          </article>
        })}
        {generationHasMore ? <div className="generation-load-more">
          <button className="secondary-button" disabled={loadingMoreGenerations || !generationNextCursor} onClick={() => {
            if (generationNextCursor) void fetchGenerationPage({
              academicYear: selectedAcademicYear,
              documentType: generationDocumentType,
              curriculumId: generationCurriculum,
              search: generationSearch,
              cursor: generationNextCursor,
              append: true,
            });
          }}>{loadingMoreGenerations ? <LoaderCircle className="spin" size={16} /> : null}{loadingMoreGenerations ? "Yükleniyor…" : `${generationPageSize} olay daha yükle`}</button>
        </div> : null}
      </section>

      <section className="academic-year-archive-filter">
        <div>
          <span className="section-kicker">
            <History size={14} /> Öğretim yılı arşivi
          </span>
          <h2>Yıla göre kayıtları görüntüleyin</h2>
          <p>
            Geçmiş yıl kayıtları salt arşiv görünümünde korunur. Yeni öğretim
            yılına kopyalanmaz, değiştirilmez veya yeniden onaylanmaz.
          </p>
        </div>
        <label>
          Öğretim yılı
          <select
            value={selectedAcademicYear}
            disabled={loading || !activeAcademicYear}
            onChange={(event) => {
              setGenerationDocumentType("all");
              setGenerationCurriculum("all");
              setGenerationSearch("");
              void loadRecords(event.target.value);
            }}
          >
            {[
              ...(academicYearArchives.some(
                (item) => item.academicYear === activeAcademicYear,
              )
                ? []
                : [
                    {
                      academicYear: activeAcademicYear,
                      recordCount: 0,
                      revisionCount: 0,
                    },
                  ]),
              ...academicYearArchives,
            ]
              .filter((item) => item.academicYear)
              .map((item) => (
                <option key={item.academicYear} value={item.academicYear}>
                  {item.academicYear}
                  {item.academicYear === activeAcademicYear
                    ? " • Etkin yıl"
                    : " • Geçmiş yıl"}
                  {` • ${item.recordCount} kayıt / ${item.revisionCount} revizyon`}
                </option>
              ))}
          </select>
        </label>
      </section>

      {message ? <div className="archive-message" role="status" aria-live="polite">{message}</div> : null}

      <section className="local-import-card">
        <div>
          <span className="section-kicker"><Upload size={14} /> v46 geçişi</span>
          <h2>Yerel kayıtları kontrollü biçimde aktarın</h2>
          <p>{localStatus?.message ?? "Yerel arşiv denetleniyor…"}</p>
          {localStatus?.state === "ready" ? (
            <small>
              {localStatus.recordCount} kayıt • {localStatus.revisionCount} revizyon.
              Aktarım kopyalama işlemidir; tarayıcıdaki v46 arşivi silinmez.
            </small>
          ) : null}
        </div>
        {localStatus?.state === "ready" ? (
          <div className="import-confirmation">
            <label>
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(event) => setConfirmed(event.target.checked)}
              />
              Bu kayıtları hesabıma kopyalamayı onaylıyorum.
            </label>
            <button
              className="primary-button"
              disabled={!confirmed || importing}
              onClick={() => void importLocalArchive()}
            >
              {importing ? <LoaderCircle className="spin" size={17} /> : <Upload size={17} />}
              Hesabıma aktar
            </button>
          </div>
        ) : null}
      </section>

      <section className="account-export-card">
        <div>
          <span className="section-kicker"><FileJson size={14} /> Hesap verileri</span>
          <h2>Taşınabilir bir kopya indirin</h2>
          <p>
            JSON paketi hesap e-postanızı, öğretmen profilinizi ve hesabınıza
            bağlı pedagojik kayıtların revizyon geçmişini içerir.
          </p>
          <ul>
            <li>İçerir: profil, pedagojik kayıtlar ve bütünlük özeti</li>
            <li>İçermez: öğrenci listeleri, puanlar, BEP/sağlık verileri</li>
            <li>İçermez: oturum bilgileri ve sistem iç kimlikleri</li>
          </ul>
        </div>
        <div className="export-confirmation">
          <label>
            <input
              type="checkbox"
              checked={exportConfirmed}
              onChange={(event) => setExportConfirmed(event.target.checked)}
            />
            Paketin kapsamını okudum ve hesap verilerimin indirilmesini
            onaylıyorum.
          </label>
          <button
            className="primary-button"
            disabled={!exportConfirmed || exporting}
            onClick={() => void exportAccountData()}
          >
            {exporting ? (
              <LoaderCircle className="spin" size={17} />
            ) : (
              <Download size={17} />
            )}
            JSON paketini indir
          </button>
        </div>
      </section>

      <section className="retention-policy-card">
        <div className="retention-policy-copy">
          <span className="section-kicker">
            <ShieldCheck size={14} /> Saklama ve güvenli silme
          </span>
          <h2>Verilerinizin yaşam döngüsünü yönetin</h2>
          <p>
            Hesabınız ve öğretmen profiliniz bu işlemden etkilenmez. Yalnızca
            hesaba bağlı pedagojik kayıtlar silme alanına taşınır.
          </p>
          {policy ? (
            <ul>
              <li>Hesap ve profil: {policy.policies.accountAndProfile}</li>
              <li>Pedagojik kayıtlar: {policy.policies.pedagogicalRecords}</li>
              <li>Öğrenci verisi: {policy.policies.studentData}</li>
              <li>Dışa aktarılan dosyalar: {policy.policies.exportedFiles}</li>
            </ul>
          ) : (
            <p>Saklama politikası yükleniyor…</p>
          )}
          {policy?.trashedRevisionCount ? (
            <div className="trash-recovery">
              <div>
                <strong>{policy.trashedRevisionCount} revizyon geri alınabilir</strong>
                <span>
                  Silinen kayıtlar {policy.trashRetentionDays} gün sonra kalıcı
                  olarak temizlenir.
                </span>
              </div>
              <button
                className="secondary-button"
                disabled={restoring}
                onClick={() => void restoreAccountRecords()}
              >
                {restoring ? (
                  <LoaderCircle className="spin" size={17} />
                ) : (
                  <RotateCcw size={17} />
                )}
                Kayıtları geri yükle
              </button>
            </div>
          ) : null}
        </div>
        <div className="delete-records-panel">
          <span className="section-kicker"><Trash2 size={14} /> Tehlikeli işlem</span>
          <strong>Pedagojik kayıtlarımı sil</strong>
          <p>
            {policy?.activeRevisionCount ?? records.length} etkin revizyon silme
            alanına taşınacak. v46 yerel arşiviniz ve indirdiğiniz dosyalar
            etkilenmez.
          </p>
          <label>
            <input
              type="checkbox"
              checked={deleteConfirmed}
              onChange={(event) => setDeleteConfirmed(event.target.checked)}
            />
            Kapsamı ve 30 günlük geri alma süresini anladım.
          </label>
          <label className="confirmation-phrase">
            Onaylamak için <strong>KAYITLARIMI SİL</strong> yazın
            <input
              value={confirmationText}
              onChange={(event) => setConfirmationText(event.target.value)}
              autoComplete="off"
            />
          </label>
          <button
            className="danger-button"
            disabled={
              !deleteConfirmed ||
              confirmationText !== "KAYITLARIMI SİL" ||
              (policy?.activeRevisionCount ?? 0) < 1 ||
              deleting
            }
            onClick={() => void deleteAccountRecords()}
          >
            {deleting ? (
              <LoaderCircle className="spin" size={17} />
            ) : (
              <Trash2 size={17} />
            )}
            Kayıtları silme alanına taşı
          </button>
        </div>
      </section>

      <section className="account-closure-card">
        <div>
          <span className="section-kicker">
            <UserX size={14} /> Hesabı kapat
          </span>
          <h2>FOPOS hesabımı kalıcı olarak sil</h2>
          <p>
            Bu işlem öğretmen profilinizi, etkin ve silme alanındaki tüm
            pedagojik revizyonları ve FOPOS hesap kaydınızı kalıcı olarak siler.
            30 günlük geri alma süresi bu işlem için geçerli değildir.
          </p>
          <ul>
            <li>
              Silinecek: öğretmen profili ve{" "}
              {closureSummary?.recordRevisionCount ?? "—"} pedagojik revizyon
            </li>
            <li>
              Etkilenmez: tarayıcınızdaki v46 yerel arşivi ve daha önce
              indirdiğiniz dosyalar
            </li>
            <li>
              Öğrenci kişisel verisi hesapta kalıcı tutulmadığı için silinecek
              hesap paketinde bulunmaz
            </li>
            <li>İşlem tamamlandığında güvenli biçimde çıkış yapılır</li>
          </ul>
          <p className="closure-export-reminder">
            Saklamak istediğiniz içerik varsa önce yukarıdaki JSON paketini
            indirin.
          </p>
        </div>
        <div className="account-closure-confirmation">
          <label>
            <input
              type="checkbox"
              checked={accountDeleteConfirmed}
              onChange={(event) =>
                setAccountDeleteConfirmed(event.target.checked)
              }
            />
            Bu işlemin geri alınamayacağını ve hesabımın yeniden
            oluşturulmasının eski verileri geri getirmeyeceğini anlıyorum.
          </label>
          <label>
            Hesap e-postanızı yazın
            <input
              value={accountEmailConfirmation}
              onChange={(event) =>
                setAccountEmailConfirmation(event.target.value)
              }
              autoComplete="off"
              inputMode="email"
            />
          </label>
          <label>
            Onaylamak için <strong>HESABIMI KALICI OLARAK SİL</strong> yazın
            <input
              value={accountConfirmationText}
              onChange={(event) =>
                setAccountConfirmationText(event.target.value)
              }
              autoComplete="off"
            />
          </label>
          <button
            className="danger-button"
            disabled={
              !accountDeleteConfirmed ||
              accountConfirmationText !== "HESABIMI KALICI OLARAK SİL" ||
              accountEmailConfirmation.trim().toLocaleLowerCase("en-US") !==
                accountEmail ||
              !closureSummary ||
              closingAccount
            }
            onClick={() => void closeAccountPermanently()}
          >
            {closingAccount ? (
              <LoaderCircle className="spin" size={17} />
            ) : (
              <UserX size={17} />
            )}
            Hesabımı kalıcı olarak sil
          </button>
        </div>
      </section>

      <section className="archive-list" aria-busy={loading}>
        <div className="archive-list-heading">
          <div>
            <span className="section-kicker">
              {selectedAcademicYear === activeAcademicYear
                ? "Etkin öğretim yılı"
                : "Geçmiş yıl arşivi"}
            </span>
            <h2>{selectedAcademicYear || "—"} revizyon geçmişi</h2>
          </div>
          <span>{loading ? "Yükleniyor…" : `${histories.length} kayıt`}</span>
        </div>
        {loading ? (
          <div className="archive-empty"><LoaderCircle className="spin" size={24} /> Kayıtlar yükleniyor…</div>
        ) : histories.length === 0 ? (
          <div className="archive-empty">
            <Archive size={28} />
            <strong>Henüz hesap kaydı yok</strong>
            <span>Ders Tasarım Stüdyosu’nda oluşturduğunuz ilk plan burada görünecek.</span>
          </div>
        ) : (
          histories.map((history) => {
            const latest = history[0];
            return (
              <article className="archive-record-card" key={latest.recordId}>
                <div className="archive-record-title">
                  <div>
                    <strong>{latest.curriculum.unitCode}</strong>
                    <span>{latest.curriculum.outcomeCode} • {latest.curriculum.grade}. sınıf • {latest.lessonContext.week}. hafta</span>
                  </div>
                  <span className={`archive-status ${latest.status}`}>{statusLabels[latest.status]}</span>
                </div>
                <p>{latest.pedagogicalDecision.strategy}</p>
                <details>
                  <summary>{history.length} revizyonu göster</summary>
                  {history.map((record) => (
                    <div className="archive-revision-row" key={`${record.recordId}-${record.revision}`}>
                      <span>Revizyon {record.revision}</span>
                      <span>{statusLabels[record.status]}</span>
                      <time dateTime={record.updatedAt}>
                        {new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(record.updatedAt))}
                      </time>
                    </div>
                  ))}
                </details>
              </article>
            );
          })
        )}
      </section>
    </section>
  );
}
