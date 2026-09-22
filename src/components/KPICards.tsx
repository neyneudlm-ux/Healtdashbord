import React from 'react';
import { Users, Heart, Activity, AlertTriangle, ShieldCheck, Dumbbell } from 'lucide-react';
import { HealthStats } from '../utils/healthCalculations';

interface KPICardsProps {
  stats: HealthStats;
}

export const KPICards: React.FC<KPICardsProps> = ({ stats }) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-[#1E3023] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#3D6646]" />
          <span>การสรุปข้อมูลภาพรวมสุขภาพ (Health Overview KPIs)</span>
        </h2>
        <span className="text-xs text-[#5C7463]">
          คำนวณตามเกณฑ์เวชศาสตร์ป้องกันและกระทรวงสาธารณสุข
        </span>
      </div>

      {/* Grid of 4 Primary Required KPI Cards (plus 2 context cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* KPI 1: High Risk Overview (จำนวน, ร้อยละ, สัดส่วน) */}
        <div className="bg-white rounded-xl border border-[#DCE6DA] p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-[#BED3BC] transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#637C6A] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" /> ระดับความเสี่ยงสุขภาพรวม
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                เสี่ยงสูง {stats.highRiskPercent}%
              </span>
            </div>
            
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#1F3325]">
                {stats.highRiskCount}
              </span>
              <span className="text-xs text-[#526B58]">
                รายที่มีความเสี่ยงสูง (จาก {stats.totalCount} ราย)
              </span>
            </div>

            {/* Proportion Bar */}
            <div className="mt-3 pt-3 border-t border-[#EDF3EC]">
              <div className="flex justify-between text-xs text-[#4F6855] mb-1.5 font-medium">
                <span>สัดส่วนกลุ่มเสี่ยง:</span>
                <span>ต่ำ : กลาง : สูง ({stats.lowRiskCount} : {stats.moderateRiskCount} : {stats.highRiskCount})</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#E8EFE6] overflow-hidden flex">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500" 
                  style={{ width: `${stats.lowRiskPercent}%` }} 
                  title={`เสี่ยงต่ำ: ${stats.lowRiskCount} ราย (${stats.lowRiskPercent}%)`}
                />
                <div 
                  className="bg-amber-400 h-full transition-all duration-500" 
                  style={{ width: `${stats.moderateRiskPercent}%` }} 
                  title={`เสี่ยงปานกลาง: ${stats.moderateRiskCount} ราย (${stats.moderateRiskPercent}%)`}
                />
                <div 
                  className="bg-rose-500 h-full transition-all duration-500" 
                  style={{ width: `${stats.highRiskPercent}%` }} 
                  title={`เสี่ยงสูง: ${stats.highRiskCount} ราย (${stats.highRiskPercent}%)`}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#6A8271] mt-1.5">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>ต่ำ {stats.lowRiskPercent}%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span>กลาง {stats.moderateRiskPercent}%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span>สูง {stats.highRiskPercent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI 2: BMI Statistics (ค่าเฉลี่ย, ค่าต่ำสุด, ค่าสูงสุด, ร้อยละ) */}
        <div className="bg-white rounded-xl border border-[#DCE6DA] p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-[#BED3BC] transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#637C6A] flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#3C6446]" /> ดัชนีมวลกายเฉลี่ย (Mean BMI)
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                stats.avgBmi >= 25 
                  ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                  : stats.avgBmi >= 23 
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                {stats.avgBmi >= 25 ? 'ภาวะเริ่มอ้วน' : stats.avgBmi >= 23 ? 'น้ำหนักเกิน' : 'ปกติสมส่วน'}
              </span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#1F3325]">
                {stats.avgBmi}
              </span>
              <span className="text-sm font-medium text-[#526B58]">kg/m²</span>
              <span className="text-xs text-[#708A77] ml-auto">เกณฑ์เอเชีย 18.5-22.9</span>
            </div>

            {/* Min / Max & Obese Proportion */}
            <div className="mt-3 pt-3 border-t border-[#EDF3EC] grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#F6F9F5] p-2 rounded-lg border border-[#E3EDE1]">
                <div className="text-[#647C6B] text-[11px]">ค่าต่ำสุด - ค่าสูงสุด</div>
                <div className="font-bold text-[#233829] text-sm mt-0.5">
                  {stats.minBmi} - {stats.maxBmi} <span className="font-normal text-xs text-[#5D7765]">kg/m²</span>
                </div>
              </div>
              <div className="bg-[#F6F9F5] p-2 rounded-lg border border-[#E3EDE1]">
                <div className="text-[#647C6B] text-[11px]">ภาวะอ้วน (BMI ≥ 25)</div>
                <div className="font-bold text-rose-700 text-sm mt-0.5">
                  {stats.obeseCount} ราย <span className="font-normal text-xs">({stats.obesePercent}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI 3: Blood Pressure Statistics (ค่าเฉลี่ย, Min-Max, ร้อยละเสี่ยง) */}
        <div className="bg-white rounded-xl border border-[#DCE6DA] p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-[#BED3BC] transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#637C6A] flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#C2410C]" /> ความดันโลหิตเฉลี่ย (Mean BP)
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                เสี่ยงสูง {stats.hypertensionRiskPercent}%
              </span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#1F3325]">
                {stats.avgSbp}
                <span className="text-2xl text-[#6D8A74] font-medium mx-1">/</span>
                {stats.avgDbp}
              </span>
              <span className="text-sm font-medium text-[#526B58]">mmHg</span>
            </div>

            {/* Min / Max & Risk rate */}
            <div className="mt-3 pt-3 border-t border-[#EDF3EC] grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#F6F9F5] p-2 rounded-lg border border-[#E3EDE1]">
                <div className="text-[#647C6B] text-[11px]">ช่วง SBP ต่ำสุด - สูงสุด</div>
                <div className="font-bold text-[#233829] text-sm mt-0.5">
                  {stats.minSbp} - {stats.maxSbp} <span className="font-normal text-xs text-[#5D7765]">mmHg</span>
                </div>
              </div>
              <div className="bg-[#F6F9F5] p-2 rounded-lg border border-[#E3EDE1]">
                <div className="text-[#647C6B] text-[11px]">มีแนวโน้มความดันสูง</div>
                <div className="font-bold text-amber-700 text-sm mt-0.5">
                  {stats.hypertensionRiskCount} ราย <span className="font-normal text-xs">({stats.hypertensionRiskPercent}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI 4: Blood Sugar Statistics (ค่าเฉลี่ย, ค่าต่ำสุด, ค่าสูงสุด, ร้อยละเสี่ยง) */}
        <div className="bg-white rounded-xl border border-[#DCE6DA] p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-[#BED3BC] transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#637C6A] flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#854D0E]" /> ระดับน้ำตาลในเลือดเฉลี่ย (FBS)
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                เสี่ยง {stats.diabetesRiskPercent}%
              </span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#1F3325]">
                {stats.avgBloodSugar}
              </span>
              <span className="text-sm font-medium text-[#526B58]">mg/dL</span>
              <span className="text-xs text-[#708A77] ml-auto">เป้าหมาย &lt; 100 mg/dL</span>
            </div>

            {/* Min / Max & Diabetes Risk Count */}
            <div className="mt-3 pt-3 border-t border-[#EDF3EC] grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#F6F9F5] p-2 rounded-lg border border-[#E3EDE1]">
                <div className="text-[#647C6B] text-[11px]">ต่ำสุด - สูงสุด</div>
                <div className="font-bold text-[#233829] text-sm mt-0.5">
                  {stats.minBloodSugar} - {stats.maxBloodSugar} <span className="font-normal text-xs text-[#5D7765]">mg/dL</span>
                </div>
              </div>
              <div className="bg-[#F6F9F5] p-2 rounded-lg border border-[#E3EDE1]">
                <div className="text-[#647C6B] text-[11px]">เสี่ยงเบาหวาน (≥100)</div>
                <div className="font-bold text-amber-700 text-sm mt-0.5">
                  {stats.diabetesRiskCount} ราย <span className="font-normal text-xs">({stats.diabetesRiskPercent}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI 5: Demographics & Gender Ratio (จำนวน, สัดส่วน, ร้อยละ) */}
        <div className="bg-white rounded-xl border border-[#DCE6DA] p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-[#BED3BC] transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#637C6A] flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#375F40]" /> ผู้รับการคัดกรองทั้งหมด
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#EBF2EA] text-[#33593B]">
                เวชระเบียนชุมชน
              </span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#1F3325]">
                {stats.totalCount}
              </span>
              <span className="text-sm font-medium text-[#526B58]">คน</span>
              <span className="text-xs text-[#708A77] ml-auto">ครบทุกกลุ่มประชากร</span>
            </div>

            {/* Gender Ratio */}
            <div className="mt-3 pt-3 border-t border-[#EDF3EC]">
              <div className="flex justify-between text-xs text-[#4F6855] mb-1 font-medium">
                <span>สัดส่วนเพศ ชาย : หญิง</span>
                <span>{stats.maleCount} : {stats.femaleCount} ราย ({stats.maleRatio}% : {stats.femaleRatio}%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#E5ECE3] overflow-hidden flex">
                <div 
                  className="bg-[#467299] h-full" 
                  style={{ width: `${stats.maleRatio}%` }} 
                  title={`ชาย: ${stats.maleCount} ราย`}
                />
                <div 
                  className="bg-[#C56C86] h-full" 
                  style={{ width: `${stats.femaleRatio}%` }} 
                  title={`หญิง: ${stats.femaleCount} ราย`}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#6A8271] mt-1">
                <span className="text-[#365A7C]">ชาย {stats.maleCount} ราย ({stats.maleRatio}%)</span>
                <span className="text-[#96475E]">หญิง {stats.femaleCount} ราย ({stats.femaleRatio}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI 6: Key Risk Behaviors (จำนวน, ร้อยละ, พฤติกรรม) */}
        <div className="bg-white rounded-xl border border-[#DCE6DA] p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-[#BED3BC] transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#637C6A] flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-[#446C4D]" /> พฤติกรรมสุขภาพเสี่ยงรวม
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#EBF2EA] text-[#33593B]">
                การปรับเปลี่ยนพฤติกรรม
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1 mb-2">
              <div className="bg-[#FAFBF9] p-2 rounded-lg border border-[#E2EDE0]">
                <div className="text-[11px] text-[#607968]">สูบบุหรี่</div>
                <div className="text-lg font-bold text-[#1F3325]">{stats.smokerCount}</div>
                <div className="text-[10px] text-[#718B79]">{stats.smokerPercent}%</div>
              </div>
              <div className="bg-[#FAFBF9] p-2 rounded-lg border border-[#E2EDE0]">
                <div className="text-[11px] text-[#607968]">ดื่มสุรา</div>
                <div className="text-lg font-bold text-[#1F3325]">{stats.drinkerCount}</div>
                <div className="text-[10px] text-[#718B79]">{stats.drinkerPercent}%</div>
              </div>
              <div className="bg-[#FAFBF9] p-2 rounded-lg border border-[#E2EDE0]">
                <div className="text-[11px] text-[#607968]">ไม่ออกกำลัง</div>
                <div className="text-lg font-bold text-rose-700">{stats.noExerciseCount}</div>
                <div className="text-[10px] text-rose-600">{stats.noExercisePercent}%</div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#EDF3EC] flex items-center justify-between text-xs text-[#526B58]">
              <span>ออกกำลังกายสม่ำเสมอ:</span>
              <span className="font-semibold text-emerald-700">{stats.regularExerciseCount} ราย ({stats.regularExercisePercent}%)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
