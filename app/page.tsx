'use client';

import { useState } from 'react';
import HUD from '@/components/HUD';
import StreakCard from '@/components/StreakCard';
import HabitTrail from '@/components/HabitTrail';
import QuestPanel from '@/components/QuestPanel';
import BadgesPanel from '@/components/BadgesPanel';
import LootShop from '@/components/LootShop';
import Graveyard from '@/components/Graveyard';
import ToastContainer from '@/components/ToastContainer';
import LevelUpOverlay from '@/components/LevelUpOverlay';
import TabNavigation, { type TabId } from '@/components/TabNavigation';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  return (
    <>
      <ToastContainer />
      <LevelUpOverlay />
      <HUD />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Mobile tabs (horizontal, above content) */}
        <div className="lg:hidden">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="flex gap-6">
          {/* Main content */}
          <main className="flex-1 min-w-0">
            {activeTab === 'dashboard' && (
              <div className="flex flex-col gap-5 animate-[fade-in_0.2s_ease-out]">
                <StreakCard />
                <HabitTrail />
                <BadgesPanel />
              </div>
            )}

            {activeTab === 'daily' && (
              <div className="rounded-xl border border-border bg-card p-5 sm:p-6 animate-[fade-in_0.2s_ease-out]">
                <QuestPanel period="daily" />
              </div>
            )}

            {activeTab === 'weekly' && (
              <div className="rounded-xl border border-border bg-card p-5 sm:p-6 animate-[fade-in_0.2s_ease-out]">
                <QuestPanel period="weekly" />
              </div>
            )}

            {activeTab === 'monthly' && (
              <div className="rounded-xl border border-border bg-card p-5 sm:p-6 animate-[fade-in_0.2s_ease-out]">
                <QuestPanel period="monthly" />
              </div>
            )}

            {activeTab === 'rewards' && (
              <div className="animate-[fade-in_0.2s_ease-out]">
                <LootShop />
              </div>
            )}

            {activeTab === 'graveyard' && (
              <div className="animate-[fade-in_0.2s_ease-out]">
                <Graveyard />
              </div>
            )}
          </main>

          {/* Desktop tabs (right sidebar) */}
          <div className="hidden lg:block">
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>
      </div>

      <footer className="text-center py-6 text-xs text-muted-dim border-t border-border mt-8">
        Quest Log — Forge habits, slay quests, level up your life.
      </footer>
    </>
  );
}
