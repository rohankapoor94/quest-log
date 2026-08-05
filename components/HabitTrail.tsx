'use client';

import { useQuestStore } from '@/lib/store';
import { HABIT_TRAIL_LENGTH } from '@/lib/constants';
import { MapPin, Trophy } from 'lucide-react';

export default function HabitTrail() {
  const streak = useQuestStore((s) => s.streak);
  const filled = Math.min(streak, HABIT_TRAIL_LENGTH);
  const isForged = streak >= HABIT_TRAIL_LENGTH;

  return (
    <div className={`rounded-xl border p-5 sm:p-6 transition-all duration-500 ${
      isForged
        ? 'border-gold/30 bg-gradient-to-br from-card to-gold/[0.03] shadow-[0_0_30px_rgba(255,215,0,0.08)]'
        : 'border-border bg-card'
    }`}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold font-[family-name:var(--font-cinzel)] text-foreground flex items-center gap-2">
          <MapPin className="w-4 h-4 text-success" />
          The 21-Day Habit Trail
        </h2>
        {isForged ? (
          <div className="flex items-center gap-1.5 text-gold text-sm font-semibold animate-[fade-in_0.5s_ease-out]">
            <Trophy className="w-4 h-4" />
            Habit Forged!
          </div>
        ) : (
          <span className="text-xs text-muted">
            {filled}/{HABIT_TRAIL_LENGTH} days — {HABIT_TRAIL_LENGTH - filled} to go
          </span>
        )}
      </div>

      {/* Trail nodes */}
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        {Array.from({ length: HABIT_TRAIL_LENGTH }, (_, i) => {
          const isFilled = i < filled;
          const isCurrent = i === filled && !isForged;
          const isWeekEnd = (i + 1) % 7 === 0;

          return (
            <div key={i} className="flex items-center gap-2">
              <div className="relative group">
                <div
                  className={`
                    w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-mono font-semibold
                    transition-all duration-300 border
                    ${
                      isFilled
                        ? 'bg-success/20 border-success/40 text-success shadow-[0_0_8px_rgba(74,222,128,0.2)]'
                        : isCurrent
                          ? 'bg-xp/10 border-xp/40 text-xp animate-pulse shadow-[0_0_12px_rgba(167,139,250,0.3)]'
                          : 'bg-border/20 border-border text-muted-dim'
                    }
                  `}
                >
                  {isFilled ? '✓' : i + 1}
                </div>
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-foreground text-background text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  Day {i + 1}
                </div>
              </div>
              {/* Week separator */}
              {isWeekEnd && i < HABIT_TRAIL_LENGTH - 1 && (
                <div className="hidden sm:block w-px h-6 bg-border mx-1" />
              )}
            </div>
          );
        })}
      </div>

      {/* Week labels */}
      <div className="hidden sm:flex justify-around mt-3 text-xs text-muted-dim uppercase tracking-wider">
        <span>Week 1</span>
        <span>Week 2</span>
        <span>Week 3</span>
      </div>
    </div>
  );
}
