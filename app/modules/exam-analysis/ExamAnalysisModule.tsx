"use client";

import {
  BarChart3,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Plus,
  Sparkles,
  Trash2,
  TrendingUp,
  Upload,
  UsersRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { downloadBlob, safeFileName } from "../../core/file-download";
import { operationErrorMessage } from "../../core/operation-error";
import { createId } from "../../core/id.js";
import { examNames, type ExamName } from "../../core/exam-types";
import { createAnonymousClassSummary, type AnonymousClassSummary } from "../../core/anonymous-class-summary";
import { createStudentRosterTransfer, type StudentRosterTransfer } from "../../core/student-roster-transfer";
import { useSensitiveSession } from "../../hooks/use-sensitive-session";
import { StudentImportPreview } from "../../components/student-import/StudentImportPreview";
import { readStudentSpreadsheet } from "../../core/student-spreadsheet-import";
import {
  normalizedScore,
  parseScoreCell,
  type ScoreCell,
} from "../../core/score-model";
import {
  developmentBand,
  scoreToDevelopmentLevel,
} from "../../core/exam-report-model";
import {
  assertSafeCellText,
  assertTabularBounds,
  STUDENT_IMPORT_LIMITS,
} from "../../core/student-import-security";
import type { ExamBlueprintTransfer } from "../../core/exam-blueprint-transfer";
import type { ClassWorkspaceContext } from "../../core/class-workspace";
import {
  assertStudentImportWorkspace,
  bindStudentImportToWorkspace,
  type ClassBoundStudentImport,
} from "../../core/class-bound-student-import";

type Grade = 10 | 11;
type Unit = {
  code: string;
  name: string;
  grade: Grade;
  outcomes: { code: string; description: string; short: string }[];
};
type PlanMeta = {
  school: string;
  academicYear: string;
  teacher: string;
  principal: string;
};
type Question = { id: string; outcome: string; max: number };
type AttendanceReview = "not_required" | "pending" | "present" | "absent";
type Student = {
  id: string;
  no: string;
  name: string;
  scores: ScoreCell[];
  absent: boolean;
  reportedTotal: number | null;
  attendanceReview: AttendanceReview;
};
type PendingStudentImport = ClassBoundStudentImport;
type RosterContext = { grade: Grade; branch: string };

const uid = () => createId();
const defaultMax = [10, 15, 10, 10, 15, 10, 15, 15];
const initialStudents: Student[] = [];

function requireGradeUnit(units: Unit[], grade: Grade) {
  const unit = units.find((candidate) => candidate.grade === grade);
  if (!unit)
    throw new Error(`${grade}. sınıf için doğrulanmış ünite bulunamadı.`);
  return unit;
}

function requireUnit(units: Unit[], grade: Grade, code: string) {
  const unit = units.find(
    (candidate) => candidate.grade === grade && candidate.code === code,
  );
  if (!unit)
    throw new Error(
      `${grade}. sınıfta “${code}” kodlu doğrulanmış ünite bulunamadı.`,
    );
  if (!unit.outcomes.length)
    throw new Error(`“${code}” ünitesinde doğrulanmış öğrenme çıktısı yok.`);
  return unit;
}

export default function ExamAnalysisModule({
  classContext,
  baseMeta,
  units,
  incomingRoster,
  incomingExam,
  onResolveRoster,
  onResolveExam,
  onTransferRoster,
  onSendToAi,
}: {
  classContext: ClassWorkspaceContext;
  baseMeta: PlanMeta;
  units: Unit[];
  incomingRoster: StudentRosterTransfer | null;
  incomingExam: ExamBlueprintTransfer | null;
  onResolveRoster: () => void;
  onResolveExam: () => void;
  onTransferRoster: (transfer: StudentRosterTransfer) => void;
  onSendToAi: (summary: AnonymousClassSummary) => void;
}) {
  const initialUnit = requireGradeUnit(units, classContext.grade);
  const [grade, setGrade] = useState<Grade>(classContext.grade),
    gradeUnits = units.filter((u) => u.grade === grade),
    [unitCode, setUnitCode] = useState(initialUnit.code);
  const unit = requireUnit(units, grade, unitCode);
  const [school, setSchool] = useState(baseMeta.school),
    [year, setYear] = useState(baseMeta.academicYear),
    [branch, setBranch] = useState(classContext.branchCode),
    [examName, setExamName] = useState<ExamName>(examNames[0]),
    [date, setDate] = useState(""),
    [teacher, setTeacher] = useState(baseMeta.teacher),
    [principal, setPrincipal] = useState(baseMeta.principal);
  const [questions, setQuestions] = useState<Question[]>(
    Array.from({ length: 8 }, (_, i) => ({
      id: uid(),
      outcome: unit.outcomes[i % unit.outcomes.length].code,
      max: defaultMax[i],
    })),
  );
  const [students, setStudents] = useState<Student[]>(initialStudents),
    [created, setCreated] = useState(false),
    [exporting, setExporting] = useState(false),
    [operationMessage, setOperationMessage] = useState(""),
    [analysisReviewConfirmed, setAnalysisReviewConfirmed] = useState(false),
    [privacyConfirmed, setPrivacyConfirmed] = useState(false),
    [clearConfirmed, setClearConfirmed] = useState(false),
    [transferConfirmed, setTransferConfirmed] = useState(false),
    [pendingImport, setPendingImport] = useState<PendingStudentImport | null>(null),
    [previousStudents, setPreviousStudents] = useState<Student[] | null>(null),
    [rosterContext, setRosterContext] = useState<RosterContext | null>(null),
    [previousRosterContext, setPreviousRosterContext] = useState<RosterContext | null>(null),
    [importStatus, setImportStatus] = useState(
      "Henüz e-Okul listesi yüklenmedi.",
    ),
    preview = useRef<HTMLDivElement>(null),
    incomingExamRef = useRef<HTMLElement>(null),
    incomingRosterRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!incomingExam) return;
    window.setTimeout(() => {
      incomingExamRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      incomingExamRef.current?.focus();
    }, 80);
  }, [incomingExam]);
  useEffect(() => {
    if (!incomingRoster) return;
    const timer = window.setTimeout(() => {
      incomingRosterRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      incomingRosterRef.current?.focus();
    }, 80);
    return () => window.clearTimeout(timer);
  }, [incomingRoster]);
  useSensitiveSession(students.length > 0 || pendingImport !== null || incomingRoster !== null);
  const normalized = (student: Student) =>
    normalizedScore(
      student.scores,
      questions.map((question) => question.max),
      student.absent ? "absent" : "present",
    );
  const participants = students.filter((s) => !s.absent),
    completeParticipants = participants.filter(
      (student) => normalized(student) !== null,
    ),
    totals = completeParticipants.map((s) => normalized(s) as number),
    average = totals.length
      ? totals.reduce((a, b) => a + b, 0) / totals.length
      : 0,
    successful = totals.filter((x) => x >= 50).length,
    successRate = completeParticipants.length
      ? (successful * 100) / completeParticipants.length
      : 0;
  const analysisComplete =
    students.length > 0 &&
    students.every((student) => student.attendanceReview !== "pending" && (student.absent || normalized(student) !== null));
  const contextMatches = rosterContext?.grade === grade && rosterContext?.branch === branch;
  const exportReady = analysisComplete && contextMatches && analysisReviewConfirmed && privacyConfirmed;
  const invalidateExportReview = () => setAnalysisReviewConfirmed(false);
  const questionStats = questions.map((q, i) => {
    const vals = participants
      .map((s) => s.scores[i])
      .filter((v): v is number => v !== null);
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0,
      rate = q.max ? (avg * 100) / q.max : 0;
    return {
      ...q,
      index: i,
      answered: vals.length,
      missing: participants.length - vals.length,
      avg,
      rate,
      label:
        rate < 35
          ? "Bireysel çalışma"
          : rate < 55
            ? "Pekiştirme gerekli"
            : rate < 75
              ? "Orta derece"
              : "İyi düzey",
    };
  });
  const lowest = [...questionStats]
    .sort((a, b) => a.rate - b.rate)
    .slice(0, Math.min(3, questionStats.length));
  const distribution = [
    { label: "85-100", count: totals.filter((x) => x >= 85).length },
    { label: "70-84", count: totals.filter((x) => x >= 70 && x < 85).length },
    { label: "60-69", count: totals.filter((x) => x >= 60 && x < 70).length },
    { label: "50-59", count: totals.filter((x) => x >= 50 && x < 60).length },
    { label: "0-49", count: totals.filter((x) => x < 50).length },
  ];
  function changeGrade(g: Grade) {
    if (g === grade) return;
    if ((students.length > 0 || pendingImport) && !window.confirm("Sınıf değişirse oturumdaki öğrenci listesi, puanlar ve içe aktarma önizlemesi silinir. Devam etmek istiyor musunuz?")) return;
    const first = requireGradeUnit(units, g);
    setGrade(g); setUnitCode(first.code); resetStudentData(); invalidateExportReview();
  }
  function changeBranch(nextBranch: string) {
    if (nextBranch === branch) return;
    if ((students.length > 0 || pendingImport) && !window.confirm("Şube değişirse oturumdaki öğrenci listesi, puanlar ve içe aktarma önizlemesi silinir. Devam etmek istiyor musunuz?")) return;
    setBranch(nextBranch); resetStudentData(); invalidateExportReview();
  }
  void changeGrade;
  void changeBranch;
  function resetStudentData() {
    setStudents([]); setPendingImport(null); setPreviousStudents(null); setRosterContext(null); setPreviousRosterContext(null); setCreated(false); setAnalysisReviewConfirmed(false); setPrivacyConfirmed(false); setTransferConfirmed(false);
  }
  function changeUnit(code: string) {
    const next = requireUnit(units, grade, code);
    setUnitCode(code);
    setQuestions((qs) =>
      qs.map((q, i) => ({
        ...q,
        outcome: next.outcomes[i % next.outcomes.length].code,
      })),
    );
    invalidateExportReview();
  }
  function updateQuestion(i: number, patch: Partial<Question>) {
    setQuestions((qs) => qs.map((q, x) => (x === i ? { ...q, ...patch } : q)));
    setStudents((ss) =>
      ss.map((s) => ({
        ...s,
        scores: questions.map((_, x) =>
          x === i
            ? s.scores[x] === null
              ? null
              : Math.min(s.scores[x] as number, patch.max ?? questions[x].max)
            : s.scores[x],
        ),
      })),
    );
    invalidateExportReview();
  }
  function addQuestion() {
    const firstOutcome = unit.outcomes.at(0);
    if (!firstOutcome)
      throw new Error(
        `“${unit.code}” ünitesinde doğrulanmış öğrenme çıktısı yok.`,
      );
    const q = { id: uid(), outcome: firstOutcome.code, max: 10 };
    setQuestions((qs) => [...qs, q]);
    setStudents((ss) => ss.map((s) => ({ ...s, scores: [...s.scores, null] })));
    invalidateExportReview();
  }
  function removeQuestion(i: number) {
    setQuestions((qs) => qs.filter((_, x) => x !== i));
    setStudents((ss) =>
      ss.map((s) => ({ ...s, scores: s.scores.filter((_, x) => x !== i) })),
    );
    invalidateExportReview();
  }
  function addStudent() {
    if (students.length === 0) setRosterContext({ grade, branch });
    setStudents((ss) => [
      ...ss,
      {
        id: uid(),
        no: "",
        name: "Yeni öğrenci",
        scores: questions.map(() => null),
        absent: false,
        reportedTotal: null,
        attendanceReview: "not_required",
      },
    ]);
    invalidateExportReview();
  }
  function removeStudent(index: number) {
    setStudents((ss) => ss.filter((_, i) => i !== index));
    invalidateExportReview();
  }
  async function importStudentFile(file: File) {
    try {
      const previewData = await readStudentSpreadsheet(file);
      setPendingImport(bindStudentImportToWorkspace(previewData, classContext));
      setImportStatus(`${file.name}: güvenli önizleme hazır. Sütunları doğrulayıp içe aktarın.`);
    } catch (error) {
      setImportStatus(
        `Liste okunamadı: ${error instanceof Error ? error.message : "Dosya biçimini kontrol edin."}`,
      );
    }
  }
  function confirmStudentImport() {
    if (!pendingImport) return;
    try {
      const { rows, headerRow, numberColumn, nameColumn, totalColumn } = pendingImport;
      assertStudentImportWorkspace(pendingImport, classContext);
      if (numberColumn < 0 || nameColumn < 0) throw new Error("Öğrenci numarası ve ad-soyad sütunlarını seçin.");
      if (numberColumn === nameColumn) throw new Error("Numara ve ad-soyad için farklı sütunlar seçilmelidir.");
      const found: Student[] = [], seen = new Set<string>(), invalidRows: number[] = [];
      let duplicateCount = 0, blankTotalCount = 0;
      const importRows = rows.slice(headerRow + 1);
      const lastStudentOffset = importRows.findLastIndex((row) => /^\d+$/.test(String(row[numberColumn] ?? "").trim()));
      if (lastStudentOffset < 0) throw new Error("Seçilen numara sütununda öğrenci satırı bulunamadı.");
      importRows.slice(0, lastStudentOffset + 1).forEach((row, offset) => {
        const no = assertSafeCellText(row[numberColumn], "Öğrenci numarası");
        const name = assertSafeCellText(row[nameColumn], "Ad soyad");
        if (!no && !name) return;
        if (!no || !name) { invalidRows.push(headerRow + offset + 2); return; }
        if (!/^\d+$/.test(no)) return;
        if (seen.has(no)) { duplicateCount += 1; return; }
        seen.add(no);
        const totalText = totalColumn >= 0 ? assertSafeCellText(row[totalColumn], "E-Okul toplam puanı") : "";
        const reportedTotal = totalText === "" ? null : Number(totalText.replace(",", "."));
        if (reportedTotal !== null && (!Number.isFinite(reportedTotal) || reportedTotal < 0 || reportedTotal > 100)) {
          throw new Error(`${headerRow + offset + 2}. satırdaki E-Okul toplam puanı 0-100 aralığında değil.`);
        }
        const attendanceReview: AttendanceReview = totalColumn >= 0 && reportedTotal === null ? "pending" : "not_required";
        if (attendanceReview === "pending") blankTotalCount += 1;
        found.push({ id: uid(), no, name, scores: questions.map(() => null), absent: false, reportedTotal, attendanceReview });
      });
      if (invalidRows.length) throw new Error(`Numarası veya adı eksik satırlar var: ${invalidRows.slice(0, 5).join(", ")}${invalidRows.length > 5 ? "…" : ""}`);
      if (!found.length) throw new Error("Seçilen sütunlarda öğrenci satırı bulunamadı.");
      if (found.length > STUDENT_IMPORT_LIMITS.maxStudents) throw new Error(`Liste ${STUDENT_IMPORT_LIMITS.maxStudents} öğrenci sınırını aşıyor.`);
      setPreviousStudents(students);
      setPreviousRosterContext(rosterContext);
      setStudents(found);
      setRosterContext({ grade, branch });
      setPendingImport(null);
      invalidateExportReview();
      setImportStatus(`${found.length} öğrenci öğretmen onayıyla içe aktarıldı${totalColumn >= 0 ? "; E-Okul toplamları kontrol alanına alındı" : ""}${blankTotalCount ? `; ${blankTotalCount} boş puan için katılım kararı bekleniyor` : ""}${duplicateCount ? `; ${duplicateCount} yinelenen numara atlandı` : ""}.`);
    } catch (error) {
      setImportStatus(`İçe aktarma tamamlanmadı: ${error instanceof Error ? error.message : "Eşlemeyi kontrol edin."}`);
    }
  }
  function undoStudentImport() {
    if (!previousStudents) return;
    setStudents(previousStudents);
    setRosterContext(previousRosterContext);
    setPreviousStudents(null);
    setPreviousRosterContext(null);
    setTransferConfirmed(false);
    setAnalysisReviewConfirmed(false);
    setPrivacyConfirmed(false);
    setImportStatus("Son öğrenci içe aktarma işlemi geri alındı.");
  }
  function parsePaste(value: string) {
    try {
      const rows = value.trim().split(/\r?\n/).map((row) => row.split(/\t|;/));
      if (!value.trim()) return;
      assertTabularBounds(rows);
      if (rows.length > STUDENT_IMPORT_LIMITS.maxStudents) throw new Error(`Liste ${STUDENT_IMPORT_LIMITS.maxStudents} öğrenci sınırını aşıyor.`);
      const seen = new Set<string>();
      const parsed = rows.map((row, index) => {
        const no = assertSafeCellText(row[0], `${index + 1}. satır öğrenci numarası`);
        const name = assertSafeCellText(row[1], `${index + 1}. satır ad soyad`);
        if (!no || !name) throw new Error(`${index + 1}. satırda öğrenci numarası veya ad soyad eksik.`);
        if (seen.has(no)) throw new Error(`${index + 1}. satırda yinelenen öğrenci numarası var: ${no}`);
        seen.add(no);
        return { id: uid(), no, name, scores: questions.map((question, questionIndex) => parseScoreCell(row[questionIndex + 2], question.max)), absent: /^(g|gelmedi|absent)$/i.test(row[2] || ""), reportedTotal: null, attendanceReview: "not_required" as AttendanceReview };
      });
      setStudents(parsed);
      setPreviousStudents(students);
      setPreviousRosterContext(rosterContext);
      setRosterContext({ grade, branch });
      setImportStatus(`${parsed.length} öğrenci yapıştırılan listeden eklendi.`);
      invalidateExportReview();
    } catch (error) {
      setImportStatus(`Yapıştırılan liste alınamadı: ${error instanceof Error ? error.message : "Biçimi kontrol edin."}`);
    }
  }
  async function exportDocx() {
    if (!exportReady)
      throw new Error(
        "Analiz, puanlar ve mahremiyet öğretmen tarafından doğrulanmadan dışa aktarılamaz.",
      );
    setExporting(true);
    setOperationMessage("Sınav analiz tutanağı hazırlanıyor…");
    try {
      const {
        AlignmentType,
        BorderStyle,
        Document,
        HeadingLevel,
        Packer,
        PageOrientation,
        Paragraph,
        Table,
        TableCell,
        TableRow,
        TextRun,
        WidthType,
      } = await import("docx");
      const b = { style: BorderStyle.SINGLE, size: 1, color: "94A3B8" };
      const c = (text: string, w: number, bold = false) =>
        new TableCell({
          width: { size: w, type: WidthType.PERCENTAGE },
          borders: { top: b, bottom: b, left: b, right: b },
          children: [
            new Paragraph({
              children: [new TextRun({ text, bold, size: 18 })],
            }),
          ],
        });
      const summary = [
        "Sınıf Mevcudu",
        String(students.length),
        "Sınava Katılan",
        String(completeParticipants.length),
        "Katılmayan",
        String(students.length - participants.length),
        "Başarılı",
        String(successful),
        "Başarısız",
        String(completeParticipants.length - successful),
        "Ortalama",
        average.toFixed(1),
        "Başarı %",
        `%${successRate.toFixed(1)}`,
      ];
      const outcomeText = (code: string) => {
        const outcome = gradeUnits
          .flatMap((candidate) => candidate.outcomes)
          .find((candidate) => candidate.code === code);
        return outcome ? `${outcome.code}. ${outcome.description}` : code;
      };
      const signature = () =>
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 260 },
          children: [
            new TextRun({
              text: `${teacher}\nDers Öğretmeni                 ................................\nZümre Başkanı                 ${date || ".... / .... / ........"}\nOkul Müdürü onayı / imza: ................................\n${principal}\nOkul Müdürü`,
              bold: true,
            }),
          ],
        });
      const summaryTable = () =>
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: Array.from({ length: 6 }, (_, i) =>
                c(summary[i * 2], 16, true),
              ),
            }),
            new TableRow({
              children: Array.from({ length: 6 }, (_, i) =>
                c(summary[i * 2 + 1], 16),
              ),
            }),
          ],
        });
      const doc = new Document({
        creator: "FOPOS v5.6",
        title: `${grade}-${branch} Sınav Analizi`,
        sections: [
          {
            properties: {
              page: {
                margin: { top: 650, right: 650, bottom: 650, left: 650 },
              },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${year} EĞİTİM-ÖĞRETİM YILI ${school.toLocaleUpperCase("tr-TR")}\n${grade}-${branch} SINIFI FELSEFE DERSİ ${examName.toLocaleUpperCase("tr-TR")}\nSINAV SONUÇ DEĞERLENDİRME TUTANAĞI`,
                    bold: true,
                    size: 24,
                  }),
                ],
              }),
              summaryTable(),
              new Paragraph({
                text: "PUAN DAĞILIMI",
                heading: HeadingLevel.HEADING_1,
              }),
              ...distribution.map(
                (d) =>
                  new Paragraph({
                    text: `${d.label}: ${d.count}/${completeParticipants.length} (%${completeParticipants.length ? ((d.count * 100) / completeParticipants.length).toFixed(1) : "0"})`,
                  }),
              ),
              new Paragraph({
                text: "KONU / ÖĞRENME ÇIKTISI ANALİZİ",
                heading: HeadingLevel.HEADING_1,
              }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      c("Soru", 7, true),
                      c("Öğrenme çıktısı", 43, true),
                      c("Cevap veren", 12, true),
                      c("Başarı %", 12, true),
                      c("Ort. puan", 12, true),
                      c("Sonuç", 14, true),
                    ],
                  }),
                  ...questionStats.map(
                    (q) =>
                      new TableRow({
                        children: [
                          c(String(q.index + 1), 7),
                          c(outcomeText(q.outcome), 43),
                          c(String(q.answered), 12),
                          c(`%${q.rate.toFixed(1)}`, 12),
                          c(`${q.avg.toFixed(1)}/${q.max}`, 12),
                          c(q.label, 14),
                        ],
                      }),
                  ),
                ],
              }),
              signature(),
            ],
          },
          {
            properties: {
              page: {
                size: { orientation: PageOrientation.LANDSCAPE },
                margin: { top: 500, right: 420, bottom: 500, left: 420 },
              },
            },
            children: [
              new Paragraph({
                text: "ÖĞRENCİ PUAN DAĞILIMI",
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
              }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      c("#", 4, true), c("No.", 7, true), c("Ad Soyad", 25, true),
                      ...questions.map((_, index) => c(String(index + 1), 5, true)),
                      c("Puan", 8, true), c("Sonuç", 10, true),
                    ],
                  }),
                  ...students.map((student, studentIndex) => {
                    const total = normalized(student);
                    return new TableRow({
                      children: [
                        c(String(studentIndex + 1), 4), c(student.no, 7), c(student.name, 25),
                        ...questions.map((_, questionIndex) =>
                          c(student.absent ? "G" : String(student.scores[questionIndex] ?? ""), 5),
                        ),
                        c(total === null ? "-" : total.toFixed(1), 8, true),
                        c(student.absent ? "Katılmadı" : total === null ? "Eksik" : total >= 50 ? "Başarılı" : "Başarısız", 10),
                      ],
                    });
                  }),
                  new TableRow({
                    children: [
                      c("Sorulara Göre Başarı (%)", 36, true),
                      ...questionStats.map((question) => c(`%${question.rate.toFixed(1)}`, 5, true)),
                      c(average.toFixed(1), 8, true), c(`%${successRate.toFixed(1)}`, 10, true),
                    ],
                  }),
                ],
              }),
              signature(),
            ],
          },
          {
            properties: { page: { margin: { top: 650, right: 650, bottom: 650, left: 650 } } },
            children: [
              new Paragraph({
                text: "SINAV SONUÇ DEĞERLENDİRME TUTANAĞI",
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({ text: `${school} • ${grade}-${branch} • ${examName} • ${date || "Tarih girilmedi"}` }),
              new Paragraph({ text: "1. Bölüm Öğrencilerin Puan Dağılımı", heading: HeadingLevel.HEADING_2 }),
              summaryTable(),
              new Paragraph({ text: "2. Bölüm Eksik Öğrenme Çıktılarının Belirlenmesi ve Telafi Çalışmalarının Planlanması", heading: HeadingLevel.HEADING_2 }),
              new Paragraph({ text: "Sınav sonuçlarında en düşük başarı gösterilen üç soruya ait öğrenme çıktıları öğretmen planlamasına sunulmuştur." }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({ children: [c("Eksik Öğrenme Çıktıları", 50, true), c("Gelişim Planı (Plan Çalışmaları / Tarih)", 50, true)] }),
                  ...lowest.map((question, index) => new TableRow({
                    children: [
                      c(`${index + 1}. ${outcomeText(question.outcome)} (%${question.rate.toFixed(1)})`, 50, true),
                      c("☐ Ders İçi Konu Tekrarı\n☐ Bakanlık Destek Materyalleri\n☐ Çalışma Kağıdı\n☐ EBA Uygulamaları\n☐ MEBİ Uygulamaları\n☐ DYK Çalışmaları\n☐ Diğer: ........................\nUygulama tarihi: .... / .... / ........", 50),
                    ],
                  })),
                ],
              }),
              signature(),
            ],
          },
          {
            properties: {
              page: {
                size: { orientation: PageOrientation.LANDSCAPE },
                margin: { top: 500, right: 420, bottom: 500, left: 420 },
              },
            },
            children: [
              new Paragraph({ text: "KAZANIMLARA GÖRE SINIF GELİŞİM RAPORU", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
              new Paragraph({ text: "Kazanımlar ve Puanları", heading: HeadingLevel.HEADING_2, alignment: AlignmentType.CENTER }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({ children: [c("Soru No.", 7, true), c("Öğrenme Çıktısı", 53, true), c("Puan", 8, true), ...[1, 2, 3, 4].map((level) => c(String(level), 8, true))] }),
                  ...questionStats.map((question) => new TableRow({
                    children: [
                      c(String(question.index + 1), 7), c(outcomeText(question.outcome), 53), c(String(question.max), 8, true),
                      ...[1, 2, 3, 4].map((level) => c(developmentBand(question.max, level), 8)),
                    ],
                  })),
                ],
              }),
              new Paragraph({ text: "Öğrenci Puan Dağılımı (1-4 Arası)", heading: HeadingLevel.HEADING_2, alignment: AlignmentType.CENTER }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({ children: [c("#", 4, true), c("No.", 7, true), c("Ad Soyad", 25, true), ...questions.map((_, index) => c(String(index + 1), 5, true)), c("Ort.", 8, true)] }),
                  ...students.map((student, studentIndex) => {
                    const levels = questions.map((question, questionIndex) => scoreToDevelopmentLevel(student.absent ? null : student.scores[questionIndex], question.max));
                    const numericLevels = levels.filter((level) => level !== "-").map(Number);
                    const levelAverage = numericLevels.length ? Math.round(numericLevels.reduce((sum, level) => sum + level, 0) / numericLevels.length) : "-";
                    return new TableRow({ children: [c(String(studentIndex + 1), 4), c(student.no, 7), c(student.name, 25), ...levels.map((level) => c(level, 5)), c(String(levelAverage), 8, true)] });
                  }),
                ],
              }),
              signature(),
            ],
          },
        ],
      });
      const blob = await Packer.toBlob(doc);
      downloadBlob(
        blob,
        safeFileName(["FOPOS", grade, branch, "Sinav_Analizi"], "docx"),
      );
      setOperationMessage("Sınav analiz tutanağı indirildi.");
    } catch (error) {
      setOperationMessage(
        operationErrorMessage(error, "Sınav analiz tutanağı indirilemedi."),
      );
    } finally {
      setExporting(false);
    }
  }
  function clearStudentSession() {
    if (!clearConfirmed) return;
    setStudents([]);
    setCreated(false);
    setAnalysisReviewConfirmed(false);
    setPrivacyConfirmed(false);
    setClearConfirmed(false);
    setPendingImport(null);
    setPreviousStudents(null);
    setRosterContext(null);
    setPreviousRosterContext(null);
    setImportStatus("Öğrenci oturumu temizlendi.");
    setOperationMessage("Öğrenci listesi ve puanlar bu cihaz oturumundan silindi.");
  }
  function anonymousSummary() {
    return createAnonymousClassSummary({
      module: "exam_analysis",
      grade,
      groupSize: completeParticipants.length,
      metrics: {
        classAverage: Number(average.toFixed(2)),
        successRate: Number(successRate.toFixed(2)),
        absentCount: students.length - participants.length,
        completeCount: completeParticipants.length,
      },
    });
  }
  function exportAnonymousSummary() {
    const summary = anonymousSummary();
    downloadBlob(
      new Blob([JSON.stringify(summary, null, 2)], { type: "application/json" }),
      `fopos-${grade}-${branch}-kimliksiz-sinav-ozeti.json`,
    );
  }
  function sendAnonymousSummaryToAi() {
    onSendToAi(anonymousSummary());
  }
  function transferRosterToPerformance() {
    if (!transferConfirmed || !contextMatches) return;
    const transfer = createStudentRosterTransfer({ grade, branch, students: students.map(({ no, name }) => ({ no, name })) });
    setTransferConfirmed(false);
    onTransferRoster(transfer);
  }
  function acceptIncomingRoster() {
    if (!incomingRoster) return;
    if (students.length > 0 && !window.confirm("Mevcut sınav öğrenci listesi ve puanlar gelen listeyle değiştirilecek. Devam etmek istiyor musunuz?")) return;
    const nextUnit = requireGradeUnit(units, incomingRoster.grade);
    const nextQuestions = Array.from({ length: 8 }, (_, index) => ({ id: uid(), outcome: nextUnit.outcomes[index % nextUnit.outcomes.length].code, max: defaultMax[index] }));
    setGrade(incomingRoster.grade); setBranch(incomingRoster.branch); setUnitCode(nextUnit.code); setQuestions(nextQuestions);
    setStudents(incomingRoster.students.map((student) => ({ id: uid(), no: student.no, name: student.name, scores: nextQuestions.map(() => null), absent: false, reportedTotal: null, attendanceReview: "not_required" })));
    setRosterContext({ grade: incomingRoster.grade, branch: incomingRoster.branch });
    setCreated(false); setAnalysisReviewConfirmed(false); setPrivacyConfirmed(false); setPendingImport(null); setPreviousStudents(null); setPreviousRosterContext(null);
    setImportStatus(`${incomingRoster.students.length} öğrenci oturum listesinden kabul edildi; puanlar boş bırakıldı.`);
    onResolveRoster();
  }
  function acceptIncomingExam() {
    if (!incomingExam) return;
    if (
      (students.length > 0 || pendingImport) &&
      !window.confirm(
        "Mevcut soru yapısı değiştirilirse öğrenci puanları ve içe aktarma önizlemesi temizlenecek. Devam etmek istiyor musunuz?",
      )
    )
      return;
    const validUnits = units.filter(
      (candidate) => candidate.grade === incomingExam.grade,
    );
    const validOutcomes = new Set(
      validUnits.flatMap((candidate) =>
        candidate.outcomes.map((outcome) => outcome.code),
      ),
    );
    if (
      incomingExam.questions.some(
        (question) => !validOutcomes.has(question.outcomeCode),
      )
    )
      throw new Error(
        "Gelen sınavda doğrulanmış müfredatla eşleşmeyen öğrenme çıktısı var.",
      );
    const firstUnit = validUnits.find(
      (candidate) => candidate.code === incomingExam.questions[0]?.unitCode,
    );
    if (!firstUnit)
      throw new Error("Gelen sınavın ilk ünitesi doğrulanamadı.");
    resetStudentData();
    setGrade(incomingExam.grade);
    setUnitCode(firstUnit.code);
    setExamName(incomingExam.examName);
    setQuestions(
      incomingExam.questions.map((question) => ({
        id: uid(),
        outcome: question.outcomeCode,
        max: question.maxPoints,
      })),
    );
    setCreated(true);
    setOperationMessage(
      `${incomingExam.questions.length} soruluk sınav yapısı kabul edildi; öğrenci puanları boş bırakıldı.`,
    );
    onResolveExam();
    window.setTimeout(() => {
      preview.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      preview.current?.focus();
    }, 80);
  }
  return (
    <section className="analysis-module" id="top" data-sensitive-session={students.length > 0 || pendingImport || incomingRoster ? "active" : "inactive"}>
      {incomingExam ? <section className="incoming-roster" role="region" aria-labelledby="analysis-incoming-exam" ref={incomingExamRef} tabIndex={-1}><div><strong id="analysis-incoming-exam">Sınav Oluşturucudan sınav yapısı geldi</strong><span>{incomingExam.grade}. sınıf • {incomingExam.examName} • {incomingExam.questions.length} soru • 100 puan</span><p>Yalnız ünite, öğrenme çıktısı ve soru puanları taşındı. Öğrenci verisi içermez ve otomatik uygulanmaz.</p></div><div><button type="button" className="secondary-button" onClick={onResolveExam}>Aktarımı reddet ve sil</button><button type="button" className="primary-button" onClick={acceptIncomingExam}>Sınav yapısını analize kabul et</button></div></section> : null}
      {incomingRoster ? <section className="incoming-roster incoming-roster--attention" role="region" aria-labelledby="analysis-incoming-roster" ref={incomingRosterRef} tabIndex={-1}><div><strong id="analysis-incoming-roster">Öğrenci Listelerinden liste geldi</strong><span>{incomingRoster.grade}-{incomingRoster.branch} • {incomingRoster.students.length} öğrenci • Puan içermez</span><p>Liste otomatik uygulanmadı. Kabul edilirse mevcut soru yapısına boş puan alanlarıyla bağlanır.</p></div><div><button type="button" className="secondary-button" onClick={onResolveRoster}>Aktarımı reddet ve sil</button><button type="button" className="primary-button" onClick={acceptIncomingRoster}>{incomingRoster.students.length} öğrenciyi sınav analizine kabul et</button></div></section> : null}
      {operationMessage && (
        <div className="calendar-note" role="status" aria-live="polite">
          <FileSpreadsheet size={18} /> <span>{operationMessage}</span>
        </div>
      )}
      <section className="annual-hero analysis-hero">
        <div>
          <span className="eyebrow">
            <BarChart3 size={15} /> FOPOS v5.5 • e-Okul Listeli Sınav Analizi
          </span>
          <h1>
            Sonuçları görün,
            <br />
            <em>öğretimi iyileştirin.</em>
          </h1>
          <p>
            Soru ve öğrenci puanlarını girin; sınıf başarısını, eksik öğrenme
            çıktılarını ve uygulanabilir telafi planını otomatik oluşturun.
          </p>
        </div>
        <form
          className="builder-card"
          onSubmit={(e) => {
            e.preventDefault();
            setCreated(true);
            setTimeout(() => {
              preview.current?.scrollIntoView({ behavior: "smooth" });
              preview.current?.focus();
            }, 60);
          }}
        >
          <div className="field-grid compact-grid">
            <label className="field">
              <span>Sınıf</span>
              <select
                value={grade}
                disabled
              >
                <option value={grade}>{grade}. Sınıf</option>
              </select>
            </label>
            <label className="field">
              <span>Şube</span>
              <select value={branch} disabled>
                <option value={branch}>{branch}</option>
              </select>
            </label>
          </div>
          <label className="field">
            <span>Ünite</span>
            <select
              value={unitCode}
              onChange={(e) => changeUnit(e.target.value)}
            >
              {gradeUnits.map((u) => (
                <option key={u.code} value={u.code}>
                  {u.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Sınav adı</span>
            <select
              value={examName}
              onChange={(e) => setExamName(e.target.value as ExamName)}
            >
              {examNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <details className="official-fields">
            <summary>Resmî bilgiler</summary>
            <label className="field">
              <span>Okul</span>
              <input
                value={school}
                onChange={(e) => setSchool(e.target.value)}
              />
            </label>
            <label className="field">
              <span>Öğretim yılı</span>
              <input value={year} onChange={(e) => setYear(e.target.value)} />
            </label>
            <label className="field">
              <span>Tarih</span>
              <input value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label className="field">
              <span>Öğretmen</span>
              <input
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
              />
            </label>
            <label className="field">
              <span>Müdür</span>
              <input
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
              />
            </label>
          </details>
          <div className="student-import-card">
            <UsersRound size={22} />
            <div>
              <b>e-Okul öğrenci listesini ekleyin</b>
              <span>
                .XLS, .XLSX veya .CSV dosyasından okul numarası ve ad soyad
                otomatik alınır.
              </span>
              <small role="status" aria-live="polite">{importStatus}</small>
            </div>
            <label className="upload-button">
              <Upload size={16} /> Liste seç
              <input
                aria-label="Sınav analizi öğrenci listesi dosyası"
                data-testid="analysis-setup-file-input"
                type="file"
                accept=".xls,.xlsx,.csv"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.currentTarget.value = "";
                  if (file) void importStudentFile(file);
                }}
              />
            </label>
          </div>
          {pendingImport ? (
            <StudentImportPreview preview={pendingImport} contextLabel={`${pendingImport.academicYear} • ${pendingImport.grade}-${pendingImport.branch}`} onChange={(next) => setPendingImport({ ...pendingImport, ...next })} onCancel={() => { setPendingImport(null); setImportStatus("İçe aktarma önizlemesi iptal edildi."); }} onConfirm={confirmStudentImport} />
          ) : null}
          {previousStudents ? <button type="button" className="secondary-button import-undo" onClick={undoStudentImport}>Son öğrenci içe aktarmasını geri al</button> : null}
          <div className="calendar-note meeting-warning">
            <FileSpreadsheet size={18} />
            <div>
              <strong>Yerel ve geçici işleme</strong>
              <span>
                Öğrenci listesi bu tarayıcı oturumunda işlenir; harici yapay
                zekâ servisine gönderilmez. Yalnız gerekli numara, ad ve puan
                alanlarını yükleyin.
              </span>
            </div>
          </div>
          <button className="primary-button" type="submit">
            <Sparkles size={18} /> Analiz ekranını hazırla
          </button>
        </form>
      </section>
      {!created ? (
        <section className="empty-state-section">
          <div className="section-kicker">
            DefterDoldur rapor yapısından uyarlanmıştır
          </div>
          <h2>Puan çizelgesinden gelişim planına tek akış.</h2>
          <div className="feature-grid">
            <article>
              <span>
                <FileSpreadsheet size={21} />
              </span>
              <h3>Kolay veri girişi</h3>
              <p>
                Öğrenci ve soru puanlarını elle girin veya e-Okul/Excel
                satırlarını yapıştırın.
              </p>
            </article>
            <article>
              <span>
                <BarChart3 size={21} />
              </span>
              <h3>Soru analizi</h3>
              <p>
                Cevaplayan, ortalama puan ve başarı yüzdesi her soru için
                hesaplanır.
              </p>
            </article>
            <article>
              <span>
                <TrendingUp size={21} />
              </span>
              <h3>İyileştirme planı</h3>
              <p>
                En düşük üç öğrenme çıktısı için telafi çalışmaları otomatik
                önerilir.
              </p>
            </article>
            <article>
              <span>
                <Download size={21} />
              </span>
              <h3>Resmî tutanak</h3>
              <p>
                Analiz, dağılım ve gelişim planı düzenlenebilir DOCX olarak
                hazırlanır.
              </p>
            </article>
          </div>
        </section>
      ) : (
        <section
          className="results-section analysis-results"
          ref={preview}
          tabIndex={-1}
        >
          <div className="results-header">
            <div>
              <span className="review-pill">
                <CheckCircle2 size={15} />{" "}
                {analysisComplete
                  ? "HESAPLAMA TAMAMLANDI"
                  : "EKSİK PUAN KONTROLÜ GEREKLİ"}
              </span>
              <h2>
                {grade}-{branch} {examName}
              </h2>
              <p>
                {completeParticipants.length} tam kayıt • Ortalama{" "}
                {average.toFixed(1)} • Başarı %{successRate.toFixed(1)}
              </p>
            </div>
            <div className="session-actions">
              <button type="button" className="secondary-button" disabled={completeParticipants.length < 5} onClick={exportAnonymousSummary}>Kimliksiz sınıf özetini indir</button>
              <button type="button" className="secondary-button" disabled={completeParticipants.length < 5} onClick={sendAnonymousSummaryToAi}>Kimliksiz özeti FOPOS AI’ya aktar</button>
              <button className="download-button" onClick={() => void exportDocx()} disabled={exporting || !exportReady}><Download size={16} /> {exporting ? "Hazırlanıyor…" : "Analiz tutanağını DOCX indir"}</button>
              <label><input type="checkbox" checked={clearConfirmed} onChange={(event) => setClearConfirmed(event.target.checked)} /> Öğrenci listesi ve puanların silineceğini anlıyorum</label>
              <button type="button" className="row-delete session-clear" disabled={!clearConfirmed} onClick={clearStudentSession}>Öğrenci oturumunu temizle</button>
            </div>
          </div>
          <div
            className="record-approval-bar"
            role="region"
            aria-label="Sınav analizi dışa aktarma onayı"
          >
            <div>
              <strong>
                {analysisComplete
                  ? "Kesin hesaplamalar tamamlandı"
                  : "Eksik puanlar var"}
              </strong>
              <span>
                Boş puanlı öğrenciler istatistiğe alınmaz. DOCX kurumsal ve
                sınav verisi içerdiği için güvenli saklanmalıdır.
              </span>
            </div>
            <label>
              <input
                type="checkbox"
                checked={privacyConfirmed}
                onChange={(event) => setPrivacyConfirmed(event.target.checked)}
              />{" "}
              Dosyayı yalnız yetkili kişilerle paylaşacağım
            </label>
            <label>
              <input
                type="checkbox"
                disabled={!analysisComplete}
                checked={analysisReviewConfirmed}
                onChange={(event) =>
                  setAnalysisReviewConfirmed(event.target.checked)
                }
              />{" "}
              Öğrenci listesi, puanlar ve analiz sonuçlarını kontrol ettim
            </label>
          </div>
          <div className="roster-transfer-bar" role="region" aria-label="Öğrenci listesini performans modülüne aktarma">
            <div><strong>Öğrenci listesini Öğrenci Performansına aktar</strong><span>Yalnız öğrenci numarası, ad-soyad ve {grade}-{branch} bağlamı taşınır. Soru puanları, sınav sonucu, devamsızlık ve analiz aktarılmaz; bu analiz oturumu kapanır.</span></div>
            <label><input type="checkbox" checked={transferConfirmed} onChange={(event) => setTransferConfirmed(event.target.checked)} /> Aktarım sınırını ve mevcut analiz oturumunun kapanacağını anlıyorum</label>
            <button type="button" className="secondary-button" disabled={!transferConfirmed || !contextMatches || students.length === 0} onClick={transferRosterToPerformance}>Listeyi performans modülüne gönder</button>
          </div>
          <div className="analysis-summary">
            <article>
              <span>Sınıf mevcudu</span>
              <b>{students.length}</b>
            </article>
            <article>
              <span>Katılan</span>
              <b>{completeParticipants.length}</b>
            </article>
            <article>
              <span>Başarılı</span>
              <b>{successful}</b>
            </article>
            <article>
              <span>Ortalama</span>
              <b>{average.toFixed(1)}</b>
            </article>
            <article>
              <span>Başarı</span>
              <b>%{successRate.toFixed(1)}</b>
            </article>
          </div>
          <div className="analysis-grid">
            <section className="analysis-question-entry">
              <h3>Soru ve öğrenme çıktısı tanımları</h3>
              {questions.map((q, i) => (
                <div className="question-definition" key={q.id}>
                  <b>S{i + 1}</b>
                  <select
                    aria-label={`Soru ${i + 1} öğrenme çıktısı`}
                    value={q.outcome}
                    onChange={(e) =>
                      updateQuestion(i, { outcome: e.target.value })
                    }
                  >
                    {gradeUnits.flatMap((candidateUnit) =>
                      candidateUnit.outcomes.map((outcome) => (
                        <option key={outcome.code} value={outcome.code}>
                          {outcome.code} • {candidateUnit.name} • {outcome.short}
                        </option>
                      )),
                    )}
                  </select>
                  <input
                    aria-label={`Soru ${i + 1} azami puanı`}
                    type="number"
                    min="1"
                    max="100"
                    value={q.max}
                    onChange={(e) =>
                      updateQuestion(i, { max: +e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeQuestion(i)}
                    aria-label={`Soru ${i + 1} tanımını sil`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              <button className="secondary-button" onClick={addQuestion}>
                <Plus size={15} /> Soru ekle
              </button>
            </section>
            <section className="analysis-roster-entry">
              <h3>Öğrenci listesi ve toplu puan girişi</h3>
              <label className="upload-drop">
                <Upload size={20} />
                <b>e-Okul Excel listesini yükle</b>
                <span>.XLS, .XLSX veya .CSV</span>
                <input
                  aria-label="e-Okul öğrenci listesi dosyası"
                  data-testid="analysis-score-file-input"
                  type="file"
                  accept=".xls,.xlsx,.csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.currentTarget.value = "";
                    if (file) void importStudentFile(file);
                  }}
                />
              </label>
              <p className="import-status" role="status" aria-live="polite">{importStatus}</p>
              <p className="field-help">
                Excel’den “Numara; Ad Soyad; S1; S2…” düzenindeki satırları
                kopyalayıp yapıştırabilirsiniz.
              </p>
              <textarea
                className="paste-area"
                placeholder={
                  "101; Ayşe Yılmaz; 8; 12; 6; 9\n102; Mehmet Kaya; 5; 8; 4; 7"
                }
                onBlur={(e) => {
                  if (e.target.value.trim()) parsePaste(e.target.value);
                }}
              />
              <button className="secondary-button" onClick={addStudent}>
                <Plus size={15} /> Öğrenci ekle
              </button>
            </section>
          </div>
          <div className="student-score-table">
            <div className="score-row score-head">
              <b>#</b>
              <b>İşlem</b>
              <b>Öğr. No</b>
              <b>Ad Soyad</b>
              {questions.map((_, i) => (
                <b key={i}>S{i + 1}</b>
              ))}
              <b>Toplam</b>
              <b>E-Okul / Kontrol</b>
              <b>Durum</b>
            </div>
            {students.map((s, si) => (
              <div className="score-row" key={s.id}>
                <b>{si + 1}</b>
                <button
                  className="row-delete"
                  onClick={() => removeStudent(si)}
                  aria-label="Öğrenciyi sil"
                >
                  <Trash2 size={15} />
                </button>
                <input
                  aria-label={`${si + 1}. öğrenci okul numarası`}
                  value={s.no}
                  onChange={(e) => {
                    setStudents((ss) =>
                      ss.map((x, i) =>
                        i === si ? { ...x, no: e.target.value } : x,
                      ),
                    );
                    invalidateExportReview();
                  }}
                />
                <input
                  aria-label={`${si + 1}. öğrenci adı soyadı`}
                  value={s.name}
                  onChange={(e) => {
                    setStudents((ss) =>
                      ss.map((x, i) =>
                        i === si ? { ...x, name: e.target.value } : x,
                      ),
                    );
                    invalidateExportReview();
                  }}
                />
                {questions.map((q, qi) => (
                  <input
                    aria-label={`${si + 1}. öğrenci, soru ${qi + 1} puanı`}
                    key={q.id}
                    type="number"
                    min="0"
                    max={q.max}
                    disabled={s.absent}
                    value={s.scores[qi] ?? ""}
                    onChange={(e) => {
                      setStudents((ss) =>
                        ss.map((x, i) =>
                          i === si
                            ? {
                                ...x,
                                scores: x.scores.map((v, j) =>
                                  j === qi
                                    ? parseScoreCell(e.target.value, q.max)
                                    : v,
                                ),
                              }
                            : x,
                        ),
                      );
                      invalidateExportReview();
                    }}
                  />
                ))}
                <b>
                  {s.absent
                    ? "Katılmadı"
                    : normalized(s) === null
                      ? "Eksik"
                      : (normalized(s) as number).toFixed(0)}
                </b>
                <div className="score-reference" aria-label={`${si + 1}. öğrenci E-Okul toplam puan kontrolü`}>
                  <strong>{s.reportedTotal === null ? "—" : s.reportedTotal.toFixed(0)}</strong>
                  <span>{s.reportedTotal === null
                    ? "Referans yok"
                    : normalized(s) === null
                      ? "Soru puanları bekleniyor"
                      : Math.abs((normalized(s) as number) - s.reportedTotal) < 0.01
                        ? "Uyumlu"
                        : `Fark ${((normalized(s) as number) - s.reportedTotal).toFixed(0)}`}</span>
                </div>
                <div className="attendance-decision">
                  {s.attendanceReview === "pending" ? <select
                    aria-label={`${si + 1}. öğrenci boş E-Okul puanı kararı`}
                    value="pending"
                    onChange={(event) => {
                      const decision = event.target.value as AttendanceReview;
                      setStudents((ss) => ss.map((x, i) => i === si ? { ...x, attendanceReview: decision, absent: decision === "absent" } : x));
                      invalidateExportReview();
                    }}
                  >
                    <option value="pending">Karar bekliyor</option>
                    <option value="present">Sınava girdi</option>
                    <option value="absent">Katılmadı</option>
                  </select> : null}
                  <label>
                  <input
                    type="checkbox"
                    checked={s.absent}
                    onChange={(e) => {
                      setStudents((ss) =>
                        ss.map((x, i) =>
                          i === si ? { ...x, absent: e.target.checked, attendanceReview: e.target.checked ? "absent" : "present" } : x,
                        ),
                      );
                      invalidateExportReview();
                    }}
                  />{" "}
                  Gelmedi
                  </label>
                </div>
              </div>
            ))}
          </div>
          <div className="mobile-score-list" aria-label="Mobil öğrenci puan girişi">
            {students.map((student, studentIndex) => {
              const calculatedTotal = normalized(student);
              return <article className="mobile-score-card" key={student.id}>
                <header>
                  <div><span>{studentIndex + 1}. Öğrenci</span><strong>{student.name || "Ad soyad girilmedi"}</strong><small>Okul No: {student.no || "Eksik"}</small></div>
                  <button type="button" className="row-delete" onClick={() => removeStudent(studentIndex)} aria-label={`${studentIndex + 1}. öğrenciyi sil`}><Trash2 size={15}/></button>
                </header>
                <div className="mobile-student-identity">
                  <label><span>Okul numarası</span><input aria-label={`${studentIndex + 1}. mobil öğrenci okul numarası`} value={student.no} onChange={(event) => { setStudents((current) => current.map((item, index) => index === studentIndex ? { ...item, no:event.target.value } : item)); invalidateExportReview(); }}/></label>
                  <label><span>Ad soyad</span><input aria-label={`${studentIndex + 1}. mobil öğrenci adı soyadı`} value={student.name} onChange={(event) => { setStudents((current) => current.map((item, index) => index === studentIndex ? { ...item, name:event.target.value } : item)); invalidateExportReview(); }}/></label>
                </div>
                <div className="mobile-question-scores">
                  {questions.map((question, questionIndex) => <label key={question.id}><span>S{questionIndex + 1} <small>/ {question.max}</small></span><input aria-label={`${studentIndex + 1}. mobil öğrenci, soru ${questionIndex + 1} puanı`} type="number" inputMode="decimal" min="0" max={question.max} disabled={student.absent} value={student.scores[questionIndex] ?? ""} onChange={(event) => { setStudents((current) => current.map((item, index) => index === studentIndex ? { ...item, scores:item.scores.map((score, scoreIndex) => scoreIndex === questionIndex ? parseScoreCell(event.target.value, question.max) : score) } : item)); invalidateExportReview(); }}/></label>)}
                </div>
                <div className="mobile-score-result">
                  <div><span>Hesaplanan</span><strong>{student.absent ? "Katılmadı" : calculatedTotal === null ? "Eksik" : calculatedTotal.toFixed(0)}</strong></div>
                  <div><span>E-Okul</span><strong>{student.reportedTotal === null ? "—" : student.reportedTotal.toFixed(0)}</strong><small>{student.reportedTotal === null ? "Referans yok" : calculatedTotal === null ? "Puanlar bekleniyor" : Math.abs(calculatedTotal - student.reportedTotal) < .01 ? "Uyumlu" : `Fark ${(calculatedTotal - student.reportedTotal).toFixed(0)}`}</small></div>
                  <div className="mobile-attendance"><span>Katılım</span>{student.attendanceReview === "pending" ? <select aria-label={`${studentIndex + 1}. mobil öğrenci boş E-Okul puanı kararı`} value="pending" onChange={(event) => { const decision=event.target.value as AttendanceReview; setStudents((current) => current.map((item,index) => index === studentIndex ? { ...item, attendanceReview:decision, absent:decision === "absent" } : item)); invalidateExportReview(); }}><option value="pending">Karar bekliyor</option><option value="present">Sınava girdi</option><option value="absent">Katılmadı</option></select> : <label><input type="checkbox" checked={student.absent} onChange={(event) => { setStudents((current) => current.map((item,index) => index === studentIndex ? { ...item, absent:event.target.checked, attendanceReview:event.target.checked ? "absent" : "present" } : item)); invalidateExportReview(); }}/> Gelmedi</label>}</div>
                </div>
              </article>;
            })}
          </div>
          <section className="question-analysis">
            <h3>Konu / Öğrenme Çıktısı Analizi</h3>
            {questionStats.map((q) => (
              <article key={q.id}>
                <div>
                  <b>
                    S{q.index + 1} • {q.outcome}
                  </b>
                  <span>
                    {q.answered} cevap • Ort. {q.avg.toFixed(1)}/{q.max} • %
                    {q.rate.toFixed(1)}
                  </span>
                </div>
                <div className="analysis-bar">
                  <i style={{ width: `${Math.min(q.rate, 100)}%` }} />
                </div>
                <strong>{q.label}</strong>
              </article>
            ))}
          </section>
          <section className="improvement-plan">
            <h3>Eksik Öğrenmeler ve İyileştirme Planı</h3>
            {lowest.map((q, i) => (
              <article key={q.id}>
                <b>
                  {i + 1}. {q.outcome} — %{q.rate.toFixed(1)}
                </b>
                <p>
                  Ders içi kısa konu tekrarı → metin temelli çalışma kâğıdı →
                  akran açıklaması → çıkış biletiyle yeniden ölçme.
                </p>
                <span>Uygulama tarihi: .... / .... / ........</span>
              </article>
            ))}
          </section>
        </section>
      )}
    </section>
  );
}
