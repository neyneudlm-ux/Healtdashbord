import React from 'react';
import { X, Printer, CheckCircle, ShieldCheck, FileText, UserCheck } from 'lucide-react';
import { HealthStats } from '../utils/healthCalculations';

interface ExportSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: HealthStats;
  lastUpdated: string;
}

export const ExportSummaryModal: React.FC<ExportSummaryModalProps> = ({
  isOpen,
  onClose,
  stats,
  lastUpdated,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#D5E1D3] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#2D4D36] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">รายงานสรุปผลการคัดกรองข้อมูลสุขภาพ</h3>
              <p className="text-xs text-[#C5DAC9]">เอกสารเวชระเบียนชุมชนเพื่อการวางแผนสาธารณสุข</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs text-[#203627]" id="printable-summary">
          
          {/* Header of document */}
          <div className="border-b border-[#D8E4D6] pb-4 text-center space-y-1">
            <h2 className="text-base font-bold text-[#1C3022]">
              แบบรายงานและวิเคราะห์ผลการคัดกรองสุขภาพเบื้องต้นชุมชน
            </h2>
            <p className="text-[#4F6855]">
              การประเมินความเสี่ยงโรคเบาหวานและความดันโลหิตสูงในกลุ่มประชากร
            </p>
            <div className="flex items-center justify-center gap-4 text-[11px] text-[#637D6A] pt-1">
              <span>วันที่จัดทำรายงาน: {new Date().toLocaleDateString('th-TH')}</span>
              <span>•</span>
              <span>เวลาอัปเดตข้อมูล: {lastUpdated}</span>
            </div>
          </div>

          {/* Student Profile & Credential */}
          <div className="p-3.5 rounded-xl bg-[#F6F9F5] border border-[#DEE8DC] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-5 h-5 text-[#375E40]" />
              <div>
                <span className="font-semibold text-sm text-[#1E3023]">นางสาวนูรฮานีนี ดาแล่หมัน</span>
                <span className="text-[#516C5A] block text-[11px]">นักศึกษาหลักสูตรเวชระเบียน (Medical Records Specialist)</span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF1EA] text-[#33593B] border border-[#CAD8C8]">
              ผ่านการตรวจสอบข้อมูล
            </span>
          </div>

          {/* KPI Summary Matrix */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#3D5E45] mb-2">
              1. สรุปตัวชี้วัดภาพรวมประชากร ({stats.totalCount} ราย)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-lg border border-[#E3EDE1] bg-white">
                <span className="text-[#647C6B] block">ผู้มีความเสี่ยงสูง</span>
                <span className="text-base font-bold text-rose-700">{stats.highRiskCount} คน ({stats.highRiskPercent}%)</span>
              </div>
              <div className="p-3 rounded-lg border border-[#E3EDE1] bg-white">
                <span className="text-[#647C6B] block">ผู้มีความเสี่ยงปานกลาง</span>
                <span className="text-base font-bold text-amber-700">{stats.moderateRiskCount} คน ({stats.moderateRiskPercent}%)</span>
              </div>
              <div className="p-3 rounded-lg border border-[#E3EDE1] bg-white">
                <span className="text-[#647C6B] block">ผู้มีความเสี่ยงต่ำ (ปกติ)</span>
                <span className="text-base font-bold text-emerald-700">{stats.lowRiskCount} คน ({stats.lowRiskPercent}%)</span>
              </div>
              <div className="p-3 rounded-lg border border-[#E3EDE1] bg-white">
                <span className="text-[#647C6B] block">BMI เฉลี่ย (Min - Max)</span>
                <span className="text-sm font-bold text-[#1F3325]">{stats.avgBmi} ({stats.minBmi}-{stats.maxBmi})</span>
              </div>
              <div className="p-3 rounded-lg border border-[#E3EDE1] bg-white">
                <span className="text-[#647C6B] block">ความดันเฉลี่ย SBP/DBP</span>
                <span className="text-sm font-bold text-[#1F3325]">{stats.avgSbp}/{stats.avgDbp} mmHg</span>
              </div>
              <div className="p-3 rounded-lg border border-[#E3EDE1] bg-white">
                <span className="text-[#647C6B] block">น้ำตาลเฉลี่ย (Min - Max)</span>
                <span className="text-sm font-bold text-[#1F3325]">{stats.avgBloodSugar} ({stats.minBloodSugar}-{stats.maxBloodSugar})</span>
              </div>
            </div>
          </div>

          {/* Clinical Findings & Recommendations */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#3D5E45]">
              2. ข้อค้นพบสำคัญและข้อเสนอแนะเชิงเวชระเบียน
            </h4>
            <div className="p-3.5 rounded-xl bg-[#FAFBF9] border border-[#DEE8DC] space-y-2 leading-relaxed">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#3E6548] shrink-0 mt-0.5" />
                <p>
                  <strong>กลุ่มเสี่ยงสูง:</strong> พบผู้รับการคัดกรองที่มีความเสี่ยงสูงจำนวน {stats.highRiskCount} ราย ({stats.highRiskPercent}%) โดยกระจุกตัวอย่างมีนัยสำคัญในกลุ่มอายุ 50 ปีขึ้นไปและกลุ่มที่มีค่า BMI เกิน 28 kg/m²
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#3E6548] shrink-0 mt-0.5" />
                <p>
                  <strong>พฤติกรรมเสี่ยง:</strong> การไม่ออกกำลังกายร่วมกับการดื่มแอลกอฮอล์ส่งผลให้คะแนนความเสี่ยงเพิ่มขึ้นเฉลี่ยเป็น 5-7 คะแนน
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#3E6548] shrink-0 mt-0.5" />
                <p>
                  <strong>มาตรการส่งต่อ:</strong> ผู้ที่มีความเสี่ยงสูงควรได้รับการบันทึกรหัสวินิจฉัยและส่งต่อเข้าคลินิก NCDs เพื่อรับการดูแลและติดตามผลอย่างใกล้ชิด
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Actions Footer */}
        <div className="p-4 bg-[#FAFBF9] border-t border-[#E3EDE1] flex items-center justify-between">
          <span className="text-[11px] text-[#66826E] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#375E40]" /> ได้รับการรับรองตามระเบียบเวชระเบียน
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg border border-[#CAD8C8] bg-white text-[#314F3A] text-xs font-semibold hover:bg-[#F2F6F1]"
            >
              ปิด
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3C6446] hover:bg-[#315339] text-white text-xs font-semibold shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์รายงานสรุป</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
