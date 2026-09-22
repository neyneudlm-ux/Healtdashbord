export interface HealthRecord {
  id: string; // รหัสบุคคล เช่น H0001
  screeningDate: string; // วันที่คัดกรอง เช่น 3/1/2026
  area: string; // พื้นที่ เช่น เมือง, เหนือ, ตะวันออก, ตะวันตก, ใต้
  gender: 'ชาย' | 'หญิง' | string; // เพศ
  age: number; // อายุ
  heightCm: number; // ส่วนสูง cm
  weightKg: number; // น้ำหนัก kg
  bmi: number; // BMI
  sbp: number; // SBP mmHg
  dbp: number; // DBP mmHg
  pulse: number; // ชีพจร bpm
  bloodSugar: number; // น้ำตาล mg/dL
  smoking: 'สูบ' | 'ไม่สูบ' | string; // สูบบุหรี่
  alcohol: 'ดื่ม' | 'ไม่ดื่ม' | string; // ดื่มแอลกอฮอล์
  exercise: 'สม่ำเสมอ' | 'บางครั้ง' | 'ไม่ออกกำลังกาย' | string; // การออกกำลังกาย
  diabetesScreening: 'ไม่มี' | 'มีแนวโน้ม/เสี่ยง' | string; // เบาหวาน_คัดกรอง
  hypertensionScreening: 'ไม่มี' | 'มีแนวโน้ม/เสี่ยง' | string; // ความดันโลหิตสูง_คัดกรอง
  riskScore: number; // คะแนนความเสี่ยง 0 - 7
  riskLevel: 'ต่ำ' | 'ปานกลาง' | 'สูง' | string; // ระดับความเสี่ยง
  month: string; // เดือน เช่น 2026-01, 2026-02, 2026-03
}

export interface FilterState {
  area: string; // 'ทั้งหมด' or specific area
  gender: string; // 'ทั้งหมด' | 'ชาย' | 'หญิง'
  ageGroup: string; // 'ทั้งหมด' | '< 35 ปี' | '35 - 50 ปี' | '51 - 60 ปี' | '> 60 ปี'
  riskLevel: string; // 'ทั้งหมด' | 'ต่ำ' | 'ปานกลาง' | 'สูง'
  screeningCondition: string; // 'ทั้งหมด' | 'เสี่ยงเบาหวาน' | 'เสี่ยงความดัน' | 'เสี่ยงทั้งคู่'
  searchQuery: string;
}

export type TabType = 'overview' | 'risk' | 'trend-correlation' | 'behavior-area' | 'table';

export type FontSizeSetting = 'normal' | 'large' | 'xlarge';
