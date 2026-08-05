'use client';

import { useQuestStore } from '@/lib/store';
import { Flame, Shield, Minus, Plus, Target } from 'lucide-react';

export default function StreakCard() {
  const streak = useQuestStore((s) => s.streak);
  const shields = useQuestStore((s) => s.shields);
  const dailyQuests = useQuestStore((s) => s.dailyQuests);
  const completedTodayCount = useQuestStore((s) => s.completedTodayCount);

  const dailyGoal = Math.max(1, dailyQuests.length);
  const progressPercent = Math.min(100, (completedTodayCount / dailyGoal) * 100);
  const goalMet = completedTodayCount >= dailyGoal;

  // Flame visual tiers
  const flameTier =
    streak === 0 ? 0 : streak < 7 ? 1 : streak < 21 ? 2 : 3;

  const flameColors = [
    'from-muted-dim/20 to-muted-dim/5',         // dim
    'from-ember/30 to-ember/10',                  // warm
    'from-ember/50 to-ember-bright/20',           // bright
    'from-ember-bright/60 to-gold/30',            // max glow
  ];

  const flameShadows = [
    '',
    'shadow-[0_0_20px_rgba(255,107,53,0.15)]',
    'shadow-[0_0_30px_rgba(255,107,53,0.3)]',
    'shadow-[0_0_50px_rgba(255,69,0,0.4)]',
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold font-[family-name:var(--font-cinzel)] text-foreground flex items-center gap-2">
          <Target className="w-4 h-4 text-xp" />
          Streak &amp; Daily Progress
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted text-xs">Daily Goal:</span>
          <span className="font-mono font-semibold text-foreground">{dailyGoal}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Flame & Streak Number */}
        <div className="flex flex-col items-center gap-3 sm:min-w-[140px]">
          <div
            className={`relative w-24 h-24 rounded-full bg-gradient-to-b ${flameColors[flameTier]} ${flameShadows[flameTier]} flex items-center justify-center transition-all duration-500`}
          >
            <Flame
              className={`w-10 h-10 transition-all duration-500 ${
                flameTier === 0
                  ? 'text-muted-dim/50'
                  : flameTier === 1
                    ? 'text-ember/70'
                    : flameTier === 2
                      ? 'text-ember animate-pulse'
                      : 'text-ember-bright animate-pulse drop-shadow-[0_0_8px_rgba(255,69,0,0.6)]'
              }`}
            />
            {flameTier === 3 && (
              <div className="absolute inset-0 rounded-full border border-gold/20 animate-ping opacity-30" />
            )}
          </div>
          <div className="text-center">
            <span className="text-3xl font-bold font-mono text-foreground">{streak}</span>
            <p className="text-xs text-muted mt-0.5">day streak</p>
          </div>
        </div>

        {/* Progress & Shields */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Daily progress */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-muted">Today&apos;s Progress</span>
              <span className="text-sm font-mono font-semibold text-foreground">
                {completedTodayCount} / {dailyGoal} quests
              </span>
            </div>
            <div className="h-3 rounded-full bg-border overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  goalMet
                    ? 'bg-gradient-to-r from-success-dim to-success shadow-[0_0_10px_rgba(74,222,128,0.3)]'
                    : 'bg-gradient-to-r from-xp-dim to-xp'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {goalMet && (
              <p className="text-xs text-success mt-1.5 font-medium animate-[fade-in_0.3s_ease-out]">
                ✨ Daily goal achieved! Your streak will grow tomorrow.
              </p>
            )}
          </div>

          {/* Shields */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted">Streak Shields</span>
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <Shield
                  key={i}
                  className={`w-5 h-5 transition-all duration-300 ${
                    i < shields
                      ? 'text-accent drop-shadow-[0_0_4px_rgba(79,109,240,0.4)]'
                      : 'text-border'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-dim">Earn 1 every 7-day streak</span>
          </div>
        </div>
      </div>
    </div>
  );
}
