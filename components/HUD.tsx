'use client';

import { useQuestStore, getLevel, getXpInCurrentLevel } from '@/lib/store';
import { XP_PER_LEVEL } from '@/lib/constants';
import { Swords, Coins, Flame, Shield } from 'lucide-react';

export default function HUD() {
  const xp = useQuestStore((s) => s.xp);
  const gold = useQuestStore((s) => s.gold);
  const streak = useQuestStore((s) => s.streak);
  const shields = useQuestStore((s) => s.shields);

  const level = getLevel(xp);
  const xpInLevel = getXpInCurrentLevel(xp);
  const xpPercent = (xpInLevel / XP_PER_LEVEL) * 100;

  // Flame intensity based on streak
  const flameClass =
    streak === 0
      ? 'opacity-30'
      : streak < 7
        ? 'opacity-60'
        : streak < 21
          ? 'opacity-85 drop-shadow-[0_0_6px_rgba(255,107,53,0.5)]'
          : 'opacity-100 drop-shadow-[0_0_12px_rgba(255,69,0,0.7)]';

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <Swords className="w-6 h-6 text-gold" />
          <h1 className="text-lg sm:text-xl font-bold tracking-wide font-[family-name:var(--font-cinzel)] text-foreground">
            Quest Log
          </h1>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
          {/* Level + XP bar */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted uppercase tracking-wider font-medium">Lvl</span>
            <span className="text-lg font-bold font-mono text-xp">{level}</span>
            <div className="hidden sm:flex flex-col gap-0.5 min-w-[100px]">
              <div className="h-2 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-xp-dim to-xp transition-all duration-500 ease-out"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <span className="text-xs text-muted font-mono">
                {xpInLevel}/{XP_PER_LEVEL} XP
              </span>
            </div>
          </div>

          {/* Gold */}
          <div className="flex items-center gap-1.5" title="Gold">
            <Coins className="w-4 h-4 text-gold" />
            <span className="font-mono font-semibold text-gold">{gold}</span>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1" title={`${streak}-day streak`}>
            <Flame className={`w-4 h-4 text-ember transition-all duration-300 ${flameClass}`} />
            <span className="font-mono font-semibold text-ember">{streak}</span>
          </div>

          {/* Shields */}
          <div className="flex items-center gap-1" title={`${shields} shield(s)`}>
            <Shield className="w-4 h-4 text-accent" />
            <span className="font-mono font-semibold text-accent">{shields}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
