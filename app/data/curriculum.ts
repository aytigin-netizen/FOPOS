import {
  createCurriculumCatalog,
  resolveCatalogUnit,
} from "../core/curriculum-catalog.ts";

export type Grade = 10 | 11 | 12;
export type UnitCode = string;
export type Unit = {
  subjectCode: string; code: UnitCode; name: string; hours: number; grade: Grade; keywords: string[];
  purpose: string;
  outcomes: { code: string; description: string; short: string; processComponents: { step: string; description: string }[] }[];
  competencyFramework: {
    fieldSkills: string[]; conceptualSkills: string[]; tendencies: string[];
    socialEmotionalLearning: string[]; values: string[]; literacy: string[];
    interdisciplinaryRelations: string[]; interSkillRelations: string[];
  };
  contentFramework: string[];
  learningEvidence: string;
  learningTeachingExperiences: { basicAssumptions: string; preAssessment: string; bridging: string };
  differentiation: { enrichment: string; support: string };
  strategy: string; methods: string[]; opening: string; inquiry: string;
  discussion: string; application: string; evidence: string;
};

type UnitEnrichment = Omit<Unit, "purpose" | "competencyFramework" | "contentFramework" | "learningEvidence" | "learningTeachingExperiences" | "differentiation" | "outcomes"> & {
  outcomes: { code: string; description: string; short: string }[];
};

