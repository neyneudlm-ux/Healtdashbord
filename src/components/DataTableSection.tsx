import React, { useState, useMemo } from 'react';
import {
  ArrowUpDown, Download, Eye, ChevronLeft, ChevronRight, User, AlertTriangle
} from 'lucide-react';
import { HealthRecord } from '../types/health';
import {
  getBmiCategory,
  getBloodPressureCategory,
  getBloodSugarCategory,
  getRiskLevelBadge
} from '../utils/healthCalculations';

interface DataTableSectionProps {
  records: HealthRecord[];
  onSelectRecord: (record: HealthRecord) => void;
}

type SortField = 'id' | 'age' | 'bmi' | 'sbp' | 'bloodSugar' | 'riskScore';
type SortOrder = 'asc' | 'desc';

export const DataTableSection: React.FC<DataTableSectionProps> = ({ records, onSelectRecord }) => {
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedRecords = useMemo(() => {
    const list = [...records];
    list.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
    return list;
  }, [records, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  // CSV Export
  const exportToCSV = () => {
    const headers = [
      'รหัสบุคคล', 'วันที่คัดกรอง', 'พื้นที่', 'เพศ', 'อายุ', 'ส่วนสูง_cm', 'น้ำหนัก_kg',
      'BMI', 'SBP_mmHg', 'DBP_mmHg', 'ชีพจร_bpm', 'น้ำตาล_mg_dL', 'สูบบุหรี่',
      'ดื่มแอลกอฮอล์', 'การออกกำลังกาย', 'เบาหวาน_คัดกรอง', 'ความดันโลหิตสูง_คัดกรอง',
      'คะแนนความเสี่ยง', 'ระดับความเสี่ยง'
    ];

    const rows = sortedRecords.map(r => [
      r.id, r.screeningDate, r.area, r.gender, r.age, r.heightCm, r.weightKg,
      r.bmi, r.sbp, r.dbp, r.pulse, r.bloodSugar, r.smoking,
      r.alcohol, r.exercise, r.diabetesScreening, r.hypertensionScreening,
      r.riskScore, r.riskLevel
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF"
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `รายงานผลการคัดกรองสุขภาพ_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl border border-[#DCE6DA] shadow-xs overflow-hidden">
      
      {/* Table Action Bar */}
      <div className="p-4 sm:p-5 border-b border-[#EEF3ED] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#FAFBF9]">
        <div>
          <h3 className="font-bold text-[#1E3023] text-sm sm:text-base flex items-center gap-2">
            <span>ทะเบียนข้อมูลคัดกรองรายบุคคล (Medical Records Registry)</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-[#EBF1EA] text-[#34553E] border border-[#CCDBCB]">
              ทั้งหมด {records.length} ราย
            </span>
          </h3>
          <p className="text-xs text-[#526D59] mt-0.5">
            แสดงข้อมูลสัญญาณชีพพร้อมระบบแถบสีแจ้งเตือนความเสี่ยง (Conditional Formatting)
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Page Size Selector */}
          <div className="flex items-center gap-1.5 text-xs text-[#4F6855]">
            <span>แสดง:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-[#CAD8C8] rounded-md px-2 py-1 text-xs text-[#203425] focus:outline-none"
            >
              <option value={10}>10 รายการ</option>
              <option value={20}>20 รายการ</option>
              <option value={30}>ทั้งหมด (30)</option>
            </select>
          </div>

          {/* Export CSV button */}
          <button
            type="button"
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#F3F7F2] text-[#2F4C37] text-xs font-semibold border border-[#CAD8C8] shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลด CSV</span>
          </button>
        </div>
      </div>

      {/* Legend for Conditional Formatting */}
      <div className="px-4 py-2 bg-[#F4F7F3] border-b border-[#E3EDE1] flex items-center gap-4 text-[11px] text-[#4E6855] overflow-x-auto no-scrollbar">
        <span className="font-semibold text-[#27402F] whitespace-nowrap">แถบสีแจ้งเตือน:</span>
        <span className="flex items-center gap-1 whitespace-nowrap"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> ปกติ/เสี่ยงต่ำ</span>
        <span className="flex items-center gap-1 whitespace-nowrap"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> เริ่มเสี่ยง/เสี่ยงปานกลาง</span>
        <span className="flex items-center gap-1 whitespace-nowrap"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> เสี่ยงสูง/ผิดปกติ</span>
        <span className="text-[#6C8673] ml-auto whitespace-nowrap">*คลิกที่แถวเพื่อดูข้อมูลสุขภาพฉบับเต็ม</span>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-[#FAFBF9] text-[#2F4B36] border-b border-[#DEE8DC]">
              
              <th className="py-3 px-3.5 font-bold cursor-pointer hover:bg-[#EDF3EC] transition-colors" onClick={() => handleSort('id')}>
                <div className="flex items-center gap-1">
                  <span>รหัสบุคคล</span>
                  <ArrowUpDown className="w-3 h-3 text-[#5A7462]" />
                </div>
              </th>

              <th className="py-3 px-3 font-semibold">พื้นที่</th>
              <th className="py-3 px-3 font-semibold">เพศ</th>
              
              <th className="py-3 px-3 font-bold cursor-pointer hover:bg-[#EDF3EC] transition-colors" onClick={() => handleSort('age')}>
                <div className="flex items-center gap-1">
                  <span>อายุ</span>
                  <ArrowUpDown className="w-3 h-3 text-[#5A7462]" />
                </div>
              </th>

              <th className="py-3 px-3.5 font-bold cursor-pointer hover:bg-[#EDF3EC] transition-colors" onClick={() => handleSort('bmi')}>
                <div className="flex items-center gap-1">
                  <span>BMI (kg/m²)</span>
                  <ArrowUpDown className="w-3 h-3 text-[#5A7462]" />
                </div>
              </th>

              <th className="py-3 px-3.5 font-bold cursor-pointer hover:bg-[#EDF3EC] transition-colors" onClick={() => handleSort('sbp')}>
                <div className="flex items-center gap-1">
                  <span>ความดัน SBP/DBP</span>
                  <ArrowUpDown className="w-3 h-3 text-[#5A7462]" />
                </div>
              </th>

              <th className="py-3 px-3.5 font-bold cursor-pointer hover:bg-[#EDF3EC] transition-colors" onClick={() => handleSort('bloodSugar')}>
                <div className="flex items-center gap-1">
                  <span>น้ำตาล FBS (mg/dL)</span>
                  <ArrowUpDown className="w-3 h-3 text-[#5A7462]" />
                </div>
              </th>

              <th className="py-3 px-3 font-semibold">พฤติกรรม (บุหรี่/สุรา/ออกกำลัง)</th>
              
              <th className="py-3 px-3.5 font-bold cursor-pointer hover:bg-[#EDF3EC] transition-colors" onClick={() => handleSort('riskScore')}>
                <div className="flex items-center gap-1">
                  <span>คะแนนเสี่ยง</span>
                  <ArrowUpDown className="w-3 h-3 text-[#5A7462]" />
                </div>
              </th>

              <th className="py-3 px-3.5 font-semibold text-center">ระดับความเสี่ยง</th>
              <th className="py-3 px-3 font-semibold text-center">รายละเอียด</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EEF4ED]">
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-[#5E7966]">
                  ไม่พบข้อมูลตามเงื่อนไขตัวกรองที่กำหนด
                </td>
              </tr>
            ) : (
              paginatedRecords.map((r) => {
                const bmiCat = getBmiCategory(r.bmi);
                const bpCat = getBloodPressureCategory(r.sbp, r.dbp);
                const sugarCat = getBloodSugarCategory(r.bloodSugar);
                const riskBadge = getRiskLevelBadge(r.riskLevel);

                return (
                  <tr
                    key={r.id}
                    onClick={() => onSelectRecord(r)}
                    className="hover:bg-[#F4F8F3] cursor-pointer transition-colors"
                  >
                    
                    {/* ID */}
                    <td className="py-3 px-3.5 font-bold text-[#1F3325]">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#3E6548]" />
                        <span>{r.id}</span>
                      </div>
                    </td>

                    {/* Area */}
                    <td className="py-3 px-3 text-[#2E4835] font-medium">{r.area}</td>

                    {/* Gender */}
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        r.gender === 'ชาย' ? 'bg-[#EEF4FB] text-[#29527A]' : 'bg-[#FCEDF2] text-[#8C3450]'
                      }`}>
                        {r.gender}
                      </span>
                    </td>

                    {/* Age */}
                    <td className="py-3 px-3 text-[#1E3023] font-semibold">{r.age} ปี</td>

                    {/* BMI with Conditional Formatting */}
                    <td className="py-3 px-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded font-semibold text-xs border ${
                        r.bmi >= 25 
                          ? 'bg-rose-50 text-rose-700 border-rose-200' 
                          : r.bmi >= 23 
                          ? 'bg-amber-50 text-amber-800 border-amber-200' 
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {r.bmi} ({bmiCat.label})
                      </span>
                    </td>

                    {/* Blood Pressure with Conditional Formatting */}
                    <td className="py-3 px-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded font-semibold text-xs border ${
                        r.sbp >= 140 || r.dbp >= 90
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : r.sbp >= 120 || r.dbp >= 80
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {r.sbp}/{r.dbp}
                      </span>
                    </td>

                    {/* Blood Sugar with Conditional Formatting */}
                    <td className="py-3 px-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded font-semibold text-xs border ${
                        r.bloodSugar >= 126
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : r.bloodSugar >= 100
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {r.bloodSugar} mg/dL
                      </span>
                    </td>

                    {/* Behaviors */}
                    <td className="py-3 px-3 text-[#4A6451]">
                      <div className="flex items-center gap-1 text-[11px]">
                        <span className={r.smoking === 'สูบ' ? 'text-rose-700 font-bold' : 'text-[#6C8573]'}>
                          {r.smoking === 'สูบ' ? 'สูบ' : 'ไม่สูบ'}
                        </span>
                        <span>/</span>
                        <span className={r.alcohol === 'ดื่ม' ? 'text-amber-700 font-bold' : 'text-[#6C8573]'}>
                          {r.alcohol === 'ดื่ม' ? 'ดื่ม' : 'ไม่ดื่ม'}
                        </span>
                        <span>/</span>
                        <span className={r.exercise === 'สม่ำเสมอ' ? 'text-emerald-700 font-bold' : r.exercise === 'ไม่ออกกำลังกาย' ? 'text-rose-700 font-bold' : 'text-[#5C7564]'}>
                          {r.exercise}
                        </span>
                      </div>
                    </td>

                    {/* Risk Score */}
                    <td className="py-3 px-3.5 font-bold text-[#1F3325]">
                      {r.riskScore} <span className="font-normal text-[11px] text-[#647E6B]">/ 7</span>
                    </td>

                    {/* Risk Level with Badge */}
                    <td className="py-3 px-3.5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${riskBadge.bg} ${riskBadge.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${riskBadge.dotColor}`}></span>
                        {riskBadge.label}
                      </span>
                    </td>

                    {/* Detail Button */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRecord(r);
                        }}
                        className="p-1 rounded-md text-[#3E6548] hover:bg-[#EAF1E8] transition-colors"
                        title="ดูประวัติการตรวจ"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-[#EEF3ED] bg-[#FAFBF9] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-[#516C5A]">
        <div>
          แสดงหน้า <span className="font-bold text-[#233B2B]">{currentPage}</span> จากทั้งหมด <span className="font-bold text-[#233B2B]">{totalPages}</span> หน้า (รวม {records.length} รายการ)
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#CAD8C8] bg-white text-[#2B4633] font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F3F7F2] transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>ก่อนหน้า</span>
          </button>

          <span className="px-3 py-1.5 rounded-lg bg-[#EBF1EA] text-[#2E4B36] font-semibold border border-[#CCDBCB]">
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#CAD8C8] bg-white text-[#2B4633] font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F3F7F2] transition-colors"
          >
            <span>ถัดไป</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
