'use client';

import { useQuestStore } from '@/lib/store';
import { BADGE_MILESTONES, FAILURE_BADGES } from '@/lib/constants';
import { Award } from 'lucide-react';

export default function BadgesPanel() {
  const streak = useQuestStore((s) => s.streak);
  const badgesEarned = useQuestStore((s) => s.badgesEarned);

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-base font-semibold font-[family-name:var(--font-cinzel)] text-foreground flex items-center gap-2 mb-5">
        <Award className="w-4 h-4 text-gold" />
        Milestone Badges
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {BADGE_MILESTONES.map((badge) => {
          const earned = badgesEarned[badge.id] || streak >= badge.day;
          return (
            <div
              key={badge.id}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 ${
                earned
                  ? 'border-gold/30 bg-gold/[0.04] shadow-[0_0_15px_rgba(255,215,0,0.08)]'
                  : 'border-border bg-background/30 opacity-40'
              }`}
            >
              <div
                className={`text-2xl transition-all duration-500 ${
                  earned ? 'animate-[badge-earn_0.6s_cubic-bezier(0.22,1,0.36,1)]' : 'grayscale'
                }`}
              >
                {badge.emoji}
              </div>
              <div className="text-center">
                <p className={`text-xs font-semibold ${earned ? 'text-gold' : 'text-muted-dim'}`}>
                  {badge.label}
                </p>
                <p className="text-xs text-muted-dim mt-0.5">{badge.description}</p>
              </div>
              {earned && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-success text-background flex items-center justify-center">
                  <span className="text-[8px] font-bold">✓</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <h2 className="text-base font-semibold font-[family-name:var(--font-cinzel)] text-foreground flex items-center gap-2 mb-5">
        <span className="w-4 h-4 text-warning flex items-center justify-center text-xs">💀</span>
        Infamous Badges
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {FAILURE_BADGES.map((badge) => {
          const earned = badgesEarned[badge.id];
          return (
            <div
              key={badge.id}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 ${
                earned
                  ? 'border-warning/30 bg-warning/[0.04] shadow-[0_0_15px_rgba(255,107,53,0.08)]'
                  : 'border-border bg-background/30 opacity-40'
              }`}
            >
              <div
                className={`text-2xl transition-all duration-500 ${
                  earned ? 'animate-[badge-earn_0.6s_cubic-bezier(0.22,1,0.36,1)]' : 'grayscale'
                }`}
              >
                {badge.emoji}
              </div>
              <div className="text-center">
                <p className={`text-xs font-semibold ${earned ? 'text-warning' : 'text-muted-dim'}`}>
                  {badge.label}
                </p>
                <p className="text-xs text-muted-dim mt-0.5">{badge.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