const enrichments: UnitEnrichment[] = [
  { code: "F10_U1", name: "Felsefenin Doğası", hours: 10, grade: 10, keywords: ["felsefe", "bilgelik", "sorgulama", "düşünme"], outcomes: [
    { code: "FEL.10.1.1", description: "Felsefenin anlamını ve gelişim sürecini sorgulayabilme", short: "Felsefenin anlamı ve gelişimi" },
    { code: "FEL.10.1.2", description: "Felsefenin özelliklerini, farklı alanlarla ilişkisini ve işlevini sorgulayabilme", short: "Özellikleri, ilişkileri ve işlevi" },
  ], strategy: "Sorgulamaya Dayalı Öğrenme", methods: ["Sokratik sorgulama", "Akvaryum tartışması", "Kavram haritalama", "Öz-yansıtma"], opening: "Felsefe bir cevap mı, yoksa arayış mı?", inquiry: "Felsefenin ortak bir tanımı mümkün müdür?", discussion: "Felsefi düşünceyi diğer düşünme biçimlerinden ayıran nedir?", application: "Gündelik bir soruyu felsefi soru ölçütleriyle yeniden kurar.", evidence: "Özgün felsefi soru" },
  { code: "F10_U2", name: "Felsefe, Mantık ve Argümantasyon", hours: 8, grade: 10, keywords: ["akıl yürütme", "argüman", "geçerlilik", "safsata", "tutarlılık"], outcomes: [
    { code: "FEL.10.2.1", description: "Mantık ve argümantasyonda kullanılan temel kavramları yorumlayabilme", short: "Mantık ve argümantasyon kavramları" },
  ], strategy: "Problem Temelli Argümantasyon", methods: ["Argüman haritalama", "Örnek–karşı örnek", "Safsata avı", "Akran değerlendirmesi"], opening: "İkna edici olan her düşünce geçerli midir?", inquiry: "Bir gerekçeler dizisini argüman yapan koşullar nelerdir?", discussion: "Geçerli bir argüman yanlış bir sonuca ulaşabilir mi?", application: "Gündelik bir iddiayı öncül–sonuç yapısına dönüştürür ve olası safsatayı belirler.", evidence: "Argüman haritası" },
  { code: "F10_U3", name: "Varlık Felsefesi", hours: 8, grade: 10, keywords: ["fenomen", "idea", "madde", "oluş", "öz", "töz", "varlık", "varoluş"], outcomes: [{ code: "FEL.10.3.1", description: "Varlık felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme", short: "Varlık felsefesi problemleri" }], strategy: "Probleme Dayalı Felsefi Soruşturma", methods: ["Kavram çözümleme", "Düşünce deneyi", "Karşılaştırmalı metin", "Gerekçeli tartışma"], opening: "Değişen bir şey aynı şey olmaya nasıl devam eder?", inquiry: "Varlığın temeli madde, düşünce ya da oluş olabilir mi?", discussion: "Gerçek olan yalnızca deneyimleyebildiğimiz midir?", application: "Bir nesnenin değişim boyunca özdeşliğini koruyup korumadığını düşünce deneyiyle sınar.", evidence: "Varlık görüşleri matrisi" },
  { code: "F10_U4", name: "Bilgi Felsefesi", hours: 8, grade: 10, keywords: ["bilgi", "doğruluk", "gerçeklik"], outcomes: [{ code: "FEL.10.4.1", description: "Bilgi felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme", short: "Bilgi felsefesi problemleri" }], strategy: "Sorgulamaya Dayalı Kavram İnşası", methods: ["Şüphe senaryosu", "Kavram ayrıştırma", "Sokratik diyalog", "Gerekçe denetimi"], opening: "Bir şeyi bildiğimizi nasıl biliriz?", inquiry: "İnanç, doğruluk ve gerekçe bilgi için yeterli midir?", discussion: "Kesin bilgi mümkün müdür?", application: "Güncel bir iddianın bilgi sayılabilmesi için gereken kanıtları değerlendirir.", evidence: "Bilgi ölçütleri kartı" },
  { code: "F10_U5", name: "Ahlak Felsefesi", hours: 8, grade: 10, keywords: ["ahlak", "erdem", "etik", "iyi", "kötü", "özgürlük", "sorumluluk", "vicdan"], outcomes: [{ code: "FEL.10.5.1", description: "Ahlak felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme", short: "Ahlak felsefesi problemleri" }], strategy: "Vaka Temelli Etik Muhakeme", methods: ["Etik ikilem", "Değer çizgisi", "Gerekçeli tartışma", "Perspektif değiştirme"], opening: "İyi niyet, bir eylemi ahlaken iyi yapmaya yeter mi?", inquiry: "Bir eylemin ahlaki değerini sonuç, niyet ya da ilke mi belirler?", discussion: "Özgür değilsek davranışlarımızdan sorumlu olabilir miyiz?", application: "Bir etik ikilemi farklı ahlak ölçütleriyle değerlendirir.", evidence: "Etik karar gerekçesi" },
  { code: "F10_U6", name: "Estetik ve Sanat Felsefesi", hours: 6, grade: 10, keywords: ["estetik", "güzellik", "sanat", "sanat eseri"], outcomes: [{ code: "FEL.10.6.1", description: "Estetik ve sanat felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme", short: "Estetik ve sanat problemleri" }], strategy: "Deneyim Temelli Estetik Soruşturma", methods: ["Görsel düşünme", "Kavram karşılaştırma", "Eleştiri çemberi", "Gerekçeli yargı"], opening: "Güzel bulmadığımız bir şey sanat eseri olabilir mi?", inquiry: "Estetik yargılar öznel midir, ortak ölçütlere dayanabilir mi?", discussion: "Bir nesneyi sanat eseri yapan sanatçı mı, eser mi, yoksa izleyici midir?", application: "Seçilen bir esere ilişkin estetik yargısını ölçüt ve gerekçeyle savunur.", evidence: "Estetik değerlendirme kartı" },
  { code: "F10_U7", name: "Siyaset Felsefesi", hours: 8, grade: 10, keywords: ["adalet", "birey", "devlet", "eşitlik", "iktidar", "özgürlük", "toplum", "ütopya"], outcomes: [{ code: "FEL.10.7.1", description: "Siyaset felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme", short: "Siyaset felsefesi problemleri" }], strategy: "Müzakereye Dayalı Yurttaşlık Soruşturması", methods: ["Adalet vakası", "Kavramsal müzakere", "Rol temelli tartışma", "İlke tasarımı"], opening: "Eşitlik her zaman adalet üretir mi?", inquiry: "Devletin meşruiyeti hangi ilkelere dayanmalıdır?", discussion: "Özgürlük ile toplumsal düzen çatıştığında hangisi önceliklidir?", application: "Kurgusal bir toplum için özgürlük ve adaleti dengeleyen bir ilke tasarlar.", evidence: "Toplumsal ilke önerisi" },
  { code: "F10_U8", name: "Din Felsefesi", hours: 6, grade: 10, keywords: ["ibadet", "iman", "inanç", "Tanrı", "vahiy"], outcomes: [{ code: "FEL.10.8.1", description: "Din felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme", short: "Din felsefesi problemleri" }], strategy: "Çoğulcu Felsefi Soruşturma", methods: ["Kavram çözümleme", "Gerekçe karşılaştırma", "Felsefi metin", "Saygılı diyalog"], opening: "İnanmak ile bilmek arasında nasıl bir ilişki vardır?", inquiry: "İman, akıl ve deneyim dinî inançta nasıl ilişkilendirilebilir?", discussion: "Tanrı hakkında akıl yoluyla konuşmanın sınırları nelerdir?", application: "Farklı bir inanç gerekçesini çarpıtmadan yeniden kurar ve felsefi açıdan değerlendirir.", evidence: "Gerekçe karşılaştırma tablosu" },
  { code: "F10_U9", name: "Bilim Felsefesi", hours: 6, grade: 10, keywords: ["bilim", "doğrulama", "paradigma", "yanlışlama"], outcomes: [{ code: "FEL.10.9.1", description: "Bilim felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme", short: "Bilim felsefesi problemleri" }], strategy: "Kanıt Temelli Bilimsel Soruşturma", methods: ["Sınır çizme vakası", "Hipotez sınama", "Kavram haritası", "Yapılandırılmış tartışma"], opening: "Bir iddiayı bilimsel yapan nedir?", inquiry: "Doğrulanamayan ama yanlışlanabilen bir önerme bilimsel olabilir mi?", discussion: "Bilimsel ilerleme birikimle mi, paradigma değişimleriyle mi gerçekleşir?", application: "Bir iddiayı bilimsel ölçütlerle değerlendirir ve sınanabilir hâle getirir.", evidence: "Bilimsellik ölçütleri raporu" },
  { code: "F11_U1", name: "Çevre Sorunları ve Felsefe", hours: 12, grade: 11, keywords: ["çevre", "çevre etiği", "değer", "doğa"], outcomes: [
    { code: "FEL.11.1.1", description: "Çevre ile ilgili felsefi soru ve problemleri anlayabilme", short: "Çevre problemlerini anlama" },
    { code: "FEL.11.1.2", description: "Çevre sorunlarıyla ilgili felsefi düşünce ortaya koyabilme", short: "Çevre üzerine felsefi düşünce" },
  ], strategy: "Sorun Temelli Çevre Etiği Soruşturması", methods: ["Yerel sorun incelemesi", "Neden–sonuç diyagramı", "Etik yaklaşım karşılaştırma", "Felsefi metin yazma"], opening: "Doğanın insanlardan bağımsız bir değeri var mıdır?", inquiry: "İnsan çevre ilişkisi hangi değer temelinde kurulmalıdır?", discussion: "Çevre krizinde sorumluluk bireye mi, kurumlara mı aittir?", application: "Yakın çevresindeki bir soruna insan, canlı ve çevre merkezci etik açısından çözüm önerir.", evidence: "Çevre etiği görüş metni" },
  { code: "F11_U2", name: "Teknoloji ve Hayat", hours: 12, grade: 11, keywords: ["ontolojik anlam", "tekhne", "teknoloji karşıtlığı", "teknoloji taraftarlığı", "teknokrasi", "zaman ve mekân"], outcomes: [
    { code: "FEL.11.2.1", description: "Teknoloji ile ilgili felsefi soru ve problemleri anlayabilme", short: "Teknoloji problemlerini anlama" },
    { code: "FEL.11.2.2", description: "Teknoloji ve hayat ilişkisiyle ilgili felsefi düşünce ortaya koyabilme", short: "Teknoloji ve hayat üzerine düşünce" },
  ], strategy: "Vaka Temelli Teknoloji Soruşturması", methods: ["Dijital yaşam vakası", "Görüş karşılaştırma", "Gelecek senaryosu", "Argüman yazma"], opening: "Teknoloji yalnızca kullandığımız bir araç mıdır?", inquiry: "Teknoloji insanın gerçeklik, zaman ve mekân deneyimini nasıl değiştirir?", discussion: "Teknolojik ilerleme insanı özgürleştirir mi, yabancılaştırır mı?", application: "Bir teknolojinin ontolojik ve aksiyolojik etkilerini güçlü ve zayıf yönleriyle değerlendirir.", evidence: "Teknoloji etkisi argümanı" },
  { code: "F11_U3", name: "Akıl ve İnanç", hours: 10, grade: 11, keywords: ["akıl", "gönül", "inanç"], outcomes: [
    { code: "FEL.11.3.1", description: "Akıl-inanç ilişkisiyle ilgili felsefi soru ve problemleri anlayabilme", short: "Akıl–inanç problemlerini anlama" },
    { code: "FEL.11.3.2", description: "Akıl-inanç ilişkisiyle ilgili felsefi düşünce ortaya koyabilme", short: "Akıl–inanç üzerine düşünce" },
  ], strategy: "Çoğulcu Metin Temelli Soruşturma", methods: ["Felsefi metin çözümleme", "Gerekçe karşılaştırma", "Diyalojik tartışma", "Yansıtıcı yazma"], opening: "Akıl ile temellendirilemeyen bir inanç anlamlı olabilir mi?", inquiry: "Akıl ve inanç birbirini sınırlar mı, tamamlar mı?", discussion: "Hakikate ulaşmada akıl mı, gönül mü daha belirleyicidir?", application: "Akıl ve inanç ilişkisine dair iki görüşü adil biçimde karşılaştırıp kendi konumunu gerekçelendirir.", evidence: "Karşılaştırmalı görüş metni" },
  { code: "F11_U4", name: "Edebiyat ve Felsefe", hours: 12, grade: 11, keywords: ["edebiyat", "felsefi roman", "felsefi şiir"], outcomes: [
    { code: "FEL.11.4.1", description: "Edebiyat-felsefe ilişkisi ile ilgili soru ve problemleri anlayabilme", short: "Edebiyat–felsefe ilişkisini anlama" },
    { code: "FEL.11.4.2", description: "Edebiyat-felsefe ilişkisi ile ilgili felsefi düşünce ortaya koyabilme", short: "Edebiyat–felsefe üzerine düşünce" },
  ], strategy: "Yorumlayıcı Metin Soruşturması", methods: ["Yakın okuma", "Metafor çözümleme", "Felsefi kavram avı", "Yaratıcı-felsefi yazma"], opening: "Bir edebiyat eseri felsefi bir argüman kurabilir mi?", inquiry: "Edebî anlatım felsefi düşünceye ne kazandırır ve neyi sınırlar?", discussion: "Felsefi roman, felsefe metni sayılabilir mi?", application: "Bir şiir ya da roman kesitindeki felsefi problemi, kavramı ve örtük görüşü yorumlar.", evidence: "Felsefi edebiyat incelemesi" },
  { code: "F11_U5", name: "Hayatın Anlamı", hours: 12, grade: 11, keywords: ["kaygı", "kendi olma", "mutluluk", "ölüm", "saçma", "umutsuzluk", "varoluş", "yabancılaşma"], outcomes: [
    { code: "FEL.11.5.1", description: "Hayatın anlamına ilişkin felsefi soru ve problemleri anlayabilme", short: "Hayatın anlamı problemlerini anlama" },
    { code: "FEL.11.5.2", description: "Hayatın anlamına ilişkin felsefi düşünce ortaya koyabilme", short: "Hayatın anlamı üzerine düşünce" },
  ], strategy: "Deneyim Temelli Varoluş Soruşturması", methods: ["Örnek olay", "Metafor çözümleme", "Filozof görüşleri karşılaştırma", "Yansıtıcı metin"], opening: "Hayatı anlamlı kılan nedir?", inquiry: "Mutluluk, varoluş ve kendi olma arasında nasıl bir ilişki kurulabilir?", discussion: "Hayatın anlamı bulunur mu, yoksa insan tarafından mı kurulur?", application: "Bir yaşam deneyimini varoluş, mutluluk ve kendi olma kavramlarıyla felsefi olarak yorumlar.", evidence: "Anlam arayışı metni" },
  { code: "F11_U6", name: "Hukuk ve Felsefe", hours: 10, grade: 11, keywords: ["ceza", "hakkaniyet", "hukuk", "suç", "yasa"], outcomes: [
    { code: "FEL.11.6.1", description: "Hukukun doğasına yönelik soru ve felsefi problemleri anlayabilme", short: "Hukukun doğasını anlama" },
    { code: "FEL.11.6.2", description: "Hukuk sorunları üzerine felsefi düşünce ortaya koyabilme", short: "Hukuk sorunları üzerine düşünce" },
  ], strategy: "Dava Temelli Hukuk Soruşturması", methods: ["Örnek dava", "Doğal–pozitif hukuk karşılaştırma", "Hukuk–ahlak müzakeresi", "Gerekçeli karar"], opening: "Yasal olan her şey adil midir?", inquiry: "Hukukun kaynağı ve bağlayıcılığı neye dayanır?", discussion: "Adaletin sağlanmasında yasa mı, hakkaniyet mi önceliklidir?", application: "Bir hukuk vakasını suç, ceza, yasa ve hakkaniyet ölçütleriyle değerlendirir.", evidence: "Felsefi hukuk görüşü" },
];

