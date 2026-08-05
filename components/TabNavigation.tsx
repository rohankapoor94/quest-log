'use client';

import {
  LayoutDashboard,
  Swords,
  CalendarDays,
  CalendarRange,
  ShoppingBag,
  Skull,
} from 'lucide-react';

export type TabId = 'dashboard' | 'daily' | 'weekly' | 'monthly' | 'rewards' | 'graveyard';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const TABS: Tab[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'daily', label: 'Daily', icon: <Swords className="w-4 h-4" /> },
  { id: 'weekly', label: 'Weekly', icon: <CalendarDays className="w-4 h-4" /> },
  { id: 'monthly', label: 'Monthly', icon: <CalendarRange className="w-4 h-4" /> },
  { id: 'rewards', label: 'Rewards', icon: <ShoppingBag className="w-4 h-4" /> },
  { id: 'graveyard', label: 'Graveyard', icon: <Skull className="w-4 h-4" /> },
];

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <>
      {/* ─── Desktop: Right sidebar ─── */}
      <nav className="hidden lg:flex flex-col gap-1 w-44 shrink-0 sticky top-20 self-start" aria-label="Navigation">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer text-left ${
                isActive
                  ? 'bg-xp/10 text-xp border border-xp/20 shadow-[0_0_12px_rgba(167,139,250,0.08)]'
                  : 'text-muted hover:text-foreground hover:bg-card-hover border border-transparent'
              }`}
            >
              <span className={isActive ? 'text-xp' : 'text-muted-dim'}>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* ─── Mobile/Tablet: Top horizontal pills ─── */}
      <div className="lg:hidden flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none mb-4">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-xp/10 text-xp border border-xp/20'
                  : 'text-muted hover:text-foreground bg-card border border-border'
              }`}
            >
              <span className={isActive ? 'text-xp' : 'text-muted-dim'}>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
