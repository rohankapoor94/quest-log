'use client';

import { create } from 'zustand';
import {
  type Quest,
  type Reward,
  type Difficulty,
  type QuestPeriod,
  type QuestType,
  type FailedQuest,
  DIFFICULTY_TIERS,
  XP_PER_LEVEL,
  SHIELD_INTERVAL,
  MAX_SHIELDS,
  DEFAULT_REWARDS,
  FAILURE_BADGES,
  BADGE_MILESTONES,
} from '@/lib/constants';

// ─── Helpers ───────────────────────────────────────────
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getCurrentWeekStart(): string {
  const d = new Date();
  const day = d.getDay(); // 0=Sun
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(d);
  monday.setDate(diff);
  return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
}

function getCurrentMonthString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function dayDiff(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  return Math.round((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24));
}

export function getLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function getXpInCurrentLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}

// ─── State Shape ───────────────────────────────────────
interface ToastItem {
  id: string;
  message: string;
  type: 'xp' | 'gold' | 'shield' | 'streak' | 'info' | 'warning';
}

interface QuestState {
  // Quests by period
  dailyQuests: Quest[];
  weeklyQuests: Quest[];
  monthlyQuests: Quest[];
  graveyard: FailedQuest[];
  // Period tracking
  currentDate: string;
  currentWeekStart: string;
  currentMonth: string;
  // Core data
  xp: number;
  gold: number;
  streak: number;
  shields: number;
  failedCount: number;
  rewards: Reward[];
  badgesEarned: Record<string, boolean>;
  // UI state
  toasts: ToastItem[];
  levelUpLevel: number | null;
  // Computed
  completedTodayCount: number;
  // Actions
  addQuest: (title: string, difficulty: Difficulty, period: QuestPeriod, type: QuestType) => void;
  toggleQuest: (id: string, period: QuestPeriod) => void;
  deleteQuest: (id: string, period: QuestPeriod) => void;
  resurrectQuest: (id: string) => void;
  addReward: (title: string, cost: number, emoji: string) => void;
  claimReward: (id: string) => void;
  deleteReward: (id: string) => void;
  dismissToast: (id: string) => void;
  clearLevelUp: () => void;
  processNewDay: () => void;
  hydrate: () => void;
}

const STORAGE_KEY = 'quest-log-state';

