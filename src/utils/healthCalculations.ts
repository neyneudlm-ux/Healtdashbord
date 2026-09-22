import { HealthRecord } from '../types/health';

export interface HealthStats {
  totalCount: number;
  
  // BMI Stats
  avgBmi: number;
  minBmi: number;
  maxBmi: number;
  normalBmiCount: number;
  normalBmiPercent: number;
  obeseCount: number;
  obesePercent: number;

  // Blood Pressure Stats
  avgSbp: number;
  avgDbp: number;
  minSbp: number;
  maxSbp: number;
  minDbp: number;
  maxDbp: number;
  hypertensionRiskCount: number;
  hypertensionRiskPercent: number;

  // Blood Sugar Stats
  avgBloodSugar: number;
  minBloodSugar: number;
  maxBloodSugar: number;
  diabetesRiskCount: number;
  diabetesRiskPercent: number;

  // Overall Risk Stats
  highRiskCount: number;
  highRiskPercent: number;
  moderateRiskCount: number;
  moderateRiskPercent: number;
  lowRiskCount: number;
  lowRiskPercent: number;
  avgRiskScore: number;

  // Gender Breakdown
  maleCount: number;
  femaleCount: number;
  maleRatio: number;
  femaleRatio: number;

  // Behavior stats
  smokerCount: number;
  smokerPercent: number;
  drinkerCount: number;
  drinkerPercent: number;
  regularExerciseCount: number;
  regularExercisePercent: number;
  noExerciseCount: number;
  noExercisePercent: number;
}

export function computeHealthStats(records: HealthRecord[]): HealthStats {
  const n = records.length;
  if (n === 0) {
    return {
      totalCount: 0,
      avgBmi: 0, minBmi: 0, maxBmi: 0, normalBmiCount: 0, normalBmiPercent: 0, obeseCount: 0, obesePercent: 0,
      avgSbp: 0, avgDbp: 0, minSbp: 0, maxSbp: 0, minDbp: 0, maxDbp: 0, hypertensionRiskCount: 0, hypertensionRiskPercent: 0,
      avgBloodSugar: 0, minBloodSugar: 0, maxBloodSugar: 0, diabetesRiskCount: 0, diabetesRiskPercent: 0,
      highRiskCount: 0, highRiskPercent: 0, moderateRiskCount: 0, moderateRiskPercent: 0, lowRiskCount: 0, lowRiskPercent: 0, avgRiskScore: 0,
      maleCount: 0, femaleCount: 0, maleRatio: 0, femaleRatio: 0,
      smokerCount: 0, smokerPercent: 0, drinkerCount: 0, drinkerPercent: 0, regularExerciseCount: 0, regularExercisePercent: 0, noExerciseCount: 0, noExercisePercent: 0
    };
  }

  let totalBmi = 0;
  let minBmi = Infinity;
  let maxBmi = -Infinity;
  let normalBmiCount = 0;
  let obeseCount = 0;

  let totalSbp = 0;
  let totalDbp = 0;
  let minSbp = Infinity;
  let maxSbp = -Infinity;
  let minDbp = Infinity;
  let maxDbp = -Infinity;
  let hypertensionRiskCount = 0;

  let totalBloodSugar = 0;
  let minBloodSugar = Infinity;
  let maxBloodSugar = -Infinity;
  let diabetesRiskCount = 0;

  let highRiskCount = 0;
  let moderateRiskCount = 0;
  let lowRiskCount = 0;
  let totalRiskScore = 0;

  let maleCount = 0;
  let femaleCount = 0;

  let smokerCount = 0;
  let drinkerCount = 0;
  let regularExerciseCount = 0;
  let noExerciseCount = 0;

  for (const r of records) {
    // BMI
    totalBmi += r.bmi;
    if (r.bmi < minBmi) minBmi = r.bmi;
    if (r.bmi > maxBmi) maxBmi = r.bmi;
    if (r.bmi >= 18.5 && r.bmi <= 22.9) normalBmiCount++;
    if (r.bmi >= 25.0) obeseCount++;

    // SBP / DBP
    totalSbp += r.sbp;
    totalDbp += r.dbp;
    if (r.sbp < minSbp) minSbp = r.sbp;
    if (r.sbp > maxSbp) maxSbp = r.sbp;
    if (r.dbp < minDbp) minDbp = r.dbp;
    if (r.dbp > maxDbp) maxDbp = r.dbp;
    if (r.hypertensionScreening === 'มีแนวโน้ม/เสี่ยง' || r.sbp >= 140 || r.dbp >= 90) {
      hypertensionRiskCount++;
    }

    // Blood Sugar
    totalBloodSugar += r.bloodSugar;
    if (r.bloodSugar < minBloodSugar) minBloodSugar = r.bloodSugar;
    if (r.bloodSugar > maxBloodSugar) maxBloodSugar = r.bloodSugar;
    if (r.diabetesScreening === 'มีแนวโน้ม/เสี่ยง' || r.bloodSugar >= 126) {
      diabetesRiskCount++;
    }

    // Risk
    totalRiskScore += r.riskScore;
    if (r.riskLevel === 'สูง') highRiskCount++;
    else if (r.riskLevel === 'ปานกลาง') moderateRiskCount++;
    else lowRiskCount++;

    // Gender
    if (r.gender === 'ชาย') maleCount++;
    else if (r.gender === 'หญิง') femaleCount++;

    // Behaviors
    if (r.smoking === 'สูบ') smokerCount++;
    if (r.alcohol === 'ดื่ม') drinkerCount++;
    if (r.exercise === 'สม่ำเสมอ') regularExerciseCount++;
    if (r.exercise === 'ไม่ออกกำลังกาย') noExerciseCount++;
  }

  return {
    totalCount: n,
    avgBmi: Number((totalBmi / n).toFixed(1)),
    minBmi: Number(minBmi.toFixed(1)),
    maxBmi: Number(maxBmi.toFixed(1)),
    normalBmiCount,
    normalBmiPercent: Number(((normalBmiCount / n) * 100).toFixed(1)),
    obeseCount,
    obesePercent: Number(((obeseCount / n) * 100).toFixed(1)),

    avgSbp: Math.round(totalSbp / n),
    avgDbp: Math.round(totalDbp / n),
    minSbp,
    maxSbp,
    minDbp,
    maxDbp,
    hypertensionRiskCount,
    hypertensionRiskPercent: Number(((hypertensionRiskCount / n) * 100).toFixed(1)),

    avgBloodSugar: Math.round(totalBloodSugar / n),
    minBloodSugar,
    maxBloodSugar,
    diabetesRiskCount,
    diabetesRiskPercent: Number(((diabetesRiskCount / n) * 100).toFixed(1)),

    highRiskCount,
    highRiskPercent: Number(((highRiskCount / n) * 100).toFixed(1)),
    moderateRiskCount,
    moderateRiskPercent: Number(((moderateRiskCount / n) * 100).toFixed(1)),
    lowRiskCount,
    lowRiskPercent: Number(((lowRiskCount / n) * 100).toFixed(1)),
    avgRiskScore: Number((totalRiskScore / n).toFixed(1)),

    maleCount,
    femaleCount,
    maleRatio: Number(((maleCount / n) * 100).toFixed(1)),
    femaleRatio: Number(((femaleCount / n) * 100).toFixed(1)),

    smokerCount,
    smokerPercent: Number(((smokerCount / n) * 100).toFixed(1)),
    drinkerCount,
    drinkerPercent: Number(((drinkerCount / n) * 100).toFixed(1)),
    regularExerciseCount,
    regularExercisePercent: Number(((regularExerciseCount / n) * 100).toFixed(1)),
    noExerciseCount,
    noExercisePercent: Number(((noExerciseCount / n) * 100).toFixed(1))
  };
}

