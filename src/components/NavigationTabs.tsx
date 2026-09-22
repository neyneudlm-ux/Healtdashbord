import React from 'react';
import { LayoutDashboard, AlertTriangle, TrendingUp, HeartPulse, Table, Filter } from 'lucide-react';
import { TabType } from '../types/health';

interface NavigationTabsProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  filteredCount: number;
  totalCount: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  currentTab,
  onChangeTab,
  filteredCount,
  totalCount,
}) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'overview',
      label: 'ภาพรวมและตัวชี้วัด (Overview)',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'risk',
      label: 'การวิเคราะห์ความเสี่ยง (Health Risk)',
      icon: <AlertTriangle className="w-4 h-4" />
    },
    {
      id: 'trend-correlation',
      label: 'แนวโน้มและความสัมพันธ์ (Trends)',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: 'behavior-area',
      label: 'พฤติกรรมและพื้นที่ (Behaviors & Areas)',
      icon: <HeartPulse className="w-4 h-4" />
    },
    {
      id: 'table',
      label: 'รายละเอียดเชิงลึก (Data Registry)',
      icon: <Table className="w-4 h-4" />,
      badge: `${filteredCount}`
    }
  ];

  return (
    <div className="bg-[#EDF3EC] border-b border-[#D8E4D6] sticky top-0 z-20 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-2">
          
          <nav className="flex items-center space-x-1 sm:space-x-2">
            {tabs.map(tab => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onChangeTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#375E40] text-white shadow-xs'
                      : 'text-[#445E4C] hover:bg-[#DEE8DC] hover:text-[#1E3324]'
                  }`}
                >
                  <span className={isActive ? 'text-[#D2E4D4]' : 'text-[#56745F]'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`ml-1 px-1.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        isActive
                          ? 'bg-[#294831] text-[#E0EFE3]'
                          : 'bg-[#D6E3D4] text-[#334E3A]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick status badge */}
          <div className="hidden md:flex items-center gap-2 pl-4 text-xs text-[#526B57] font-medium shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#3E6548]" />
            <span>ผลการคัดกรอง:</span>
            <span className="bg-white px-2 py-0.5 rounded-md border border-[#D5E1D3] text-[#243B2B] font-semibold">
              {filteredCount} / {totalCount} ราย
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
