import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { annualOnlySources, getAnnualPlanContext, annualOnlyWeek } from '../app/modules/annual-plan/annual-only-curricula.ts';
import { annualRows, annualRowForDate } from '../app/modules/annual-plan/annual-plan-rows.ts';
import { resolveAnnualPlanWeekFramework } from '../app/modules/annual-plan/annual-plan-2026-framework.ts';
import { createAnnualPlanDecision } from '../app/core/annual-plan-decision.ts';
import { isAnnualOnlyRecord, annualOnlyDocumentAllowed } from '../app/core/annual-only-record.ts';
import { resolveDomainCapability } from '../src/core/domain-adapter/registry.ts';
import { buildAnnualPlanArtifact } from '../app/modules/annual-plan/export-annual-plan.ts';
const manifest=JSON.parse(readFileSync(new URL('../sources/curriculum-2026/manifest.json',import.meta.url),'utf8'));
const normalize=value=>value.normalize('NFC').replace(/-\s*\n\s*/gu,'').replace(/\s+/gu,' ').trim();
const specs={psychology:{hours:[10,18,20,20],outputs:[1,4,4,4],components:38},logic:{hours:[10,16,16,26],outputs:[3,3,5,6],components:53}};
for(const [subject,spec] of Object.entries(specs)) {
 test(`${subject}: 2026 PDF kimliği ve bütün çıktı, süreç, konu, TYMM metinleri kaynakla birebir`,()=>{
  const source=annualOnlySources[subject];
  const pdf=new URL('../'+source.sourcePdf,import.meta.url);
  const official=manifest.sources.find(item=>item.disciplineCode===subject);
  assert.equal(createHash('sha256').update(readFileSync(pdf)).digest('hex'),official.sha256);
  const officialText=readFileSync(new URL('../'+official.textPath,import.meta.url),'utf8');
  assert.equal(createHash('sha256').update(officialText).digest('hex'),official.textSha256);
  const text=normalize(officialText.replaceAll('Öğrenme Becerileri',''));
  assert.deepEqual(source.units.map(unit=>unit.hours),spec.hours);
  assert.deepEqual(source.units.map(unit=>unit.outcomes.length),spec.outputs);
  assert.equal(source.units.flatMap(unit=>unit.outcomes).flatMap(outcome=>outcome.processComponents).length,spec.components);
  for(const unit of source.units){
   for(const outcome of unit.outcomes){
    assert.ok(text.includes(normalize(outcome.code+'. '+outcome.description)),outcome.code);
    for(const component of outcome.processComponents)assert.ok(text.includes(normalize(`${component.step}) ${component.description}`)),`${outcome.code}/${component.step}`);
   }
   for(const task of unit.requiredEnrichment)assert.ok(text.includes(normalize(task)),task);
   for(const topic of unit.contentFramework)assert.ok(text.includes(normalize(topic)),topic);
   for(const items of Object.values(unit.competencyFramework))for(const item of items)assert.ok(text.includes(normalize(item)),item);
  }
 });
 for(const schoolType of ['general_secondary','social_sciences_high_school'])for(const grade of [10,11,12]) test(`${subject}/${schoolType}/${grade}: 68+4 saat, 34 ünite haftası, tüm çıktı ve bileşenler`,()=>{
  const context=getAnnualPlanContext(subject,schoolType);
  const rows=annualRows(grade,'2026-2027',context.units,subject,'2026.1');
  const lessons=rows.filter(row=>row.kind==='lesson');
  assert.equal(lessons.length,34);assert.equal(lessons.reduce((sum,row)=>sum+row.hours,0),68);
  assert.equal(rows.filter(row=>row.kind==='planning').reduce((sum,row)=>sum+row.hours,0),4);
  assert.ok(rows.filter(row=>row.kind==='planning').every(row=>row.topic.includes('kariyer')));
  assert.equal(rows.filter(row=>row.kind==='break').length,4);
  for(const unit of context.units.filter(unit=>unit.grade===grade)){
   const selected=lessons.filter(row=>row.unitCode===unit.code);
   assert.equal(selected.length*2,unit.hours);
   for(const outcome of unit.outcomes){
    const matching=selected.filter(row=>row.outcomeCode===outcome.code);
    assert.ok(matching.length,outcome.code);
    for(const component of outcome.processComponents)assert.ok(matching.some(row=>row.components.includes(component.description)),`${outcome.code}/${component.step}`);
   }
  }
  const today=annualRowForDate(rows,'2026-10-16');
  assert.equal(today.unitWeek,5);assert.equal(today.unitCode,context.units[0].code);
  assert.equal(annualRowForDate(rows,'2026-11-18').kind,'break');
  assert.equal(resolveDomainCapability(subject).productRuntime,'disabled');
  assert.match(context.distributionNote,/taslak/);
  if(schoolType === 'social_sciences_high_school')for(const unit of context.units.filter(unit=>unit.grade===grade))for(const task of unit.requiredEnrichment)assert.ok(lessons.some(row=>row.unitCode===unit.code && row.topic.includes(task)));
  else assert.ok(lessons.every(row=>!row.topic.includes('zorunlu zenginleştirme')));
 });
 test(`${subject}: yıllık plan onayı ve belge izi açılır; günlük plan ve sınav kapısı açılmaz`,async()=>{
  const context=getAnnualPlanContext(subject);
  const record=createAnnualPlanDecision({scope:{academicYear:'2026-2027',subjectCode:subject,datasetVersion:'2026.1',grade:11},units:context.units});
  assert.ok(isAnnualOnlyRecord(record));
  assert.ok(annualOnlyDocumentAllowed(record,'annual-plan'));
  for(const kind of ['daily-plan','exam','department-meeting-minutes'])assert.equal(annualOnlyDocumentAllowed(record,kind),false);
  for(const field of [{unitCode:'OTHER'},{datasetVersion:'2025.1'},{grade:9},{outcomeCode:'PSK.1.1'}])assert.equal(isAnnualOnlyRecord({...record,curriculum:{...record.curriculum,...field}}),false);
  assert.equal(isAnnualOnlyRecord({...record,lessonContext:{...record.lessonContext,durationMinutes:80}}),false);
  assert.equal(isAnnualOnlyRecord({...record,recordId:'foreign-record'}),false);
  assert.equal(isAnnualOnlyRecord({...record,pedagogicalDecision:{...record.pedagogicalDecision,learningEvidence:'unknown'}}),false);
  assert.throws(()=>annualOnlyWeek(subject,context.units[0].code,-1));
  assert.throws(()=>annualOnlyWeek(subject,context.units[0].code,5));
  assert.throws(()=>resolveAnnualPlanWeekFramework(subject,'2025.1'));
 });
}

