export type SubjectDescriptor = {
  code: string;
  name: string;
  courseType: "independent" | "integrated";
};

export type CurriculumCatalogUnit = {
  subjectCode: string;
  grade: number;
  code: string;
  outcomeCodes: string[];
};

export type CurriculumCatalog = {
  schemaVersion: "1.0.0";
  datasetVersion: string;
  subject: SubjectDescriptor;
  supportedGrades: number[];
  units: CurriculumCatalogUnit[];
};

const CODE_PATTERN = /^[a-z][a-z0-9_-]{1,31}$/u;

export function createCurriculumCatalog(input: {
  datasetVersion: string;
  subject: SubjectDescriptor;
  units: Array<{
    grade: number;
    code: string;
    outcomeCodes: string[];
  }>;
}): CurriculumCatalog {
  const subjectCode = input.subject.code.trim().toLocaleLowerCase("en-US");
  if (!CODE_PATTERN.test(subjectCode)) {
    throw new Error("Ders alanı kodu geçersiz.");
  }
  if (!input.subject.name.trim()) {
    throw new Error("Ders alanı adı boş olamaz.");
  }
  if (!input.datasetVersion.trim()) {
    throw new Error("Müfredat veri seti sürümü gereklidir.");
  }
  if (!input.units.length) {
    throw new Error("Müfredat kataloğu en az bir ünite içermelidir.");
  }

  const unitCodes = new Set<string>();
  const outcomeCodes = new Set<string>();
  const units = input.units.map((unit) => {
    if (!Number.isInteger(unit.grade) || unit.grade < 1 || unit.grade > 12) {
      throw new Error(`Geçersiz sınıf düzeyi: ${unit.grade}`);
    }
    if (!unit.code.trim() || unitCodes.has(unit.code)) {
      throw new Error(`Geçersiz veya yinelenen ünite kodu: ${unit.code}`);
    }
    unitCodes.add(unit.code);
    for (const outcomeCode of unit.outcomeCodes) {
      if (!outcomeCode.trim() || outcomeCodes.has(outcomeCode)) {
        throw new Error(
          `Geçersiz veya yinelenen öğrenme çıktısı kodu: ${outcomeCode}`,
        );
      }
      outcomeCodes.add(outcomeCode);
    }
    return {
      subjectCode,
      grade: unit.grade,
      code: unit.code,
      outcomeCodes: [...unit.outcomeCodes],
    };
  });

  return {
    schemaVersion: "1.0.0",
    datasetVersion: input.datasetVersion.trim(),
    subject: { ...input.subject, code: subjectCode, name: input.subject.name.trim() },
    supportedGrades: [...new Set(units.map((unit) => unit.grade))].sort(
      (left, right) => left - right,
    ),
    units,
  };
}

export function resolveCatalogUnit(
  catalog: CurriculumCatalog,
  subjectCode: string,
  grade: number,
  unitCode: string,
) {
  if (catalog.subject.code !== subjectCode) {
    return {
      ok: false as const,
      message: `${subjectCode} ders alanı bu katalogda bulunamadı.`,
    };
  }
  if (!catalog.supportedGrades.includes(grade)) {
    return {
      ok: false as const,
      message: `${subjectCode} için desteklenmeyen sınıf: ${grade}`,
    };
  }
  const unit = catalog.units.find(
    (candidate) => candidate.grade === grade && candidate.code === unitCode,
  );
  return unit
    ? { ok: true as const, value: unit }
    : {
        ok: false as const,
        message: `${subjectCode} ${grade}. sınıfta ${unitCode} kodlu ünite bulunamadı.`,
      };
}
