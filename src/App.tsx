import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HealthRecord, FilterState, TabType, FontSizeSetting } from './types/health';
import { INITIAL_HEALTH_RECORDS, syncHealthDataFromSheet } from './data/initialData';
import { computeHealthStats } from './utils/healthCalculations';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { FiltersBar } from './components/FiltersBar';
import { KPICards } from './components/KPICards';
import { SmartClinicalInsights } from './components/SmartClinicalInsights';
import { RiskAnalysisSection } from './components/RiskAnalysisSection';
import { TrendsAndCorrelations } from './components/TrendsAndCorrelations';
import { BehaviorsAndGeography } from './components/BehaviorsAndGeography';
import { DataTableSection } from './components/DataTableSection';
import { PatientDetailModal } from './components/PatientDetailModal';
import { ExportSummaryModal } from './components/ExportSummaryModal';
import { HealthRiskSimulatorModal } from './components/HealthRiskSimulatorModal';
import { Activity, ShieldCheck, Heart, UserCheck } from 'lucide-react';

export default function App() {
  const [records, setRecords] = useState<HealthRecord[]>(INITIAL_HEALTH_RECORDS);
  const [currentTab, setCurrentTab] = useState<TabType>('overview');
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isEyeCareMode, setIsEyeCareMode] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>(
    new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
  );
  const [fontSize, setFontSize] = useState<FontSizeSetting>('normal');

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    area: 'ทั้งหมด',
    gender: 'ทั้งหมด',
    ageGroup: 'ทั้งหมด',
    riskLevel: 'ทั้งหมด',
    screeningCondition: 'ทั้งหมด',
    searchQuery: '',
  });

  // Sync with live sheet in background
  const handleSyncData = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await syncHealthDataFromSheet();
      setRecords(res.records);
      setLastUpdated(res.updatedTime + ' น.');
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Sync once on initial mount
  useEffect(() => {
    handleSyncData();
  }, [handleSyncData]);

  // Handle Filter Change
  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      area: 'ทั้งหมด',
      gender: 'ทั้งหมด',
      ageGroup: 'ทั้งหมด',
      riskLevel: 'ทั้งหมด',
      screeningCondition: 'ทั้งหมด',
      searchQuery: '',
    });
  };

  // Distinct Areas
  const areaOptions = useMemo(() => {
    const list = Array.from(new Set(records.map(r => r.area))).filter(Boolean);
    return list.sort();
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      // Area
      if (filters.area !== 'ทั้งหมด' && r.area !== filters.area) {
        return false;
      }
      // Gender
      if (filters.gender !== 'ทั้งหมด' && r.gender !== filters.gender) {
        return false;
      }
      // Age group
      if (filters.ageGroup !== 'ทั้งหมด') {
        if (filters.ageGroup === '< 35 ปี' && r.age >= 35) return false;
        if (filters.ageGroup === '35 - 50 ปี' && (r.age < 35 || r.age > 50)) return false;
        if (filters.ageGroup === '51 - 60 ปี' && (r.age < 51 || r.age > 60)) return false;
        if (filters.ageGroup === '> 60 ปี' && r.age <= 60) return false;
      }
      // Risk Level
      if (filters.riskLevel !== 'ทั้งหมด' && r.riskLevel !== filters.riskLevel) {
        return false;
      }
      // Screening condition
      if (filters.screeningCondition === 'เสี่ยงเบาหวาน') {
        if (r.diabetesScreening !== 'มีแนวโน้ม/เสี่ยง' && r.bloodSugar < 100) return false;
      } else if (filters.screeningCondition === 'เสี่ยงความดัน') {
        if (r.hypertensionScreening !== 'มีแนวโน้ม/เสี่ยง' && r.sbp < 140) return false;
      } else if (filters.screeningCondition === 'เสี่ยงทั้งคู่') {
        const dm = r.diabetesScreening === 'มีแนวโน้ม/เสี่ยง' || r.bloodSugar >= 126;
        const ht = r.hypertensionScreening === 'มีแนวโน้ม/เสี่ยง' || r.sbp >= 140;
        if (!dm || !ht) return false;
      }
      // Search
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.trim().toLowerCase();
        const matchId = r.id.toLowerCase().includes(q);
        const matchArea = r.area.toLowerCase().includes(q);
        if (!matchId && !matchArea) return false;
      }
      return true;
    });
  }, [records, filters]);

  // Compute Statistics for Filtered Data
  const stats = useMemo(() => {
    return computeHealthStats(filteredRecords);
  }, [filteredRecords]);

  // Accessibility font-size wrapper classes
  const fontWrapperClass = useMemo(() => {
    switch (fontSize) {
      case 'large':
        return 'text-[17px] leading-relaxed [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl [&_h4]:text-lg [&_p]:text-base';
      case 'xlarge':
        return 'text-[19px] leading-loose [&_h1]:text-4xl [&_h2]:text-3xl [&_h3]:text-2xl [&_h4]:text-xl [&_p]:text-lg font-medium';
      default:
        return 'text-sm leading-normal';
    }
  }, [fontSize]);

  return (
    <div className={`min-h-screen ${isEyeCareMode ? 'bg-[#EEF4ED]' : 'bg-[#F7F9F6]'} text-[#1E2D24] flex flex-col font-['Sarabun',sans-serif] transition-colors duration-200 ${fontWrapperClass}`}>
      
      {/* 1. Header & Controls */}
      <Header
        lastUpdated={lastUpdated}
        isSyncing={isSyncing}
        onSync={handleSyncData}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        totalRecordsCount={records.length}
        isEyeCareMode={isEyeCareMode}
        onToggleEyeCare={() => setIsEyeCareMode(prev => !prev)}
      />

      {/* 5. Navigation Tabs */}
      <NavigationTabs
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        filteredCount={filteredRecords.length}
        totalCount={records.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Filters Bar (Accessible across all views) */}
        <FiltersBar
          filters={filters}
          onChangeFilter={handleFilterChange}
          onResetFilters={handleResetFilters}
          areaOptions={areaOptions}
          totalCount={records.length}
          filteredCount={filteredRecords.length}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
        />

        {/* Tab 1: Overview & Primary KPI Cards */}
        {currentTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Smart Clinical Insights Card */}
            <SmartClinicalInsights
              stats={stats}
              records={filteredRecords}
              onQuickFilterHighRisk={() => {
                handleResetFilters();
                handleFilterChange('riskLevel', 'สูง');
              }}
              onQuickFilterHypertension={() => {
                handleResetFilters();
                handleFilterChange('screeningCondition', 'เสี่ยงความดัน');
              }}
              onOpenSimulator={() => setIsSimulatorOpen(true)}
            />

            {/* 2. KPI Summary Cards */}
            <KPICards stats={stats} />

            {/* Quick Preview Split: Risk Snapshot & DataTable preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
              
              {/* Snapshot of Medical Highlights */}
              <div className="bg-white rounded-xl border border-[#DCE6DA] p-5 shadow-xs lg:col-span-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-[#1E3023] text-sm sm:text-base flex items-center gap-2 mb-3 border-b border-[#EDF3EC] pb-2.5">
                    <Heart className="w-4 h-4 text-[#3E6548]" />
                    <span>สรุปประเด็นสารสนเทศสุขภาพ</span>
                  </h3>
                  
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-lg bg-[#F8FAF7] border border-[#E3EDE1]">
                      <span className="font-bold text-[#2A4432] block">กลุ่มเป้าหมายเร่งด่วน:</span>
                      <p className="text-[#516C5A] mt-0.5">
                        ผู้มีความเสี่ยงสูงมีจำนวน <strong className="text-rose-700">{stats.highRiskCount} คน</strong> ({stats.highRiskPercent}%) ซึ่งมีทั้งภาวะอ้วน (BMI &ge; 25) และความดันโลหิตเกิน 140 mmHg
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-[#F8FAF7] border border-[#E3EDE1]">
                      <span className="font-bold text-[#2A4432] block">ผลการปรับเปลี่ยนพฤติกรรม:</span>
                      <p className="text-[#516C5A] mt-0.5">
                        ประชากรที่ออกกำลังกายสม่ำเสมอมีอัตราความเสี่ยงต่ำ 100% ตรงข้ามกับกลุ่มที่ไม่ออกกำลังกายที่เสี่ยงสูงทุกราย
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-[#F8FAF7] border border-[#E3EDE1]">
                      <span className="font-bold text-[#2A4432] block">สัดส่วนเพศและพื้นที่:</span>
                      <p className="text-[#516C5A] mt-0.5">
                        สัดส่วน ชาย {stats.maleRatio}% : หญิง {stats.femaleRatio}% ครอบคลุมพื้นที่ให้บริการ 5 โซนชุมชน
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EDF3EC] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentTab('risk')}
                    className="text-xs font-semibold text-[#375E40] hover:underline"
                  >
                    ดูผลวิเคราะห์ความเสี่ยงเชิงลึก &rarr;
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('table')}
                    className="text-xs font-semibold text-[#375E40] hover:underline"
                  >
                    ดูตารางเวชระเบียน &rarr;
                  </button>
                </div>
              </div>

              {/* Table Preview */}
              <div className="lg:col-span-2">
                <DataTableSection
                  records={filteredRecords}
                  onSelectRecord={setSelectedRecord}
                />
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Health Risk Analysis (4+ fields) */}
        {currentTab === 'risk' && (
          <div className="animate-in fade-in duration-200">
            <RiskAnalysisSection records={filteredRecords} />
          </div>
        )}

        {/* Tab 3: Health Trends & Correlations */}
        {currentTab === 'trend-correlation' && (
          <div className="animate-in fade-in duration-200">
            <TrendsAndCorrelations records={filteredRecords} />
          </div>
        )}

        {/* Tab 4: Health Behaviors & Areas */}
        {currentTab === 'behavior-area' && (
          <div className="animate-in fade-in duration-200">
            <BehaviorsAndGeography records={filteredRecords} />
          </div>
        )}

        {/* Tab 5: Detailed Data Table */}
        {currentTab === 'table' && (
          <div className="animate-in fade-in duration-200">
            <DataTableSection
              records={filteredRecords}
              onSelectRecord={setSelectedRecord}
            />
          </div>
        )}

      </main>

      {/* Patient Detail Modal */}
      <PatientDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />

      {/* Interactive Health Risk Simulator Modal */}
      <HealthRiskSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />

      {/* Export / Print Summary Modal */}
      <ExportSummaryModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        stats={stats}
        lastUpdated={lastUpdated}
      />

      {/* Footer */}
      <footer className={`${isEyeCareMode ? 'bg-[#F2F6F0] border-[#D1DDD0]' : 'bg-white border-[#DDE6DC]'} border-t mt-12 py-6 transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5C7463]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#4A7255] text-white flex items-center justify-center">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-[#1F3325]">
                รายงานผลการคัดกรองข้อมูลสุขภาพเบื้องต้น
              </span>
              <span>•</span>
              <span>ระบบสารสนเทศเวชระเบียนชุมชน</span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#F4F7F3] px-3 py-1.5 rounded-lg border border-[#E0E9DE]">
              <UserCheck className="w-4 h-4 text-[#3C6446]" />
              <span>
                ผู้จัดทำ: <strong className="text-[#1D2E22]">นางสาวนูรฮานีนี ดาแล่หมัน</strong> นักศึกษาเวชระเบียน
              </span>
            </div>

            <div className="text-[11px] text-[#718B79] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#467352]" />
              <span>คุ้มครองข้อมูลสุขภาพและข้อมูลส่วนบุคคลตาม พ.ร.บ. เวชระเบียน</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