type CanonicalOutcome = { outcome_code: string; description: string };
type CanonicalUnit = {
  grade: number;
  unit_code: string;
  unit_name: string;
  duration_hours: number;
  purpose: string;
  keywords: string[];
  learning_outcomes: (CanonicalOutcome & { process_components: { step: string; description: string }[] })[];
  competency_framework: {
    field_skills: string[]; conceptual_skills: string[]; tendencies: string[];
    cross_program_components: { social_emotional_learning: string[]; values: string[]; literacy: string[] };
    interdisciplinary_relations: string[]; inter_skill_relations: string[];
  };
  content_framework: string[];
  learning_evidence: string;
  learning_teaching_experiences: { basic_assumptions: string; pre_assessment: string; bridging: string };
  differentiation: { enrichment: string; support: string };
};
type CanonicalGrade = {
  unit_count: number;
  learning_outcome_count: number;
  instruction_hours: number;
  school_based_planning_hours: number;
  units: CanonicalUnit[];
};
type CanonicalDataset = {
  schema_version: string;
  dataset_version: string;
  program_rules: {annual_total_hours_per_grade: number; school_based_planning_hours_per_grade: number};
  grades: {"10": CanonicalGrade; "11": CanonicalGrade};
};

const dataset = canonicalCurriculum as CanonicalDataset;
const canonicalUnits = [...dataset.grades["10"].units, ...dataset.grades["11"].units];

