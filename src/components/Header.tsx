import React from 'react';
import { Activity, RefreshCw, Printer, UserCheck, ShieldCheck, Type, Sparkles, Moon, Sun, Github, Download } from 'lucide-react';
import { FontSizeSetting } from '../types/health';

interface HeaderProps {
  lastUpdated: string;
  isSyncing: boolean;
  onSync: () => void;
  onOpenReport: () => void;
  onOpenSimulator: () => void;
  fontSize: FontSizeSetting;
  onChangeFontSize: (size: FontSizeSetting) => void;
  totalRecordsCount: number;
  isEyeCareMode: boolean;
  onToggleEyeCare: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdated,
  isSyncing,
  onSync,
  onOpenReport,
  onOpenSimulator,
  fontSize,
  onChangeFontSize,
  totalRecordsCount,
  isEyeCareMode,
  onToggleEyeCare,
}) => {
  return (
    <header className={`${isEyeCareMode ? 'bg-[#F2F6F0] border-[#D1DDD0]' : 'bg-white border-[#DDE6DC]'} border-b shadow-xs transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Brand & Title */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#3E6548] text-white flex items-center justify-center shadow-sm">
                <Activity className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#1E2E23] tracking-tight">
                    รายงานผลการคัดกรองข้อมูลสุขภาพเบื้องต้น
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF0E9] text-[#34583E] border border-[#CCDBCB]">
                    <ShieldCheck className="w-3.5 h-3.5" /> เวชระเบียนชุมชน
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#4E6353]">
                  ระบบสารสนเทศสุขภาพเพื่อการเฝ้าระวัง ประเมินความเสี่ยงโรคไม่ติดต่อเรื้อรัง (NCDs) และสุขภาวะประชากร
                </p>
              </div>
            </div>

            {/* Author Credit & Sync Timestamp */}
            <div className="flex items-center gap-3 text-xs sm:text-sm text-[#5C7162] pt-1 flex-wrap">
              <div className="flex items-center gap-1.5 bg-[#F4F7F3] px-2.5 py-1 rounded-md border border-[#E1EADF] shadow-2xs">
                <UserCheck className="w-4 h-4 text-[#3D6347]" />
                <span>
                  ผู้จัดทำ: <strong className="font-semibold text-[#1C2C20]">นางสาวนูรฮานีนี ดาแล่หมัน</strong>
                </span>
                <span className="text-[#6D8574] text-xs">(นักศึกษาเวชระเบียน)</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#526857]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>อัปเดตล่าสุด: <span className="font-medium text-[#223627]">{lastUpdated}</span></span>
                <span className="text-gray-300">•</span>
                <span>ฐานข้อมูล: <span className="font-medium text-[#223627]">{totalRecordsCount} ราย</span></span>
              </div>
            </div>
          </div>

          {/* Right Action Tools & Accessibility Controls */}
          <div className="flex items-center gap-2.5 flex-wrap sm:justify-end">
            
            {/* Eye Care Toggle */}
            <button
              type="button"
              onClick={onToggleEyeCare}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                isEyeCareMode
                  ? 'bg-[#E1EDE0] text-[#223B2A] border-[#BED1BD] font-semibold'
                  : 'bg-[#F4F7F3] text-[#4F6855] border-[#D9E3D8] hover:bg-[#E8F0E6]'
              }`}
              title="สลับโหมดถนอมสายตาโทนเขียวชาอุ่น"
            >
              {isEyeCareMode ? <Sun className="w-3.5 h-3.5 text-amber-600" /> : <Moon className="w-3.5 h-3.5 text-[#3D6347]" />}
              <span>{isEyeCareMode ? 'โหมดถนอมสายตา' : 'ถนอมสายตา'}</span>
            </button>

            {/* Font Size Accessibility for All Ages */}
            <div className="inline-flex items-center bg-[#F3F7F2] p-1 rounded-lg border border-[#D9E3D8] text-xs" title="ปรับขนาดตัวอักษรเพื่อความสะดวกในการอ่านสำหรับทุกวัย">
              <span className="px-2 text-[#475E4E] font-medium flex items-center gap-1">
                <Type className="w-3.5 h-3.5" /> ตัวอักษร
              </span>
              <button
                type="button"
                onClick={() => onChangeFontSize('normal')}
                className={`px-2 py-1 rounded-md font-medium transition-all ${
                  fontSize === 'normal' 
                    ? 'bg-white text-[#294532] shadow-xs font-semibold' 
                    : 'text-[#5C7362] hover:text-[#233829]'
                }`}
              >
                ปกติ
              </button>
              <button
                type="button"
                onClick={() => onChangeFontSize('large')}
                className={`px-2 py-1 rounded-md font-medium transition-all ${
                  fontSize === 'large' 
                    ? 'bg-white text-[#294532] shadow-xs font-semibold' 
                    : 'text-[#5C7362] hover:text-[#233829]'
                }`}
              >
                ใหญ่
              </button>
              <button
                type="button"
                onClick={() => onChangeFontSize('xlarge')}
                className={`px-2 py-1 rounded-md font-medium transition-all ${
                  fontSize === 'xlarge' 
                    ? 'bg-white text-[#294532] shadow-xs font-semibold' 
                    : 'text-[#5C7362] hover:text-[#233829]'
                }`}
              >
                สูงวัย
              </button>
            </div>

            {/* Risk Simulator Trigger Button */}
            <button
              type="button"
              onClick={onOpenSimulator}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#EBF3EA] hover:bg-[#DDEADA] text-[#2C4D34] font-semibold text-xs sm:text-sm transition-all border border-[#CADBC9] shadow-2xs active:scale-95"
              title="เปิดเครื่องมือจำลองคำนวณคะแนนความเสี่ยงสุขภาพ"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#375E40]" />
              <span>จำลองความเสี่ยง</span>
            </button>

            {/* Sync Live Button */}
            <button
              type="button"
              onClick={onSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#EBF1EA] hover:bg-[#DDE7DA] text-[#2C4834] font-medium text-xs sm:text-sm transition-colors border border-[#CAD8C8] active:scale-95 disabled:opacity-60 shadow-2xs"
              title="ดึงข้อมูลล่าสุดจากระบบฐานข้อมูล"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#3A6044]' : 'text-[#3A6044]'}`} />
              <span>{isSyncing ? 'กำลังซิงค์...' : 'ซิงค์ข้อมูล'}</span>
            </button>

            {/* Print / Summary Report Button */}
            <button
              type="button"
              onClick={onOpenReport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#3C6446] hover:bg-[#315339] text-white font-medium text-xs sm:text-sm shadow-xs transition-colors active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์รายงาน</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
