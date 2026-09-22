import React, { useState, useMemo } from 'react';
import {
  X, Calculator, Sparkles, AlertTriangle, ShieldCheck, Heart, Activity,
  RefreshCw, CheckCircle2, ArrowRight
} from 'lucide-react';

interface HealthRiskSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HealthRiskSimulatorModal: React.FC<HealthRiskSimulatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Input parameters
  const [age, setAge] = useState<number>(45);
  const [gender, setGender] = useState<'ชาย' | 'หญิง'>('หญิง');
  const [weight, setWeight] = useState<number>(68);
  const [height, setHeight] = useState<number>(160);
  const [sbp, setSbp] = useState<number>(135);
  const [dbp, setDbp] = useState<number>(85);
  const [bloodSugar, setBloodSugar] = useState<number>(115);
  const [smoking, setSmoking] = useState<boolean>(false);
  const [alcohol, setAlcohol] = useState<boolean>(false);
  const [exercise, setExercise] = useState<'สม่ำเสมอ' | 'บางครั้ง' | 'ไม่ออกกำลังกาย'>('บางครั้ง');

  if (!isOpen) return null;

  // Real-time BMI calculation
  const bmi = Number((weight / ((height / 100) * (height / 100))).toFixed(1));

  // Risk Score calculation based on screening criteria
  const { score, level, factors, recommendation } = useMemo(() => {
    let s = 0;
    const f: string[] = [];

    // Age factor
    if (age >= 60) {
      s += 2;
      f.push('อายุ 60 ปีขึ้นไป (+2)');
    } else if (age >= 50) {
      s += 1;
      f.push('อายุ 50-59 ปี (+1)');
    }

    // BMI factor
    if (bmi >= 25) {
      s += 2;
      f.push(`ดัชนีมวลกาย ${bmi} kg/m² อยู่ในเกณฑ์อ้วน (+2)`);
    } else if (bmi >= 23) {
      s += 1;
      f.push(`ดัชนีมวลกาย ${bmi} kg/m² น้ำหนักเกิน/ท้วม (+1)`);
    }

    // Blood Pressure factor
    if (sbp >= 140 || dbp >= 90) {
      s += 2;
      f.push(`ความดันโลหิตสูง ${sbp}/${dbp} mmHg (+2)`);
    } else if (sbp >= 120 || dbp >= 80) {
      s += 1;
      f.push(`ความดันโลหิตเริ่มสูง ${sbp}/${dbp} mmHg (+1)`);
    }

    // Blood Sugar factor
    if (bloodSugar >= 126) {
      s += 2;
      f.push(`น้ำตาลในเลือด ${bloodSugar} mg/dL เกณฑ์เสี่ยงเบาหวาน (+2)`);
    } else if (bloodSugar >= 100) {
      s += 1;
      f.push(`น้ำตาลในเลือด ${bloodSugar} mg/dL เกณฑ์เริ่มเสี่ยง (+1)`);
    }

    // Lifestyle factors
    if (smoking) {
      s += 1;
      f.push('มีประวัติสูบบุหรี่ (+1)');
    }
    if (alcohol) {
      s += 1;
      f.push('มีประวัติดื่มแอลกอฮอล์ (+1)');
    }
    if (exercise === 'ไม่ออกกำลังกาย') {
      s += 1;
      f.push('ขาดกิจกรรมทางกาย / ไม่ออกกำลังกาย (+1)');
    } else if (exercise === 'สม่ำเสมอ' && s > 0) {
      s = Math.max(0, s - 1);
      f.push('ออกกำลังกายสม่ำเสมอ (-1 ปัจจัยป้องกัน)');
    }

    // Determine level
    let lvl: 'ต่ำ' | 'ปานกลาง' | 'สูง' = 'ต่ำ';
    let rec = '';

    if (s >= 5) {
      lvl = 'สูง';
      rec = 'จัดอยู่ในกลุ่มเสี่ยงสูงเร่งด่วน: แนะนำส่งต่อแพทย์ตรวจยืนยันค่าน้ำตาล Fasting Blood Sugar และความดันโลหิตซ้ำ นัดติดตามในคลินิก NCDs ภายใน 2-4 สัปดาห์ และเริ่มปรับพฤติกรรม 3อ. 2ส.';
    } else if (s >= 3) {
      lvl = 'ปานกลาง';
      rec = 'จัดอยู่ในกลุ่มเสี่ยงปานกลาง: แนะนำปรับพฤติกรรมการบริโภคอาหาร ลดหวาน มัน เค็ม ออกกำลังกายสัปดาห์ละ 150 นาที และตรวจคัดกรองซ้ำในอีก 3-6 เดือน';
    } else {
      lvl = 'ต่ำ';
      rec = 'สุขภาพอยู่ในเกณฑ์ปกติ: ส่งเสริมการรักษาระดับน้ำหนักตัว ออกกำลังกายต่อเนื่อง และเข้ารับการตรวจคัดกรองสุขภาพประจำปีตามสิทธิเวชระเบียน';
    }

    return { score: s, level: lvl, factors: f, recommendation: rec };
  }, [age, bmi, sbp, dbp, bloodSugar, smoking, alcohol, exercise]);

  const handleResetToNormal = () => {
    setAge(32);
    setGender('หญิง');
    setWeight(52);
    setHeight(162);
    setSbp(115);
    setDbp(75);
    setBloodSugar(88);
    setSmoking(false);
    setAlcohol(false);
    setExercise('สม่ำเสมอ');
  };

  const handleSetHighRiskSample = () => {
    setAge(62);
    setGender('ชาย');
    setWeight(82);
    setHeight(165);
    setSbp(152);
    setDbp(94);
    setBloodSugar(138);
    setSmoking(true);
    setAlcohol(true);
    setExercise('ไม่ออกกำลังกาย');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-[#D5E1D3] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#2D4D36] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">เครื่องมือจำลองคำนวณความเสี่ยงสุขภาพเฉพาะบุคคล</h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-700/60 text-emerald-100 border border-emerald-500/40">
                  Interactive Simulator
                </span>
              </div>
              <p className="text-xs text-[#C5DAC9]">
                ปรับค่าสัญญาณชีพและพฤติกรรมเพื่อคำนวณคะแนนความเสี่ยง (Risk Score) ตามเกณฑ์คัดกรองเวชระเบียน
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

        {/* Preset Buttons Bar */}
        <div className="bg-[#FAFBF9] border-b border-[#E3EDE1] px-4 py-2.5 flex items-center justify-between gap-2 flex-wrap text-xs">
          <span className="text-[#516C5A] font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#3D6347]" /> กรณีศึกษาทดสอบ:
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetToNormal}
              className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-medium transition-colors"
            >
              🌿 ตัวอย่าง: สุขภาพปกติ (เสี่ยงต่ำ)
            </button>
            <button
              type="button"
              onClick={handleSetHighRiskSample}
              className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200 font-medium transition-colors"
            >
              ⚠️ ตัวอย่าง: ผู้ป่วยความเสี่ยงสูง
            </button>
          </div>
        </div>

        {/* Modal Body - 2 Columns */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Sliders & Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-4 text-xs">
            
            {/* Age & Gender */}
            <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DEE8DC] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#2B4633] flex items-center gap-1.5">
                  1. อายุและเพศ
                </span>
                <span className="font-bold text-[#1E3023] text-sm">{age} ปี ({gender})</span>
              </div>

              <input
                type="range"
                min="18"
                max="85"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full accent-[#3C6446] h-1.5 bg-[#DCE6DA] rounded-lg cursor-pointer"
              />

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="sim-gender"
                    checked={gender === 'ชาย'}
                    onChange={() => setGender('ชาย')}
                    className="accent-[#3C6446]"
                  />
                  <span>ชาย</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="sim-gender"
                    checked={gender === 'หญิง'}
                    onChange={() => setGender('หญิง')}
                    className="accent-[#3C6446]"
                  />
                  <span>หญิง</span>
                </label>
              </div>
            </div>

            {/* Height, Weight & BMI */}
            <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DEE8DC] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#2B4633]">
                  2. ส่วนสูง น้ำหนัก และค่า BMI
                </span>
                <span className={`px-2 py-0.5 rounded font-bold ${
                  bmi >= 25 ? 'bg-rose-100 text-rose-800' : bmi >= 23 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  BMI: {bmi} kg/m²
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-[11px] text-[#526B58] mb-1">
                    <span>น้ำหนัก (กก.):</span>
                    <span className="font-bold">{weight} kg</span>
                  </div>
                  <input
                    type="range"
                    min="35"
                    max="120"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full accent-[#3C6446] h-1.5 bg-[#DCE6DA] rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-[#526B58] mb-1">
                    <span>ส่วนสูง (ซม.):</span>
                    <span className="font-bold">{height} cm</span>
                  </div>
                  <input
                    type="range"
                    min="135"
                    max="195"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full accent-[#3C6446] h-1.5 bg-[#DCE6DA] rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Blood Pressure */}
            <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DEE8DC] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#2B4633]">
                  3. ความดันโลหิต (SBP / DBP)
                </span>
                <span className={`px-2 py-0.5 rounded font-bold ${
                  sbp >= 140 || dbp >= 90 ? 'bg-rose-100 text-rose-800' : sbp >= 120 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {sbp}/{dbp} mmHg
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-[11px] text-[#526B58] mb-1">
                    <span>ตัวบน SBP:</span>
                    <span className="font-bold">{sbp}</span>
                  </div>
                  <input
                    type="range"
                    min="90"
                    max="200"
                    value={sbp}
                    onChange={(e) => setSbp(Number(e.target.value))}
                    className="w-full accent-[#3C6446] h-1.5 bg-[#DCE6DA] rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-[#526B58] mb-1">
                    <span>ตัวล่าง DBP:</span>
                    <span className="font-bold">{dbp}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="120"
                    value={dbp}
                    onChange={(e) => setDbp(Number(e.target.value))}
                    className="w-full accent-[#3C6446] h-1.5 bg-[#DCE6DA] rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Blood Sugar FBS */}
            <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DEE8DC] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#2B4633]">
                  4. ระดับน้ำตาลในเลือด (FBS)
                </span>
                <span className={`px-2 py-0.5 rounded font-bold ${
                  bloodSugar >= 126 ? 'bg-rose-100 text-rose-800' : bloodSugar >= 100 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {bloodSugar} mg/dL
                </span>
              </div>
              <input
                type="range"
                min="70"
                max="220"
                value={bloodSugar}
                onChange={(e) => setBloodSugar(Number(e.target.value))}
                className="w-full accent-[#3C6446] h-1.5 bg-[#DCE6DA] rounded-lg cursor-pointer"
              />
            </div>

            {/* Habits & Lifestyle */}
            <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DEE8DC] space-y-2.5">
              <span className="font-semibold text-[#2B4633] block">
                5. พฤติกรรมสุขภาพ
              </span>
              <div className="flex items-center gap-4 flex-wrap">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smoking}
                    onChange={(e) => setSmoking(e.target.checked)}
                    className="accent-[#3C6446] w-4 h-4 rounded"
                  />
                  <span>สูบบุหรี่</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alcohol}
                    onChange={(e) => setAlcohol(e.target.checked)}
                    className="accent-[#3C6446] w-4 h-4 rounded"
                  />
                  <span>ดื่มแอลกอฮอล์</span>
                </label>
              </div>

              <div className="pt-1">
                <span className="text-[11px] text-[#526B58] block mb-1">การออกกำลังกาย:</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['สม่ำเสมอ', 'บางครั้ง', 'ไม่ออกกำลังกาย'] as const).map((ex) => (
                    <button
                      key={ex}
                      type="button"
                      onClick={() => setExercise(ex)}
                      className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                        exercise === ex
                          ? 'bg-[#3C6446] text-white border-[#3C6446] font-bold'
                          : 'bg-white text-[#385440] border-[#CAD8C8] hover:bg-[#F2F6F1]'
                      }`}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Live Simulated Outcome Card (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            <div className={`p-5 rounded-2xl border text-center shadow-xs transition-all ${
              level === 'สูง'
                ? 'bg-gradient-to-b from-rose-50 to-white border-rose-200'
                : level === 'ปานกลาง'
                ? 'bg-gradient-to-b from-amber-50 to-white border-amber-200'
                : 'bg-gradient-to-b from-emerald-50 to-white border-emerald-200'
            }`}>
              
              <span className="text-xs uppercase font-bold tracking-wider text-[#637C6A] block">
                ผลการประเมินจำลองสุขภาพ
              </span>

              {/* Large Score Dial */}
              <div className="my-3 inline-flex flex-col items-center justify-center w-24 h-24 rounded-full bg-white shadow-sm border-2 border-dashed border-[#CAD8C8]">
                <span className="text-3xl font-extrabold text-[#1B2F21]">{score}</span>
                <span className="text-[10px] text-[#607A67]">คะแนนความเสี่ยง</span>
              </div>

              {/* Risk Level Badge */}
              <div className="mb-3">
                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold shadow-xs ${
                  level === 'สูง'
                    ? 'bg-rose-600 text-white'
                    : level === 'ปานกลาง'
                    ? 'bg-amber-500 text-white'
                    : 'bg-emerald-600 text-white'
                }`}>
                  {level === 'สูง' ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>ระดับความเสี่ยง: {level}</span>
                </span>
              </div>

              {/* Contributing Factors */}
              <div className="text-left text-xs bg-white/80 rounded-xl p-3 border border-[#E1EADF] space-y-1.5">
                <span className="font-semibold text-[#2D4935] block border-b border-[#EDF3EC] pb-1">
                  ปัจจัยที่ตรวจพบในแบบจำลอง ({factors.length} รายการ):
                </span>
                {factors.length === 0 ? (
                  <span className="text-emerald-700 italic">ไม่พบปัจจัยเสี่ยง (สุขภาพปกติสมบูรณ์)</span>
                ) : (
                  factors.map((f, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[#3A5341]">
                      <ArrowRight className="w-3 h-3 text-[#3C6446] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))
                )}
              </div>

            </div>

            {/* Clinical Recommendation */}
            <div className="p-3.5 rounded-xl bg-[#F4F8F3] border border-[#CCDDC9] text-xs space-y-1.5">
              <span className="font-bold text-[#284931] flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#3C6947]" /> แผนการดูแลเวชระเบียนที่แนะนำ
              </span>
              <p className="text-[#45634E] leading-relaxed text-[11px]">
                {recommendation}
              </p>
            </div>

            {/* Done button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[#3C6446] hover:bg-[#315339] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              ปิดหน้าต่างเครื่องมือจำลอง
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