const QUESTS_KEY_MAP: Record<QuestPeriod, 'dailyQuests' | 'weeklyQuests' | 'monthlyQuests'> = {
  daily: 'dailyQuests',
  weekly: 'weeklyQuests',
  monthly: 'monthlyQuests',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadFromStorage(): Record<string, any> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveToStorage(state: QuestState) {
  if (typeof window === 'undefined') return;
  const toSave = {
    dailyQuests: state.dailyQuests,
    weeklyQuests: state.weeklyQuests,
    monthlyQuests: state.monthlyQuests,
    graveyard: state.graveyard,
    currentDate: state.currentDate,
    currentWeekStart: state.currentWeekStart,
    currentMonth: state.currentMonth,
    xp: state.xp,
    gold: state.gold,
    streak: state.streak,
    shields: state.shields,
    failedCount: state.failedCount,
    rewards: state.rewards,
    badgesEarned: state.badgesEarned,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}

function initRewards(): Reward[] {
  return DEFAULT_REWARDS.map((r) => ({ ...r, id: generateId() }));
}

// ─── Store ─────────────────────────────────────────────
export const useQuestStore = create<QuestState>((set, get) => ({
  // Initial defaults
  dailyQuests: [],
  weeklyQuests: [],
  monthlyQuests: [],
  graveyard: [],
  currentDate: getTodayString(),
  currentWeekStart: getCurrentWeekStart(),
  currentMonth: getCurrentMonthString(),
  xp: 0,
  gold: 0,
  streak: 0,
  shields: 0,
  failedCount: 0,
  rewards: initRewards(),
  badgesEarned: {},
  toasts: [],
  levelUpLevel: null,
  completedTodayCount: 0,

  hydrate: () => {
    const saved = loadFromStorage();
    if (saved) {
      // Migration: old format used `quests` for dailyQuests
      const dailyQuests: Quest[] = saved.dailyQuests ?? saved.quests ?? [];
      const weeklyQuests: Quest[] = saved.weeklyQuests ?? [];
      const monthlyQuests: Quest[] = saved.monthlyQuests ?? [];

      // Migrate badge IDs from numbers to strings
      const rawBadges = saved.badgesEarned ?? {};
      const migratedBadges: Record<string, boolean> = {};
      for (const [k, v] of Object.entries(rawBadges)) {
        if (!isNaN(Number(k))) migratedBadges[`streak-${k}`] = v as boolean;
        else migratedBadges[k] = v as boolean;
      }

      set({
        dailyQuests,
        weeklyQuests,
        monthlyQuests,
        graveyard: saved.graveyard ?? [],
        currentDate: saved.currentDate ?? getTodayString(),
        currentWeekStart: saved.currentWeekStart ?? getCurrentWeekStart(),
        currentMonth: saved.currentMonth ?? getCurrentMonthString(),
        xp: saved.xp ?? 0,
        gold: saved.gold ?? 0,
        streak: saved.streak ?? 0,
        shields: saved.shields ?? 0,
        failedCount: saved.failedCount ?? 0,
        rewards: saved.rewards ?? initRewards(),
        badgesEarned: migratedBadges,
        completedTodayCount: dailyQuests.filter((q: Quest) => q.completed).length,
      });
      get().processNewDay();
    }
  },

  processNewDay: () => {
    const state = get();
    const today = getTodayString();
    const thisWeek = getCurrentWeekStart();
    const thisMonth = getCurrentMonthString();

    const isNewDay = state.currentDate !== today;
    const isNewWeek = state.currentWeekStart !== thisWeek;
    const isNewMonth = state.currentMonth !== thisMonth;

    if (!isNewDay && !isNewWeek && !isNewMonth) return;

    let { streak, shields, badgesEarned, dailyQuests, weeklyQuests, monthlyQuests, graveyard, xp, gold, failedCount } = state;
    const toasts: ToastItem[] = [];

    // Helper to process uncompleted one-off quests
    const processFailures = (quests: Quest[], period: QuestPeriod) => {
      const remaining: Quest[] = [];
      quests.forEach((q) => {
        if (!q.completed && q.type === 'one-off') {
          const tier = DIFFICULTY_TIERS[q.difficulty];
          xp = Math.max(0, xp - tier.xp);
          gold = Math.max(0, gold - tier.gold);
          failedCount += 1;
          graveyard = [{ ...q, failedAt: today, period }, ...graveyard];
          toasts.push({ id: generateId(), message: `Failed: ${q.title} (−${tier.xp} XP)`, type: 'warning' });
        } else {
          remaining.push({ ...q, completed: false }); // habits stay and reset
        }
      });
      return remaining;
    };

    // ── Day transition ──
    if (isNewDay) {
      const gap = dayDiff(state.currentDate, today);
      if (gap > 0) {
        const prevCompleted = state.dailyQuests.filter((q) => q.completed).length;
        const prevDailyGoal = Math.max(1, state.dailyQuests.length);
        const goalMet = prevCompleted >= prevDailyGoal;

        if (goalMet) {
          streak += 1;
          if (streak % SHIELD_INTERVAL === 0 && shields < MAX_SHIELDS) {
            shields += 1;
            toasts.push({ id: generateId(), message: `Shield earned! (${shields}/${MAX_SHIELDS})`, type: 'shield' });
          }
        } else {
          if (shields > 0) {
            shields -= 1;
            toasts.push({ id: generateId(), message: `Shield consumed to protect streak! (${shields} left)`, type: 'warning' });
          } else {
            if (streak > 0) {
              toasts.push({ id: generateId(), message: `Streak reset — no shields remaining`, type: 'warning' });
            }
            streak = 0;
          }
        }

        const additionalGaps = gap - 1;
        for (let i = 0; i < additionalGaps; i++) {
          if (shields > 0) shields -= 1;
          else streak = 0;
        }
        if (additionalGaps > 0 && streak === 0) {
          toasts.push({ id: generateId(), message: `You were away for ${additionalGaps} extra day(s)`, type: 'info' });
        }

        // Streak badges
        for (const badge of BADGE_MILESTONES) {
          if (streak >= badge.day && !badgesEarned[badge.id]) {
            badgesEarned = { ...badgesEarned, [badge.id]: true };
            toasts.push({ id: generateId(), message: `Badge Unlocked: ${badge.label}! 🏆`, type: 'info' });
          }
        }

        // Process daily failures
        dailyQuests = processFailures(state.dailyQuests, 'daily');
      }
    }

    // ── Week transition ──
    if (isNewWeek) {
      weeklyQuests = processFailures(weeklyQuests, 'weekly');
      toasts.push({ id: generateId(), message: 'New week started!', type: 'info' });
    }

    // ── Month transition ──
    if (isNewMonth) {
      monthlyQuests = processFailures(monthlyQuests, 'monthly');
      toasts.push({ id: generateId(), message: 'New month started!', type: 'info' });
    }

    // Check failure badges
    for (const badge of FAILURE_BADGES) {
      if (failedCount >= badge.count && !badgesEarned[badge.id]) {
        badgesEarned = { ...badgesEarned, [badge.id]: true };
        toasts.push({ id: generateId(), message: `Badge Unlocked: ${badge.label} 💀`, type: 'warning' });
      }
    }

    set({
      streak,
      shields,
      xp,
      gold,
      failedCount,
      badgesEarned,
      graveyard,
      dailyQuests,
      weeklyQuests,
      monthlyQuests,
      currentDate: today,
      currentWeekStart: thisWeek,
      currentMonth: thisMonth,
      completedTodayCount: 0,
      toasts: [...state.toasts, ...toasts],
    });
    saveToStorage(get());
  },

  addQuest: (title, difficulty, period, type) => {
    const quest: Quest = { id: generateId(), title, difficulty, completed: false, type };
    const key = QUESTS_KEY_MAP[period];
    set((s) => {
      const newState = { ...s, [key]: [...s[key], quest] };
      saveToStorage(newState as QuestState);
      return newState;
    });
  },

  toggleQuest: (id, period) => {
    const state = get();
    const key = QUESTS_KEY_MAP[period];
    const questList = state[key];
    const quest = questList.find((q) => q.id === id);
    if (!quest) return;

    const wasCompleted = quest.completed;
    const tier = DIFFICULTY_TIERS[quest.difficulty];
    const prevLevel = getLevel(state.xp);

    let newXp: number;
    let newGold: number;
    const newToasts: ToastItem[] = [];

    if (wasCompleted) {
      newXp = Math.max(0, state.xp - tier.xp);
      newGold = Math.max(0, state.gold - tier.gold);
      newToasts.push({ id: generateId(), message: `−${tier.xp} XP · −${tier.gold} Gold`, type: 'info' });
    } else {
      newXp = state.xp + tier.xp;
      newGold = state.gold + tier.gold;
      newToasts.push({ id: generateId(), message: `+${tier.xp} XP · +${tier.gold} Gold`, type: 'xp' });
    }

    const newLevel = getLevel(newXp);
    let levelUpLevel: number | null = state.levelUpLevel;
    if (newLevel > prevLevel && !wasCompleted) {
      levelUpLevel = newLevel;
    }

    const updatedList = questList.map((q) =>
      q.id === id ? { ...q, completed: !q.completed } : q
    );

    // Daily goal check (only for daily quests)
    const updates: Partial<QuestState> = {
      [key]: updatedList,
      xp: newXp,
      gold: newGold,
      toasts: [...state.toasts, ...newToasts],
      levelUpLevel,
    };

    if (period === 'daily') {
      const completedCount = updatedList.filter((q) => q.completed).length;
      const prevCompletedCount = state.dailyQuests.filter((q) => q.completed).length;
      const currentDailyGoal = Math.max(1, updatedList.length);
      if (completedCount >= currentDailyGoal && prevCompletedCount < currentDailyGoal) {
        newToasts.push({ id: generateId(), message: `Daily goal reached! 🎯`, type: 'streak' });
        updates.toasts = [...state.toasts, ...newToasts];
      }
      updates.completedTodayCount = completedCount;
    }

    set(updates);
    saveToStorage(get());
  },

  deleteQuest: (id, period) => {
    const state = get();
    const key = QUESTS_KEY_MAP[period];
    const questList = state[key];
    const quest = questList.find((q) => q.id === id);
    if (!quest) return;

    let { xp, gold } = state;
    if (quest.completed) {
      const tier = DIFFICULTY_TIERS[quest.difficulty];
      xp = Math.max(0, xp - tier.xp);
      gold = Math.max(0, gold - tier.gold);
    }

    const newList = questList.filter((q) => q.id !== id);
    const updates: Partial<QuestState> = { [key]: newList, xp, gold };

    if (period === 'daily') {
      updates.completedTodayCount = newList.filter((q) => q.completed).length;
    }

    set(updates);
    saveToStorage(get());
  },

  resurrectQuest: (id) => {
    const state = get();
    const quest = state.graveyard.find((q) => q.id === id);
    if (!quest) return;

    const tier = DIFFICULTY_TIERS[quest.difficulty];
    const cost = tier.gold; // Cost to resurrect is equal to the gold reward tier

    if (state.gold < cost) {
      set({ toasts: [...state.toasts, { id: generateId(), message: 'Not enough Gold to resurrect!', type: 'warning' }] });
      return;
    }

    const key = QUESTS_KEY_MAP[quest.period];
    const newQuest: Quest = {
      id: generateId(),
      title: quest.title,
      difficulty: quest.difficulty,
      type: quest.type,
      completed: false,
    };

    const newGraveyard = state.graveyard.filter((q) => q.id !== id);
    
    set((s) => ({
      gold: s.gold - cost,
      graveyard: newGraveyard,
      [key]: [...s[key], newQuest],
      toasts: [...s.toasts, { id: generateId(), message: `Resurrected: ${quest.title} (−${cost} Gold)`, type: 'gold' }],
    }));
    saveToStorage(get());
  },

  addReward: (title, cost, emoji) => {
    const reward: Reward = { id: generateId(), title, cost, emoji: emoji || '🎁', claimed: false };
    set((s) => {
      const newState = { ...s, rewards: [...s.rewards, reward] };
      saveToStorage(newState as QuestState);
      return newState;
    });
  },

  claimReward: (id) => {
    const state = get();
    const reward = state.rewards.find((r) => r.id === id);
    if (!reward || reward.claimed || state.gold < reward.cost) return;

    const newRewards = state.rewards.map((r) =>
      r.id === id ? { ...r, claimed: true } : r
    );
    set({
      rewards: newRewards,
      gold: state.gold - reward.cost,
      toasts: [
        ...state.toasts,
        { id: generateId(), message: `Claimed: ${reward.title}! 🎉`, type: 'gold' },
      ],
    });
    saveToStorage(get());
  },

  deleteReward: (id) => {
    set((s) => {
      const newState = { ...s, rewards: s.rewards.filter((r) => r.id !== id) };
      saveToStorage(newState as QuestState);
      return newState;
    });
  },

  dismissToast: (id) => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },

  clearLevelUp: () => {
    set({ levelUpLevel: null });
  },
}));
