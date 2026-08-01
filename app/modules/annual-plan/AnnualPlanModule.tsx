"use client";

import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  Clock3,
  Download,
  FileCheck2,
  Layers3,
  LoaderCircle,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { downloadBlob, safeFileName } from "../../core/file-download";
import { operationErrorMessage } from "../../core/operation-error";
import { annualPlanRecordId, createAnnualPlanDecision } from "../../core/annual-plan-decision";
import { approveRecord, submitForReview, type PedagogicalRecord } from "../../core/pedagogical-record";
import { generateApprovedDocument, toApprovedGenerationDecision } from "../../core/opus-generation-bridge";
import type { Grade, Unit } from "../../data/curriculum";
import type { CurriculumContext } from "../../data/curriculum-runtime";

type PlanMeta = {
  school: string;
  academicYear: string;
  date: string;
  teacher: string;
  principal: string;
  specialDays: string;
};

type AnnualRow = {
  week: number;
  month: string;
  dates: string;
  hours: number;
  unit: string;
  topic: string;
  outcome: string;
  components: string;
  socialEmotional: string;
  values: string;
  literacy: string;
  special: string;
  kind: "lesson" | "break" | "planning" | "social" | "blank";
};

const trMonths = [
  "OCAK",
  "ŞUBAT",
  "MART",
  "NİSAN",
  "MAYIS",
  "HAZİRAN",
  "TEMMUZ",
  "AĞUSTOS",
  "EYLÜL",
  "EKİM",
  "KASIM",
  "ARALIK",
];
const shortMonths = [
  "Oca",
  "Şub",
  "Mar",
  "Nis",
  "May",
  "Haz",
  "Tem",
  "Ağu",
  "Eyl",
  "Eki",
  "Kas",
  "Ara",
];
const specialDays: Record<string, string> = {
  "9-14": "İlköğretim Haftası",
  "9-19": "Gaziler Günü",
  "10-29": "Cumhuriyet Bayramı",
  "11-10": "Atatürk Haftası",
  "11-24": "Öğretmenler Günü",
  "12-10": "İnsan Hakları ve Demokrasi Haftası",
  "3-18": "Çanakkale Zaferi",
  "4-23": "Ulusal Egemenlik ve Çocuk Bayramı",
  "5-19": "Atatürk’ü Anma, Gençlik ve Spor Bayramı",
  "6-5": "Çevre ve İklim Değişikliği Haftası",
};

type AcademicCalendar = {
  start: string;
  end: string;
  breaks: Array<{ start: string; end: string; label: string }>;
  specialWeeks?: Record<string, { kind: "planning" | "social" | "blank"; label: string; detail: string }>;
  examWeeks?: Record<string, string>;
};

