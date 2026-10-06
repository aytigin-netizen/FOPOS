import { readFileSync, writeFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { earlyUnits, earlyUnitTasks } from '../app/modules/exam-builder/philosophy-early-units-2026.ts';
import { getCurriculumContext } from '../app/data/curriculum-runtime.ts';
import { resolveExamContentEngine } from '../app/modules/exam-builder/exam-content-engine.ts';

// Capture the initial generic bank before any component-specific overrides.
// Compare final slots against their own initial slot; no keyword heuristic.
const path='app/modules/exam-builder/philosophy-early-units-2026.ts';
const source=readFileSync(new URL('../'+path,import.meta.url),'utf8');
const marker='  const analysis: Record<string, [string, string]> = {';
assert.equal(source.split(marker).length,2,'Initial bank capture marker changed');
const instrumented=source.replace(marker,'  const baseline = structuredClone(tasks);\n'+marker);
const finalReturn="return tasks.map(task => ({ ...task, stem: task.stem.charAt(0).toLocaleUpperCase('tr') + task.stem.slice(1) }));";
assert.equal(instrumented.split(finalReturn).length,2,'Final bank return changed');
const js=stripTypeScriptTypes(instrumented.replace(finalReturn,"return { baseline, tasks: tasks.map(task => ({ ...task, stem: task.stem.charAt(0).toLocaleUpperCase('tr') + task.stem.slice(1) })) };"))
 .replace(/^export /gm,'');
const capture=new Function(js+'\nreturn earlyUnitTasks;')();
const upper=s=>s.charAt(0).toLocaleUpperCase('tr')+s.slice(1);
const labels={understand:'Anlama',apply:'Uygulama',analyze:'Çözümleme',evaluate:'Değerlendirme',create:'Oluşturma'};
const units=getCurriculumContext('philosophy').units.filter(u=>u.grade===10&&['F10_U1','F10_U2'].includes(u.code));
const rows=[];
const engine=resolveExamContentEngine('philosophy');
for(const [code,focuses] of Object.entries(earlyUnits)){
 const unit=units.find(u=>u.outcomes.some(o=>o.code===code));const outcome=unit.outcomes.find(o=>o.code===code);
 assert.equal(outcome.processComponents.length,focuses.length);
 for(const [componentIndex,focus] of focuses.entries()){
  const {baseline,tasks}=capture(focus);assert.deepEqual(tasks,earlyUnitTasks(focus));assert.equal(tasks.length,10);
  for(const [slot,task] of tasks.entries()){
   const ordered=[...tasks.filter(t=>t.level===task.level),...tasks.filter(t=>t.level!==task.level)];
   const ordinal=ordered.indexOf(task)*focuses.length+componentIndex;
   const actual=engine.generate({unitCode:unit.code,outcomeCode:code,ordinal,level:task.level,points:13,kind:'text',datasetVersion:'2026.1',mode:'standard',profile:'reading'});
   assert.ok(actual.text.includes(task.stem), 'Inventory slot must be reachable by actual engine');
   assert.equal(actual.componentStep,outcome.processComponents[componentIndex].step);
   assert.equal(actual.level,task.level);
   assert.equal([...actual.criterion.matchAll(/: (\d+) puan\. Tam:/g)].reduce((n,m)=>n+Number(m[1]),0),13);
   const genericStem=task.stem===upper(baseline[slot].stem);
   const genericKey=task.key===baseline[slot].key;
   const genericCriteria=JSON.stringify(task.criteria)===JSON.stringify(baseline[slot].criteria);
   const givesExample=genericStem&&slot===2, givesJudgment=genericStem&&slot===6;
   rows.push({id:`${code}/${outcome.processComponents[componentIndex].step}/T${slot}`,unitCode:unit.code,outcomeCode:code,componentIndex,componentStep:outcome.processComponents[componentIndex].step,focus:focus.focus,slot,exampleOrdinalAtOwnLevel:ordinal,level:task.level,genericStem,genericKey,genericCriteria,givesExample,givesJudgment,stem:task.stem,key:task.key,criteria:task.criteria});
  }
 }
}
assert.equal(rows.length,100);assert.equal(new Set(rows.map(r=>r.id)).size,100);
const pending=rows.filter(r=>r.genericStem);
assert.equal(pending.length%2,0);
for(const r of pending) assert.ok(pending.some(p=>p.outcomeCode===r.outcomeCode&&p.componentIndex===r.componentIndex&&p.slot===(r.slot^1)), 'Remaining slots must include their level partner');
const digest=createHash('sha256').update(source).digest('hex');
const revision=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const summary={total:rows.length,genericStem:pending.length,customStem:rows.length-pending.length,genericKey:rows.filter(r=>r.genericKey).length,genericCriteria:rows.filter(r=>r.genericCriteria).length,withFocusPhrase:pending.filter(r=>r.stem.toLocaleLowerCase('tr').includes(r.focus)).length,genericEvaluationWithGivenJudgment:pending.filter(r=>r.givesJudgment).length,genericApplicationWithGivenExample:pending.filter(r=>r.givesExample).length};
writeFileSync('docs/quality/early-exam-template-inventory-20261006.json',JSON.stringify({revision,path,sourceSha256:digest,method:'Exact final-versus-initial slot comparison; uppercase normalized only',summary,rows},null,2)+'\n');
let md=`# 10. sınıf ilk iki ünite — Kesin görev yuvası envanteri\n\nTarih: 6 Ekim 2026\nKaynak commit: ${revision}\nKaynak: \`${path}\`\nKaynak SHA-256: \`${digest}\`\n\n## Sonuç ve sayım ölçütü\n\nToplam **${summary.total} görev yuvasının ${summary.genericStem}'si genel soru kökünü aynen kullanıyor; ${summary.customStem}'i bileşene özgü köke sahip.** #179'daki yaklaşık 47 kesin sayı değildir. Kapsam 10 süreç bileşeni × 5 bilişsel düzey × 2 görevdir. Bu sayı tek sınavdaki soru sayısı, kitapçık sayısı veya tüm FOPOS havuzunun toplamı değildir.\n\nBaşlangıçtaki 10 genel görev, bileşene özgü güncellemelerden önce yakalandı. Her son kök kendi başlangıç yuvasıyla tam eşleşme üzerinden karşılaştırıldı; yalnız ilk harfin Türkçe büyük harfe çevrilmesi normalleştirildi. Bileşen adını taşımayan ama sonucu hazır veren genel değerlendirme kökleri de sayıldı. Bu nedenle yalnız bileşen ifadesini aramak eksik sayar.\n\n- Genel kök ve bileşen ifadesi taşıyan: ${summary.withFocusPhrase}.\n- Bileşen ifadesi yerine hazır değerlendirme yargısı taşıyan genel kök: ${summary.genericEvaluationWithGivenJudgment}.\n- Genel uygulama kökünde hazır örnek verilen: ${summary.genericApplicationWithGivenExample} (genel kök toplamının alt kümesi).\n- Başlangıç anahtarını aynen kullanan yuva: ${summary.genericKey}.\n- Başlangıç ölçüt etiketlerini aynen kullanan yuva: ${summary.genericCriteria}.\n\nAnahtar/ölçüt sayıları genel kök sayısına eklenmez. Ortak etiket veya anahtar kullanımı tek başına içerik hatası kanıtı değildir. Bu çalışma şablon kökenini saptar; 52 yuvanın tamamını pedagojik olarak yanlış ilan etmez. Ayrıntılı anahtar ve ölçütler eşlik eden JSON'da tüm 100 yuva için kayıtlıdır. Bütün 100 yuva gerçek üreticide kendi düzeyinde üretildi; kök, bileşen ve düzey eşleşmesi ile 13 puanlık ölçüt toplamı doğrulandı. Kalan 52 yuva 26 tam düzey çifti oluşturuyor. Müfredat veya soru içeriği değiştirilmedi. Bileşen kodları mevcut 2026 runtime verisinden okundu; bu tur bağımsız PDF parite denetimi değildir.\n\n## Bileşen ve düzey dağılımı\n\n| Öğrenme çıktısı / bileşen | Odak | Anlama | Uygulama | Çözümleme | Değerlendirme | Oluşturma | Kalan |\n|---|---|---:|---:|---:|---:|---:|---:|\n`;
for(const [code,focuses] of Object.entries(earlyUnits))for(const [index,f]of focuses.entries()){
 const rs=rows.filter(r=>r.outcomeCode===code&&r.componentIndex===index),p=rs.filter(r=>r.genericStem);
 md+=`| ${code} / ${rs[0].componentStep} | ${f.focus} | ${Object.keys(labels).map(l=>p.filter(r=>r.level===l).length).join(' | ')} | ${p.length} |\n`;
}
md+=`| **Toplam** | | ${Object.keys(labels).map(l=>pending.filter(r=>r.level===l).length).join(' | ')} | **${pending.length}** |\n\n## Kalan her yuvanın soru kökü\n\nT0–T9, earlyUnitTasks dizisinin sıfır tabanlı yuva kimliğidir; kitapçık soru numarası değildir. Aynı düzeydeki (T0/T1, T2/T3, T4/T5, T6/T7, T8/T9) görevler potansiyel A/B çiftleridir. Gerçek ordinal, istenen düzeye göre yeniden sıralandığı için T numarasıyla eşit kabul edilmemelidir.\n\n| Kimlik | Düzey | Görev / risk odağı | Soru kökü |\n|---|---|---|---|\n`;
for(const r of pending){const risk=r.givesJudgment?'Hazır değerlendirme yargısı':r.givesExample?'Hazır örneği uygulama':r.level==='create'?'Genel yeni ürün yönergesi':r.level==='understand'?'Genel bilgi/özet yönergesi':r.level==='evaluate'?'Genel sonuç/genelleme yönergesi':'Genel örnek yönergesi';md+=`| ${r.id} | ${labels[r.level]} | ${risk} | ${r.stem.replaceAll('|','\\|')} |\n`;}
md+='\n## Sonraki paketin kapsamı\n\nÖncelikle bilim–din–sanat ilişkisi, bireysel/toplumsal işlevler ve nesnel yeniden ifade bileşenlerinde sekizer; kalan altı bileşende toplam 28 genel yuva vardır. Toplam 26 potansiyel düzey çifti için yönerge–bilişsel işlem–anahtar–ölçüt birlikte incelenmelidir. Uygulamada verilen örneğin ilişkiyi önceden açıklayıp açıklamadığı ve değerlendirmede sonuç yargısının öğrenciye hazır verilip verilmediği öncelikli kontrol noktalarıdır. Anlama yönergelerinin açıklığı ve oluşturma görevlerinin ürününe özgü ölçütler ayrıca değerlendirilmelidir.\n\nTamamı bileşene özgü 48 kök bu şablon temizliği envanterinin dışındadır; bu sınıflandırma onların pedagojik kusursuzluğunu kanıtlamaz. Sınav Analiz Formu ve eski önermeler listesi bulguları ayrı kapsamda kalır. Bu envanter tek başına içerik geliştirmesi veya canlı dağıtım gerektirmez.\n';
writeFileSync('docs/quality/early-exam-template-inventory-20261006.md',md);
console.log(JSON.stringify(summary,null,2));
