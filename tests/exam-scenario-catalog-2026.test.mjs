import assert from 'node:assert/strict';
import test from 'node:test';
import {
  examScenarios2026,
  examScenarioComputedTotal,
  examScenarioIsConsistent,
  getExamScenarios,
} from '../app/modules/exam-builder/exam-scenarios-2026.ts';

test('2026-2027 senaryo kataloğu yalnızca dolu Maarif Modeli senaryolarını içerir', () => {
  assert.equal(examScenarios2026.length, 32);
  for (const scenario of examScenarios2026) {
    assert.equal(scenario.academicYear, '2026-2027');
    assert.equal(scenario.curriculum, 'tymm-2026');
    assert.ok(scenario.outcomes.length > 0, scenario.id);
    assert.ok(scenario.outcomes.every(row => row.questionCount > 0), scenario.id);
    assert.equal(new Set(scenario.outcomes.map(row => row.outcomeCode)).size, scenario.outcomes.length, scenario.id);
  }
});

test('Felsefe 10. sınıf senaryo sayıları kaynak PDF ile eşleşir', () => {
  assert.deepEqual(getExamScenarios({ subject: 'philosophy', grade: 10, exam: 'term1_exam1' }).map(x => x.declaredTotal), [6, 5, 6, 7]);
  assert.deepEqual(getExamScenarios({ subject: 'philosophy', grade: 10, exam: 'term1_exam2' }).map(x => x.declaredTotal), [7, 7, 6, 7, 8]);
});

test('Felsefe 11. sınıf senaryo sayıları kaynak PDF ile eşleşir; kaynak toplam uyuşmazlıkları korunur', () => {
  const first = getExamScenarios({ subject: 'philosophy', grade: 11, exam: 'term1_exam1' });
  const second = getExamScenarios({ subject: 'philosophy', grade: 11, exam: 'term1_exam2' });
  assert.deepEqual(first.map(x => x.declaredTotal), [6, 6, 6, 6, 8]);
  assert.deepEqual(second.map(x => x.declaredTotal), [6, 5, 6, 7, 7, 8]);
  assert.deepEqual(second.filter(x => !examScenarioIsConsistent(x)).map(x => x.scenarioNumber), [2, 5]);
  assert.deepEqual(second.filter(x => !examScenarioIsConsistent(x)).map(examScenarioComputedTotal), [6, 8]);
});

test('Seçmeli Psikoloji, Sosyoloji ve Mantık senaryoları Excel Maarif sekmeleriyle eşleşir', () => {
  const expected = {
    psychology: [[10, 7], [9, 11]],
    sociology: [[5, 7], [7, 6]],
    logic: [[5, 7], [6, 10]],
  };
  for (const [subject, totals] of Object.entries(expected)) {
    assert.deepEqual(getExamScenarios({ subject, grade: 11, exam: 'term1_exam1' }).map(x => x.declaredTotal), totals[0], subject);
    assert.deepEqual(getExamScenarios({ subject, grade: 11, exam: 'term1_exam2' }).map(x => x.declaredTotal), totals[1], subject);
  }
  assert.ok(examScenarios2026.every(examScenarioIsConsistent));
  const philosophyMismatchIds = examScenarios2026.filter(x => !examScenarioIsConsistent(x)).map(x => x.id);
  assert.deepEqual(philosophyMismatchIds, [
    'philosophy-11-term1-exam2-scenario-2',
    'philosophy-11-term1-exam2-scenario-5',
  ]);
});
