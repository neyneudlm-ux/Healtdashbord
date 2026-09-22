import React from 'react';
import { X, User, Heart, Activity, AlertTriangle, ShieldCheck, Dumbbell, Calendar, MapPin } from 'lucide-react';
import { HealthRecord } from '../types/health';
import {
  getBmiCategory,
  getBloodPressureCategory,
  getBloodSugarCategory,
  getRiskLevelBadge
} from '../utils/healthCalculations';

interface PatientDetailModalProps {
  record: HealthRecord | null;
  onClose: () => void;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ record, onClose }) => {
  if (!record) return null;

  const bmiCat = getBmiCategory(record.bmi);
  const bpCat = getBloodPressureCategory(record.sbp, record.dbp);
  const sugarCat = getBloodSugarCategory(record.bloodSugar);
  const riskBadge = getRiskLevelBadge(record.riskLevel);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-[#D5E1D3] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-[#2D4D36] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{record.id}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-white/20 text-[#E1EFE3]">
                  เพศ{record.gender} • อายุ {record.age} ปี
                </span>
              </div>
              <p className="text-xs text-[#C5DAC9] mt-0.5 flex items-center gap-2">
                <span><MapPin className="w-3 h-3 inline mr-0.5" /> โซน: {record.area}</span>
                <span>•</span>
                <span><Calendar className="w-3 h-3 inline mr-0.5" /> วันที่คัดกรอง: {record.screeningDate}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Overall Risk Score Alert */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            record.riskLevel === 'สูง' 
              ? 'bg-rose-50 border-rose-200 text-rose-900' 
              : record.riskLevel === 'ปานกลาง'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <div className="flex items-center gap-2.5">
              <AlertTriangle className={`w-5 h-5 ${
                record.riskLevel === 'สูง' ? 'text-rose-600' : record.riskLevel === 'ปานกลาง' ? 'text-amber-600' : 'text-emerald-600'
              }`} />
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider block">ระดับความเสี่ยงสุขภาพรวม</span>
                <span className="text-base font-bold">
                  {riskBadge.label} (คะแนนประเมิน: {record.riskScore}/7 คะแนน)
                </span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              record.riskLevel === 'สูง' ? 'bg-rose-600 text-white' : record.riskLevel === 'ปานกลาง' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
            }`}>
              {record.riskLevel}
            </span>
          </div>

          {/* Vitals & Biomarkers Grid */}
          <div>
            <h4 className="text-xs font-bold text-[#44634C] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#375E40]" /> สัญญาณชีพและผลตรวจทางห้องปฏิบัติการ
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              
              {/* BMI */}
              <div className="p-3 rounded-xl bg-[#F6F9F5] border border-[#DEE9DC]">
                <span className="text-[#607968] block">BMI & รูปร่าง</span>
                <div className="text-base font-bold text-[#1E3023] mt-0.5">{record.bmi} <span className="text-xs font-normal text-[#526B58]">kg/m²</span></div>
                <div className="text-[11px] text-[#607968] mt-0.5">{record.weightKg} kg / {record.heightCm} cm</div>
                <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${bmiCat.bg} ${bmiCat.color}`}>
                  {bmiCat.label}
                </span>
              </div>

              {/* BP */}
              <div className="p-3 rounded-xl bg-[#F6F9F5] border border-[#DEE9DC]">
                <span className="text-[#607968] block">ความดันโลหิต</span>
                <div className="text-base font-bold text-[#1E3023] mt-0.5">{record.sbp}/{record.dbp} <span className="text-xs font-normal text-[#526B58]">mmHg</span></div>
                <div className="text-[11px] text-[#607968] mt-0.5">ชีพจร: {record.pulse} bpm</div>
                <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${bpCat.bg} ${bpCat.color}`}>
                  {bpCat.label}
                </span>
              </div>

              {/* Blood Sugar */}
              <div className="p-3 rounded-xl bg-[#F6F9F5] border border-[#DEE9DC] col-span-2 sm:col-span-1">
                <span className="text-[#607968] block">น้ำตาลในเลือด (FBS)</span>
                <div className="text-base font-bold text-[#1E3023] mt-0.5">{record.bloodSugar} <span className="text-xs font-normal text-[#526B58]">mg/dL</span></div>
                <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${sugarCat.bg} ${sugarCat.color}`}>
                  {sugarCat.label}
                </span>
              </div>

            </div>
          </div>

          {/* Screening Conditions & Lifestyle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            {/* Screening Status */}
            <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DEE8DC]">
              <h5 className="font-bold text-[#2A4432] mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#3E6548]" /> ผลการคัดกรองเบื้องต้น
              </h5>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[#516C5A]">ภาวะเสี่ยงเบาหวาน:</span>
                  <span className={`font-semibold px-2 py-0.5 rounded ${
                    record.diabetesScreening === 'มีแนวโน้ม/เสี่ยง' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {record.diabetesScreening}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#516C5A]">ภาวะเสี่ยงความดันโลหิตสูง:</span>
                  <span className={`font-semibold px-2 py-0.5 rounded ${
                    record.hypertensionScreening === 'มีแนวโน้ม/เสี่ยง' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {record.hypertensionScreening}
                  </span>
                </div>
              </div>
            </div>

            {/* Lifestyle & Behavior */}
            <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DEE8DC]">
              <h5 className="font-bold text-[#2A4432] mb-2 flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-[#3E6548]" /> พฤติกรรมสุขภาพ
              </h5>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[#516C5A]">การสูบบุหรี่:</span>
                  <span className={`font-medium ${record.smoking === 'สูบ' ? 'text-rose-700 font-bold' : 'text-emerald-700'}`}>
                    {record.smoking}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#516C5A]">การดื่มแอลกอฮอล์:</span>
                  <span className={`font-medium ${record.alcohol === 'ดื่ม' ? 'text-amber-700 font-bold' : 'text-emerald-700'}`}>
                    {record.alcohol}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#516C5A]">การออกกำลังกาย:</span>
                  <span className={`font-medium ${record.exercise === 'สม่ำเสมอ' ? 'text-emerald-700 font-bold' : record.exercise === 'ไม่ออกกำลังกาย' ? 'text-rose-700 font-bold' : 'text-amber-700'}`}>
                    {record.exercise}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Medical Record Guidance */}
          <div className="p-3.5 rounded-xl bg-[#F4F8F3] border border-[#CCDDC9] text-xs space-y-1.5">
            <span className="font-bold text-[#284931] flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-[#3C6947]" /> แผนการดูแลสุขภาพและข้อเสนอแนะเวชระเบียน
            </span>
            <p className="text-[#45634E] leading-relaxed">
              {record.riskLevel === 'สูง' 
                ? 'ผู้ป่วยอยู่ในกลุ่มเสี่ยงสูง ควรได้รับการส่งต่อแพทย์เพื่อตรวจวินิจฉัยยืนยัน Fasting Plasma Glucose และตรวจซ้ำความดันโลหิต พร้อมนัดติดตามผลในคลินิก NCDs ทุก 1-3 เดือน แนะนำปรับพฤติกรรมลดหวาน มัน เค็ม และเลิกสูบบุหรี่/แอลกอฮอล์'
                : record.riskLevel === 'ปานกลาง'
                ? 'กลุ่มเสี่ยงปานกลาง แนะนำให้ปรับเปลี่ยนพฤติกรรมด้านการบริโภคอาหาร เพิ่มกิจกรรมทางกายสม่ำเสมอสัปดาห์ละอย่างน้อย 150 นาที และตรวจคัดกรองซ้ำในอีก 6 เดือน'
                : 'สุขภาพอยู่ในเกณฑ์ปกติ ส่งเสริมการรักษาน้ำหนักตัวตามเกณฑ์ ออกกำลังกายสม่ำเสมอ และตรวจคัดกรองสุขภาพประจำปีต่อเนื่อง'}
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAFBF9] border-t border-[#E3EDE1] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#3C6446] hover:bg-[#32543A] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
