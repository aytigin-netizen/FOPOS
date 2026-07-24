"use client";

import { useMemo, useState } from "react";
import { getCurriculum, type GradeLevel } from "@/curriculum";
import {
  classProfiles,
  createLessonDraft,
  evidenceOptions,
  getStudioDefaults,
  getUnitWeekCount,
  teachingMethods,
} from "@/modules/lesson-studio/model";
import type { LessonStudioSelection } from "@/modules/lesson-studio/types";

export function LessonStudio() {
  const [selection, setSelection] = useState<LessonStudioSelection>(getStudioDefaults);
  const curriculum = getCurriculum(selection.grade);
  const selectedUnit =
    curriculum.units.find((unit) => unit.code === selection.unitCode) ??
    curriculum.units[0];
  const selectedOutcome =
    selectedUnit.outcomes.find((outcome) => outcome.code === selection.outcomeCode) ??
    selectedUnit.outcomes[0];
  const weekCount = getUnitWeekCount(selectedUnit.code);
  const draft = useMemo(
    () =>
      createLessonDraft({
        ...selection,
        unitCode: selectedUnit.code,
        outcomeCode: selectedOutcome.code,
        week: Math.min(selection.week, weekCount),
      }),
    [selectedOutcome.code, selectedUnit.code, selection, weekCount],
  );

  function selectGrade(grade: GradeLevel) {
    const nextCurriculum = getCurriculum(grade);
    const firstUnit = nextCurriculum.units[0];
    setSelection((current) => ({
      ...current,
      grade,
      unitCode: firstUnit.code,
      outcomeCode: firstUnit.outcomes[0].code,
      week: 1,
    }));
  }

  function selectUnit(unitCode: string) {
    const unit = curriculum.units.find((item) => item.code === unitCode);
    if (!unit) return;

    setSelection((current) => ({
      ...current,
      unitCode,
      outcomeCode: unit.outcomes[0].code,
      week: 1,
    }));
  }

  return (
    <div className="studio-layout">
      <aside className="studio-panel" aria-label="Ders tasarımı seçimleri">
        <div>
          <span className="eyebrow">Müfredat bağlantılı</span>
          <h1 className="studio-title">Ders Tasarım Stüdyosu</h1>
          <p className="studio-intro">
            Seçimler doğrudan 2024 Felsefe Dersi Öğretim Programı veri modelinden gelir.
          </p>
        </div>

        <div className="field-group">
          <span className="field-label">Sınıf</span>
          <div className="segmented" role="group" aria-label="Sınıf seçimi">
            {([10, 11] as const).map((grade) => (
              <button
                className={selection.grade === grade ? "segment active" : "segment"}
                key={grade}
                onClick={() => selectGrade(grade)}
                type="button"
              >
                {grade}. sınıf
              </button>
            ))}
          </div>
        </div>

        <label className="field-group">
          <span className="field-label">Ünite</span>
          <select value={selectedUnit.code} onChange={(event) => selectUnit(event.target.value)}>
            {curriculum.units.map((unit) => (
              <option key={unit.code} value={unit.code}>
                {unit.order}. {unit.title}
              </option>
            ))}
          </select>
        </label>

        <label className="field-group">
          <span className="field-label">Öğrenme çıktısı</span>
          <select
            value={selectedOutcome.code}
            onChange={(event) =>
              setSelection((current) => ({
                ...current,
                outcomeCode: event.target.value,
              }))
            }
          >
            {selectedUnit.outcomes.map((outcome) => (
              <option key={outcome.code} value={outcome.code}>
                {outcome.code} · {outcome.title}
              </option>
            ))}
          </select>
        </label>

        <label className="field-group">
          <span className="field-label">Ünite içi hafta</span>
          <select
            value={Math.min(selection.week, weekCount)}
            onChange={(event) =>
              setSelection((current) => ({
                ...current,
                week: Number(event.target.value),
              }))
            }
          >
            {Array.from({ length: weekCount }, (_, index) => index + 1).map((week) => (
              <option key={week} value={week}>
                {week}. hafta · 80 dakika
              </option>
            ))}
          </select>
          <small>{selectedUnit.lessonHours} ders saati · {weekCount} hafta</small>
        </label>

        <label className="field-group">
          <span className="field-label">Sınıf profili</span>
          <select
            value={selection.classProfile}
            onChange={(event) =>
              setSelection((current) => ({
                ...current,
                classProfile: event.target.value as LessonStudioSelection["classProfile"],
              }))
            }
          >
            {classProfiles.map((profile) => (
              <option key={profile.value} value={profile.value}>
                {profile.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field-group">
          <span className="field-label">Ana yöntem</span>
          <select
            value={selection.method}
            onChange={(event) =>
              setSelection((current) => ({ ...current, method: event.target.value }))
            }
          >
            {teachingMethods.map((method) => (
              <option key={method}>{method}</option>
            ))}
          </select>
        </label>

        <label className="field-group">
          <span className="field-label">Öğrenme kanıtı</span>
          <select
            value={selection.evidence}
            onChange={(event) =>
              setSelection((current) => ({ ...current, evidence: event.target.value }))
            }
          >
            {evidenceOptions.map((evidence) => (
              <option key={evidence}>{evidence}</option>
            ))}
          </select>
        </label>
      </aside>

      <div className="studio-workspace">
        <section className="studio-hero">
          <div>
            <span className="outcome-code">{selectedOutcome.code}</span>
            <h2>{draft.title}</h2>
            <p>{draft.curriculum.outcomeTitle}</p>
          </div>
          <div className="duration">
            <strong>{draft.totalMinutes}</strong>
            <span>dakika</span>
          </div>
        </section>

        <section className="curriculum-context" aria-labelledby="curriculum-context-title">
          <div className="context-heading">
            <div>
              <span className="eyebrow">Karar öncesi bağlam</span>
              <h3 id="curriculum-context-title">Müfredat izi</h3>
            </div>
            <a href={selectedUnit.sourceUrl} rel="noreferrer" target="_blank">
              Resmî kaynağı aç
            </a>
          </div>

          <div className="context-grid">
            <div>
              <h4>Süreç bileşenleri</h4>
              <ol>
                {draft.curriculum.processComponents.map((component) => (
                  <li key={component}>{component}</li>
                ))}
              </ol>
            </div>
            <div>
              <h4>İçerik çerçevesi</h4>
              <ul>
                {draft.curriculum.contentFramework.map((content) => (
                  <li key={content}>{content}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="tag-row">
            {draft.curriculum.keyConcepts.map((concept) => (
              <span key={concept}>{concept}</span>
            ))}
          </div>
          <div className="component-strip">
            <span>Beceriler: {draft.curriculum.fieldSkills.join(", ")}</span>
            <span>Değerler: {draft.curriculum.values.join(", ")}</span>
            <span>Okuryazarlık: {draft.curriculum.literacies.join(", ")}</span>
          </div>
        </section>

        <section aria-labelledby="lesson-flow-title">
          <div className="flow-heading">
            <div>
              <span className="eyebrow">Pedagojik taslak</span>
              <h3 id="lesson-flow-title">9 aşamalı ders akışı</h3>
            </div>
            <span>{selection.method} · {selection.evidence}</span>
          </div>

          <div className="lesson-flow">
            {draft.phases.map((phase) => (
              <article className="phase" key={phase.order}>
                <div className="phase-index">{phase.order.toString().padStart(2, "0")}</div>
                <div className="phase-main">
                  <div className="phase-title">
                    <h4>{phase.title}</h4>
                    <span>{phase.minutes} dk.</span>
                  </div>
                  <div className="phase-actions">
                    <p><strong>Öğretmen:</strong> {phase.teacherAction}</p>
                    <p><strong>Öğrenci:</strong> {phase.studentAction}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
