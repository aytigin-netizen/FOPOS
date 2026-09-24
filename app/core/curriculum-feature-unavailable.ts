export class CurriculumFeatureUnavailableError extends Error {
  readonly feature: string;
  readonly subjectCode: string;
  readonly datasetVersion: string;

  constructor(feature: string, subjectCode: string, datasetVersion: string) {
    super(`${feature} özelliği ${subjectCode} / ${datasetVersion} için kullanıma açık değil.`);
    this.name = "CurriculumFeatureUnavailableError";
    this.feature = feature;
    this.subjectCode = subjectCode;
    this.datasetVersion = datasetVersion;
  }
}
