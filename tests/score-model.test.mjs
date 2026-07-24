import assert from "node:assert/strict";
import test from "node:test";
import {normalizedScore,parseScoreCell,scoreTotal} from "../app/core/score-model.ts";
import {developmentBand,scoreToDevelopmentLevel} from "../app/core/exam-report-model.ts";

test("boş puan ile gerçek sıfır ayrıdır",()=>{
  assert.equal(parseScoreCell("",10),null);
  assert.equal(parseScoreCell("0",10),0);
  assert.equal(parseScoreCell(0,10),0);
});

test("eksik ve katılmadı sonuçları hesaplamaya girmez",()=>{
  assert.equal(scoreTotal([5,null]),null);
  assert.equal(normalizedScore([5,null],[10,10],"present"),null);
  assert.equal(normalizedScore([5,5],[10,10],"absent"),null);
  assert.equal(normalizedScore([0,10],[10,10],"present"),50);
});

test("puan sınırlandırılır ve geçersiz sayı boş olur",()=>{
  assert.equal(parseScoreCell("12",10),10);
  assert.equal(parseScoreCell("-2",10),0);
  assert.equal(parseScoreCell("yanlış",10),null);
});

test("süreç gelişim düzeyi puanın dörtte birlik aralığına göre belirlenir",()=>{
  assert.equal(scoreToDevelopmentLevel(null,10),"-");
  assert.equal(scoreToDevelopmentLevel(0,10),"1");
  assert.equal(scoreToDevelopmentLevel(2.5,10),"2");
  assert.equal(scoreToDevelopmentLevel(7.5,10),"4");
  assert.equal(developmentBand(10,1),"0-2.49");
  assert.equal(developmentBand(15,4),"11.25-15");
});