function assertCanonicalDataset(): void {
  if (dataset.schema_version !== "1.0.0" || dataset.dataset_version !== "2024.1") throw new Error("Desteklenmeyen müfredat veri seti sürümü.");
  if (dataset.grades["10"].unit_count !== 9 || dataset.grades["11"].unit_count !== 6 || canonicalUnits.length !== 15) throw new Error("Müfredat ünite kapsamı doğrulanamadı.");
  const outcomeCount = canonicalUnits.reduce((sum, unit) => sum + unit.learning_outcomes.length, 0);
  if (outcomeCount !== 22) throw new Error("Müfredat öğrenme çıktısı kapsamı doğrulanamadı.");
  for (const grade of ["10", "11"] as const) {
    const gradeData = dataset.grades[grade];
    const hours = gradeData.units.reduce((sum, unit) => sum + unit.duration_hours, 0);
    if (hours !== 68 || gradeData.instruction_hours !== 68 || gradeData.school_based_planning_hours !== 4) throw new Error(`${grade}. sınıf ders saati kapsamı doğrulanamadı.`);
    if (hours + gradeData.school_based_planning_hours !== dataset.program_rules.annual_total_hours_per_grade) throw new Error(`${grade}. sınıf yıllık toplamı doğrulanamadı.`);
  }
  const codes = canonicalUnits.flatMap(unit => [unit.unit_code, ...unit.learning_outcomes.map(outcome => outcome.outcome_code)]);
  if (new Set(codes).size !== codes.length) throw new Error("Müfredat kodları benzersiz değil.");
}