const academicCalendars: Record<string, AcademicCalendar> = {
  "2025-2026": {
    start: "2025-09-08",
    end: "2026-06-26",
    breaks: [
      { start: "2025-11-10", end: "2025-11-14", label: "ARA TATİL" },
      { start: "2026-01-19", end: "2026-01-30", label: "YARIYIL TATİLİ" },
      { start: "2026-03-16", end: "2026-03-20", label: "ARA TATİL" },
    ],
    specialWeeks: {
      "2025-11-03": { kind: "planning", label: "OKUL TEMELLİ PLANLAMA", detail: "1. Dönem 1. Sınav • okul temelli planlama" },
      "2026-06-08": { kind: "planning", label: "OKUL TEMELLİ PLANLAMA", detail: "Okulun ve öğrencilerin ihtiyaçlarına göre planlanır." },
      "2026-06-15": { kind: "social", label: "SOSYAL ETKİNLİK", detail: "Sosyal etkinlik çalışmaları" },
      "2026-06-22": { kind: "blank", label: "ÇERÇEVE YILLIK PLANDA BOŞ BIRAKILMIŞ", detail: "Okul ve yerel takvim kararına göre öğretmen tarafından planlanır." },
    },
    examWeeks: {
      "2026-01-05": "1. Dönem 2. Sınav",
      "2026-04-06": "2. Dönem 1. Sınav",
      "2026-06-01": "2. Dönem 2. Sınav",
    },
  },
  "2026-2027": {
    start: "2026-09-14",
    end: "2027-06-25",
    breaks: [
      { start: "2026-11-16", end: "2026-11-20", label: "ARA TATİL" },
      { start: "2027-01-25", end: "2027-02-05", label: "YARIYIL TATİLİ" },
      { start: "2027-03-08", end: "2027-03-12", label: "ARA TATİL" },
    ],
  },
};

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}
function dateLabel(start: Date) {
  const end = addDays(start, 4);
  return start.getMonth() === end.getMonth()
    ? `${start.getDate()}-${end.getDate()} ${shortMonths[end.getMonth()]}`
    : `${start.getDate()} ${shortMonths[start.getMonth()]}-${end.getDate()} ${shortMonths[end.getMonth()]}`;
}
function localDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}
function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function specialDaysForWeek(start: Date) {
  return Array.from({ length: 5 }, (_, day) => addDays(start, day))
    .map((date) => specialDays[`${date.getMonth() + 1}-${date.getDate()}`])
    .filter((item): item is string => Boolean(item))
    .join(" • ") || "—";
}
function annualRows(grade: Grade, academicYear: string, units: Unit[]): AnnualRow[] {
  const calendar = academicCalendars[academicYear];
  if (!calendar) throw new Error("Bu öğretim yılı için doğrulanmış MEB takvimi bulunmuyor.");
  const curriculum = units.filter((u) => u.grade === grade);
  const allocations = curriculum.flatMap((unit) =>
    Array.from({ length: Math.ceil(unit.hours / 2) }, (_, i) => ({
      unit,
      index: i + 1,
      total: Math.ceil(unit.hours / 2),
    })),
  );
  let lessonIndex = 0;
  let fallbackPlanningWeeks = 0;
  const firstWeek = localDate(calendar.start);
  const lastDay = localDate(calendar.end);
  const weekCount = Math.ceil((lastDay.getTime() - firstWeek.getTime() + 86400000) / (7 * 86400000));
  return Array.from({ length: weekCount }, (_, index) => {
    const start = addDays(firstWeek, index * 7);
    const weekKey = dateKey(start);
    const breakPeriod = calendar.breaks.find((item) => weekKey >= item.start && weekKey <= item.end);
    const specialWeek = calendar.specialWeeks?.[weekKey];
    const base = {
      week: index + 1,
      month: trMonths[start.getMonth()],
      dates: dateLabel(start),
      hours: 2,
    };
    if (breakPeriod)
      return {
        ...base,
        unit: breakPeriod.label,
        topic: "Ders yapılmaz",
        outcome: "—",
        components: "—",
        socialEmotional: "—",
        values: "—",
        literacy: "—",
        special: specialDaysForWeek(start),
        kind: "break" as const,
      };
    if (specialWeek)
      return {
        ...base,
        unit: specialWeek.label,
        topic: specialWeek.detail,
        outcome: specialWeek.detail,
        components: specialWeek.label,
        socialEmotional: specialWeek.label,
        values: specialWeek.label,
        literacy: specialWeek.label,
        special: specialDaysForWeek(start),
        kind: specialWeek.kind,
      };
    const slot = allocations[lessonIndex++];
    if (!slot) {
      const isPlanning = fallbackPlanningWeeks < 2;
      fallbackPlanningWeeks += 1;
      return {
        ...base,
        unit: isPlanning ? "OKUL TEMELLİ PLANLAMA" : "SOSYAL ETKİNLİK",
        topic: isPlanning ? "Okulun ve öğrencilerin ihtiyaçlarına göre planlanır." : "Sosyal etkinlik çalışmaları",
        outcome: isPlanning ? "Okul temelli planlama" : "Sosyal etkinlik",
        components: isPlanning ? "Okul temelli planlama" : "Sosyal etkinlik",
        socialEmotional: isPlanning ? "Okul temelli planlama" : "Sosyal etkinlik",
        values: isPlanning ? "Okul temelli planlama" : "Sosyal etkinlik",
        literacy: isPlanning ? "Okul temelli planlama" : "Sosyal etkinlik",
        special: specialDaysForWeek(start),
        kind: isPlanning ? "planning" as const : "social" as const,
      };
    }
    const outcomeIndex = Math.min(slot.unit.outcomes.length - 1, Math.floor(((slot.index - 1) * slot.unit.outcomes.length) / slot.total));
    const outcome = slot.unit.outcomes[outcomeIndex];
    const outcomeStart = Math.floor((outcomeIndex * slot.total) / slot.unit.outcomes.length) + 1;
    const outcomeEnd = Math.floor(((outcomeIndex + 1) * slot.total) / slot.unit.outcomes.length);
    const outcomeWeekIndex = slot.index - outcomeStart;
    const outcomeWeekTotal = Math.max(1, outcomeEnd - outcomeStart + 1);
    const componentStart = Math.floor((outcomeWeekIndex * outcome.processComponents.length) / outcomeWeekTotal);
    const componentEnd = Math.max(componentStart + 1, Math.floor(((outcomeWeekIndex + 1) * outcome.processComponents.length) / outcomeWeekTotal));
    const processComponents = outcome.processComponents.slice(componentStart, componentEnd).map((component) => `${component.step}) ${component.description}`).join(" ");
    const contentIndex = Math.min(slot.unit.contentFramework.length - 1, Math.floor(((slot.index - 1) * slot.unit.contentFramework.length) / slot.total));
    const examLabel = calendar.examWeeks?.[weekKey];
    return {
      ...base,
      unit: slot.unit.name.toLocaleUpperCase("tr-TR"),
      topic: `${examLabel ? `${examLabel} • ` : ""}${slot.unit.contentFramework[contentIndex]}`,
      outcome: `${examLabel ? `${examLabel}\n` : ""}${outcome.code} — ${outcome.description}`,
      components: processComponents,
      socialEmotional: slot.unit.competencyFramework.socialEmotionalLearning.join(" • ") || "—",
      values: slot.unit.competencyFramework.values.join(" • ") || "—",
      literacy: slot.unit.competencyFramework.literacy.join(" • ") || "—",
      special: specialDaysForWeek(start),
      kind: "lesson" as const,
    };
  });
}

