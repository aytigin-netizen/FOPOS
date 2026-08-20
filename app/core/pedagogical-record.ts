import type {Grade, Unit} from "../data/curriculum";

export type RecordStatus="draft"|"in_review"|"approved"|"superseded";
export type ProductType="lesson_design"|"daily_plan"|"presentation"|"activity"|"worksheet"|"exam";
export type Approval={approvedAt:string;statement:string;actorRole:"teacher"};
export type PedagogicalRecord={schemaVersion:"1.0.0";recordId:string;revision:number;status:RecordStatus;createdAt:string;updatedAt:string;previousRevision:number|null;approval:Approval|null;curriculum:{subjectCode:string;datasetVersion:string;grade:Grade;unitCode:string;outcomeCode:string};lessonContext:{week:number;durationMinutes:number;profile:string};pedagogicalDecision:{strategy:string;methods:string[];learningEvidence:string}};
export type DerivedProduct={productId:string;productType:ProductType;sourceRecordId:string;sourceRevision:number;createdAt:string};
const makeId=(prefix:string)=>`${prefix}-${createId()}`;

export function createPedagogicalRecord(input:{unit:Unit;outcomeCode:string;week:number;profile:string;datasetVersion:string;durationMinutes?:number}):PedagogicalRecord{
  if(!input.unit.outcomes.some(outcome=>outcome.code===input.outcomeCode))throw new Error(`${input.outcomeCode} kodlu çıktı ${input.unit.code} ünitesinde bulunamadı.`);
  if(!Number.isInteger(input.week)||input.week<1||input.week>input.unit.hours)throw new Error(`Geçersiz hafta: ${input.week}`);
  const now=new Date().toISOString();
  return{schemaVersion:"1.0.0",recordId:makeId("OPUS-PR"),revision:1,status:"draft",createdAt:now,updatedAt:now,previousRevision:null,approval:null,curriculum:{subjectCode:input.unit.subjectCode??"philosophy",datasetVersion:input.datasetVersion,grade:input.unit.grade,unitCode:input.unit.code,outcomeCode:input.outcomeCode},lessonContext:{week:input.week,durationMinutes:input.durationMinutes??80,profile:input.profile},pedagogicalDecision:{strategy:input.unit.strategy,methods:[...input.unit.methods],learningEvidence:input.unit.evidence}};
}
export function submitForReview(record:PedagogicalRecord):PedagogicalRecord{if(record.status!=="draft")throw new Error("Yalnızca taslak kayıt incelemeye gönderilebilir.");return{...record,status:"in_review",updatedAt:new Date().toISOString()}}
export function approveRecord(record:PedagogicalRecord,statement:string):PedagogicalRecord{if(record.status!=="in_review")throw new Error("Yalnızca incelemedeki kayıt öğretmen tarafından onaylanabilir.");if(!statement.trim())throw new Error("Öğretmen onay beyanı boş olamaz.");const now=new Date().toISOString();return{...record,status:"approved",updatedAt:now,approval:{approvedAt:now,statement:statement.trim(),actorRole:"teacher"}}}
export function reviseRecord(record:PedagogicalRecord,patch:Partial<Pick<PedagogicalRecord,"lessonContext"|"pedagogicalDecision">>):{previous:PedagogicalRecord;next:PedagogicalRecord}{const now=new Date().toISOString();return{previous:{...record,status:"superseded",updatedAt:now},next:{...record,...patch,revision:record.revision+1,status:"draft",previousRevision:record.revision,approval:null,createdAt:now,updatedAt:now}}}
export function deriveProduct(record:PedagogicalRecord,productType:ProductType):DerivedProduct{return{productId:makeId("OPUS-OUT"),productType,sourceRecordId:record.recordId,sourceRevision:record.revision,createdAt:new Date().toISOString()}}
export function assertProductTrace(record:PedagogicalRecord,product:DerivedProduct):void{if(product.sourceRecordId!==record.recordId||product.sourceRevision!==record.revision)throw new Error("Ürün ile pedagojik kayıt arasında izlenebilirlik uyuşmazlığı var.")}
import { createId } from "./id.js";
