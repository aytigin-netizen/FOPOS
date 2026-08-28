import assert from "node:assert/strict";
import test from "node:test";

import { getCurriculumContext } from "../app/data/curriculum-runtime.ts";
import { philosophyPhaseCatalog2026 } from "../app/modules/lesson-studio/phase-catalog-2026.ts";
import { getOutcomeForWeek } from "../app/modules/lesson-studio/week-outcome.ts";
import { getLessonStudioWeekCount, getUnitWeekFocus, specializePhasesForWeek } from "../app/modules/lesson-studio/weekly-content-2026.ts";

test("tek çıktılı ünitenin bütün haftaları aynı öğrenme çıktısına eşlenir", () => {
  const unit = getCurriculumContext("philosophy").units.find((item) => item.code === "F10_U3");
  assert.ok(unit);
  for (let week = 1; week <= getLessonStudioWeekCount(unit.code, unit.hours); week += 1) {
    assert.equal(getOutcomeForWeek(unit, week).code, "FEL.10.3.1");
  }
});

test("çok çıktılı ünitenin haftaları çıktı sırasına göre otomatik bölüştürülür", () => {
  const unit = getCurriculumContext("philosophy").units.find((item) => item.code === "F10_U2");
  assert.ok(unit);
  assert.deepEqual(
    Array.from({ length: unit.hours }, (_, index) => getOutcomeForWeek(unit, index + 1).code),
    ["FEL.10.2.1", "FEL.10.2.1", "FEL.10.2.1", "FEL.10.2.2", "FEL.10.2.2", "FEL.10.2.2"],
  );
});

test("ünite kapsamı dışındaki hafta sessizce yanlış çıktıya bağlanmaz", () => {
  const unit = getCurriculumContext("philosophy").units.find((item) => item.code === "F10_U2");
  assert.ok(unit);
  assert.throws(() => getOutcomeForWeek(unit, 0), /kapsamı dışında/);
  assert.throws(() => getOutcomeForWeek(unit, getLessonStudioWeekCount(unit.code, unit.hours) + 1), /kapsamı dışında/);
});

test("Bilgi Felsefesi sekiz ayrı ve müfredat sıralı hafta odağı taşır", () => {
  const titles = Array.from({ length: 8 }, (_, index) => getUnitWeekFocus("F10_U4", index + 1));
  assert.equal(new Set(titles).size, 8);
  assert.match(titles[0], /konusu.*bilgi ve sanı/u);
  assert.match(titles[5], /kritisizm ve entüisyonizm/u);
  assert.match(titles[6], /doğruluk ölçütleri/u);
  assert.match(titles[7], /metni inceleme/u);
});

