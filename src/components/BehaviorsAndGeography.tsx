import React from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { HeartPulse, MapPin, Users, Cigarette, Wine, Dumbbell } from 'lucide-react';
import { HealthRecord } from '../types/health';

interface BehaviorsAndGeographyProps {
  records: HealthRecord[];
}

export const BehaviorsAndGeography: React.FC<BehaviorsAndGeographyProps> = ({ records }) => {
  const total = records.length || 1;

  // Field 1: Smoking
  const smokerRecords = records.filter(r => r.smoking === 'สูบ');
  const nonSmokerRecords = records.filter(r => r.smoking === 'ไม่สูบ');
  const smokerHighRisk = smokerRecords.filter(r => r.riskLevel === 'สูง').length;
  const nonSmokerHighRisk = nonSmokerRecords.filter(r => r.riskLevel === 'สูง').length;

  const smokingData = [
    { name: 'ไม่สูบบุหรี่', count: nonSmokerRecords.length, highRisk: nonSmokerHighRisk, color: '#3E7B52' },
    { name: 'สูบบุหรี่', count: smokerRecords.length, highRisk: smokerHighRisk, color: '#C53030' },
  ];

  // Field 2: Alcohol
  const drinkerRecords = records.filter(r => r.alcohol === 'ดื่ม');
  const nonDrinkerRecords = records.filter(r => r.alcohol === 'ไม่ดื่ม');
  const drinkerHighRisk = drinkerRecords.filter(r => r.riskLevel === 'สูง').length;
  const nonDrinkerHighRisk = nonDrinkerRecords.filter(r => r.riskLevel === 'สูง').length;

  const alcoholData = [
    { name: 'ไม่ดื่มแอลกอฮอล์', count: nonDrinkerRecords.length, highRisk: nonDrinkerHighRisk, color: '#3E7B52' },
    { name: 'ดื่มแอลกอฮอล์', count: drinkerRecords.length, highRisk: drinkerHighRisk, color: '#D99B26' },
  ];

  // Field 3: Exercise
  const exerciseRegular = records.filter(r => r.exercise === 'สม่ำเสมอ');
  const exerciseSometimes = records.filter(r => r.exercise === 'บางครั้ง');
  const exerciseNone = records.filter(r => r.exercise === 'ไม่ออกกำลังกาย');

  const exerciseData = [
    { name: 'สม่ำเสมอ', count: exerciseRegular.length, color: '#3E7B52', highRisk: exerciseRegular.filter(r => r.riskLevel === 'สูง').length },
    { name: 'บางครั้ง', count: exerciseSometimes.length, color: '#D99B26', highRisk: exerciseSometimes.filter(r => r.riskLevel === 'สูง').length },
    { name: 'ไม่ออกกำลังกาย', count: exerciseNone.length, color: '#C53030', highRisk: exerciseNone.filter(r => r.riskLevel === 'สูง').length },
  ];

  // Field 4: Combined Behaviors vs Risk Level (พฤติกรรมกับระดับความเสี่ยง)
  const behaviorRiskMatrix = [
    {
      group: 'สูบ + ดื่ม',
      count: records.filter(r => r.smoking === 'สูบ' && r.alcohol === 'ดื่ม').length,
      highRiskCount: records.filter(r => r.smoking === 'สูบ' && r.alcohol === 'ดื่ม' && r.riskLevel === 'สูง').length,
      avgScore: Number((records.filter(r => r.smoking === 'สูบ' && r.alcohol === 'ดื่ม').reduce((s, r) => s + r.riskScore, 0) / (records.filter(r => r.smoking === 'สูบ' && r.alcohol === 'ดื่ม').length || 1)).toFixed(1))
    },
    {
      group: 'ไม่ออกกำลังกาย',
      count: exerciseNone.length,
      highRiskCount: exerciseNone.filter(r => r.riskLevel === 'สูง').length,
      avgScore: Number((exerciseNone.reduce((s, r) => s + r.riskScore, 0) / (exerciseNone.length || 1)).toFixed(1))
    },
    {
      group: 'ออกกำลังสม่ำเสมอ',
      count: exerciseRegular.length,
      highRiskCount: exerciseRegular.filter(r => r.riskLevel === 'สูง').length,
      avgScore: Number((exerciseRegular.reduce((s, r) => s + r.riskScore, 0) / (exerciseRegular.length || 1)).toFixed(1))
    }
  ];

  // Useful Field: Area Risk Ranking (พื้นที่ที่มีผู้เสี่ยงสูง)
  const areas = Array.from(new Set(records.map(r => r.area)));
  const areaData = areas.map(area => {
    const areaRecords = records.filter(r => r.area === area);
    const highRisk = areaRecords.filter(r => r.riskLevel === 'สูง').length;
    const modRisk = areaRecords.filter(r => r.riskLevel === 'ปานกลาง').length;
    const lowRisk = areaRecords.filter(r => r.riskLevel === 'ต่ำ').length;
    const avgScore = Number((areaRecords.reduce((sum, r) => sum + r.riskScore, 0) / (areaRecords.length || 1)).toFixed(1));

    return {
      area,
      total: areaRecords.length,
      highRisk,
      modRisk,
      lowRisk,
      highRiskPercent: Math.round((highRisk / (areaRecords.length || 1)) * 100),
      avgScore
    };
  }).sort((a, b) => b.highRisk - a.highRisk);

  // Useful Field: High-Risk Age Groups (กลุ่มอายุที่มีความเสี่ยงสูง)
  const ageGroupDefs = [
    { label: '< 35 ปี', filter: (r: HealthRecord) => r.age < 35 },
    { label: '35 - 50 ปี', filter: (r: HealthRecord) => r.age >= 35 && r.age <= 50 },
    { label: '51 - 60 ปี', filter: (r: HealthRecord) => r.age >= 51 && r.age <= 60 },
    { label: '> 60 ปี', filter: (r: HealthRecord) => r.age > 60 },
  ];

  const ageRiskData = ageGroupDefs.map(ag => {
    const matched = records.filter(ag.filter);
    const high = matched.filter(r => r.riskLevel === 'สูง').length;
    const moderate = matched.filter(r => r.riskLevel === 'ปานกลาง').length;
    const low = matched.filter(r => r.riskLevel === 'ต่ำ').length;

    return {
      ageGroup: ag.label,
      total: matched.length,
      highRisk: high,
      moderateRisk: moderate,
      lowRisk: low,
      highRiskPercent: matched.length ? Math.round((high / matched.length) * 100) : 0
    };
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#FAFBF9] border border-[#DEE7DD] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#1E3023] flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-[#375E40]" />
            <span>การวิเคราะห์พฤติกรรมสุขภาพและพื้นที่เสี่ยง (Behaviors & Geographic Hotspots)</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#506857] mt-0.5">
            สำรวจพฤติกรรมการสูบบุหรี่ สุรา กิจกรรมทางกาย ร่วมกับพื้นที่และกลุ่มอายุเพื่อวางแผนเวชระเบียนชุมชน
          </p>
        </div>
      </div>

      {/* Behavior Cards (Smoking, Alcohol, Exercise, Behavior vs Risk) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Behavior 1: Smoking */}
        <div className="bg-white rounded-xl border border-[#DCE6DA] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#EDF3EC] pb-2">
              <span className="font-bold text-[#1E3023] text-sm flex items-center gap-1.5">
                <Cigarette className="w-4 h-4 text-[#8C3434]" /> 1. การสูบบุหรี่
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-medium">
                สูบ {Math.round((smokerRecords.length / total) * 100)}%
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={smokingData}
                    dataKey="count"
                    nameKey="name"
                    innerRadius={35}
                    outerRadius={65}
                    paddingAngle={3}
                  >
                    {smokingData.map((entry, index) => (
                      <Cell key={`smoke-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val} ราย`, 'จำนวน']}
                    contentStyle={{ backgroundColor: '#FCFDFC', borderColor: '#CCDCCB', borderRadius: 8, fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 text-xs mt-2">
              <div className="flex justify-between p-2 rounded-lg bg-[#F8FAF7] border border-[#E3EDE1]">
                <span className="text-[#3A5441]">สูบบุหรี่ ({smokerRecords.length} ราย):</span>
                <span className="font-bold text-rose-700">เสี่ยงสูง {smokerHighRisk} ราย ({Math.round((smokerHighRisk / (smokerRecords.length || 1)) * 100)}%)</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-[#F8FAF7] border border-[#E3EDE1]">
                <span className="text-[#3A5441]">ไม่สูบบุหรี่ ({nonSmokerRecords.length} ราย):</span>
                <span className="font-medium text-[#2E4835]">เสี่ยงสูง {nonSmokerHighRisk} ราย ({Math.round((nonSmokerHighRisk / (nonSmokerRecords.length || 1)) * 100)}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Behavior 2: Alcohol */}
        <div className="bg-white rounded-xl border border-[#DCE6DA] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#EDF3EC] pb-2">
              <span className="font-bold text-[#1E3023] text-sm flex items-center gap-1.5">
                <Wine className="w-4 h-4 text-[#B45309]" /> 2. การดื่มแอลกอฮอล์
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-medium">
                ดื่ม {Math.round((drinkerRecords.length / total) * 100)}%
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={alcoholData}
                    dataKey="count"
                    nameKey="name"
                    innerRadius={35}
                    outerRadius={65}
                    paddingAngle={3}
                  >
                    {alcoholData.map((entry, index) => (
                      <Cell key={`alcohol-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val} ราย`, 'จำนวน']}
                    contentStyle={{ backgroundColor: '#FCFDFC', borderColor: '#CCDCCB', borderRadius: 8, fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 text-xs mt-2">
              <div className="flex justify-between p-2 rounded-lg bg-[#F8FAF7] border border-[#E3EDE1]">
                <span className="text-[#3A5441]">ดื่มแอลกอฮอล์ ({drinkerRecords.length} ราย):</span>
                <span className="font-bold text-amber-700">เสี่ยงสูง {drinkerHighRisk} ราย ({Math.round((drinkerHighRisk / (drinkerRecords.length || 1)) * 100)}%)</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-[#F8FAF7] border border-[#E3EDE1]">
                <span className="text-[#3A5441]">ไม่ดื่ม ({nonDrinkerRecords.length} ราย):</span>
                <span className="font-medium text-[#2E4835]">เสี่ยงสูง {nonDrinkerHighRisk} ราย ({Math.round((nonDrinkerHighRisk / (nonDrinkerRecords.length || 1)) * 100)}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Behavior 3: Exercise Habits */}
        <div className="bg-white rounded-xl border border-[#DCE6DA] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#EDF3EC] pb-2">
              <span className="font-bold text-[#1E3023] text-sm flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-[#375E40]" /> 3. กิจกรรมทางกาย / ออกกำลังกาย
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-medium">
                สม่ำเสมอ {Math.round((exerciseRegular.length / total) * 100)}%
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={exerciseData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EFE6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#3E5745' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#5C7463' }} />
                  <Tooltip
                    formatter={(val: any) => [`${val} ราย`, 'จำนวน']}
                    contentStyle={{ backgroundColor: '#FCFDFC', borderColor: '#CCDCCB', borderRadius: 8, fontSize: 12 }}
                  />
                  <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                    {exerciseData.map((entry, index) => (
                      <Cell key={`ex-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1 text-xs mt-2">
              <div className="flex justify-between p-1.5 rounded-lg bg-emerald-50 text-emerald-900">
                <span>ออกกำลังสม่ำเสมอ ({exerciseRegular.length} คน):</span>
                <span className="font-bold">เสี่ยงสูง 0% (ปลอดภัย)</span>
              </div>
              <div className="flex justify-between p-1.5 rounded-lg bg-rose-50 text-rose-900">
                <span>ไม่ออกกำลังกาย ({exerciseNone.length} คน):</span>
                <span className="font-bold">เสี่ยงสูง {exerciseNone.filter(r => r.riskLevel === 'สูง').length} คน (100%)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Geographic & High-Risk Age Groups Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Geographic Hotspots: Area Ranking */}
        <div className="bg-white rounded-xl border border-[#DCE6DA] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-[#EDF3EC] pb-3">
            <div>
              <h4 className="font-bold text-[#1E3023] text-sm sm:text-base flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#3E6548]" /> พื้นที่ที่มีผู้เสี่ยงสูง (Area Risk Comparison)
              </h4>
              <span className="text-xs text-[#5C7463]">สัดส่วนกลุ่มเสี่ยงสูงและคะแนนความเสี่ยงเฉลี่ยตามพื้นที่</span>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-[#F3F7F2] text-[#2C4834] border border-[#CAD8C8]">
              {areas.length} โซนบริการ
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaData} margin={{ top: 10, right: 15, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EFE6" />
                <XAxis dataKey="area" tick={{ fontSize: 12, fill: '#3E5745' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#5C7463' }} />
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${val} ราย (คะแนนเฉลี่ย: ${item.payload.avgScore})`,
                    name === 'highRisk' ? 'กลุ่มเสี่ยงสูง' : 'กลุ่มเสี่ยงต่ำ/กลาง'
                  ]}
                  contentStyle={{ backgroundColor: '#FCFDFC', borderColor: '#CCDCCB', borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="highRisk" fill="#C53030" name="highRisk" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="modRisk" fill="#D99B26" name="modRisk" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="lowRisk" fill="#3E7B52" name="lowRisk" stackId="a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Area Summary list */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3 pt-3 border-t border-[#EDF3EC] text-center text-xs">
            {areaData.map(a => (
              <div key={a.area} className="p-2 rounded-lg bg-[#F8FAF7] border border-[#E3EDE1]">
                <div className="font-semibold text-[#1F3325]">{a.area}</div>
                <div className="text-rose-700 font-bold mt-0.5">เสี่ยงสูง {a.highRisk}</div>
                <div className="text-[10px] text-[#698471]">เฉลี่ย {a.avgScore} คะแนน</div>
              </div>
            ))}
          </div>
        </div>

        {/* High-Risk Age Groups */}
        <div className="bg-white rounded-xl border border-[#DCE6DA] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-[#EDF3EC] pb-3">
            <div>
              <h4 className="font-bold text-[#1E3023] text-sm sm:text-base flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#3E6548]" /> กลุ่มอายุที่มีความเสี่ยงสูง (High Risk by Age)
              </h4>
              <span className="text-xs text-[#5C7463]">การกระจายระดับความเสี่ยงตามวัย</span>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-rose-50 text-rose-700 border border-rose-200">
              พบสูงสุดในวัย 50+
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageRiskData} margin={{ top: 10, right: 15, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EFE6" />
                <XAxis dataKey="ageGroup" tick={{ fontSize: 12, fill: '#3E5745' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#5C7463' }} />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    `${val} ราย`,
                    name === 'highRisk' ? 'เสี่ยงสูง' : name === 'moderateRisk' ? 'เสี่ยงปานกลาง' : 'เสี่ยงต่ำ'
                  ]}
                  contentStyle={{ backgroundColor: '#FCFDFC', borderColor: '#CCDCCB', borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="highRisk" fill="#C53030" name="highRisk" stackId="b" />
                <Bar dataKey="moderateRisk" fill="#D99B26" name="moderateRisk" stackId="b" />
                <Bar dataKey="lowRisk" fill="#3E7B52" name="lowRisk" stackId="b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-[#EDF3EC] text-xs text-[#526B58] bg-[#F7FAF6] p-2.5 rounded-lg border border-[#E3EDE1]">
            💡 <strong>ผลการคัดกรอง:</strong> ผู้ที่มีอายุเกิน 60 ปี มีสัดส่วนความเสี่ยงสูงมากถึง 100% ของกลุ่ม ในขณะที่กลุ่มอายุน้อยกว่า 35 ปี มีความเสี่ยงต่ำทั้งหมด
          </div>
        </div>

      </div>

      {/* Combined Behavior vs Risk Score Table */}
      <div className="bg-white rounded-xl border border-[#DCE6DA] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-[#EDF3EC] pb-2">
          <h4 className="font-bold text-[#1E3023] text-sm sm:text-base">
            4. ความสัมพันธ์ระหว่างพฤติกรรมกับระดับความเสี่ยง (Behavior Risk Matrix)
          </h4>
          <span className="text-xs text-[#5C7463]">สรุปผลกระทบจากพฤติกรรมต่อคะแนนความเสี่ยง</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#F5F8F4] text-[#34523C] border-b border-[#D8E4D6]">
                <th className="py-2.5 px-3 font-semibold">กลุ่มพฤติกรรม</th>
                <th className="py-2.5 px-3 font-semibold text-center">จำนวนประชากร</th>
                <th className="py-2.5 px-3 font-semibold text-center">จำนวนเสี่ยงสูง</th>
                <th className="py-2.5 px-3 font-semibold text-center">อัตราส่วนเสี่ยงสูง</th>
                <th className="py-2.5 px-3 font-semibold text-center">คะแนนเสี่ยงเฉลี่ย</th>
                <th className="py-2.5 px-3 font-semibold">ข้อเสนอแนะทางเวชระเบียน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF4ED]">
              {behaviorRiskMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#FAFBF9]">
                  <td className="py-2.5 px-3 font-medium text-[#1E3023]">{item.group}</td>
                  <td className="py-2.5 px-3 text-center">{item.count} คน</td>
                  <td className="py-2.5 px-3 text-center font-bold text-rose-700">{item.highRiskCount} คน</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      {Math.round((item.highRiskCount / (item.count || 1)) * 100)}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-[#2A4432]">{item.avgScore} / 7</td>
                  <td className="py-2.5 px-3 text-[#506857]">
                    {item.highRiskCount > 0 
                      ? 'ส่งต่อเข้าคลินิก NCDs ปรับเปลี่ยนพฤติกรรมเร่งด่วน'
                      : 'ส่งเสริมรักษาสุขภาวะต่อเนื่อง'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