export function getBmiCategory(bmi: number): { label: string; color: string; bg: string; border: string } {
  if (bmi < 18.5) return { label: 'น้ำหนักน้อย', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
  if (bmi <= 22.9) return { label: 'สมส่วน/ปกติ', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
  if (bmi <= 24.9) return { label: 'น้ำหนักเกิน (ท้วม)', color: 'text-yellow-800', bg: 'bg-yellow-50', border: 'border-yellow-200' };
  return { label: 'ภาวะอ้วน (เสี่ยง)', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' };
}

export function getBloodPressureCategory(sbp: number, dbp: number): { label: string; color: string; bg: string } {
  if (sbp >= 140 || dbp >= 90) return { label: 'ความดันสูง (เสี่ยง)', color: 'text-rose-700', bg: 'bg-rose-50' };
  if (sbp >= 120 || dbp >= 80) return { label: 'มีแนวโน้มเสี่ยง', color: 'text-amber-800', bg: 'bg-amber-50' };
  return { label: 'ปกติ', color: 'text-emerald-700', bg: 'bg-emerald-50' };
}

export function getBloodSugarCategory(sugar: number): { label: string; color: string; bg: string } {
  if (sugar >= 126) return { label: 'เบาหวาน (เสี่ยงสูง)', color: 'text-rose-700', bg: 'bg-rose-50' };
  if (sugar >= 100) return { label: 'เริ่มเสี่ยงเบาหวาน', color: 'text-amber-800', bg: 'bg-amber-50' };
  return { label: 'ปกติ (<100)', color: 'text-emerald-700', bg: 'bg-emerald-50' };
}

export function getRiskLevelBadge(level: string): { label: string; color: string; bg: string; dotColor: string } {
  if (level === 'สูง') return { label: 'เสี่ยงสูง', color: 'text-rose-800', bg: 'bg-rose-100/90 border-rose-300', dotColor: 'bg-rose-500' };
  if (level === 'ปานกลาง') return { label: 'เสี่ยงปานกลาง', color: 'text-amber-800', bg: 'bg-amber-100/90 border-amber-300', dotColor: 'bg-amber-500' };
  return { label: 'เสี่ยงต่ำ', color: 'text-emerald-800', bg: 'bg-emerald-100/90 border-emerald-300', dotColor: 'bg-emerald-500' };
}
