"use client";

import {
  ChevronDown,
  ClipboardList,
  Download,
  FileCheck2,
  LoaderCircle,
  Plus,
  ShieldAlert,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";
import { downloadBlob, safeFileName } from "../../core/file-download";
import { operationErrorMessage } from "../../core/operation-error";
import { createId } from "../../core/id.js";

type PlanMeta = {
  school: string;
  academicYear: string;
  date: string;
  teacher: string;
  principal: string;
  specialDays: string;
};
type MeetingPeriod =
  | "year_start"
  | "november"
  | "term_two"
  | "april"
  | "year_end"
  | "extraordinary";
type MeetingMeta = {
  year: string;
  school: string;
  field: string;
  meetingNo: string;
  period: MeetingPeriod;
  date: string;
  time: string;
  place: string;
  chair: string;
  principal: string;
  members: string;
};
type ItemStatus = "draft" | "discussed" | "adopted" | "rejected" | "deferred";
type MeetingItem = {
  id: string;
  title: string;
  discussion: string;
  decision: string;
  status: ItemStatus;
  custom: boolean;
};
const periodLabels: Record<MeetingPeriod, string> = {
  year_start: "Ders yılı başı",
  november: "Kasım ara değerlendirme",
  term_two: "İkinci dönem başı",
  april: "Nisan ara değerlendirme",
  year_end: "Ders yılı sonu",
  extraordinary: "Olağanüstü toplantı",
};
const CLOSING_AGENDA_TITLE = "Dilek, temenniler ve kapanış";
const agendaTitles = [
  "Açılış, yoklama ve gündemin görüşülmesi",
  "Bir önceki toplantıda alınan kararların değerlendirilmesi",
  "Eğitim ve öğretim mevzuatı, okulun kuruluş amacı ve öğretim programının incelenmesi",
  "Türkiye Yüzyılı Maarif Modeli, öğrenme çıktıları, yıllık planlar ve ders planları",
  "Öğretim yöntem ve teknikleri ile okul temelli faaliyetlerin planlanması",
  "Farklılaştırılmış öğretim, BEP ve özel eğitim tedbirleri",
  "Akademik ve bilimsel çalışmalar ile eğitim teknolojilerinin izlenmesi",
  "Proje ve performans çalışmalarının belirlenmesi ve değerlendirilmesi",
  "Araç-gereç, öğretim materyalleri ve eğitim ortamlarının etkin kullanımı",
  "Ölçme-değerlendirme, ortak yazılı ve mazeret sınavları",
  "Öğrenci başarısı, sınav analizleri, eksik öğrenmeler ve eylem planları",
  "Ders ziyareti, zümreler arası iş birliği ve YKS çalışmaları",
  "Millî, manevi ve ahlaki değerler ile sosyal sorumluluk çalışmaları",
  "İş sağlığı ve güvenliği ile önleme, müdahale ve yönlendirme çalışmaları",
  CLOSING_AGENDA_TITLE,
];
function titlesFor(period: MeetingPeriod) {
  if (period === "year_start") return agendaTitles;
  if (period === "year_end")
    return agendaTitles.map((title, index) =>
      index === 1 ? "Eğitim öğretim yılı zümre kararlarının sonuçları" : title,
    );
  if (period === "november" || period === "april")
    return agendaTitles.filter((_, index) =>
      [0, 1, 2, 3, 4, 5, 9, 10, 11, 12, 13, 14].includes(index),
    );
  if (period === "term_two")
    return agendaTitles.filter((_, index) => ![7].includes(index));
  return agendaTitles.filter((_, index) => [0, 1, 2, 3, 10, 14].includes(index));
}
function createItems(period: MeetingPeriod): MeetingItem[] {
  return titlesFor(period).map((title, index) => ({
    id: `${period}-${index}`,
    title,
    discussion: "",
    decision: "",
    status: "draft",
    custom: false,
  }));
}

export default function MeetingModule({ baseMeta }: { baseMeta: PlanMeta }) {
  const [m, setM] = useState<MeetingMeta>({
    year: baseMeta.academicYear,
    school: baseMeta.school,
    field: "Felsefe Grubu",
    meetingNo: "1",
    period: "year_start",
    date: "",
    time: "",
    place: "",
    chair: baseMeta.teacher,
    principal: baseMeta.principal,
    members: "",
  });
  const [items, setItems] = useState<MeetingItem[]>(() =>
    createItems("year_start"),
  );
  const [created, setCreated] = useState(false),
    [exporting, setExporting] = useState(false),
    [operationMessage, setOperationMessage] = useState(""),
    [teacherApproved, setTeacherApproved] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const allReviewed =
    items.length > 0 &&
    items.every(
      (item) =>
        item.title.trim() &&
        item.status !== "draft" &&
        item.discussion.trim() &&
        (item.status === "discussed" || item.decision.trim()),
    );
  const exportReady =
    allReviewed &&
    teacherApproved &&
    m.meetingNo.trim() &&
    m.date.trim() &&
    m.time.trim() &&
    m.place.trim() &&
    m.members.trim();
  const updateItem = (id: string, patch: Partial<MeetingItem>) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
    setTeacherApproved(false);
  };
  const addCustomItem = () => {
    setItems((current) => {
      const nextItem: MeetingItem = {
        id: createId(),
        title: "",
        discussion: "",
        decision: "",
        status: "draft",
        custom: true,
      };
      const closingIndex = current.findLastIndex(
        (item) => !item.custom && item.title === CLOSING_AGENDA_TITLE,
      );
      if (closingIndex < 0) return [...current, nextItem];
      return [
        ...current.slice(0, closingIndex),
        nextItem,
        ...current.slice(closingIndex),
      ];
    });
    setTeacherApproved(false);
  };
  const removeCustomItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    setTeacherApproved(false);
  };
  const field = (label: string, key: keyof MeetingMeta) => (
    <label className="field">
      <span>{label}</span>
      <input
        value={String(m[key])}
        onChange={(event) => {
          setM({ ...m, [key]: event.target.value });
          setTeacherApproved(false);
        }}
      />
    </label>
  );

  async function exportMeeting() {
    if (!exportReady)
      throw new Error(
        "Zümre belgesi bütün maddeler incelenip öğretmen tarafından onaylanmadan dışa aktarılamaz.",
      );
    setExporting(true);
    setOperationMessage("Zümre belgesi hazırlanıyor…");
    try {
      const {
        AlignmentType,
        BorderStyle,
        Document,
        HeadingLevel,
        Packer,
        Paragraph,
        Table,
        TableCell,
        TableRow,
        TextRun,
        WidthType,
      } = await import("docx");
      const border = { style: BorderStyle.SINGLE, size: 1, color: "94A3B8" };
      const cell = (text: string, width: number, bold = false) =>
        new TableCell({
          width: { size: width, type: WidthType.PERCENTAGE },
          borders: { top: border, bottom: border, left: border, right: border },
          children: [
            new Paragraph({
              children: [new TextRun({ text, bold, size: 19 })],
            }),
          ],
        });
      const children = [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: `T.C.\n${m.school.toLocaleUpperCase("tr-TR")}\n${m.year} EĞİTİM-ÖĞRETİM YILI\n${m.field.toLocaleUpperCase("tr-TR")} ${periodLabels[m.period].toLocaleUpperCase("tr-TR")} ZÜMRE TOPLANTI TUTANAĞI TASLAĞI`,
              bold: true,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Belge durumu: ", bold: true }),
            new TextRun(
              "Öğretmen içerik kontrolü tamamlandı. Yetkili imzalar olmadan yürürlüğe girmez.",
            ),
          ],
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            [
              "Toplantı no",
              m.meetingNo,
              "Toplantı türü",
              periodLabels[m.period],
            ],
            ["Toplantı tarihi", m.date, "Toplantı saati", m.time],
            ["Toplantı yeri", m.place, "Zümre başkanı", m.chair],
            ["Katılan üyeler", m.members, "Okul müdürü", m.principal],
          ].map(
            (row) =>
              new TableRow({
                children: [
                  cell(row[0], 18, true),
                  cell(row[1], 32),
                  cell(row[2], 18, true),
                  cell(row[3], 32),
                ],
              }),
          ),
        }),
        new Paragraph({
          text: "GÜNDEM MADDELERİ",
          heading: HeadingLevel.HEADING_1,
        }),
        ...items.map(
          (item, index) =>
            new Paragraph({ text: `${index + 1}. ${item.title}` }),
        ),
        new Paragraph({
          text: "GÜNDEM MADDELERİNİN GÖRÜŞÜLMESİ",
          heading: HeadingLevel.HEADING_1,
        }),
        ...items.flatMap((item, index) => [
          new Paragraph({
            children: [
              new TextRun({ text: `${index + 1}. ${item.title}`, bold: true }),
            ],
          }),
          new Paragraph({ text: `Durum: ${item.status}` }),
          new Paragraph({ text: `Görüşme kaydı: ${item.discussion}` }),
        ]),
        new Paragraph({
          text: "ALINAN KARARLAR",
          heading: HeadingLevel.HEADING_1,
        }),
        ...items.map(
          (item, index) =>
            new Paragraph({
              text: `${index + 1}. ${item.decision || "Karar alınmadı."}`,
            }),
        ),
        new Paragraph({
          text: "İMZA ÇİZELGESİ",
          heading: HeadingLevel.HEADING_1,
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: m.members
            .split(/[,;\n]/)
            .map((name) => name.trim())
            .filter(Boolean)
            .map(
              (name, index) =>
                new TableRow({
                  children: [
                    cell(String(index + 1), 8),
                    cell(name, 37),
                    cell(index === 0 ? "Zümre Başkanı" : "Üye", 25),
                    cell("İmza: ....................", 30),
                  ],
                }),
            ),
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: `${m.principal}\nOkul Müdürü\nOnay tarihi / İmza:`,
              bold: true,
            }),
          ],
        }),
      ];
      const doc = new Document({
        creator: "FOPOS",
        title: `${m.field} Zümre Toplantı Tutanağı Taslağı`,
        sections: [{ children }],
      });
      const blob = await Packer.toBlob(doc);
      downloadBlob(
        blob,
        safeFileName(["FOPOS", m.year, m.field, "Zumre_Taslagi"], "docx"),
      );
      setOperationMessage("Zümre belgesi DOCX dosyası indirildi.");
    } catch (error) {
      setOperationMessage(
        operationErrorMessage(error, "Zümre belgesi indirilemedi."),
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
      <section className="annual-hero meeting-hero" id="top">
        <div>
          <span className="eyebrow">
            <ClipboardList size={15} /> FOPOS • Zümre Belgesi Taslağı
          </span>
          <h1>
            Gündemi hazırlayın,
            <br />
            <em>gerçek kararları</em> öğretmen kaydetsin.
          </h1>
          <p>
            Sistem gündem taslağı sunar; görüşme ve kararlar yalnız toplantıda
            gerçekleşen içerikle öğretmen tarafından yazılır.
          </p>
        </div>
        <form
          className="builder-card"
          onSubmit={(event) => {
            event.preventDefault();
            setCreated(true);
            setTeacherApproved(false);
            setTimeout(() => {
              previewRef.current?.scrollIntoView({ behavior: "smooth" });
              previewRef.current?.focus();
            }, 60);
          }}
        >
          <div className="card-heading">
            <span className="step-badge">01</span>
            <div>
              <h2>Yeni zümre gündemi</h2>
              <p>Toplantı bilgileri yapılmış gibi varsayılmaz</p>
            </div>
          </div>
          <label className="field">
            <span>Toplantı dönemi</span>
            <div className="select-wrap">
              <select
                value={m.period}
                onChange={(event) => {
                  const period = event.target.value as MeetingPeriod;
                  setM({ ...m, period });
                  setItems(createItems(period));
                  setCreated(false);
                  setTeacherApproved(false);
                }}
              >
                {Object.entries(periodLabels).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} />
            </div>
          </label>
          <div className="official-fields-grid annual-fields">
            {field("Okul adı", "school")}
            {field("Öğretim yılı", "year")}
            {field("Zümre / alan", "field")}
            {field("Toplantı no", "meetingNo")}
            {field("Toplantı tarihi", "date")}
            {field("Toplantı saati", "time")}
            {field("Toplantı yeri", "place")}
            {field("Zümre başkanı", "chair")}
            {field("Okul müdürü", "principal")}
          </div>
          <label className="field">
            <span>Katılan üyeler</span>
            <textarea
              value={m.members}
              onChange={(event) => {
                setM({ ...m, members: event.target.value });
                setTeacherApproved(false);
              }}
              placeholder="Yalnız gerçekten katılan üyeleri yazın"
            />
          </label>
          <div className="calendar-note meeting-warning">
            <ShieldAlert size={18} />
            <div>
              <strong>
                Gündem taslağı — mevzuat ve kurum kontrolü gerekli
              </strong>
              <span>
                Toplantı yapılmadan görüşme, karar, katılım veya oy birliği
                kaydı oluşturulmaz.
              </span>
            </div>
          </div>
          <section className="agenda-builder" aria-labelledby="agenda-builder-title">
            <div>
              <h3 id="agenda-builder-title">Gündem maddeleri</h3>
              <p>
                Taslağı oluşturmadan önce veya oluşturduktan sonra yeni madde
                ekleyebilirsiniz. Eklenen maddeler görüşme ve karar kayıtlarına
                da aynen taşınır.
              </p>
            </div>
            <button
              type="button"
              className="secondary-button"
              onClick={addCustomItem}
            >
              <Plus size={16} /> Yeni gündem maddesi ekle
            </button>
            {items.filter((item) => item.custom).map((item, index) => (
              <div className="agenda-builder-row" key={item.id}>
                <label className="field">
                  <span>{index + 1}. ek gündem maddesi</span>
                  <input
                    value={item.title}
                    onChange={(event) =>
                      updateItem(item.id, { title: event.target.value })
                    }
                    placeholder="Gündem maddesinin başlığını yazın"
                  />
                </label>
                <button
                  type="button"
                  className="row-delete"
                  onClick={() => removeCustomItem(item.id)}
                  aria-label={`${index + 1}. ek gündem maddesini sil`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </section>
          <button className="primary-button" type="submit">
            <Sparkles size={19} />
            Gündem taslağını oluştur
          </button>
        </form>
      </section>
      {!created ? (
        <section className="empty-state-section">
          <div className="section-kicker">Öğretmen kontrollü belge akışı</div>
          <h2>Gündem önerilir; karar uydurulmaz.</h2>
          <div className="feature-grid">
            <article>
              <span>
                <ClipboardList size={21} />
              </span>
              <h3>Dönemsel gündem</h3>
              <p>
                Toplantı türüne göre düzenlenebilir gündem taslağı oluşturulur.
              </p>
            </article>
            <article>
              <span>
                <ShieldAlert size={21} />
              </span>
              <h3>Açık durum</h3>
              <p>
                Her madde taslak başlar ve öğretmen tarafından sonuçlandırılır.
              </p>
            </article>
            <article>
              <span>
                <Target size={21} />
              </span>
              <h3>Gerçek kayıt</h3>
              <p>
                Görüşme ve karar metni toplantıda gerçekleşen içeriğe dayanır.
              </p>
            </article>
            <article>
              <span>
                <FileCheck2 size={21} />
              </span>
              <h3>Onay kapısı</h3>
              <p>Tüm maddeler incelenmeden DOCX dışa aktarılamaz.</p>
            </article>
          </div>
        </section>
      ) : (
        <section
          className="results-section meeting-results"
          ref={previewRef}
          tabIndex={-1}
        >
          <div className="results-header">
            <div>
              <span className="review-pill">
                <ShieldAlert size={15} />{" "}
                {allReviewed ? "MADDELER İNCELENDİ" : "ÖĞRETMEN KAYDI GEREKLİ"}
              </span>
              <h2>{m.field} Zümre Belgesi Taslağı</h2>
              <p>
                {periodLabels[m.period]} • {items.length} gündem maddesi
              </p>
            </div>
            <button
              className="download-button"
              onClick={() => void exportMeeting()}
              disabled={exporting || !exportReady}
            >
              {exporting ? (
                <LoaderCircle className="spin" size={17} />
              ) : (
                <Download size={17} />
              )}{" "}
              {exporting ? "Hazırlanıyor…" : "Taslağı DOCX indir"}
            </button>
          </div>
          <div className="meeting-agenda-actions">
            <button
              type="button"
              className="secondary-button add-meeting-item"
              onClick={addCustomItem}
            >
              <Plus size={16} /> Sonradan gündem maddesi ekle
            </button>
            <span>
              Yeni madde kapanış maddesinden hemen önce eklenir ve belge
              onayını sıfırlar.
            </span>
          </div>
          <div className="meeting-preview">
            <div className="meeting-document">
              <div className="meeting-document-meta">
                <strong>Toplantı No: {m.meetingNo}</strong>
                <span>{m.date} • {m.time} • {m.place}</span>
              </div>
              <h3>GÜNDEM MADDELERİ</h3>
              <ol className="meeting-agenda-list">
                {items.map((item) => (
                  <li key={`agenda-${item.id}`}>{item.title}</li>
                ))}
              </ol>
              <h3>GÜNDEM MADDELERİNİN GÖRÜŞÜLMESİ</h3>
            {items.map((item, index) => (
              <section className="decision-item" key={item.id}>
                <div className="decision-item-heading">
                  <h4>
                    {index + 1}. {item.title || "Yeni gündem maddesi"}
                  </h4>
                  {item.custom && (
                    <button
                      type="button"
                      className="row-delete"
                      onClick={() => removeCustomItem(item.id)}
                      aria-label={`${index + 1}. ek gündem maddesini sil`}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                {item.custom && (
                  <label className="field">
                    <span>Ek gündem maddesi başlığı</span>
                    <input
                      value={item.title}
                      onChange={(event) =>
                        updateItem(item.id, { title: event.target.value })
                      }
                      placeholder="Gerçek gündem başlığını yazın"
                    />
                  </label>
                )}
                  <label className="field">
                    <span>Madde durumu</span>
                    <select
                      value={item.status}
                      onChange={(event) =>
                        updateItem(item.id, {
                          status: event.target.value as ItemStatus,
                        })
                      }
                    >
                      <option value="draft">Taslak — görüşülmedi</option>
                      <option value="discussed">
                        Görüşüldü — karar alınmadı
                      </option>
                      <option value="adopted">Kabul edildi</option>
                      <option value="rejected">Reddedildi</option>
                      <option value="deferred">Ertelendi</option>
                    </select>
                  </label>
                  <label className="field">
                    <span>Gerçek görüşme kaydı</span>
                    <textarea
                      value={item.discussion}
                      onChange={(event) =>
                        updateItem(item.id, { discussion: event.target.value })
                      }
                    />
                  </label>
                  <label className="field">
                    <span>Gerçek karar / sonuç</span>
                    <textarea
                      value={item.decision}
                      disabled={item.status === "discussed"}
                      onChange={(event) =>
                        updateItem(item.id, { decision: event.target.value })
                      }
                    />
                  </label>
              </section>
            ))}
            <h3>ALINAN KARARLAR</h3>
            <ol className="meeting-decision-list">
              {items.map((item) => (
                <li key={`decision-${item.id}`}>
                  {item.decision || "Karar alınmadı."}
                </li>
              ))}
            </ol>
            <button
              type="button"
              className="secondary-button add-meeting-item"
              onClick={addCustomItem}
            >
              <Plus size={16} /> Ek gündem maddesi ekle
            </button>
              <div className="record-approval-bar">
                <div>
                  <strong>Öğretmen içerik onayı</strong>
                  <span>
                    Bu onay elektronik imza değildir; belge yetkili imzalar
                    olmadan yürürlüğe girmez.
                  </span>
                </div>
                <label>
                  <input
                    type="checkbox"
                    disabled={!allReviewed}
                    checked={teacherApproved}
                    onChange={(event) =>
                      setTeacherApproved(event.target.checked)
                    }
                  />{" "}
                  Görüşme ve karar kayıtlarının toplantıda gerçekleşen içeriği
                  yansıttığını kontrol ettim
                </label>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
