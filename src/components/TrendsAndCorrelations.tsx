import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, ReferenceLine
} from 'recharts';
import { TrendingUp, GitCommit, AlertCircle } from 'lucide-react';
import { HealthRecord } from '../types/health';

interface TrendsAndCorrelationsProps {
  records: HealthRecord[];
}

export const TrendsAndCorrelations: React.FC<TrendsAndCorrelationsProps> = ({ records }) => {
  const [activeTrendView, setActiveTrendView] = useState<'age' | 'month'>('age');

  // Trend 1 & 2: By Age Group
  const ageGroups = [
    { label: '< 35 ปี', filter: (r: HealthRecord) => r.age < 35 },
    { label: '35 - 50 ปี', filter: (r: HealthRecord) => r.age >= 35 && r.age <= 50 },
    { label: '51 - 60 ปี', filter: (r: HealthRecord) => r.age >= 51 && r.age <= 60 },
    { label: '> 60 ปี', filter: (r: HealthRecord) => r.age > 60 },
  ];

  interface TrendPoint {
    label: string;
    avgSbp: number;
    avgDbp: number;
    avgSugar: number;
    avgBmi: number;
    count: number;
  }

  const trendByAgeData: TrendPoint[] = ageGroups.map(group => {
    const matched = records.filter(group.filter);
    if (matched.length === 0) {
      return { label: group.label, avgSbp: 0, avgDbp: 0, avgSugar: 0, avgBmi: 0, count: 0 };
    }
    const totalSbp = matched.reduce((sum, r) => sum + r.sbp, 0);
    const totalDbp = matched.reduce((sum, r) => sum + r.dbp, 0);
    const totalSugar = matched.reduce((sum, r) => sum + r.bloodSugar, 0);
    const totalBmi = matched.reduce((sum, r) => sum + r.bmi, 0);

    return {
      label: group.label,
      avgSbp: Math.round(totalSbp / matched.length),
      avgDbp: Math.round(totalDbp / matched.length),
      avgSugar: Math.round(totalSugar / matched.length),
      avgBmi: Number((totalBmi / matched.length).toFixed(1)),
      count: matched.length
    };
  });

  // Trend 1 & 2: By Month (2026-01, 2026-02, 2026-03)
  const monthLabels: Record<string, string> = {
    '2026-01': 'ม.ค. 2026',
    '2026-02': 'ก.พ. 2026',
    '2026-03': 'มี.ค. 2026'
  };

  const months = ['2026-01', '2026-02', '2026-03'];
  const trendByMonthData: TrendPoint[] = months.map(m => {
    const matched = records.filter(r => r.month === m);
    if (matched.length === 0) {
      return { label: monthLabels[m] || m, avgSbp: 0, avgDbp: 0, avgSugar: 0, avgBmi: 0, count: 0 };
    }
    const totalSbp = matched.reduce((sum, r) => sum + r.sbp, 0);
    const totalDbp = matched.reduce((sum, r) => sum + r.dbp, 0);
    const totalSugar = matched.reduce((sum, r) => sum + r.bloodSugar, 0);
    const totalBmi = matched.reduce((sum, r) => sum + r.bmi, 0);

    return {
      label: monthLabels[m] || m,
      avgSbp: Math.round(totalSbp / matched.length),
      avgDbp: Math.round(totalDbp / matched.length),
      avgSugar: Math.round(totalSugar / matched.length),
      avgBmi: Number((totalBmi / matched.length).toFixed(1)),
      count: matched.length
    };
  });

  const activeTrendData = activeTrendView === 'age' ? trendByAgeData : trendByMonthData;

  // Correlation: BMI vs Blood Sugar
  const bmiSugarScatter = records.map(r => ({
    id: r.id,
    bmi: r.bmi,
    bloodSugar: r.bloodSugar,
    age: r.age,
    riskLevel: r.riskLevel,
    color: r.riskLevel === 'สูง' ? '#C53030' : r.riskLevel === 'ปานกลาง' ? '#D99B26' : '#3E7B52'
  }));

  // Correlation: BMI vs SBP
  const bmiSbpScatter = records.map(r => ({
    id: r.id,
    bmi: r.bmi,
    sbp: r.sbp,
    age: r.age,
    riskLevel: r.riskLevel,
    color: r.riskLevel === 'สูง' ? '#C53030' : r.riskLevel === 'ปานกลาง' ? '#D99B26' : '#3E7B52'
  }));

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#FAFBF9] border border-[#DEE7DD] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#1E3023] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#375E40]" />
            <span>แนวโน้มสุขภาพและความสัมพันธ์เชิงสถิติ (Health Trends & Correlations)</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#506857] mt-0.5">
            วิเคราะห์แนวโน้มความดัน/น้ำตาล และความสัมพันธ์ระหว่างดัชนีมวลกาย (BMI) กับปัจจัยเสี่ยง NCDs
          </p>
        </div>

        {/* View Toggle */}
        <div className="inline-flex bg-[#EEF4EC] p-1 rounded-lg border border-[#D5E1D3] text-xs font-medium self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTrendView('age')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTrendView === 'age'
                ? 'bg-white text-[#223927] shadow-xs font-semibold'
                : 'text-[#58735F] hover:text-[#1E3324]'
            }`}
          >
            จำแนกตามช่วงอายุ
          </button>
          <button
            type="button"
            onClick={() => setActiveTrendView('month')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTrendView === 'month'
                ? 'bg-white text-[#223927] shadow-xs font-semibold'
                : 'text-[#58735F] hover:text-[#1E3324]'
            }`}
          >
            จำแนกตามเดือน (ไตรมาส 1)
          </button>
        </div>
      </div>

      {/* Health Trend 1 & 2: Line Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Trend 1: Blood Pressure Trend */}
        <div className="bg-white rounded-xl border border-[#DCE6DA] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-[#EDF3EC] pb-2.5">
            <div>
              <h4 className="font-bold text-[#1E3023] text-sm sm:text-base">
                แนวโน้มความดันโลหิต ({activeTrendView === 'age' ? 'ตามช่วงอายุ' : 'ตามเดือน'})
              </h4>
              <span className="text-xs text-[#5C7463]">ค่าเฉลี่ย SBP และ DBP (mmHg)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-[#C53030]"></span> SBP</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-[#3B82F6]"></span> DBP</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={activeTrendData}
                margin={{ top: 15, right: 20, left: -10, bottom: 15 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EFE6" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#3E5745' }} />
                <YAxis domain={[60, 170]} tick={{ fontSize: 11, fill: '#5C7463' }} />
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} mmHg`, name === 'avgSbp' ? 'ค่าเฉลี่ย SBP' : 'ค่าเฉลี่ย DBP']}
                  contentStyle={{ backgroundColor: '#FCFDFC', borderColor: '#CCDCCB', borderRadius: 8, fontSize: 12 }}
                />
                <ReferenceLine y={140} stroke="#E11D48" strokeDasharray="3 3" label={{ value: 'เกณฑ์ความดันสูง (140)', fill: '#C53030', fontSize: 10, position: 'insideTopRight' }} />
                <Line type="monotone" dataKey="avgSbp" stroke="#C53030" strokeWidth={3} dot={{ r: 4, fill: '#C53030' }} name="avgSbp" />
                {activeTrendView === 'age' && (
                  <Line type="monotone" dataKey="avgDbp" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3, fill: '#3B82F6' }} name="avgDbp" />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 text-xs text-[#526B58] bg-[#F7FAF6] p-2.5 rounded-lg border border-[#E3EDE1]">
            💡 <strong>ข้อสังเกตเวชระเบียน:</strong> ค่าความดันโลหิตตัวบน (SBP) มีแนวโน้มสูงขึ้นอย่างเด่นชัดตามอายุ โดยกลุ่มอายุเกิน 60 ปี มีค่าเฉลี่ยความดันสูงกว่า 150 mmHg
          </div>
        </div>

        {/* Trend 2: Blood Sugar Trend */}
        <div className="bg-white rounded-xl border border-[#DCE6DA] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-[#EDF3EC] pb-2.5">
            <div>
              <h4 className="font-bold text-[#1E3023] text-sm sm:text-base">
                แนวโน้มระดับน้ำตาลในเลือด ({activeTrendView === 'age' ? 'ตามช่วงอายุ' : 'ตามเดือน'})
              </h4>
              <span className="text-xs text-[#5C7463]">ค่าเฉลี่ย FBS (mg/dL)</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-md font-medium bg-amber-50 text-amber-800 border border-amber-200">
              เกณฑ์ปกติ &lt; 100
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={activeTrendData}
                margin={{ top: 15, right: 20, left: -10, bottom: 15 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EFE6" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#3E5745' }} />
                <YAxis domain={[70, 160]} tick={{ fontSize: 11, fill: '#5C7463' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} mg/dL`, 'ค่าน้ำตาลเฉลี่ย']}
                  contentStyle={{ backgroundColor: '#FCFDFC', borderColor: '#CCDCCB', borderRadius: 8, fontSize: 12 }}
                />
                <ReferenceLine y={100} stroke="#D99B26" strokeDasharray="3 3" label={{ value: 'เริ่มเสี่ยง (100)', fill: '#B45309', fontSize: 10, position: 'insideTopLeft' }} />
                <ReferenceLine y={126} stroke="#C53030" strokeDasharray="3 3" label={{ value: 'เบาหวาน (126)', fill: '#C53030', fontSize: 10, position: 'insideTopRight' }} />
                <Line type="monotone" dataKey="avgSugar" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, fill: '#2563EB' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 text-xs text-[#526B58] bg-[#F7FAF6] p-2.5 rounded-lg border border-[#E3EDE1]">
            💡 <strong>ข้อสังเกตเวชระเบียน:</strong> ผู้รับการคัดกรองวัย 51 ปีขึ้นไป มีค่าน้ำตาลในเลือดเฉลี่ยเกิน 120-145 mg/dL ซึ่งอยู่ในเกณฑ์เสี่ยงสูงต่อโรคเบาหวาน
          </div>
        </div>

      </div>

      {/* Correlation Section: BMI vs Sugar & BMI vs BP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Correlation 1: BMI vs Blood Sugar */}
        <div className="bg-white rounded-xl border border-[#DCE6DA] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-[#EDF3EC] pb-2.5">
            <div>
              <h4 className="font-bold text-[#1E3023] text-sm sm:text-base">
                ความสัมพันธ์ระหว่าง BMI กับระดับน้ำตาล (BMI vs Blood Sugar)
              </h4>
              <span className="text-xs text-[#5C7463]">แกน X: BMI (kg/m²) | แกน Y: น้ำตาล (mg/dL)</span>
            </div>
            <span className="text-xs text-[#3E6548] font-medium flex items-center gap-1">
              <GitCommit className="w-3.5 h-3.5" /> สหสัมพันธ์บวกเด่นชัด
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 15, right: 20, bottom: 15, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EFE6" />
                <XAxis type="number" dataKey="bmi" name="BMI" domain={[18, 34]} unit=" kg/m²" tick={{ fontSize: 11, fill: '#3E5745' }} />
                <YAxis type="number" dataKey="bloodSugar" name="น้ำตาล" domain={[70, 180]} unit=" mg/dL" tick={{ fontSize: 11, fill: '#5C7463' }} />
                <ZAxis range={[50, 50]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2.5 rounded-lg border border-[#CCDCCB] shadow-md text-xs space-y-1">
                          <p className="font-bold text-[#1F3325]">รหัสบุคคล: {data.id} (อายุ {data.age} ปี)</p>
                          <p className="text-[#3A5642]">BMI: <strong className="text-[#1F3325]">{data.bmi} kg/m²</strong></p>
                          <p className="text-[#3A5642]">น้ำตาล: <strong className="text-rose-700">{data.bloodSugar} mg/dL</strong></p>
                          <p className="text-[11px] text-[#617B69]">ระดับความเสี่ยง: <strong style={{ color: data.color }}>{data.riskLevel}</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine x={25} stroke="#EAB308" strokeDasharray="3 3" label={{ value: 'เกณฑ์อ้วน BMI 25', fill: '#CA8A04', fontSize: 10, position: 'insideBottomRight' }} />
                <ReferenceLine y={126} stroke="#E11D48" strokeDasharray="3 3" label={{ value: 'เบาหวาน 126', fill: '#C53030', fontSize: 10, position: 'insideTopLeft' }} />
                <Scatter name="BMI vs Blood Sugar" data={bmiSugarScatter} fill="#3E7B52" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 text-xs text-[#526B58] bg-[#F7FAF6] p-2.5 rounded-lg border border-[#E3EDE1]">
            📊 <strong>ผลการวิเคราะห์:</strong> ผู้ที่มีค่า BMI สูงกว่า 28 kg/m² เกือบทั้งหมดมีระดับน้ำตาลเกิน 125 mg/dL บ่งชี้ความเสี่ยงภาวะดื้ออินซูลินจากความอ้วน
          </div>
        </div>

        {/* Correlation 2: BMI vs Systolic BP */}
        <div className="bg-white rounded-xl border border-[#DCE6DA] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-[#EDF3EC] pb-2.5">
            <div>
              <h4 className="font-bold text-[#1E3023] text-sm sm:text-base">
                ความสัมพันธ์ระหว่าง BMI กับความดัน (BMI vs Systolic BP)
              </h4>
              <span className="text-xs text-[#5C7463]">แกน X: BMI (kg/m²) | แกน Y: SBP (mmHg)</span>
            </div>
            <span className="text-xs text-[#3E6548] font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> กลุ่มเสี่ยงกระจุกตัวในคนอ้วน
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 15, right: 20, bottom: 15, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EFE6" />
                <XAxis type="number" dataKey="bmi" name="BMI" domain={[18, 34]} unit=" kg/m²" tick={{ fontSize: 11, fill: '#3E5745' }} />
                <YAxis type="number" dataKey="sbp" name="SBP" domain={[90, 180]} unit=" mmHg" tick={{ fontSize: 11, fill: '#5C7463' }} />
                <ZAxis range={[50, 50]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2.5 rounded-lg border border-[#CCDCCB] shadow-md text-xs space-y-1">
                          <p className="font-bold text-[#1F3325]">รหัสบุคคล: {data.id} (อายุ {data.age} ปี)</p>
                          <p className="text-[#3A5642]">BMI: <strong className="text-[#1F3325]">{data.bmi} kg/m²</strong></p>
                          <p className="text-[#3A5642]">SBP: <strong className="text-rose-700">{data.sbp} mmHg</strong></p>
                          <p className="text-[11px] text-[#617B69]">ระดับความเสี่ยง: <strong style={{ color: data.color }}>{data.riskLevel}</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine x={25} stroke="#EAB308" strokeDasharray="3 3" label={{ value: 'เกณฑ์อ้วน BMI 25', fill: '#CA8A04', fontSize: 10, position: 'insideBottomRight' }} />
                <ReferenceLine y={140} stroke="#E11D48" strokeDasharray="3 3" label={{ value: 'ความดันสูง 140', fill: '#C53030', fontSize: 10, position: 'insideTopLeft' }} />
                <Scatter name="BMI vs SBP" data={bmiSbpScatter} fill="#4F772D" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 text-xs text-[#526B58] bg-[#F7FAF6] p-2.5 rounded-lg border border-[#E3EDE1]">
            📊 <strong>ผลการวิเคราะห์:</strong> ผู้ที่ BMI เกิน 28 kg/m² มีค่า SBP สูงเกิน 140 mmHg คิดเป็นสัดส่วนกว่า 85% ของกลุ่มน้ำหนักเกิน
          </div>
        </div>

      </div>

    </div>
  );
};
