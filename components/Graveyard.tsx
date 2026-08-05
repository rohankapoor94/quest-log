'use client';

import { useQuestStore } from '@/lib/store';
import { Skull, AlertTriangle } from 'lucide-react';
import { DIFFICULTY_TIERS } from '@/lib/constants';

export default function Graveyard() {
  const graveyard = useQuestStore((s) => s.graveyard);
  const resurrectQuest = useQuestStore((s) => s.resurrectQuest);

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold font-[family-name:var(--font-cinzel)] text-foreground flex items-center gap-2">
          <Skull className="w-5 h-5 text-muted" />
          The Graveyard
        </h2>
        <span className="text-sm font-mono text-muted">{graveyard.length} fallen</span>
      </div>

      {graveyard.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-3">
            <span className="text-2xl">🌱</span>
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">Your conscience is clear</h3>
          <p className="text-xs text-muted max-w-[200px]">
            No one-off quests have failed yet. Keep up the flawless streak!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {graveyard.map((quest, index) => {
            const tier = DIFFICULTY_TIERS[quest.difficulty];
            return (
              <div
                key={`${quest.id}-${index}`}
                className="flex items-center p-3 sm:p-4 rounded-lg bg-background border border-border gap-3 sm:gap-4 transition-all opacity-80 hover:opacity-100"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-muted/20"
                  style={{ backgroundColor: `${tier.color}15`, color: tier.color }}
                >
                  <AlertTriangle className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground truncate">{quest.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-muted-dim font-mono uppercase">
                      {quest.difficulty}
                    </span>
                    <span className="text-[10px] text-muted-dim font-mono">
                      Failed: {quest.failedAt}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 gap-2">
                  <div className="text-right">
                    <div className="text-xs text-warning font-mono">−{tier.xp} XP</div>
                    <div className="text-xs text-warning font-mono">−{tier.gold} Gold</div>
                  </div>
                  <button
                    onClick={() => resurrectQuest(quest.id)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium transition-all bg-gold/10 text-gold hover:bg-gold/20 border border-gold/20 cursor-pointer"
                    title={`Resurrect to ${quest.period} quests`}
                  >
                    Resurrect ({tier.gold} Gold)
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