assertCanonicalDataset();
const enrichmentByCode = new Map(enrichments.map(unit => [unit.code, unit]));

export const curriculumMetadata = Object.freeze({
  subjectCode: "philosophy",
  subjectName: "Felsefe",
  schemaVersion: dataset.schema_version,
  datasetVersion: dataset.dataset_version,
  sourceFile: "felsefe_curriculum_2024.json",
});

export const units: Unit[] = canonicalUnits.map(canonicalUnit => {
  const enrichment = enrichmentByCode.get(canonicalUnit.unit_code);
  if (!enrichment) throw new Error(`${canonicalUnit.unit_code} için pedagojik zenginleştirme bulunamadı.`);
  const enrichmentOutcomeByCode = new Map(enrichment.outcomes.map(outcome => [outcome.code, outcome]));
  return {
    ...enrichment,
    subjectCode: curriculumMetadata.subjectCode,
    code: canonicalUnit.unit_code,
    name: canonicalUnit.unit_name,
    hours: canonicalUnit.duration_hours,
    grade: canonicalUnit.grade as Grade,
    purpose: canonicalUnit.purpose,
    keywords: [...canonicalUnit.keywords],
    outcomes: canonicalUnit.learning_outcomes.map(outcome => {
      const enrichmentOutcome = enrichmentOutcomeByCode.get(outcome.outcome_code);
      return {
        code: outcome.outcome_code,
        description: enrichmentOutcome?.description ?? outcome.description,
        short: enrichmentOutcome?.short ?? outcome.description,
        processComponents: outcome.process_components.map(component => ({step: component.step, description: component.description})),
      };
    }),
    competencyFramework: {
      fieldSkills: [...canonicalUnit.competency_framework.field_skills],
      conceptualSkills: [...canonicalUnit.competency_framework.conceptual_skills],
      tendencies: [...canonicalUnit.competency_framework.tendencies],
      socialEmotionalLearning: [...canonicalUnit.competency_framework.cross_program_components.social_emotional_learning],
      values: [...canonicalUnit.competency_framework.cross_program_components.values],
      literacy: [...canonicalUnit.competency_framework.cross_program_components.literacy],
      interdisciplinaryRelations: [...canonicalUnit.competency_framework.interdisciplinary_relations],
      interSkillRelations: [...canonicalUnit.competency_framework.inter_skill_relations],
    },
    contentFramework: [...canonicalUnit.content_framework],
    learningEvidence: canonicalUnit.learning_evidence,
    learningTeachingExperiences: {
      basicAssumptions: canonicalUnit.learning_teaching_experiences.basic_assumptions,
      preAssessment: canonicalUnit.learning_teaching_experiences.pre_assessment,
      bridging: canonicalUnit.learning_teaching_experiences.bridging,
    },
    differentiation: { ...canonicalUnit.differentiation },
  };
});