test('Sosyoloji okul türü kapsamı yıllık plan ve Bugün panelinde aynı kaynaktır',()=>{
 const general=getAnnualPlanContext('sociology','general_secondary');
 const social=getAnnualPlanContext('sociology','social_sciences_high_school');
 assert.deepEqual(general.supportedGrades,[11]);assert.deepEqual(social.supportedGrades,[11,12]);
 assert.throws(()=>annualRows(12,'2026-2027',general.units,'sociology','2026.1'));
 assert.equal(annualRows(12,'2026-2027',social.units,'sociology','2026.1').filter(row=>row.kind==='lesson').length,34);
});

for(const subject of ['psychology','logic']) test(`${subject}: yıllık plan DOCX belgesi aynı satırları, taslak notunu ve kariyer odağını içerir`,async()=>{
 const context=getAnnualPlanContext(subject);
 const rows=annualRows(11,'2026-2027',context.units,subject,context.datasetVersion);
 const artifact=await buildAnnualPlanArtifact({academicYear:'2026-2027',school:'Kontrol Okulu',teacher:'Ders Öğretmeni',principal:'Okul Müdürü',grade:11,subjectName:context.subjectName,sourceTitle:context.sourceTitle,sourceYear:2026,rows,distributionNote:context.distributionNote,schoolBasedPlanningFocus:context.schoolBasedPlanningFocus});
 const directory=mkdtempSync(join(tmpdir(),'annual-only-'));
 try {
  const path=join(directory,artifact.fileName);writeFileSync(path,Buffer.from(await artifact.blob.arrayBuffer()));
  const xml=execFileSync('unzip',['-p',path,'word/document.xml'],{encoding:'utf8',maxBuffer:4*1024*1024});
  assert.match(xml,/w:orient="landscape"/);
  assert.ok(xml.includes(context.distributionNote));assert.ok(xml.includes(context.schoolBasedPlanningFocus));
  for(const row of rows.filter(row=>row.kind==='lesson'))for(const key of ['topic','outcome','components'])assert.ok(xml.includes(row[key].replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')),`${row.week}/${key}`);
  assert.doesNotMatch(xml,/FEL\.\d|SOS\.\d/);
 }finally{rmSync(directory,{recursive:true,force:true});}
});

test('Bugün yıllık plan kaydını ders tasarımı diye açmaz; ders kartı sınıf ve okul türünü taşır',()=>{
 const dashboard=readFileSync(new URL('../app/components/dashboard/Dashboard.tsx',import.meta.url),'utf8');
 const client=readFileSync(new URL('../app/ClientApp.tsx',import.meta.url),'utf8');
 assert.match(dashboard,/record\.curriculum\.unitCode!=="ANNUAL_PLAN"/);
 assert.match(dashboard,/getAnnualPlanContext\(storedSlot\.subjectCode,storedSlot\.schoolType\)/);
 assert.match(dashboard,/onOpenAnnual\(slot\)/);
 assert.match(client,/initialSchoolType=\{annualLesson\?\.schoolType\}/);
 assert.match(client,/initialGrade=\{annualLesson\?\.grade/);
});
