import React from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { ShieldAlert, Info } from 'lucide-react';
import { HealthRecord } from '../types/health';

interface RiskAnalysisProps {
  records: HealthRecord[];
}

export const RiskAnalysisSection: React.FC<RiskAnalysisProps> = ({ records }) => {
  // Field 1: Blood Pressure Classification (SBP/DBP)
  let bpNormal = 0;
  let bpPre = 0;
  let bpHyper = 0;

  // Field 2: Blood Sugar Classification
  let sugarNormal = 0;
  let sugarPre = 0;
  let sugarDiabetes = 0;

  // Field 3: BMI Classification
  let bmiUnderweight = 0;
  let bmiNormal = 0;
  let bmiOverweight = 0;
  let bmiObese = 0;

  // Field 4: Risk Score Distribution (0 to 7)
  const scoreCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };

  // Field 5: Screening Outcome (เบาหวาน & ความดันโลหิตสูง)
  let bothRisk = 0;
  let htOnly = 0;
  let dmOnly = 0;
  let neitherRisk = 0;

  records.forEach(r => {
    // BP
    if (r.sbp >= 140 || r.dbp >= 90) bpHyper++;
    else if (r.sbp >= 120 || r.dbp >= 80) bpPre++;
    else bpNormal++;

    // Blood Sugar
    if (r.bloodSugar >= 126) sugarDiabetes++;
    else if (r.bloodSugar >= 100) sugarPre++;
    else sugarNormal++;

    // BMI
    if (r.bmi < 18.5) bmiUnderweight++;
    else if (r.bmi <= 22.9) bmiNormal++;
    else if (r.bmi <= 24.9) bmiOverweight++;
    else bmiObese++;

    // Score
    const s = Math.min(Math.max(r.riskScore, 0), 7);
    scoreCounts[s] = (scoreCounts[s] || 0) + 1;

    // Dual screening
    const hasDM = r.diabetesScreening === 'มีแนวโน้ม/เสี่ยง' || r.bloodSugar >= 126;
    const hasHT = r.hypertensionScreening === 'มีแนวโน้ม/เสี่ยง' || r.sbp >= 140;

    if (hasDM && hasHT) bothRisk++;
    else if (hasHT) htOnly++;
    else if (hasDM) dmOnly++;
    else neitherRisk++;
  });

  const total = records.length || 1;

  // Data for Charts
  const bpData = [
    { name: 'ปกติ (<120/<80)', count: bpNormal, percent: Math.round((bpNormal / total) * 100), color: '#3E7B52' },
    { name: 'เริ่มเสี่ยง (120-139)', count: bpPre, percent: Math.round((bpPre / total) * 100), color: '#D99B26' },
    { name: 'ความดันสูง (≥140)', count: bpHyper, percent: Math.round((bpHyper / total) * 100), color: '#C53030' },
  ];

  const sugarData = [
    { name: 'ปกติ (<100)', count: sugarNormal, percent: Math.round((sugarNormal / total) * 100), color: '#3E7B52' },
    { name: 'เสี่ยงเบาหวาน (100-125)', count: sugarPre, percent: Math.round((sugarPre / total) * 100), color: '#D99B26' },
    { name: 'เบาหวาน (≥126)', count: sugarDiabetes, percent: Math.round((sugarDiabetes / total) * 100), color: '#C53030' },
  ];

  const bmiData = [
    { name: 'ผอม (<18.5)', count: bmiUnderweight, percent: Math.round((bmiUnderweight / total) * 100), color: '#688972' },
    { name: 'ปกติ (18.5-22.9)', count: bmiNormal, percent: Math.round((bmiNormal / total) * 100), color: '#3E7B52' },
    { name: 'ท้วม (23-24.9)', count: bmiOverweight, percent: Math.round((bmiOverweight / total) * 100), color: '#D99B26' },
    { name: 'อ้วน (≥25.0)', count: bmiObese, percent: Math.round((bmiObese / total) * 100), color: '#C53030' },
  ];

  const scoreData = Object.keys(scoreCounts).map(score => ({
    score: `${score} คะแนน`,
    count: scoreCounts[Number(score)],
    category: Number(score) >= 4 ? 'เสี่ยงสูง' : Number(score) >= 2 ? 'เสี่ยงปานกลาง' : 'เสี่ยงต่ำ',
    fillColor: Number(score) >= 4 ? '#C53030' : Number(score) >= 2 ? '#D99B26' : '#3E7B52'
  }));

  const dualRiskData = [
    { name: 'ปกติทั้ง 2 โรค', value: neitherRisk, color: '#3E7B52' },
    { name: 'เสี่ยงความดันอย่างเดียว', value: htOnly, color: '#D97706' },
    { name: 'เสี่ยงเบาหวานอย่างเดียว', value: dmOnly, color: '#E11D48' },
    { name: 'เสี่ยงทั้งเบาหวานและความดัน', value: bothRisk, color: '#991B1B' },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-[#FAFBF9] border border-[#DEE7DD] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#1E3023] flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#375E40]" />
            <span>การวิเคราะห์ความเสี่ยงสุขภาพ 4 มิติหลัก (Health Risk Analytics)</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#506857] mt-0.5">
            จำแนกตามมาตรฐานทางการแพทย์: ค่าความดันโลหิต, ระดับน้ำตาลในเลือด, ดัชนีมวลกาย และคะแนนความเสี่ยงสะสม
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#4F6A56] bg-white px-3 py-1.5 rounded-lg border border-[#D5E1D3]">
          <Info className="w-3.5 h-3.5 text-[#3D6646]" />
          <span>ประมวลผลจากข้อมูล {records.length} รายการ</span>
        </div>
      </div>

      {/* Grid of Risk Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Field 1: Blood Pressure Risk */}
        <div className="bg-white rounded-xl border border-[#DCE6DA] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-[#EDF3EC] pb-3">
            <div>
              <h4 className="font-bold text-[#1E3023] text-sm sm:text-base">1. การกระจายตัวระดับความดันโลหิต (Blood Pressure)</h4>
              <span className="text-xs text-[#5C7463]">เกณฑ์ SBP/DBP มิลลิเมตรปรอท</span>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-[#F3F7F2] text-[#34553E] border border-[#D5E1D3]">
              พบความดันสูง {Math.round((bpHyper / total) * 100)}%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bpData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EFE6" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#3E5745' }} interval={0} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#5C7463' }} />
                <Tooltip
                  formatter={(val: any, _name: any, item: any) => [`${val} ราย (${item.payload.percent}%)`, 'จำนวน']}
                  contentStyle={{ backgroundColor: '#FCFDFC', borderColor: '#CCDCCB', borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {bpData.map((entry, index) => (
                    <Cell key={`bp-cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-[#EDF3EC] text-center text-xs">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100">
              <span className="block font-bold text-sm">{bpNormal} ราย</span>
              <span>ปกติ</span>
            </div>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-100">
              <span className="block font-bold text-sm">{bpPre} ราย</span>
              <span>เริ่มเสี่ยง</span>
            </div>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-100">
              <span className="block font-bold text-sm">{bpHyper} ราย</span>
              <span>ความดันสูง</span>
            </div>
          </div>
        </div>

        {/* Field 2: Blood Sugar Risk */}
        <div className="bg-white rounded-xl border border-[#DCE6DA] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-[#EDF3EC] pb-3">
            <div>
              <h4 className="font-bold text-[#1E3023] text-sm sm:text-base">2. ระดับน้ำตาลในเลือด (Fasting Blood Sugar)</h4>
              <span className="text-xs text-[#5C7463]">เกณฑ์วินิจฉัยความเสี่ยงเบาหวาน (mg/dL)</span>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-[#F3F7F2] text-[#34553E] border border-[#D5E1D3]">
              กลุ่มเสี่ยงเบาหวาน {Math.round(((sugarPre + sugarDiabetes) / total) * 100)}%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sugarData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EFE6" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#3E5745' }} interval={0} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#5C7463' }} />
                <Tooltip
                  formatter={(val: any, _name: any, item: any) => [`${val} ราย (${item.payload.percent}%)`, 'จำนวน']}
                  contentStyle={{ backgroundColor: '#FCFDFC', borderColor: '#CCDCCB', borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {sugarData.map((entry, index) => (
                    <Cell key={`sugar-cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-[#EDF3EC] text-center text-xs">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100">
              <span className="block font-bold text-sm">{sugarNormal} ราย</span>
              <span>ปกติ (&lt;100)</span>
            </div>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-100">
              <span className="block font-bold text-sm">{sugarPre} ราย</span>
              <span>เสี่ยง (100-125)</span>
            </div>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-100">
              <span className="block font-bold text-sm">{sugarDiabetes} ราย</span>
              <span>เบาหวาน (≥126)</span>
            </div>
          </div>
        </div>

        {/* Field 3: BMI Classification */}
        <div className="bg-white rounded-xl border border-[#DCE6DA] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-[#EDF3EC] pb-3">
            <div>
              <h4 className="font-bold text-[#1E3023] text-sm sm:text-base">3. ภาวะโภชนาการและดัชนีมวลกาย (BMI Categories)</h4>
              <span className="text-xs text-[#5C7463]">เกณฑ์มาตรฐานประชากรเอเชีย (กก./ตร.ม.)</span>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-[#F3F7F2] text-[#34553E] border border-[#D5E1D3]">
              ภาวะอ้วน {Math.round((bmiObese / total) * 100)}%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bmiData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EFE6" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#3E5745' }} interval={0} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#5C7463' }} />
                <Tooltip
                  formatter={(val: any, _name: any, item: any) => [`${val} ราย (${item.payload.percent}%)`, 'จำนวน']}
                  contentStyle={{ backgroundColor: '#FCFDFC', borderColor: '#CCDCCB', borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {bmiData.map((entry, index) => (
                    <Cell key={`bmi-cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-2 pt-2 border-t border-[#EDF3EC] text-center text-xs">
            <div className="p-1 rounded-lg bg-gray-50 text-gray-700 border border-gray-200">
              <span className="block font-bold text-sm">{bmiUnderweight}</span>
              <span>ผอม</span>
            </div>
            <div className="p-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100">
              <span className="block font-bold text-sm">{bmiNormal}</span>
              <span>สมส่วน</span>
            </div>
            <div className="p-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-100">
              <span className="block font-bold text-sm">{bmiOverweight}</span>
              <span>ท้วม</span>
            </div>
            <div className="p-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-100">
              <span className="block font-bold text-sm">{bmiObese}</span>
              <span>อ้วน</span>
            </div>
          </div>
        </div>

        {/* Field 4 & 5: Combined Risk Scores & Dual-Condition Comorbidity */}
        <div className="bg-white rounded-xl border border-[#DCE6DA] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-[#EDF3EC] pb-3">
            <div>
              <h4 className="font-bold text-[#1E3023] text-sm sm:text-base">4. ภาวะเสี่ยงร่วม (เบาหวาน + ความดันโลหิตสูง)</h4>
              <span className="text-xs text-[#5C7463]">สัดส่วนการเกิดโรคร่วมในกลุ่มประชากร</span>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-rose-50 text-rose-700 border border-rose-200">
              เสี่ยงคู่ {Math.round((bothRisk / total) * 100)}%
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 h-64">
            <div className="w-full sm:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dualRiskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {dualRiskData.map((entry, index) => (
                      <Cell key={`dual-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val} ราย (${Math.round((Number(val) / total) * 100)}%)`, 'จำนวน']}
                    contentStyle={{ backgroundColor: '#FCFDFC', borderColor: '#CCDCCB', borderRadius: 8, fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full sm:w-1/2 space-y-2 text-xs">
              {dualRiskData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAF7] border border-[#E3EDE1]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                    <span className="text-[#2B4332] font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-[#1F3325]">
                    {item.value} ราย <span className="text-[11px] font-normal text-[#607968]">({Math.round((item.value / total) * 100)}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-[#EDF3EC] text-xs text-[#546E5B] flex items-center justify-between">
            <span>กลุ่มที่ต้องการการดูแลเร่งด่วน:</span>
            <span className="font-bold text-rose-700">เสี่ยงทั้งสองโรค {bothRisk} ราย</span>
          </div>
        </div>

      </div>

      {/* Cumulative Risk Score Breakdown (0 to 7) */}
      <div className="bg-white rounded-xl border border-[#DCE6DA] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-[#EDF3EC] pb-3">
          <div>
            <h4 className="font-bold text-[#1E3023] text-sm sm:text-base">
              คะแนนความเสี่ยงสุขภาพสะสม (Risk Score 0 - 7 คะแนน)
            </h4>
            <span className="text-xs text-[#5C7463]">
              คำนวณจากอายุ, BMI, ความดัน, น้ำตาล และพฤติกรรมเสี่ยง
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#3E7B52]"></span>เสี่ยงต่ำ (0-1)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#D99B26]"></span>เสี่ยงปานกลาง (2-3)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#C53030]"></span>เสี่ยงสูง (4-7)</span>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scoreData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EFE6" />
              <XAxis dataKey="score" tick={{ fontSize: 12, fill: '#3E5745' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#5C7463' }} />
              <Tooltip
                formatter={(val: any, _name: any, item: any) => [`${val} ราย (ระดับ: ${item.payload.category})`, 'จำนวนประชากร']}
                contentStyle={{ backgroundColor: '#FCFDFC', borderColor: '#CCDCCB', borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {scoreData.map((entry, index) => (
                  <Cell key={`score-cell-${index}`} fill={entry.fillColor} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
