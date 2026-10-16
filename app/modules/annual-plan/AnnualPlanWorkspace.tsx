"use client";
import { useMemo, useState } from "react";
import AnnualPlanModule from "./AnnualPlanModule";
import { annualPlanningSubjects, getAnnualPlanContext } from "./annual-only-curricula";
import type { CurriculumContext } from "../../data/curriculum-runtime";
import type { SchoolType } from "../../../src/core/curriculum/package-types";

type Props = React.ComponentProps<typeof AnnualPlanModule>;
export default function AnnualPlanWorkspace({curriculum: initialCurriculum, initialSubjectCode, initialSchoolType, initialGrade, ...props}: Omit<Props,"curriculum"> & {curriculum:CurriculumContext;initialSubjectCode?:string;initialSchoolType?:SchoolType}) {
  const [subjectCode,setSubjectCode]=useState(initialSubjectCode ?? initialCurriculum.subjectCode);
  const [schoolType,setSchoolType]=useState<SchoolType>(initialSchoolType ?? initialCurriculum.schoolType ?? "general_secondary");
  const curriculum=useMemo(()=>getAnnualPlanContext(subjectCode,schoolType),[subjectCode,schoolType]);
  return <>
    <section className="class-context-bar curriculum-context-bar" aria-label="Yıllık plan dersi">
      <div><strong>Yıllık plan</strong><small>{curriculum.sourceTitle} • {curriculum.sourceYear}</small></div>
      <label><span>Ders</span><select value={subjectCode} onChange={event=>setSubjectCode(event.target.value)}>{annualPlanningSubjects.map(subject=><option key={subject.code} value={subject.code}>{subject.name}</option>)}</select></label>
      <label><span>Okul türü</span><select value={schoolType} onChange={event=>setSchoolType(event.target.value as SchoolType)}><option value="general_secondary">Genel ortaöğretim</option><option value="social_sciences_high_school">Sosyal bilimler lisesi</option></select></label>
      {curriculum.applicabilityNote && <p>{curriculum.applicabilityNote}</p>}
    </section>
    <AnnualPlanModule key={`${subjectCode}:${schoolType}`} {...props} initialGrade={subjectCode === (initialSubjectCode ?? initialCurriculum.subjectCode) ? initialGrade : undefined} curriculum={curriculum}/>
  </>;
}
