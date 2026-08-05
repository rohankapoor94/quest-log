'use client';

import { useEffect } from 'react';
import { useQuestStore } from '@/lib/store';
import { Sparkles } from 'lucide-react';

export default function LevelUpOverlay() {
  const levelUpLevel = useQuestStore((s) => s.levelUpLevel);
  const clearLevelUp = useQuestStore((s) => s.clearLevelUp);

  useEffect(() => {
    if (levelUpLevel !== null) {
      const timer = setTimeout(clearLevelUp, 2500);
      return () => clearTimeout(timer);
    }
  }, [levelUpLevel, clearLevelUp]);

  if (levelUpLevel === null) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-[fade-in_0.3s_ease-out]"
      onClick={clearLevelUp}
    >
      <div className="animate-[level-up_0.6s_cubic-bezier(0.22,1,0.36,1)] text-center">
        {/* Burst ring */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-48 h-48 rounded-full border-2 border-gold/30 animate-ping" />
          <div className="absolute w-36 h-36 rounded-full border border-xp/20 animate-ping" style={{ animationDelay: '0.2s' }} />
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-xp/30 to-gold/20 border border-gold/40 flex items-center justify-center shadow-[0_0_60px_rgba(255,215,0,0.3)]">
            <Sparkles className="w-12 h-12 text-gold" />
          </div>
        </div>
        <h2 className="mt-6 text-3xl font-bold text-gold font-[family-name:var(--font-cinzel)] tracking-wider">
          Level Up!
        </h2>
        <p className="mt-2 text-5xl font-bold text-foreground font-mono">
          Level {levelUpLevel}
        </p>
        <p className="mt-3 text-muted text-sm">Click anywhere to continue</p>
      </div>
    </div>
  );
}