export default function AnnualModule({
  meta,
  setMeta,
  curriculum,
}: {
  meta: PlanMeta;
  setMeta: (value: PlanMeta) => void;
  curriculum: CurriculumContext;
}) {
  const { units } = curriculum;
  const [grade, setGrade] = useState<Grade>(curriculum.defaultGrade);
  const [created, setCreated] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [approving, setApproving] = useState(false);
  const [approvedAnnualRecord, setApprovedAnnualRecord] = useState<PedagogicalRecord | null>(null);
  const [operationMessage, setOperationMessage] = useState("");
  const [calendarConfirmed, setCalendarConfirmed] = useState(false);
  const [contentConfirmed, setContentConfirmed] = useState(false);
  const yearValid = Boolean(academicCalendars[meta.academicYear.trim()]);
  const rows = useMemo(
    () => (yearValid ? annualRows(grade, meta.academicYear, units) : []),
    [grade, meta.academicYear, units, yearValid],
  );
  const previewRef = useRef<HTMLDivElement>(null);
  const annualScope = {
    academicYear: meta.academicYear.trim(),
    subjectCode: curriculum.subjectCode,
    datasetVersion: curriculum.datasetVersion,
    grade,
  } as const;

  async function persistRecord(record: PedagogicalRecord) {
    const response = await fetch("/api/pedagogical-records", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(record),
    });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) throw new Error(payload.error ?? "Yıllık plan kararı saklanamadı.");
  }

  async function approveAnnualPlanDecision() {
    if (!calendarConfirmed || !contentConfirmed) {
      setOperationMessage("Önce takvim ve müfredat kontrollerini tamamlayın.");
      return;
    }
    setApproving(true);
    setOperationMessage("Yıllık plan kararı onaylanıyor…");
    try {
      const response = await fetch("/api/pedagogical-records");
      const payload = (await response.json()) as { records?: PedagogicalRecord[]; error?: string };
      if (!response.ok || !payload.records) throw new Error(payload.error ?? "Karar geçmişi açılamadı.");
      const recordId = annualPlanRecordId(annualScope);
      const latest = payload.records
        .filter((record) => record.recordId === recordId)
        .sort((left, right) => right.revision - left.revision)[0];
      if (latest && latest.status !== "approved") {
        throw new Error("Bu yıllık planın tamamlanmamış karar revizyonu var; Kayıt Arşivi’nden denetlenmelidir.");
      }
      if (latest) {
        await persistRecord({ ...latest, status: "superseded", updatedAt: new Date().toISOString() });
      }
      const draft = createAnnualPlanDecision({
        scope: annualScope,
        units,
        revision: latest ? latest.revision + 1 : 1,
        previousRevision: latest?.revision ?? null,
      });
      await persistRecord(draft);
      const inReview = submitForReview(draft);
      await persistRecord(inReview);
      const approved = approveRecord(
        inReview,
        "Yıllık planın öğretim yılı, branş, sınıf düzeyi, çalışma takvimi ve müfredat dağılımını kontrol ettim; belge üretimini onaylıyorum.",
      );
      await persistRecord(approved);
      setApprovedAnnualRecord(approved);
      setOperationMessage(`OPUS yıllık plan kararı onaylandı • Revizyon ${approved.revision}`);
    } catch (error) {
      setOperationMessage(operationErrorMessage(error, "Yıllık plan kararı onaylanamadı."));
    } finally {
      setApproving(false);
    }
  }

  async function exportAnnualDocx() {
    if (!calendarConfirmed || !contentConfirmed || !approvedAnnualRecord || approvedAnnualRecord.recordId !== annualPlanRecordId(annualScope)) {
      throw new Error(
        "Yıllık plan, takvim ve müfredat kontrolü ile OPUS öğretmen onayı tamamlanmadan dışa aktarılamaz.",
      );
    }
    setExporting(true);
    setOperationMessage("Yıllık plan dosyası hazırlanıyor…");
    try {
      const {
        AlignmentType,
        BorderStyle,
        Document,
        Packer,
        Paragraph,
        PageOrientation,
        ShadingType,
        Table,
        TableCell,
        TableRow,
        TextRun,
        WidthType,
      } = await import("docx");
      const border = { style: BorderStyle.SINGLE, size: 1, color: "94A3B8" };
      const cell = (text: string, width: number, header = false) =>
        new TableCell({
          width: { size: width, type: WidthType.PERCENTAGE },
          shading: header
            ? { type: ShadingType.CLEAR, fill: "DCE6F1" }
            : undefined,
          borders: { top: border, bottom: border, left: border, right: border },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text, bold: header, size: header ? 14 : 12 }),
              ],
            }),
          ],
        });
      const doc = new Document({
        creator: "FOPOS v47 Professional Edition",
        title: `${grade}. Sınıf ${curriculum.subjectName} Ünitelendirilmiş Yıllık Planı`,
        sections: [
          {
            properties: {
              page: {
                size: { orientation: PageOrientation.LANDSCAPE },
                margin: { top: 420, right: 420, bottom: 420, left: 420 },
              },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 120 },
                children: [
                  new TextRun({
                    text: `${meta.academicYear} EĞİTİM-ÖĞRETİM YILI ${meta.school.toLocaleUpperCase("tr-TR")}\n${grade}. SINIF ${curriculum.subjectName.toLocaleUpperCase("tr-TR")} DERSİ ÜNİTELENDİRİLMİŞ YILLIK PLAN TASLAĞI`,
                    bold: true,
                    size: 20,
                  }),
                ],
              }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    tableHeader: true,
                    children: [
                      ["Ay / Hafta", 6],
                      ["Tarih / Saat", 7],
                      ["Ünite", 10],
                      ["Konu (İçerik Çerçevesi)", 12],
                      ["Öğrenme Çıktısı", 15],
                      ["Süreç Bileşenleri", 18],
                      ["Sosyal-Duygusal Öğrenme", 8],
                      ["Değerler", 8],
                      ["Okuryazarlık Becerileri", 8],
                      ["Belirli Gün ve Haftalar", 8],
                    ].map(([t, w]) => cell(String(t), Number(w), true)),
                  }),
                  ...rows.map(
                    (r) =>
                      new TableRow({
                        children: [
                          cell(`${r.month}\n${r.week}. Hafta`, 6),
                          cell(`${r.dates}\n${r.hours} saat`, 7),
                          cell(r.unit, 10),
                          cell(r.topic, 12),
                          cell(r.outcome, 15),
                          cell(r.components, 18),
                          cell(r.socialEmotional, 8),
                          cell(r.values, 8),
                          cell(r.literacy, 8),
                          cell(r.special, 8),
                        ],
                      }),
                  ),
                ],
              }),
              ...[
                ["ÖLÇME VE DEĞERLENDİRME", "Öğrenme kanıtlarında açık uçlu sorular, çalışma kâğıtları, kavram haritaları, öz ve akran değerlendirme formları, kontrol listeleri, dereceleme ölçekleri, dereceli puanlama anahtarları ve performans görevleri; öğrenme çıktısına ve sınıf bağlamına uygun biçimde kullanılır."],
                ["FARKLILAŞTIRMA", "Zenginleştirme ve destekleme uygulamaları öğrencilerin ilgi, ihtiyaç, öğrenme profili, öğrenme hızı ve hazır bulunuşlukları gözetilerek öğretmen tarafından planlanır."],
                ["OKUL TEMELLİ PLANLAMA", "Öğretim programındaki 4 ders saati; okulun, çevrenin ve öğrencilerin ihtiyaçları doğrultusunda sınav, geri bildirim, proje, sosyal etkinlik veya tamamlayıcı öğrenme çalışmaları için öğretmen ve zümre kararıyla planlanır."],
                ["DAYANAK", `Plan; MEB Eğitim Öğretim Çalışmalarının Planlı Yürütülmesine İlişkin Yönerge, ${curriculum.sourceTitle} (${curriculum.sourceYear}), TYMM Ortak Metni ve ${meta.academicYear} MEB çalışma takvimi esas alınarak hazırlanmıştır.`],
              ].flatMap(([heading, body]) => [
                new Paragraph({ spacing: { before: 120, after: 40 }, children: [new TextRun({ text: heading, bold: true, size: 14 })] }),
                new Paragraph({ spacing: { after: 70 }, children: [new TextRun({ text: body, size: 12 })] }),
              ]),
              new Paragraph({
                spacing: { before: 180 },
                children: [
                  new TextRun({ text: "Kontrol notu: ", bold: true }),
                  new TextRun(
                    "Müfredat dağılımı kanonik veri setinden üretilmiştir. Öğretmen takvim ve içerik kontrolünü tamamlamıştır; belge yetkili imzaları olmadan yürürlüğe girmez.",
                  ),
                ],
              }),
              new Paragraph({
                spacing: { before: 80, after: 80 },
                children: [
                  new TextRun({
                    text: `FOPOS v47 Professional Edition • Oluşturulma zamanı: ${new Date().toLocaleString("tr-TR")}`,
                    size: 12,
                    color: "64748B",
                  }),
                ],
              }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      cell(
                        `${meta.teacher}\nDers Öğretmeni\nTarih / İmza:`,
                        50,
                      ),
                      cell(
                        `${meta.principal}\nOkul Müdürü\nOnay tarihi / İmza:`,
                        50,
                      ),
                    ],
                  }),
                ],
              }),
            ],
          },
        ],
      });
      const blob = await Packer.toBlob(doc);
      const fileName = safeFileName(
        ["FOPOS", meta.academicYear, grade, `Sinif_${curriculum.subjectName}_Yillik_Plani`],
        "docx",
      );
      const decision = toApprovedGenerationDecision(approvedAnnualRecord, "annual-plan");
      const generated = await generateApprovedDocument(
        decision,
        {
          id: `${approvedAnnualRecord.recordId}:r${approvedAnnualRecord.revision}:annual-plan`,
          decisionId: decision.id,
          documentType: "annual-plan",
        },
        async () => ({ blob, fileName }),
      );
      const traceResponse = await fetch("/api/document-generations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(generated.provenance),
      });
      const tracePayload = (await traceResponse.json()) as { error?: string };
      if (!traceResponse.ok) throw new Error(tracePayload.error ?? "OPUS yıllık plan üretim izi kaydedilemedi.");
      downloadBlob(generated.artifact.blob, generated.artifact.fileName);
      setOperationMessage(`Yıllık plan indirildi • OPUS üretim olayı ${generated.provenance.eventId}`);
    } catch (error) {
      setOperationMessage(
        operationErrorMessage(error, "Yıllık plan indirilemedi."),
      );
    } finally {
      setExporting(false);
    }
  }
  return (
    <>
      {operationMessage && (
        <div className="calendar-note" role="status" aria-live="polite">
          <ShieldAlert size={18} /> <span>{operationMessage}</span>
        </div>
      )}
      <section className="annual-hero" id="top">
        <div>
          <span className="eyebrow">
            <CalendarDays size={15} /> FOPOS v47 • MEB Uyumlu Yıllık Plan
          </span>
          <h1>
            Bir eğitim yılını
            <br />
            <em>hafta hafta</em> planlayın.
          </h1>
          <p>
            Resmî çalışma takvimini, müfredat ünitelerini ve programlar arası
            bileşenleri birleştirerek tam ünitelendirilmiş yıllık plan
            oluşturun.
          </p>
        </div>
        <form
          className="builder-card"
          onSubmit={(e) => {
            e.preventDefault();
            if (!yearValid) return;
            setCreated(true);
            setCalendarConfirmed(false);
            setContentConfirmed(false);
            setApprovedAnnualRecord(null);
            setTimeout(() => {
              previewRef.current?.scrollIntoView({ behavior: "smooth" });
              previewRef.current?.focus();
            }, 60);
          }}
        >
          <div className="card-heading">
            <span className="step-badge">01</span>
            <div>
              <h2>Yeni yıllık plan</h2>
              <p>Planın kurumsal bilgilerini tanımlayın</p>
            </div>
          </div>
          <div className="field-grid compact-grid">
            <label className="field">
              <span>Sınıf</span>
              <div className="select-wrap">
                <select
                  value={grade}
                  onChange={(e) => {
                    setGrade(Number(e.target.value) as Grade);
                    setCreated(false);
                    setCalendarConfirmed(false);
                    setContentConfirmed(false);
                    setApprovedAnnualRecord(null);
            setApprovedAnnualRecord(null);
                  }}
                >
                  {curriculum.supportedGrades.map((item) => (
                    <option value={item} key={item}>
                      {item}. Sınıf
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} />
              </div>
            </label>
            <label className="field">
              <span>Haftalık ders saati</span>
              <div className="select-wrap locked">
                <select disabled>
                  <option>2 ders saati</option>
                </select>
                <Clock3 size={16} />
              </div>
            </label>
          </div>
          <div className="official-fields-grid annual-fields">
            <label className="field">
              <span>Okul adı</span>
              <input
                value={meta.school}
                onChange={(e) => setMeta({ ...meta, school: e.target.value })}
              />
            </label>
            <label className="field">
              <span>Öğretim yılı</span>
              <input
                value={meta.academicYear}
                aria-invalid={!yearValid}
                onChange={(e) => {
                  setMeta({ ...meta, academicYear: e.target.value });
                  setCreated(false);
                  setCalendarConfirmed(false);
                  setContentConfirmed(false);
            setApprovedAnnualRecord(null);
                }}
              />
              {!yearValid ? (
                <small>Doğrulanmış takvimler: 2025-2026 ve 2026-2027.</small>
              ) : null}
            </label>
            <label className="field">
              <span>Ders öğretmeni</span>
              <input
                value={meta.teacher}
                onChange={(e) => setMeta({ ...meta, teacher: e.target.value })}
              />
            </label>
            <label className="field">
              <span>Okul müdürü</span>
              <input
                value={meta.principal}
                onChange={(e) =>
                  setMeta({ ...meta, principal: e.target.value })
                }
              />
            </label>
          </div>
          <div className="calendar-note meeting-warning">
            <ShieldAlert size={18} />
            <div>
              <strong>Taslak takvim — resmî kaynak kontrolü gerekli</strong>
              <span>
                Örnek tarihler MEB ve yerel çalışma takvimiyle
                karşılaştırılmalıdır.
              </span>
            </div>
          </div>
          <button
            className="primary-button"
            type="submit"
            disabled={!yearValid}
          >
            <Sparkles size={19} />
            Yıllık planı oluştur
          </button>
        </form>
      </section>
      {!created ? (
        <section className="empty-state-section">
          <div className="section-kicker">Yıllık plan motoru hazır</div>
          <h2>Takvim, müfredat ve resmî biçim aynı belgede.</h2>
          <div className="feature-grid">
            <article>
              <span>
                <CalendarDays size={21} />
              </span>
              <h3>Çalışma takvimi</h3>
              <p>Taslak haftalar öğretmenin resmî takvim kontrolüne sunulur.</p>
            </article>
            <article>
              <span>
                <BookOpen size={21} />
              </span>
              <h3>Haftalık dağıtım</h3>
              <p>
                Üniteler ve öğrenme çıktıları ders saati ağırlığına göre
                haftalara dağıtılır.
              </p>
            </article>
            <article>
              <span>
                <Layers3 size={21} />
              </span>
              <h3>TYMM bileşenleri</h3>
              <p>
                Süreç bileşenleri, değerler ve okuryazarlık alanları birlikte
                gösterilir.
              </p>
            </article>
            <article>
              <span>
                <FileCheck2 size={21} />
              </span>
              <h3>Resmî DOCX</h3>
              <p>
                Yatay sayfa düzeninde, imza ve uygunluk alanlarıyla Word çıktısı
                alınır.
              </p>
            </article>
          </div>
        </section>
      ) : (
        <section
          className="results-section annual-results"
          ref={previewRef}
          tabIndex={-1}
        >
          <div className="results-header">
            <div>
              <span className="review-pill">
                <ShieldAlert size={15} />{" "}
                {approvedAnnualRecord
                  ? `OPUS KARARI ONAYLANDI • REVİZYON ${approvedAnnualRecord.revision}`
                  : calendarConfirmed && contentConfirmed
                    ? "OPUS ÖĞRETMEN ONAYI BEKLİYOR"
                    : "TAKVİM KONTROLÜ GEREKLİ"}
              </span>
              <h2>{grade}. Sınıf {curriculum.subjectName} Yıllık Planı</h2>
              <p>
                {rows.length} takvim haftası •{" "}
                {rows.filter((r) => r.kind === "lesson").length} öğretim haftası
                •{" "}
                {rows
                  .filter((r) => r.kind === "lesson")
                  .reduce((sum, row) => sum + row.hours, 0)}{" "}
                ders saati • {units.filter((u) => u.grade === grade).length}{" "}
                ünite
              </p>
            </div>
            <button
              className="download-button"
              onClick={() => void exportAnnualDocx()}
              disabled={exporting || !calendarConfirmed || !contentConfirmed || !approvedAnnualRecord}
            >
              {exporting ? (
                <LoaderCircle className="spin" size={17} />
              ) : (
                <Download size={17} />
              )}{" "}
              {exporting ? "Hazırlanıyor…" : "Yıllık planı DOCX indir"}
            </button>
          </div>
          <div
            className="record-approval-bar"
            role="region"
            aria-label="Yıllık plan öğretmen kontrolü"
          >
            <div>
              <strong>Belge taslağı kontrolü</strong>
              <span>
                Bu onay elektronik imza değildir; yetkili imzaları olmadan belge
                yürürlüğe girmez.
              </span>
            </div>
            <label>
              <input
                type="checkbox"
                checked={calendarConfirmed}
                onChange={(event) => { setCalendarConfirmed(event.target.checked); setApprovedAnnualRecord(null); }}
              />{" "}
              MEB ve yerel çalışma takvimini karşılaştırdım
            </label>
            <label>
              <input
                type="checkbox"
                checked={contentConfirmed}
                onChange={(event) => { setContentConfirmed(event.target.checked); setApprovedAnnualRecord(null); }}
              />{" "}
              Müfredat dağılımını kontrol ettim
            </label>
            <button
              className="primary-button"
              type="button"
              disabled={approving || !calendarConfirmed || !contentConfirmed || Boolean(approvedAnnualRecord)}
              onClick={() => void approveAnnualPlanDecision()}
            >
              {approving ? <LoaderCircle className="spin" size={17} /> : <FileCheck2 size={17} />}
              {approvedAnnualRecord ? "Yıllık plan kararı onaylandı" : approving ? "Onaylanıyor…" : "OPUS öğretmen onayı ver"}
            </button>
          </div>
          <div className="annual-preview">
            <div className="annual-document">
              <div className="document-title">
                <strong>
                  {meta.academicYear} EĞİTİM-ÖĞRETİM YILI{" "}
                  {meta.school.toLocaleUpperCase("tr-TR")}
                </strong>
                <span>
                  {grade}. SINIF {curriculum.subjectName.toLocaleUpperCase("tr-TR")} DERSİ ÜNİTELENDİRİLMİŞ YILLIK PLAN
                  TASLAĞI
                </span>
              </div>
              <div className="annual-table">
                <div className="annual-row annual-head">
                  <b>Ay / Hafta</b>
                  <b>Tarih / Saat</b>
                  <b>Ünite</b>
                  <b>Konu</b>
                  <b>Öğrenme Çıktısı</b>
                  <b>Süreç Bileşenleri</b>
                  <b>Sosyal-Duygusal Öğrenme</b>
                  <b>Değerler</b>
                  <b>Okuryazarlık Becerileri</b>
                  <b>Belirli Gün ve Haftalar</b>
                </div>
                {rows.map((r) => (
                  <div className={`annual-row ${r.kind}`} key={r.week}>
                    <span>
                      {r.month}
                      <br />
                      <b>{r.week}. Hafta</b>
                    </span>
                    <span>
                      {r.dates}
                      <br />
                      {r.hours} saat
                    </span>
                    <span>{r.unit}</span>
                    <span>{r.topic}</span>
                    <span>{r.outcome}</span>
                    <span>{r.components}</span>
                    <span>{r.socialEmotional}</span>
                    <span>{r.values}</span>
                    <span>{r.literacy}</span>
                    <span>{r.special}</span>
                  </div>
                ))}
              </div>
              <div className="annual-note-grid">
                <article><b>Ölçme ve Değerlendirme</b><p>Öğrenme kanıtlarında açık uçlu sorular, çalışma kâğıtları, kavram haritaları, öz ve akran değerlendirme formları, kontrol listeleri, dereceleme ölçekleri, dereceli puanlama anahtarları ve performans görevleri öğrenme çıktısına uygun biçimde kullanılır.</p></article>
                <article><b>Farklılaştırma</b><p>Zenginleştirme ve destekleme uygulamaları öğrencilerin ilgi, ihtiyaç, öğrenme profili, öğrenme hızı ve hazır bulunuşlukları gözetilerek öğretmen tarafından planlanır.</p></article>
                <article><b>Okul Temelli Planlama</b><p>Öğretim programındaki 4 ders saati; okulun, çevrenin ve öğrencilerin ihtiyaçları doğrultusunda öğretmen ve zümre kararıyla planlanır.</p></article>
                <article><b>Dayanak</b><p>Plan; ilgili MEB planlama yönergesi, {curriculum.sourceTitle} ({curriculum.sourceYear}), TYMM Ortak Metni ve {meta.academicYear} MEB çalışma takvimi esas alınarak hazırlanmıştır.</p></article>
              </div>
              <div className="signature-row">
                <span>
                  <b>{meta.teacher}</b>
                  <small>Ders Öğretmeni</small>
                </span>
                <span>
                  <b>{meta.principal}</b>
                  <small>Okul Müdürü • Onay tarihi / İmza</small>
                </span>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
