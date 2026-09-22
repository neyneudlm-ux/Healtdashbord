import React from 'react';
import { Filter, RotateCcw, Search, MapPin, Users, Calendar, AlertCircle, Sparkles, HeartPulse } from 'lucide-react';
import { FilterState } from '../types/health';

interface FiltersBarProps {
  filters: FilterState;
  onChangeFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onResetFilters: () => void;
  areaOptions: string[];
  totalCount: number;
  filteredCount: number;
  onOpenSimulator?: () => void;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  filters,
  onChangeFilter,
  onResetFilters,
  areaOptions,
  totalCount,
  filteredCount,
  onOpenSimulator,
}) => {
  const isFiltered =
    filters.area !== 'ทั้งหมด' ||
    filters.gender !== 'ทั้งหมด' ||
    filters.ageGroup !== 'ทั้งหมด' ||
    filters.riskLevel !== 'ทั้งหมด' ||
    filters.screeningCondition !== 'ทั้งหมด' ||
    filters.searchQuery !== '';

  // Quick preset shortcuts
  const applyPreset = (preset: 'highRisk' | 'elderly' | 'dm' | 'ht' | 'all') => {
    onResetFilters();
    if (preset === 'highRisk') {
      onChangeFilter('riskLevel', 'สูง');
    } else if (preset === 'elderly') {
      onChangeFilter('ageGroup', '> 60 ปี');
    } else if (preset === 'dm') {
      onChangeFilter('screeningCondition', 'เสี่ยงเบาหวาน');
    } else if (preset === 'ht') {
      onChangeFilter('screeningCondition', 'เสี่ยงความดัน');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#DDE6DC] p-4 sm:p-5 shadow-xs mb-6">
      <div className="flex flex-col gap-4">
        
        {/* Top Header & Presets */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#EEF3ED] pb-3">
          <div className="flex items-center gap-2 text-[#2D4935] font-semibold text-sm sm:text-base">
            <Filter className="w-4 h-4 text-[#446F4E]" />
            <span>ตัวกรองและเงื่อนไขการคัดกรอง (Filters & Criteria)</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EBF1EA] text-[#34553E] border border-[#CCDBCB]">
              แสดง {filteredCount} / {totalCount} ราย
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onOpenSimulator && (
              <button
                type="button"
                onClick={onOpenSimulator}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#3C6446] hover:bg-[#315339] shadow-2xs transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>จำลองคำนวณความเสี่ยง</span>
              </button>
            )}

            {isFiltered && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#C04242] bg-[#FDF2F2] hover:bg-[#FBE4E4] border border-[#F5C7C7] transition-all active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ล้างตัวกรองทั้งหมด</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Scenario Shortcut Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
          <span className="text-[#597361] font-medium whitespace-nowrap flex items-center gap-1">
            <HeartPulse className="w-3.5 h-3.5 text-[#375E40]" /> ทางลัดกลุ่มเป้าหมาย:
          </span>

          <button
            type="button"
            onClick={() => applyPreset('highRisk')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all border font-medium ${
              filters.riskLevel === 'สูง'
                ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
            }`}
          >
            🔴 กลุ่มเสี่ยงสูงเร่งด่วน
          </button>

          <button
            type="button"
            onClick={() => applyPreset('elderly')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all border font-medium ${
              filters.ageGroup === '> 60 ปี'
                ? 'bg-[#375E40] text-white border-[#375E40] shadow-2xs'
                : 'bg-[#F2F6F1] text-[#2F4E37] border-[#D0DECE] hover:bg-[#E3EFE1]'
            }`}
          >
            🧓 ผู้สูงอายุ (&gt; 60 ปี)
          </button>

          <button
            type="button"
            onClick={() => applyPreset('dm')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all border font-medium ${
              filters.screeningCondition === 'เสี่ยงเบาหวาน'
                ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            ⚠️ เสี่ยงเบาหวาน (FBS &ge; 100)
          </button>

          <button
            type="button"
            onClick={() => applyPreset('ht')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all border font-medium ${
              filters.screeningCondition === 'เสี่ยงความดัน'
                ? 'bg-[#375E40] text-white border-[#375E40] shadow-2xs'
                : 'bg-[#F2F6F1] text-[#2F4E37] border-[#D0DECE] hover:bg-[#E3EFE1]'
            }`}
          >
            🩺 เสี่ยงความดัน (SBP &ge; 140)
          </button>

          <button
            type="button"
            onClick={onResetFilters}
            className="px-3 py-1 rounded-full whitespace-nowrap bg-white text-[#526B58] border border-[#CCD8CB] hover:bg-[#F2F6F1] transition-all"
          >
            🌿 ประชากรทั้งหมด ({totalCount})
          </button>
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          
          {/* 1. Area Filter */}
          <div>
            <label className="block text-xs font-semibold text-[#48604F] mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#3F684A]" /> พื้นที่รับผิดชอบ
            </label>
            <select
              value={filters.area}
              onChange={(e) => onChangeFilter('area', e.target.value)}
              className="w-full bg-[#F7F9F6] border border-[#CAD8C8] text-[#203425] text-xs sm:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#527E5C] focus:outline-none transition-all cursor-pointer font-medium"
            >
              <option value="ทั้งหมด">ทุกพื้นที่ ({areaOptions.length} โซน)</option>
              {areaOptions.map((area) => (
                <option key={area} value={area}>
                  โซน: {area}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Gender Filter */}
          <div>
            <label className="block text-xs font-semibold text-[#48604F] mb-1.5 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#3F684A]" /> เพศ
            </label>
            <select
              value={filters.gender}
              onChange={(e) => onChangeFilter('gender', e.target.value)}
              className="w-full bg-[#F7F9F6] border border-[#CAD8C8] text-[#203425] text-xs sm:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#527E5C] focus:outline-none transition-all cursor-pointer font-medium"
            >
              <option value="ทั้งหมด">เพศทั้งหมด</option>
              <option value="ชาย">เพศชาย</option>
              <option value="หญิง">เพศหญิง</option>
            </select>
          </div>

          {/* 3. Age Group Filter */}
          <div>
            <label className="block text-xs font-semibold text-[#48604F] mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#3F684A]" /> ช่วงอายุ
            </label>
            <select
              value={filters.ageGroup}
              onChange={(e) => onChangeFilter('ageGroup', e.target.value)}
              className="w-full bg-[#F7F9F6] border border-[#CAD8C8] text-[#203425] text-xs sm:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#527E5C] focus:outline-none transition-all cursor-pointer font-medium"
            >
              <option value="ทั้งหมด">ทุกช่วงอายุ</option>
              <option value="< 35 ปี">น้อยกว่า 35 ปี</option>
              <option value="35 - 50 ปี">35 - 50 ปี (วัยทำงาน)</option>
              <option value="51 - 60 ปี">51 - 60 ปี (ก่อนสูงอายุ)</option>
              <option value="> 60 ปี">&gt; 60 ปี (ผู้สูงอายุ)</option>
            </select>
          </div>

          {/* 4. Risk Level Filter */}
          <div>
            <label className="block text-xs font-semibold text-[#48604F] mb-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-[#3F684A]" /> ระดับความเสี่ยง
            </label>
            <select
              value={filters.riskLevel}
              onChange={(e) => onChangeFilter('riskLevel', e.target.value)}
              className="w-full bg-[#F7F9F6] border border-[#CAD8C8] text-[#203425] text-xs sm:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#527E5C] focus:outline-none transition-all cursor-pointer font-medium"
            >
              <option value="ทั้งหมด">ทุกระดับความเสี่ยง</option>
              <option value="ต่ำ">ความเสี่ยงต่ำ (ปกติ)</option>
              <option value="ปานกลาง">ความเสี่ยงปานกลาง</option>
              <option value="สูง">ความเสี่ยงสูง</option>
            </select>
          </div>

          {/* 5. Search Bar */}
          <div>
            <label className="block text-xs font-semibold text-[#48604F] mb-1.5 flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-[#3F684A]" /> ค้นหารหัสบุคคล (ID)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="เช่น H0001, H0020 หรือชื่อพื้นที่"
                value={filters.searchQuery}
                onChange={(e) => onChangeFilter('searchQuery', e.target.value)}
                className="w-full bg-[#F7F9F6] border border-[#CAD8C8] text-[#203425] text-xs sm:text-sm rounded-lg pl-8 pr-3 py-2 focus:ring-2 focus:ring-[#527E5C] focus:outline-none transition-all placeholder:text-[#91A696]"
              />
              <Search className="w-3.5 h-3.5 text-[#6D8A74] absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

        </div>

        {/* Condition Check Chips */}
        <div className="flex items-center gap-2 flex-wrap pt-1 text-xs border-t border-[#EEF3ED]">
          <span className="text-[#597361] font-semibold">คัดกรองภาวะเฉพาะโรค:</span>
          
          <button
            type="button"
            onClick={() => onChangeFilter('screeningCondition', filters.screeningCondition === 'เสี่ยงเบาหวาน' ? 'ทั้งหมด' : 'เสี่ยงเบาหวาน')}
            className={`px-3 py-1 rounded-full border transition-all ${
              filters.screeningCondition === 'เสี่ยงเบาหวาน'
                ? 'bg-[#3E6548] text-white border-[#3E6548] font-bold shadow-2xs'
                : 'bg-[#F2F6F1] text-[#3D5A44] border-[#CAD8C8] hover:bg-[#E3EFE1]'
            }`}
          >
            น้ำตาลเสี่ยงเบาหวาน
          </button>

          <button
            type="button"
            onClick={() => onChangeFilter('screeningCondition', filters.screeningCondition === 'เสี่ยงความดัน' ? 'ทั้งหมด' : 'เสี่ยงความดัน')}
            className={`px-3 py-1 rounded-full border transition-all ${
              filters.screeningCondition === 'เสี่ยงความดัน'
                ? 'bg-[#3E6548] text-white border-[#3E6548] font-bold shadow-2xs'
                : 'bg-[#F2F6F1] text-[#3D5A44] border-[#CAD8C8] hover:bg-[#E3EFE1]'
            }`}
          >
            เสี่ยงความดันโลหิตสูง
          </button>

          <button
            type="button"
            onClick={() => onChangeFilter('screeningCondition', filters.screeningCondition === 'เสี่ยงทั้งคู่' ? 'ทั้งหมด' : 'เสี่ยงทั้งคู่')}
            className={`px-3 py-1 rounded-full border transition-all ${
              filters.screeningCondition === 'เสี่ยงทั้งคู่'
                ? 'bg-[#A24444] text-white border-[#A24444] font-bold shadow-2xs'
                : 'bg-[#FDF2F2] text-[#8C3434] border-[#F2D0D0] hover:bg-[#FAE5E5]'
            }`}
          >
            เสี่ยงทั้งเบาหวานและความดัน (Comorbidity)
          </button>
        </div>

      </div>
    </div>
  );
};
