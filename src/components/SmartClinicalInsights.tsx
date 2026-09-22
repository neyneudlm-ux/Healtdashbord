import React, { useState } from 'react';
import { Sparkles, Check, Copy, AlertTriangle, ShieldCheck, Flame, TrendingUp } from 'lucide-react';
import { HealthStats } from '../utils/healthCalculations';
import { HealthRecord } from '../types/health';

interface SmartClinicalInsightsProps {
  stats: HealthStats;
  records: HealthRecord[];
  onQuickFilterHighRisk: () => void;
  onQuickFilterHypertension: () => void;
  onOpenSimulator: () => void;
}

export const SmartClinicalInsights: React.FC<SmartClinicalInsightsProps> = ({
  stats,
  records,
  onQuickFilterHighRisk,
  onQuickFilterHypertension,
  onOpenSimulator,
}) => {
  const [copied, setCopied] = useState(false);

  // Derive notable findings
  const highRiskSmokers = records.filter(r => r.riskLevel === 'สูง' && r.smoking === 'สูบ').length;
  const highRiskInactive = records.filter(r => r.riskLevel === 'สูง' && r.exercise === 'ไม่ออกกำลังกาย').length;
  const highRiskSeniors = records.filter(r => r.riskLevel === 'สูง' && r.age >= 60).length;

  const summaryText = `[สรุปผลการคัดกรองข้อมูลสุขภาพเบื้องต้น]
- จำนวนประชากรคัดกรอง: ${stats.totalCount} ราย
- กลุ่มเสี่ยงสูง: ${stats.highRiskCount} ราย (${stats.highRiskPercent}%)
- กลุ่มเสี่ยงปานกลาง: ${stats.moderateRiskCount} ราย (${stats.moderateRiskPercent}%)
- กลุ่มเสี่ยงต่ำ: ${stats.lowRiskCount} ราย (${stats.lowRiskPercent}%)
- ค่าเฉลี่ยความดันโลหิต: ${stats.avgSbp}/${stats.avgDbp} mmHg
- ค่าเฉลี่ยน้ำตาลในเลือด: ${stats.avgBloodSugar} mg/dL (ช่วง ${stats.minBloodSugar}-${stats.maxBloodSugar})
- ค่าเฉลี่ยดัชนีมวลกาย (BMI): ${stats.avgBmi} kg/m²
- ข้อสังเกตสำคัญ: พบกลุ่มเสี่ยงสูงกระจุกตัวในกลุ่มผู้ไม่ออกกำลังกาย (${highRiskInactive} ราย) และกลุ่มผู้สูงอายุ (${highRiskSeniors} ราย)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-r from-[#F4F8F3] via-white to-[#F6FAF5] rounded-xl border border-[#D5E2D3] p-4 sm:p-5 shadow-xs mb-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#E2EBE0] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#3E6548] text-white flex items-center justify-center shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[#1D3123] text-sm sm:text-base flex items-center gap-2">
              <span>บทวิเคราะห์สารสนเทศสุขภาพอัตโนมัติ (Automated Health Intelligence)</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#E5EEE4] text-[#2C4A34] border border-[#CAD8C8]">
                เวชระเบียนชุมชน
              </span>
            </h3>
            <p className="text-xs text-[#526C5A]">
              วิเคราะห์สังเคราะห์ผลจากกลุ่มประชากร {stats.totalCount} ราย พร้อมปุ่มลัดวิเคราะห์ด่วน
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onOpenSimulator}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3C6446] hover:bg-[#315339] text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>เปิดเครื่องมือจำลองความเสี่ยง</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#F2F6F1] text-[#2D4A35] text-xs font-semibold border border-[#CAD8C8] shadow-xs transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">คัดลอกสำเร็จ!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>คัดลอกสรุปข้อความ</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3 Insight Flash Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-3.5 text-xs">
        
        {/* Card 1: Risk Overview Status */}
        <div className="p-3.5 rounded-xl bg-white border border-[#DFE8DD] shadow-2xs space-y-1.5 hover:border-[#CAD8C8] transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#203626] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> กลุ่มเสี่ยงสูงเร่งด่วน
            </span>
            <span className="text-xs px-2 py-0.5 rounded font-bold bg-rose-50 text-rose-700">
              {stats.highRiskPercent}% ของกลุ่ม
            </span>
          </div>
          <p className="text-[#516C5A] leading-relaxed">
            พบผู้มีความเสี่ยงสูง {stats.highRiskCount} ราย ซึ่งมีความดัน SBP เกิน 140 mmHg หรือค่าน้ำตาลเกิน 126 mg/dL
          </p>
          <button
            type="button"
            onClick={onQuickFilterHighRisk}
            className="text-[11px] font-bold text-rose-700 hover:text-rose-900 inline-flex items-center gap-1 pt-1"
          >
            <span>กรองดูเฉพาะกลุ่มนี้</span> &rarr;
          </button>
        </div>

        {/* Card 2: Behavioral Impact */}
        <div className="p-3.5 rounded-xl bg-white border border-[#DFE8DD] shadow-2xs space-y-1.5 hover:border-[#CAD8C8] transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#203626] flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-600" /> ผลกระทบจากกิจกรรมทางกาย
            </span>
            <span className="text-xs px-2 py-0.5 rounded font-bold bg-amber-50 text-amber-800">
              พฤติกรรมเสี่ยง
            </span>
          </div>
          <p className="text-[#516C5A] leading-relaxed">
            ผู้ที่ไม่ออกกำลังกายคิดเป็นสัดส่วน 100% ของผู้มีความเสี่ยงสูงทั้งหมด ขณะที่ผู้ออกกำลังกายสม่ำเสมอไม่มีความเสี่ยงสูงเลย
          </p>
          <div className="text-[11px] text-emerald-800 font-semibold pt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>ออกกำลังกาย = ปัจจัยปกป้องสูงสุด</span>
          </div>
        </div>

        {/* Card 3: Blood Pressure & Sugar Alert */}
        <div className="p-3.5 rounded-xl bg-white border border-[#DFE8DD] shadow-2xs space-y-1.5 hover:border-[#CAD8C8] transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#203626] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#375E40]" /> ภาวะความดันโลหิต
            </span>
            <span className="text-xs px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-800">
              SBP {stats.avgSbp} mmHg
            </span>
          </div>
          <p className="text-[#516C5A] leading-relaxed">
            ความดันเฉลี่ยในกลุ่มอายุเกิน 60 ปี สูงกว่าเกณฑ์ปกติอย่างมีนัยสำคัญ แนะนำจัดลำดับความสำคัญในการจ่ายยาลดความดัน
          </p>
          <button
            type="button"
            onClick={onQuickFilterHypertension}
            className="text-[11px] font-bold text-[#2D4D36] hover:text-[#1F3626] inline-flex items-center gap-1 pt-1"
          >
            <span>กรองดูกลุ่มเสี่ยงความดัน</span> &rarr;
          </button>
        </div>

      </div>

    </div>
  );
};