export const curriculumCatalog = createCurriculumCatalog({
  datasetVersion: curriculumMetadata.datasetVersion,
  subject: {
    code: curriculumMetadata.subjectCode,
    name: curriculumMetadata.subjectName,
    courseType: "independent",
  },
  units: units.map((unit) => ({
    grade: unit.grade,
    code: unit.code,
    outcomeCodes: unit.outcomes.map((outcome) => outcome.code),
  })),
});

export type Resolution<T> = {ok: true; value: T} | {ok: false; message: string};

export function resolveUnit(grade: number, unitCode: string): Resolution<Unit> {
  const catalogResolution = resolveCatalogUnit(
    curriculumCatalog,
    curriculumMetadata.subjectCode,
    grade,
    unitCode,
  );
  if (!catalogResolution.ok) return catalogResolution;
  const unit = units.find(candidate => candidate.grade === grade && candidate.code === unitCode);
  return unit ? {ok: true, value: unit} : {ok: false, message: `${grade}. sınıfta ${unitCode} kodlu ünite bulunamadı.`};
}

export function resolveOutcome(unit: Unit, outcomeCode: string): Resolution<Unit["outcomes"][number]> {
  const outcome = unit.outcomes.find(candidate => candidate.code === outcomeCode);
  return outcome ? {ok: true, value: outcome} : {ok: false, message: `${outcomeCode} kodlu öğrenme çıktısı ${unit.code} ünitesinde bulunamadı.`};
}

import canonicalCurriculum from "./felsefe_curriculum_2024.json";
