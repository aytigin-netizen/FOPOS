"use client";

import {
  ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock3, GraduationCap,
  Lightbulb, ListFilter, MessageCircle, Presentation, Search, ShieldCheck,
  Sparkles, X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { getCurriculumContext } from "../../data/curriculum-runtime";
import { experimentKindLabels, type ExperimentKind, type ThoughtExperiment } from "./domain/experiment-types";
import { thoughtExperiments } from "./data/experiments";
import ExperimentVisual from "./components/ExperimentVisual";

type GradeFilter = "all" | 10 | 11;
type KindFilter = "all" | ExperimentKind;

const normalize = (value: string) =>
  value.toLocaleLowerCase("tr-TR").replace(/\s+/gu, " ").trim();

export default function ThoughtExperimentsModule() {
  const curriculum = useMemo(() => getCurriculumContext("philosophy"), []);
  const [grade, setGrade] = useState<GradeFilter>("all");
  const [kind, setKind] = useState<KindFilter>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [presentationMode, setPresentationMode] = useState(false);
  const [position, setPosition] = useState<"support" | "question" | null>(null);
  const [reason, setReason] = useState("");

  const unitsByCode = useMemo(
    () => new Map(curriculum.units.map((unit) => [unit.code, unit])),
    [curriculum.units],
  );

  const verifiedExperiments = useMemo(
    () => thoughtExperiments.map((experiment) => {
      const unit = unitsByCode.get(experiment.unitCode);
      const outcomes = experiment.outcomeCodes.map((code) =>
        unit?.outcomes.find((outcome) => outcome.code === code) ?? null,
      );
      return {
        experiment,
        unit,
        outcomes,
        verified: Boolean(unit) && outcomes.every(Boolean),
      };
    }),
    [unitsByCode],
  );

  const filtered = useMemo(() => {
    const search = normalize(query);
    return verifiedExperiments.filter(({ experiment }) => {
      if (grade !== "all" && experiment.grade !== grade) return false;
      if (kind !== "all" && experiment.kind !== kind) return false;
      if (!search) return true;
      return normalize([
        experiment.title,
        experiment.subtitle,
        experiment.summary,
        experiment.theme,
        experiment.unitCode,
        ...experiment.concepts,
        ...experiment.outcomeCodes,
      ].join(" ")).includes(search);
    });
  }, [grade, kind, query, verifiedExperiments]);

  const selected = verifiedExperiments.find(
    (item) => item.experiment.id === selectedId,
  );

  function openExperiment(experiment: ThoughtExperiment) {
    setSelectedId(experiment.id);
    setPresentationMode(false);
    setPosition(null);
    setReason("");
  }

  function backToCatalog() {
    setSelectedId(null);
    setPresentationMode(false);
    setPosition(null);
    setReason("");
  }

  if (selected) {
    const { experiment, unit, outcomes, verified } = selected;
    return (
      <section className={`thought-lab ${presentationMode ? "is-presenting" : ""}`} id="thought-lab">
        <div className="thought-lab-topline">
          <button className="thought-lab-back" type="button" onClick={backToCatalog}>
            <ArrowLeft size={16} /> Kataloğa dön
          </button>
          <div className="thought-lab-top-actions">
            <span className="thought-lab-version">İçerik {experiment.contentVersion}</span>
            <button className="secondary-button" type="button" onClick={() => setPresentationMode((value) => !value)}>
              {presentationMode ? <X size={16} /> : <Presentation size={16} />}
              {presentationMode ? "Öğretmen görünümüne dön" : "Sunum görünümü"}
            </button>
          </div>
        </div>

        <header className="thought-detail-hero">
          <div className="thought-detail-copy">
            <div className="thought-lab-eyebrow"><Sparkles size={15} /> DÜŞÜNCE DENEYLERİ LABORATUVARI</div>
            <div className="thought-tags">
              <span>{experiment.grade}. Sınıf</span>
              <span>{experimentKindLabels[experiment.kind]}</span>
              <span>{experiment.theme}</span>
            </div>
            <h1>{experiment.title}</h1>
            <p className="thought-detail-subtitle">{experiment.subtitle}</p>
            <p className="thought-detail-summary">{experiment.summary}</p>
          </div>
          <aside className="thought-detail-seal">
            <BookOpen size={24} />
            <strong>{unit?.name ?? experiment.unitCode}</strong>
            <span>{experiment.estimatedMinutes} dakika</span>
            <span>FOPOS {curriculum.datasetVersion}</span>
          </aside>
        </header>

        <ExperimentVisual kind={experiment.visual} />

        <div className="thought-detail-grid">
          <main className="thought-detail-main">
            <article className="thought-panel thought-scenario">
              <div className="thought-panel-heading"><span>01</span><div><small>SENARYO</small><h2>Durumu düşünün</h2></div></div>
              <p>{experiment.scenario}</p>
              <div className="thought-central-question"><Lightbulb size={19} /><div><small>TEMEL FELSEFİ SORU</small><strong>{experiment.centralQuestion}</strong></div></div>
            </article>

            <article className="thought-panel">
              <div className="thought-panel-heading"><span>02</span><div><small>KAVRAMLAR</small><h2>Tartışmanın anahtarları</h2></div></div>
              <div className="thought-concept-list">{experiment.concepts.map((concept) => <span key={concept}>{concept}</span>)}</div>
              <div className="thought-question-list">
                <h3><MessageCircle size={17} /> Tartışma soruları</h3>
                <ol>{experiment.discussionQuestions.map((question) => <li key={question}>{question}</li>)}</ol>
              </div>
            </article>

            <article className="thought-panel thought-response-panel">
              <div className="thought-panel-heading"><span>03</span><div><small>GEÇİCİ SINIF ETKİLEŞİMİ</small><h2>Bir görüş belirleyin</h2></div></div>
              <p>Öğrenciler önce bireysel düşünür; ardından seçimini gerekçelendirir. Bu alana girilen metin yalnızca açık sayfa oturumu boyunca bellekte tutulur; sunucuya gönderilmez ve kaydedilmez.</p>
              <div className="thought-position-buttons">
                <button type="button" className={position === "support" ? "selected" : ""} aria-pressed={position === "support"} onClick={() => setPosition("support")}>Evet / Savunuyorum</button>
                <button type="button" className={position === "question" ? "selected" : ""} aria-pressed={position === "question"} onClick={() => setPosition("question")}>Hayır / Sorguluyorum</button>
              </div>
              <label className="thought-reason-label">Gerekçeniz veya karşı örneğiniz
                <textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={3} placeholder="Kararınızı hangi ilkeye veya gerekçeye dayandırıyorsunuz?" />
              </label>
              <div className="thought-local-note"><ShieldCheck size={15} /> Yanıtlar kaydedilmez; sayfadan ayrıldığınızda temizlenir.</div>
            </article>

            <article className="thought-panel">
              <div className="thought-panel-heading"><span>04</span><div><small>DERİNLEŞTİRME</small><h2>Karşı görüş ve aktarım</h2></div></div>
              <h3>Karşı argüman kurun</h3>
              <ul className="thought-prompt-list">{experiment.counterArgumentPrompts.map((prompt) => <li key={prompt}>{prompt}</li>)}</ul>
              <div className="thought-transfer"><strong>Çıkış / transfer sorusu</strong><p>{experiment.transferQuestion}</p></div>
            </article>
          </main>

          <aside className="thought-detail-side">
            <section className="thought-side-card">
              <h2><GraduationCap size={18} /> Müfredat bağlantısı</h2>
              {verified ? <div className="thought-verified-label"><CheckCircle2 size={15} /> Kanonik kayıtla eşleşti</div> : <div className="thought-unverified-label">Müfredat eşleşmesi doğrulanamadı</div>}
              <p className="thought-unit-name">{unit?.name ?? experiment.unitCode}</p>
              {experiment.outcomeCodes.map((code, index) => (
                <div className="thought-outcome" key={code}>
                  <strong>{code}</strong>
                  <span>{outcomes[index]?.description ?? "Çıktı kaydı bulunamadı"}</span>
                </div>
              ))}
              <small className="thought-editorial-note">Bu eşleştirme pedagojik editoryal karardır; deneyin MEB tarafından resmen önerildiği anlamına gelmez.</small>
            </section>
            <section className="thought-side-card">
              <h2><ListFilter size={18} /> Öğretmen kolaylaştırıcı notları</h2>
              <ol className="thought-facilitator-list">{experiment.facilitatorNotes.map((note) => <li key={note}>{note}</li>)}</ol>
              <div className="thought-age-note"><strong>Sınıf düzeyi</strong><p>{experiment.ageAppropriateness}</p></div>
            </section>
            <section className="thought-side-card">
              <h2><BookOpen size={18} /> Kaynaklar ve doğrulama</h2>
              {experiment.sourceNotes.map((note) => <p className="thought-source-note" key={note}>{note}</p>)}
              <div className="thought-source-links">{experiment.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.label}<ArrowRight size={13} /><small>{source.note}</small></a>)}</div>
            </section>
          </aside>
        </div>
      </section>
    );
  }

  const count10 = thoughtExperiments.filter((item) => item.grade === 10).length;
  const count11 = thoughtExperiments.filter((item) => item.grade === 11).length;

  return (
    <section className="thought-lab" id="thought-lab">
      <header className="thought-lab-hero">
        <div className="thought-lab-hero-copy">
          <div className="thought-lab-eyebrow"><Sparkles size={15} /> FOPOS • ÖĞRETMEN PEDAGOJİK ARAÇLARI</div>
          <h1>Düşünce Deneyleri<br /><em>Laboratuvarı</em></h1>
          <p>Bir soruyla başlatın. Varsayımları görünür kılın, gerekçeleri karşılaştırın ve öğrencilerin kendi felsefi düşüncelerini kurmalarını sağlayın.</p>
          <div className="thought-lab-hero-meta"><span><ShieldCheck size={15} /> Kaynakları incelenmiş pilot katalog</span><span><Clock3 size={15} /> 15–20 dakikalık etkinlikler</span></div>
        </div>
        <div className="thought-lab-hero-seal"><span>İLK PİLOT</span><strong>08</strong><small>ONAYLI KAYIT</small><div><span>10. sınıf {count10}</span><span>11. sınıf {count11}</span></div></div>
      </header>

      <div className="thought-lab-intro">
        <div><strong>Karar vermeden önce düşünün.</strong><p>Bu laboratuvar hazır cevap sunmaz; öğretmenin tartışmayı yapılandırmasına ve öğrencilerin gerekçeli düşünmesine yardımcı olur.</p></div>
        <div className="thought-lab-safety"><ShieldCheck size={18} /><span>Öğrenci hesabı yok<br />Yanıtlar kalıcı değil</span></div>
      </div>

      <div className="thought-catalog-toolbar">
        <label className="thought-search"><Search size={17} /><span className="sr-only">Deney ara</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Deney, kavram veya öğrenme çıktısı ara…" /></label>
        <label><span>Sınıf</span><select value={grade} onChange={(event) => setGrade(event.target.value === "all" ? "all" : Number(event.target.value) as 10 | 11)}><option value="all">Tüm sınıflar</option><option value="10">10. sınıf</option><option value="11">11. sınıf</option></select></label>
        <label><span>İçerik türü</span><select value={kind} onChange={(event) => setKind(event.target.value as KindFilter)}><option value="all">Tüm türler</option><option value="thought_experiment">Düşünce deneyi</option><option value="allegory">Alegori</option><option value="dilemma">Etik ikilem</option></select></label>
        <button type="button" className="thought-reset-filters" onClick={() => { setGrade("all"); setKind("all"); setQuery(""); }}>Filtreleri temizle</button>
      </div>

      <div className="thought-catalog-heading"><div><small>ONAYLI İÇERİKLER</small><h2>İlk pilot kataloğu</h2></div><span>{filtered.length} / {thoughtExperiments.length} kayıt</span></div>
      <div className="thought-catalog-grid" aria-live="polite">
        {filtered.map(({ experiment, unit, outcomes, verified }, index) => (
          <article className="thought-catalog-card" key={experiment.id}>
            <div className="thought-card-top"><span className="thought-card-number">{String(index + 1).padStart(2, "0")}</span><span>{experiment.grade}. Sınıf</span><span>{experimentKindLabels[experiment.kind]}</span></div>
            <ExperimentVisual kind={experiment.visual} compact />
            <div className="thought-card-content">
              <small>{experiment.theme}</small>
              <h3>{experiment.title}</h3>
              <p>{experiment.summary}</p>
              <div className="thought-card-outcomes">{experiment.outcomeCodes.map((code, i) => <span key={code} title={outcomes[i]?.description}>{code}</span>)}</div>
              <div className="thought-card-unit">{unit?.name ?? experiment.unitCode}</div>
            </div>
            <footer><span><Clock3 size={14} /> {experiment.estimatedMinutes} dk</span><button type="button" onClick={() => openExperiment(experiment)} disabled={!verified}>Deneyi aç <ArrowRight size={15} /></button></footer>
          </article>
        ))}
      </div>
      {!filtered.length && <div className="thought-catalog-empty"><Search size={25} /><strong>Eşleşen deney bulunamadı</strong><span>Arama ifadesini veya filtreleri değiştirin.</span></div>}

      <footer className="thought-lab-footer"><span><CheckCircle2 size={16} /> FOPOS müfredat paketi: {curriculum.datasetVersion}</span><span>İçerik eşleştirmeleri öğretmen onaylı pedagojik önerilerdir.</span></footer>
    </section>
  );
}
