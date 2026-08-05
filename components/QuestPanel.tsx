'use client';

import { useState } from 'react';
import { useQuestStore } from '@/lib/store';
import { DIFFICULTY_TIERS, PERIOD_CONFIG, type Difficulty, type QuestPeriod } from '@/lib/constants';
import { Plus, Check, Trash2, X } from 'lucide-react';

// ─── Difficulty badge colors ────────────────────────────
const difficultyStyles: Record<Difficulty, string> = {
  easy: 'bg-easy/10 text-easy border-easy/20',
  medium: 'bg-medium/10 text-medium border-medium/20',
  hard: 'bg-hard/10 text-hard border-hard/20',
  boss: 'bg-boss/10 text-boss border-boss/20',
};

const QUESTS_KEY_MAP: Record<QuestPeriod, 'dailyQuests' | 'weeklyQuests' | 'monthlyQuests'> = {
  daily: 'dailyQuests',
  weekly: 'weeklyQuests',
  monthly: 'monthlyQuests',
};

interface QuestPanelProps {
  period: QuestPeriod;
}

export default function QuestPanel({ period }: QuestPanelProps) {
  const key = QUESTS_KEY_MAP[period];
  const quests = useQuestStore((s) => s[key]);
  const addQuest = useQuestStore((s) => s.addQuest);
  const toggleQuest = useQuestStore((s) => s.toggleQuest);
  const deleteQuest = useQuestStore((s) => s.deleteQuest);
  const config = PERIOD_CONFIG[period];

  const [showModal, setShowModal] = useState(false);
  const [questName, setQuestName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [questType, setQuestType] = useState<'habit' | 'one-off'>('one-off');

  const handleSubmit = () => {
    if (!questName.trim()) return;
    addQuest(questName.trim(), difficulty, period, questType);
    setQuestName('');
    setDifficulty('easy');
    setQuestType('one-off');
    setShowModal(false);
  };

  const completedCount = quests.filter((q) => q.completed).length;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold font-[family-name:var(--font-cinzel)] text-foreground flex items-center gap-2">
            <span>{config.emoji}</span>
            {config.label}
          </h2>
          {quests.length > 0 ? (
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-muted font-mono">
                {completedCount}/{quests.length} completed
              </p>
              <span className="text-muted-dim text-xs">•</span>
              <p className="text-xs text-muted-dim">{config.resetLabel}</p>
            </div>
          ) : (
            <p className="text-xs text-muted-dim mt-1">{config.resetLabel}</p>
          )}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-xp/10 text-xp border border-xp/20 text-sm font-medium hover:bg-xp/20 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          New Quest
        </button>
      </div>

      {/* Quest List */}
      {quests.length > 0 ? (
        <div className="flex flex-col gap-2">
          {quests.map((quest) => {
            const tier = DIFFICULTY_TIERS[quest.difficulty];
            return (
              <div
                key={quest.id}
                className={`group flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 ${
                  quest.completed
                    ? 'bg-success/[0.03] border-success/10'
                    : 'bg-card-hover/50 border-border hover:border-border-glow'
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleQuest(quest.id, period)}
                  className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    quest.completed
                      ? 'bg-success border-success text-background'
                      : 'border-muted-dim hover:border-xp'
                  }`}
                  aria-label={quest.completed ? 'Uncheck quest' : 'Complete quest'}
                >
                  {quest.completed && <Check className="w-3 h-3" />}
                </button>

                {/* Title & Type */}
                <span
                  className={`flex-1 text-sm transition-all duration-200 flex items-center gap-1.5 ${
                    quest.completed ? 'text-muted line-through' : 'text-foreground'
                  }`}
                >
                  <span className="text-xs opacity-60" title={quest.type === 'habit' ? 'Recurring Habit' : 'One-off Quest'}>
                    {quest.type === 'habit' ? '🔄' : '🎯'}
                  </span>
                  {quest.title}
                </span>

                {/* Difficulty badge */}
                <span
                  className={`shrink-0 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider border ${difficultyStyles[quest.difficulty]}`}
                >
                  {tier.label}
                </span>

                {/* Rewards label */}
                <span className="hidden sm:block shrink-0 text-xs text-muted-dim font-mono">
                  +{tier.xp} XP · +{tier.gold} G
                </span>

                {/* Delete */}
                <button
                  onClick={() => deleteQuest(quest.id, period)}
                  className="shrink-0 text-muted-dim hover:text-danger opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  aria-label="Delete quest"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 animate-[fade-in_0.3s_ease-out]">
          <div className="text-4xl mb-3">{config.emptyEmoji}</div>
          <p className="text-foreground font-medium">{config.emptyTitle}</p>
          <p className="text-sm text-muted mt-1">{config.emptySubtitle}</p>
        </div>
      )}

      {/* ─── Add Quest Modal ─── */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fade-in_0.2s_ease-out] p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-card border border-border-glow rounded-xl w-full max-w-md p-6 animate-[scale-in_0.2s_ease-out] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold font-[family-name:var(--font-cinzel)] text-foreground">
                New {period.charAt(0).toUpperCase() + period.slice(1)} Quest
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted hover:text-foreground transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quest Name */}
            <div className="mb-4">
              <label htmlFor={`quest-name-${period}`} className="block text-sm text-muted mb-1.5">
                Quest Name
              </label>
              <input
                id={`quest-name-${period}`}
                type="text"
                value={questName}
                onChange={(e) => setQuestName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder={
                  period === 'daily'
                    ? 'e.g., Solve 3 algorithm problems'
                    : period === 'weekly'
                      ? 'e.g., Complete a full code review cycle'
                      : 'e.g., Read 2 technical books'
                }
                maxLength={100}
                autoFocus
                className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-dim text-sm focus:outline-none focus:ring-2 focus:ring-xp/30 focus:border-xp/40 transition-all"
              />
            </div>

            {/* Type Selection */}
            <div className="mb-4">
              <label className="block text-sm text-muted mb-2">Quest Type</label>
              <div className="flex bg-background/50 p-1 rounded-lg border border-border">
                <button
                  onClick={() => setQuestType('one-off')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    questType === 'one-off' ? 'bg-card border-border-glow shadow text-foreground' : 'text-muted hover:text-foreground'
                  }`}
                >
                  🎯 One-off
                </button>
                <button
                  onClick={() => setQuestType('habit')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    questType === 'habit' ? 'bg-card border-border-glow shadow text-foreground' : 'text-muted hover:text-foreground'
                  }`}
                >
                  🔄 Habit
                </button>
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="mb-5">
              <label className="block text-sm text-muted mb-2">Difficulty Tier</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(DIFFICULTY_TIERS) as [Difficulty, (typeof DIFFICULTY_TIERS)[Difficulty]][]).map(
                  ([key, tier]) => (
                    <button
                      key={key}
                      onClick={() => setDifficulty(key)}
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        difficulty === key
                          ? `${difficultyStyles[key]} ring-1 ring-current`
                          : 'border-border bg-background/50 text-muted hover:border-border-glow'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span>{tier.emoji}</span>
                        <span className="text-sm font-semibold">{tier.label}</span>
                      </div>
                      <span className="text-xs font-mono opacity-70">
                        +{tier.xp} XP · +{tier.gold} Gold
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg text-sm text-muted hover:text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!questName.trim()}
                className="px-4 py-2 rounded-lg bg-xp/20 text-xp border border-xp/30 text-sm font-semibold hover:bg-xp/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                Add Quest
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
