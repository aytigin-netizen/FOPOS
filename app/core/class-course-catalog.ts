import { resolveDomainCapability } from "../../src/core/domain-adapter/registry.ts";
import { supportedGradesForDiscipline } from "../../src/core/curriculum/curriculum-registry.ts";
import type { ClassWorkspaceContext, SchoolGrade } from "./class-workspace.ts";

// Administrative class/list scope. This does not activate a curriculum or producer.
export const rosterSchoolGrades: SchoolGrade[] = [9,10,11,12];
export const classCourseCatalog = [
  {code:"philosophy",name:"Felsefe"},
  {code:"sociology",name:"Sosyoloji"},
  {code:"psychology",name:"Psikoloji"},
  {code:"logic",name:"Mantık"},
] as const;
export function isClassCourse(code:string){return classCourseCatalog.some(course=>course.code===code);}
export function classCourseName(code:string){return classCourseCatalog.find(course=>course.code===code)?.name??code;}
export function classProductsAvailable(context:Pick<ClassWorkspaceContext,"subjectCode"|"grade">){
  return resolveDomainCapability(context.subjectCode).productRuntime === "enabled" && supportedGradesForDiscipline(context.subjectCode).some(grade=>grade===context.grade);
}