test("Bilgi Felsefesi 1. ve 6. hafta ayrı günlük plan içeriği üretir", () => {
  const basePhases = philosophyPhaseCatalog2026["FEL.10.4.1"];
  const first = specializePhasesForWeek("FEL.10.4.1", 1, basePhases);
  const sixth = specializePhasesForWeek("FEL.10.4.1", 6, basePhases);
  assert.notDeepEqual(first, sixth);
  assert.match(JSON.stringify(first), /Platon'un mağara benzetmesi/u);
  assert.match(JSON.stringify(sixth), /Kant ve Bergson/u);
  for (const phases of [first, sixth]) {
    assert.equal(phases.length, 9);
    assert.equal(phases.reduce((sum, phase) => sum + phase.duration, 0), 80);
  }
});

test("Felsefenin Doğası on ayrı ve müfredat sıralı hafta odağı taşır", () => {
  const titles = Array.from({ length: 10 }, (_, index) => getUnitWeekFocus("F10_U1", index + 1));
  assert.equal(new Set(titles).size, 10);
  assert.match(titles[0], /Felsefenin anlamı/u);
  assert.match(titles[2], /temel özellikleri/u);
  assert.match(titles[5], /Dünya felsefe gelenekleri/u);
  assert.match(titles[6], /Felsefi sorunun/u);
  assert.match(titles[7], /bilim, din ve sanatla/u);
  assert.match(titles[8], /bireysel ve toplumsal işlevleri/u);
  assert.match(titles[9], /röportaj ve performans görevi/u);
});

test("Felsefenin Doğası ilk, geçiş ve son haftalarda ayrı plan içeriği üretir", () => {
  const basePhases = philosophyPhaseCatalog2026["FEL.10.1.1"];
  const first = specializePhasesForWeek("FEL.10.1.1", 1, basePhases);
  const transition = specializePhasesForWeek("FEL.10.1.1", 7, basePhases);
  const last = specializePhasesForWeek("FEL.10.1.1", 10, basePhases);

  assert.notDeepEqual(first, transition);
  assert.notDeepEqual(transition, last);
  assert.match(JSON.stringify(first), /bilgelik sevgisi/u);
  assert.match(JSON.stringify(transition), /özgün soru/u);
  assert.match(JSON.stringify(last), /röportaj ürünü/u);

  for (const phases of [first, transition, last]) {
    assert.equal(phases.length, 9);
    assert.equal(phases.reduce((sum, phase) => sum + phase.duration, 0), 80);
    assert.ok(phases.every((phase) => phase.facilitator && phase.learner && phase.evidence));
  }
});

test("Felsefe, Mantık ve Argümantasyon altı ayrı ve çıktı geçişli hafta odağı taşır", () => {
  const unit = getCurriculumContext("philosophy").units.find((item) => item.code === "F10_U2");
  assert.ok(unit);
  const titles = Array.from({ length: unit.hours }, (_, index) => getUnitWeekFocus("F10_U2", index + 1));

  assert.equal(unit.hours, 6);
  assert.equal(new Set(titles).size, 6);
  assert.match(titles[0], /Düşünme, dil, anlam/u);
  assert.match(titles[2], /uyumlu bir model/u);
  assert.match(titles[3], /temel kavramları/u);
  assert.match(titles[4], /Argümanın yapısı/u);
  assert.match(titles[5], /safsata çözümleme/u);
  assert.equal(getOutcomeForWeek(unit, 3).code, "FEL.10.2.1");
  assert.equal(getOutcomeForWeek(unit, 4).code, "FEL.10.2.2");
});

test("Felsefe, Mantık ve Argümantasyon ilk, geçiş ve son haftalarda ayrı plan içeriği üretir", () => {
  const first = specializePhasesForWeek("FEL.10.2.1", 1, philosophyPhaseCatalog2026["FEL.10.2.1"]);
  const beforeTransition = specializePhasesForWeek("FEL.10.2.1", 3, philosophyPhaseCatalog2026["FEL.10.2.1"]);
  const afterTransition = specializePhasesForWeek("FEL.10.2.2", 4, philosophyPhaseCatalog2026["FEL.10.2.2"]);
  const last = specializePhasesForWeek("FEL.10.2.2", 6, philosophyPhaseCatalog2026["FEL.10.2.2"]);

  assert.notDeepEqual(first, beforeTransition);
  assert.notDeepEqual(beforeTransition, afterTransition);
  assert.notDeepEqual(afterTransition, last);
  assert.match(JSON.stringify(first), /Düşünme–dil–anlam kavram ağı/u);
  assert.match(JSON.stringify(beforeTransition), /nedensel ilişki şeması/u);
  assert.match(JSON.stringify(afterTransition), /Mantık kavramları güvenlik tablosu/u);
  assert.match(JSON.stringify(last), /safsata karşı örneği/u);

  for (const phases of [first, beforeTransition, afterTransition, last]) {
    assert.equal(phases.length, 9);
    assert.equal(phases.reduce((sum, phase) => sum + phase.duration, 0), 80);
    assert.ok(phases.every((phase) => phase.facilitator && phase.learner && phase.evidence));
  }
});

test("Varlık Felsefesi kanonik 10 ders saatini beş haftalık stüdyo kapsamına dönüştürür", () => {
  const unit = getCurriculumContext("philosophy").units.find((item) => item.code === "F10_U3");
  assert.ok(unit);
  assert.equal(unit.hours, 10);
  assert.equal(getLessonStudioWeekCount(unit.code, unit.hours), 5);
  assert.equal(getUnitWeekFocus("F10_U3", 6), null);
});

test("Varlık Felsefesi beş ayrı ve müfredat sıralı hafta odağı taşır", () => {
  const titles = Array.from({ length: 5 }, (_, index) => getUnitWeekFocus("F10_U3", index + 1));
  assert.equal(new Set(titles).size, 5);
  assert.match(titles[0], /konusu ve temel kavramları/u);
  assert.match(titles[1], /Parmenides ve Gorgias/u);
  assert.match(titles[2], /temel açıklama modelleri/u);
  assert.match(titles[3], /Değişme, görünüş/u);
  assert.match(titles[4], /metni inceleme/u);
});

test("Varlık Felsefesi ilk, ara ve son haftalarda ayrı ve güvenli plan içeriği üretir", () => {
  const basePhases = philosophyPhaseCatalog2026["FEL.10.3.1"];
  const first = specializePhasesForWeek("FEL.10.3.1", 1, basePhases);
  const middle = specializePhasesForWeek("FEL.10.3.1", 3, basePhases);
  const transition = specializePhasesForWeek("FEL.10.3.1", 4, basePhases);
  const last = specializePhasesForWeek("FEL.10.3.1", 5, basePhases);

  assert.notDeepEqual(first, middle);
  assert.notDeepEqual(middle, transition);
  assert.notDeepEqual(transition, last);
  assert.match(JSON.stringify(first), /bilim–felsefe karşılaştırması/u);
  assert.match(JSON.stringify(middle), /sınıflandırma karşı örneği/u);
  assert.match(JSON.stringify(transition), /fenomeni yanılsamayla eşitlemeden/u);
  assert.match(JSON.stringify(last), /kaynaklı metin inceleme formu/u);

  for (const phases of [first, middle, transition, last]) {
    assert.equal(phases.length, 9);
    assert.equal(phases.reduce((sum, phase) => sum + phase.duration, 0), 80);
    assert.ok(phases.every((phase) => phase.facilitator && phase.learner && phase.evidence));
    assert.equal(phases[5].facilitator.includes(phases[5].learner), false);
  }
});

test("Ahlak Felsefesi kanonik sekiz ders saatini dört haftalık stüdyo kapsamına dönüştürür", () => {
  const unit = getCurriculumContext("philosophy").units.find((item) => item.code === "F10_U5");
  assert.ok(unit);
  assert.equal(unit.hours, 8);
  assert.equal(getLessonStudioWeekCount(unit.code, unit.hours), 4);
  assert.equal(getUnitWeekFocus("F10_U5", 5), null);
  assert.deepEqual(
    Array.from({ length: 4 }, (_, index) => getOutcomeForWeek(unit, index + 1).code),
    ["FEL.10.5.1", "FEL.10.5.1", "FEL.10.5.1", "FEL.10.5.1"],
  );
});

test("Ahlak Felsefesi dört ayrı ve müfredat sıralı hafta odağı taşır", () => {
  const titles = Array.from({ length: 4 }, (_, index) => getUnitWeekFocus("F10_U5", index + 1));
  assert.equal(new Set(titles).size, 4);
  assert.match(titles[0], /konusu ve temel kavramları/u);
  assert.match(titles[1], /Evrensel ahlak yasasının/u);
  assert.match(titles[2], /Özgürlük ve ahlaki sorumluluk/u);
  assert.match(titles[3], /etik ikilem ve performans görevi/u);
});

test("Ahlak Felsefesi bütün haftalarda ayrı, güvenli ve 80 dakikalık plan içeriği üretir", () => {
  const basePhases = philosophyPhaseCatalog2026["FEL.10.5.1"];
  const weeks = Array.from({ length: 4 }, (_, index) =>
    specializePhasesForWeek("FEL.10.5.1", index + 1, basePhases),
  );

  assert.equal(new Set(weeks.map((phases) => JSON.stringify(phases))).size, 4);
  assert.match(JSON.stringify(weeks[0]), /kişileri değil eylem, gerekçe ve ilkeleri/u);
  assert.match(JSON.stringify(weeks[1]), /normatif sonuçları karıştırmadan/u);
  assert.match(JSON.stringify(weeks[2]), /otomatik suçlama yerine gerekçeli ve dereceli/u);
  assert.match(JSON.stringify(weeks[3]), /Kişisel itiraf gerektirmeyen/u);
  assert.match(JSON.stringify(weeks[3]), /hukuki, toplumsal ve ahlaki yargıları ayırarak/u);

  for (const phases of weeks) {
    assert.equal(phases.length, 9);
    assert.equal(phases.reduce((sum, phase) => sum + phase.duration, 0), 80);
    assert.ok(phases.every((phase) => phase.facilitator && phase.learner && phase.evidence));
    assert.equal(phases[5].facilitator.includes(phases[5].learner), false);
  }
});

test("Estetik ve Sanat Felsefesi kanonik altı ders saatini üç haftalık stüdyo kapsamına dönüştürür", () => {
  const unit = getCurriculumContext("philosophy").units.find((item) => item.code === "F10_U6");
  assert.ok(unit);
  assert.equal(unit.hours, 6);
  assert.equal(getLessonStudioWeekCount(unit.code, unit.hours), 3);
  assert.equal(getUnitWeekFocus("F10_U6", 4), null);
  assert.deepEqual(
    Array.from({ length: 3 }, (_, index) => getOutcomeForWeek(unit, index + 1).code),
    ["FEL.10.6.1", "FEL.10.6.1", "FEL.10.6.1"],
  );
});

test("Estetik ve Sanat Felsefesi üç ayrı ve müfredat sıralı hafta odağı taşır", () => {
  const titles = Array.from({ length: 3 }, (_, index) => getUnitWeekFocus("F10_U6", index + 1));
  assert.equal(new Set(titles).size, 3);
  assert.match(titles[0], /konusu ve temel kavramları/u);
  assert.match(titles[1], /taklit, yaratım ve oyun/u);
  assert.match(titles[2], /Güzellik, ortak estetik yargılar/u);
});

test("Estetik ve Sanat Felsefesi bütün haftalarda ayrı, güvenli ve 80 dakikalık plan içeriği üretir", () => {
  const basePhases = philosophyPhaseCatalog2026["FEL.10.6.1"];
  const weeks = Array.from({ length: 3 }, (_, index) =>
    specializePhasesForWeek("FEL.10.6.1", index + 1, basePhases),
  );

  assert.equal(new Set(weeks.map((phases) => JSON.stringify(phases))).size, 3);
  assert.match(JSON.stringify(weeks[0]), /güzel ile sanat eserini özdeşleştirmez/u);
  assert.match(JSON.stringify(weeks[1]), /sanatsal yeteneği puanlamadan/u);
  assert.match(JSON.stringify(weeks[1]), /birbirini bütünüyle dışlayan tanımlar/u);
  assert.match(JSON.stringify(weeks[2]), /alıntı\/parafraz durumu belirtilmiş/u);
  assert.match(JSON.stringify(weeks[2]), /kültürel beğenileri tek ölçüte indirgemeden/u);

  for (const phases of weeks) {
    assert.equal(phases.length, 9);
    assert.equal(phases.reduce((sum, phase) => sum + phase.duration, 0), 80);
    assert.ok(phases.every((phase) => phase.facilitator && phase.learner && phase.evidence));
    assert.equal(phases[5].facilitator.includes(phases[5].learner), false);
  }
});

test("Çevre Sorunları ve Felsefe kanonik 12 ders saatini altı haftaya ve iki çıktıya böler", () => {
  const unit = getCurriculumContext("philosophy").units.find((item) => item.code === "F11_U1");
  assert.ok(unit);
  assert.equal(unit.hours, 12);
  assert.equal(getLessonStudioWeekCount(unit.code, unit.hours), 6);
  assert.equal(getUnitWeekFocus("F11_U1", 7), null);
  assert.deepEqual(
    Array.from({ length: 6 }, (_, index) => getOutcomeForWeek(unit, index + 1).code),
    ["FEL.11.1.1", "FEL.11.1.1", "FEL.11.1.1", "FEL.11.1.2", "FEL.11.1.2", "FEL.11.1.2"],
  );
});

test("Çevre Sorunları ve Felsefe altı ayrı ve kanonik sıralı hafta odağı taşır", () => {
  const titles = Array.from({ length: 6 }, (_, index) => getUnitWeekFocus("F11_U1", index + 1));
  assert.equal(new Set(titles).size, 6);
  assert.match(titles[0], /Çevre–insan ilişkisi/u);
  assert.match(titles[1], /felsefi sorular ve problemler/u);
  assert.match(titles[2], /İnsan, canlı ve çevre merkezci/u);
  assert.match(titles[3], /argümanları çözümleme/u);
  assert.match(titles[4], /görüş ve argüman oluşturma/u);
  assert.match(titles[5], /felsefi metin ve performans görevi/u);
});

test("Çevre Sorunları ve Felsefe bütün haftalarda ayrı, güvenli ve 80 dakikalık içerik üretir", () => {
  const weeks = Array.from({ length: 6 }, (_, index) => {
    const week = index + 1;
    const outcomeCode = week <= 3 ? "FEL.11.1.1" : "FEL.11.1.2";
    return specializePhasesForWeek(outcomeCode, week, philosophyPhaseCatalog2026[outcomeCode]);
  });

  assert.equal(new Set(weeks.map((phases) => JSON.stringify(phases))).size, 6);
  assert.match(JSON.stringify(weeks[0]), /çevre bilimiyle çevre etiğinin/u);
  assert.match(JSON.stringify(weeks[1]), /doğrulanmamış oran veya felaket iddiası üretmeden/u);
  assert.match(JSON.stringify(weeks[2]), /tek doğru görüşe indirgemeden/u);
  assert.match(JSON.stringify(weeks[3]), /bilimsel veriyle normatif sonucu karıştırmadan/u);
  assert.match(JSON.stringify(weeks[4]), /Kişisel suçluluk veya siyasi yönlendirme üretmeden/u);
  assert.match(JSON.stringify(weeks[5]), /yönlendirilmiş aktivizm istemeden/u);
  assert.match(JSON.stringify(weeks[5]), /alıntı ile parafrazı ayırıp/u);

  for (const phases of weeks) {
    assert.equal(phases.length, 9);
    assert.equal(phases.reduce((sum, phase) => sum + phase.duration, 0), 80);
    assert.ok(phases.every((phase) => phase.facilitator && phase.learner && phase.evidence));
    assert.equal(phases[5].facilitator.includes(phases[5].learner), false);
  }
});

test("Teknoloji ve Hayat kanonik 12 ders saatini altı haftaya ve 2+4 çıktı dağılımına böler", () => {
  const unit = getCurriculumContext("philosophy").units.find((item) => item.code === "F11_U2");
  assert.ok(unit);
  assert.equal(unit.hours, 12);
  assert.equal(getLessonStudioWeekCount(unit.code, unit.hours), 6);
  assert.equal(getUnitWeekFocus("F11_U2", 7), null);
  assert.deepEqual(
    Array.from({ length: 6 }, (_, index) => getOutcomeForWeek(unit, index + 1).code),
    ["FEL.11.2.1", "FEL.11.2.1", "FEL.11.2.2", "FEL.11.2.2", "FEL.11.2.2", "FEL.11.2.2"],
  );
});

test("Teknoloji ve Hayat altı ayrı ve kanonik sıralı hafta odağı taşır", () => {
  const titles = Array.from({ length: 6 }, (_, index) => getUnitWeekFocus("F11_U2", index + 1));
  assert.equal(new Set(titles).size, 6);
  assert.match(titles[0], /tekhne, araç ve amaç/u);
  assert.match(titles[1], /zaman, mekân, konfor ve risk/u);
  assert.match(titles[2], /ontolojik anlam kaybı ve yabancılaşma/u);
  assert.match(titles[3], /simülasyon, yapay zekâ ve anlama/u);
  assert.match(titles[4], /aksiyolojik problemler ve ahlaki sorumluluk/u);
  assert.match(titles[5], /felsefi metin ve performans görevi/u);
});

test("Teknoloji ve Hayat bütün haftalarda ayrı, güvenli ve 80 dakikalık içerik üretir", () => {
  const weeks = Array.from({ length: 6 }, (_, index) => {
    const week = index + 1;
    const outcomeCode = week <= 2 ? "FEL.11.2.1" : "FEL.11.2.2";
    return specializePhasesForWeek(outcomeCode, week, philosophyPhaseCatalog2026[outcomeCode]);
  });

  assert.equal(new Set(weeks.map((phases) => JSON.stringify(phases))).size, 6);
  assert.match(JSON.stringify(weeks[0]), /marka veya ürün yönlendirmesi yapmadan/iu);
  assert.match(JSON.stringify(weeks[1]), /Kişisel ekran süresi, hesap bilgisi, aile davranışı/iu);
  assert.match(JSON.stringify(weeks[1]), /klinik tanı koymaz/u);
  assert.match(JSON.stringify(weeks[2]), /ontolojik problemi psikolojik tanıyla karıştırmaz/u);
  assert.match(JSON.stringify(weeks[3]), /yapay zekâ çıktısını kanıt ya da otorite saymaz/u);
  assert.match(JSON.stringify(weeks[4]), /Kişisel veri ve gerçek hesap gerektirmeyen/iu);
  assert.match(JSON.stringify(weeks[4]), /teknik saldırı talimatı vermeden/u);
  assert.match(JSON.stringify(weeks[5]), /alıntı ile parafrazı ayırır/u);
  assert.match(JSON.stringify(weeks[5]), /marka tavsiyesi vermeden/u);

  for (const phases of weeks) {
    assert.equal(phases.length, 9);
    assert.equal(phases.reduce((sum, phase) => sum + phase.duration, 0), 80);
    assert.ok(phases.every((phase) => phase.facilitator && phase.learner && phase.evidence));
    assert.equal(phases[5].facilitator.includes(phases[5].learner), false);
  }
});

test("Akıl ve İnanç kanonik 10 ders saatini beş haftaya ve 2+3 çıktı dağılımına böler", () => {
  const unit = getCurriculumContext("philosophy").units.find((item) => item.code === "F11_U3");
  assert.ok(unit);
  assert.equal(unit.hours, 10);
  assert.equal(getLessonStudioWeekCount(unit.code, unit.hours), 5);
  assert.equal(getUnitWeekFocus("F11_U3", 6), null);
  assert.deepEqual(
    Array.from({ length: 5 }, (_, index) => getOutcomeForWeek(unit, index + 1).code),
    ["FEL.11.3.1", "FEL.11.3.1", "FEL.11.3.2", "FEL.11.3.2", "FEL.11.3.2"],
  );
});

test("Akıl ve İnanç beş ayrı ve kanonik sıralı hafta odağı taşır", () => {
  const titles = Array.from({ length: 5 }, (_, index) => getUnitWeekFocus("F11_U3", index + 1));
  assert.equal(new Set(titles).size, 5);
  assert.match(titles[0], /Bilgi, inanç ve güven ayrımı/u);
  assert.match(titles[1], /akılla temellendirilmesinin imkânı/u);
  assert.match(titles[2], /uzlaştırma girişimleri/u);
  assert.match(titles[3], /Akıl–gönül–inanç ilişkisi/u);
  assert.match(titles[4], /felsefi metin performans görevi/u);
});

test("Akıl ve İnanç bütün haftalarda ayrı, çoğulcu, mahremiyet koruyan ve 80 dakikalık içerik üretir", () => {
  const weeks = Array.from({ length: 5 }, (_, index) => {
    const week = index + 1;
    const outcomeCode = week <= 2 ? "FEL.11.3.1" : "FEL.11.3.2";
    return specializePhasesForWeek(outcomeCode, week, philosophyPhaseCatalog2026[outcomeCode]);
  });

  assert.equal(new Set(weeks.map((phases) => JSON.stringify(phases))).size, 5);
  assert.match(JSON.stringify(weeks[0]), /kendi dinî inancını, inançsızlığını veya aile inancını açıklamasını istemeden/iu);
  assert.match(JSON.stringify(weeks[1]), /en fazla 100 kelimelik Tertullianus ve Augustinus/u);
  assert.match(JSON.stringify(weeks[1]), /Kişisel görüş bildirmeye zorlamadan/iu);
  assert.match(JSON.stringify(weeks[2]), /tek görüşe/u);
  assert.match(JSON.stringify(weeks[3]), /en fazla 100 kelimelik tematik parçaları/u);
  assert.match(JSON.stringify(weeks[4]), /kurmaca ya da üçüncü kişi görüşünü seçebilir/u);
  assert.match(JSON.stringify(weeks[4]), /alıntı ile parafrazı ayırır/u);
  assert.match(JSON.stringify(weeks[4]), /dinî kanaate göre değil felsefi ölçütlerle/u);

  for (const phases of weeks) {
    assert.equal(phases.length, 9);
    assert.equal(phases.reduce((sum, phase) => sum + phase.duration, 0), 80);
    assert.ok(phases.every((phase) => phase.facilitator && phase.learner && phase.evidence));
    assert.equal(phases[5].facilitator.includes(phases[5].learner), false);
  }
});

test("Edebiyat ve Felsefe kanonik 12 ders saatini altı haftaya ve 2+4 çıktı dağılımına böler", () => {
  const unit = getCurriculumContext("philosophy").units.find((item) => item.code === "F11_U4");
  assert.ok(unit);
  assert.equal(unit.hours, 12);
  assert.equal(getLessonStudioWeekCount(unit.code, unit.hours), 6);
  assert.equal(getUnitWeekFocus("F11_U4", 7), null);
  assert.deepEqual(
    Array.from({ length: 6 }, (_, index) => getOutcomeForWeek(unit, index + 1).code),
    ["FEL.11.4.1", "FEL.11.4.1", "FEL.11.4.2", "FEL.11.4.2", "FEL.11.4.2", "FEL.11.4.2"],
  );
  assert.equal(getOutcomeForWeek(unit, 2).code, "FEL.11.4.1");
  assert.equal(getOutcomeForWeek(unit, 3).code, "FEL.11.4.2");
});

test("Edebiyat ve Felsefe altı ayrı ve kanonik sıralı hafta odağı taşır", () => {
  const titles = Array.from({ length: 6 }, (_, index) => getUnitWeekFocus("F11_U4", index + 1));
  assert.equal(new Set(titles).size, 6);
  assert.match(titles[0], /biçim, amaç ve dil bakımından ilişkisi/u);
  assert.match(titles[1], /temel problemleri ve hayatla bağlantısı/u);
  assert.match(titles[2], /filozof argümanlarını çözümleme/u);
  assert.match(titles[3], /Türk edebiyatının farklı türlerinde/u);
  assert.match(titles[4], /Edebî unsurlarla felsefe yapma/u);
  assert.match(titles[5], /felsefi metin performans görevi/u);
});

test("Edebiyat ve Felsefe bütün haftalarda ayrı, kaynak güvenli, mahremiyet koruyan ve 80 dakikalık içerik üretir", () => {
  const weeks = Array.from({ length: 6 }, (_, index) => {
    const week = index + 1;
    const outcomeCode = week <= 2 ? "FEL.11.4.1" : "FEL.11.4.2";
    return specializePhasesForWeek(outcomeCode, week, philosophyPhaseCatalog2026[outcomeCode]);
  });

  assert.equal(new Set(weeks.map((phases) => JSON.stringify(phases))).size, 6);
  assert.match(JSON.stringify(weeks[0]), /edebî olanı yalnız duyguyla/u);
  assert.match(JSON.stringify(weeks[1]), /Kişisel okuma geçmişi veya sanatsal yetenek açıklatmadan/iu);
  assert.match(JSON.stringify(weeks[2]), /en fazla 100 kelimelik alıntı, parafraz/u);
  assert.match(JSON.stringify(weeks[2]), /düşünür adını argümanın doğruluk kanıtı saymaz/u);
  assert.match(JSON.stringify(weeks[3]), /anlatıcı, karakter ile yazar görüşünü özdeşleştirmeden/u);
  assert.match(JSON.stringify(weeks[4]), /en az üç tarihsel-kültürel kümeye/u);
  assert.match(JSON.stringify(weeks[4]), /kurmaca karakter ya da üçüncü kişi üzerinden/u);
  assert.match(JSON.stringify(weeks[5]), /Her alıntıyı en fazla 100 kelimeyle sınırlar/u);
  assert.match(JSON.stringify(weeks[5]), /alıntı, parafraz, sadeleştirme ve öğretmen uyarlamasını ayırır/u);
  assert.match(JSON.stringify(weeks[5]), /Edebî zevki, yaratıcı yazarlığı veya kişisel yaşantısı yerine felsefi rubrik/u);

  for (const phases of weeks) {
    assert.equal(phases.length, 9);
    assert.equal(phases.reduce((sum, phase) => sum + phase.duration, 0), 80);
    assert.ok(phases.every((phase) => phase.facilitator && phase.learner && phase.evidence));
    assert.equal(phases[5].facilitator.includes(phases[5].learner), false);
  }
});

test("Hayatın Anlamı kanonik 12 ders saatini altı haftaya ve 2+4 çıktı dağılımına böler", () => {
  const unit = getCurriculumContext("philosophy").units.find((item) => item.code === "F11_U5");
  assert.ok(unit);
  assert.equal(unit.hours, 12);
  assert.equal(getLessonStudioWeekCount(unit.code, unit.hours), 6);
  assert.equal(getUnitWeekFocus("F11_U5", 7), null);
  assert.deepEqual(
    Array.from({ length: 6 }, (_, index) => getOutcomeForWeek(unit, index + 1).code),
    ["FEL.11.5.1", "FEL.11.5.1", "FEL.11.5.2", "FEL.11.5.2", "FEL.11.5.2", "FEL.11.5.2"],
  );
  assert.equal(getOutcomeForWeek(unit, 2).code, "FEL.11.5.1");
  assert.equal(getOutcomeForWeek(unit, 3).code, "FEL.11.5.2");
});

test("Hayatın Anlamı altı ayrı ve kanonik sıralı hafta odağı taşır", () => {
  const titles = Array.from({ length: 6 }, (_, index) => getUnitWeekFocus("F11_U5", index + 1));
  assert.equal(new Set(titles).size, 6);
  assert.match(titles[0], /anlamı, amacı ve değeri/u);
  assert.match(titles[1], /Mutluluk–hayat ve varoluş–kendi olma/u);
  assert.match(titles[2], /filozof argümanları/u);
  assert.match(titles[3], /Varoluşçuluğun ortaya çıkışı/u);
  assert.match(titles[4], /saçma üzerine karşılaştırmalı/u);
  assert.match(titles[5], /felsefi metin performansı/u);
});

test("Hayatın Anlamı bütün haftalarda ayrı, kaynak güvenli, psikolojik açıdan güvenli ve 80 dakikalık içerik üretir", () => {
  const weeks = Array.from({ length: 6 }, (_, index) => {
    const week = index + 1;
    const outcomeCode = week <= 2 ? "FEL.11.5.1" : "FEL.11.5.2";
    return specializePhasesForWeek(outcomeCode, week, philosophyPhaseCatalog2026[outcomeCode]);
  });

  assert.equal(new Set(weeks.map((phases) => JSON.stringify(phases))).size, 6);
  assert.match(JSON.stringify(weeks[0]), /Kişisel hayat hikâyesi veya hassas yaşantı açıklaması istemeden/iu);
  assert.match(JSON.stringify(weeks[0]), /anonim soru kartından birini seçebilir/iu);
  assert.match(JSON.stringify(weeks[1]), /kurmaca karakterler üzerinden/iu);
  assert.match(JSON.stringify(weeks[2]), /alıntı, parafraz veya öğretmen uyarlaması/iu);
  assert.match(JSON.stringify(weeks[2]), /en fazla 100 kelimelik/u);
  assert.match(JSON.stringify(weeks[3]), /klinik tanı gibi kullanmaz/iu);
  assert.match(JSON.stringify(weeks[4]), /kişisel açıklama istemeden/iu);
  assert.match(JSON.stringify(weeks[4]), /risk davranışını romantikleştirmez/iu);
  assert.match(JSON.stringify(weeks[5]), /Kişisel hayat öyküsü, inanç veya ruh sağlığı açıklaması yerine/iu);
  assert.match(JSON.stringify(weeks[5]), /alıntı, parafraz, sadeleştirme ve öğretmen uyarlamasını ayırır/iu);

  for (const phases of weeks) {
    assert.equal(phases.length, 9);
    assert.equal(phases.reduce((sum, phase) => sum + phase.duration, 0), 80);
    assert.ok(phases.every((phase) => phase.facilitator && phase.learner && phase.evidence));
    assert.equal(phases[5].facilitator.includes(phases[5].learner), false);
  }
});


test("Hukuk ve Felsefe kanonik 10 ders saatini beş haftaya ve 2+3 çıktı dağılımına böler", () => {
  const unit = getCurriculumContext("philosophy").units.find((item) => item.code === "F11_U6");
  assert.ok(unit);
  assert.equal(unit.hours, 10);
  assert.equal(getLessonStudioWeekCount(unit.code, unit.hours), 5);
  assert.equal(getUnitWeekFocus("F11_U6", 6), null);
  assert.deepEqual(
    Array.from({ length: 5 }, (_, index) => getOutcomeForWeek(unit, index + 1).code),
    ["FEL.11.6.1", "FEL.11.6.1", "FEL.11.6.2", "FEL.11.6.2", "FEL.11.6.2"],
  );
  assert.equal(getOutcomeForWeek(unit, 2).code, "FEL.11.6.1");
  assert.equal(getOutcomeForWeek(unit, 3).code, "FEL.11.6.2");
});

test("Hukuk ve Felsefe beş ayrı ve kanonik sıralı hafta odağı taşır", () => {
  const titles = Array.from({ length: 5 }, (_, index) => getUnitWeekFocus("F11_U6", index + 1));
  assert.equal(new Set(titles).size, 5);
  assert.match(titles[0], /gereği ve önemi/u);
  assert.match(titles[1], /doğal hukuk, pozitif hukuk/u);
  assert.match(titles[2], /Hak ve özgürlüklerin hukuksal temelleri/u);
  assert.match(titles[3], /Ahlak–hukuk ilişkisi/u);
  assert.match(titles[4], /kaynaklı felsefi metin performansı/u);
});

test("Hukuk ve Felsefe bütün haftalarda ayrı, kaynak ve hukuk güvenli, mahremiyet koruyan ve 80 dakikalık içerik üretir", () => {
  const weeks = Array.from({ length: 5 }, (_, index) => {
    const week = index + 1;
    const outcomeCode = week <= 2 ? "FEL.11.6.1" : "FEL.11.6.2";
    return specializePhasesForWeek(outcomeCode, week, philosophyPhaseCatalog2026[outcomeCode]);
  });

  assert.equal(new Set(weeks.map((phases) => JSON.stringify(phases))).size, 5);
  assert.match(JSON.stringify(weeks[0]), /Kişisel veya ailevi hukuk yaşantısı açıklaması istemeden/iu);
  assert.match(JSON.stringify(weeks[0]), /anonim soru kartından birini seçebilir/iu);
  assert.match(JSON.stringify(weeks[1]), /Gerçek öğrenci suçu, mağduriyeti, aile davası/iu);
  assert.match(JSON.stringify(weeks[1]), /en fazla 100 kelimelik/u);
  assert.match(JSON.stringify(weeks[2]), /Kişisel kimlik, mağduriyet veya siyasi tercih açıklaması istemez/iu);
  assert.match(JSON.stringify(weeks[3]), /görüşü nedeniyle öğrenciyi puanlamadan/iu);
  assert.match(JSON.stringify(weeks[3]), /şiddeti meşrulaştıran ifadeleri normalleştirmeden/iu);
  assert.match(JSON.stringify(weeks[4]), /en az 250 kelimelik/iu);
  assert.match(JSON.stringify(weeks[4]), /bireysel hukuki danışmanlık üretmeden/iu);
  assert.match(JSON.stringify(weeks[4]), /Alıntı, parafraz, sadeleştirme ve öğretmen uyarlamasını ayırır/iu);

  for (const phases of weeks) {
    assert.equal(phases.length, 9);
    assert.equal(phases.reduce((sum, phase) => sum + phase.duration, 0), 80);
    assert.ok(phases.every((phase) => phase.facilitator && phase.learner && phase.evidence));
    assert.equal(phases[5].facilitator.includes(phases[5].learner), false);
  }
});
