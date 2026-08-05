// XP and Gold values for each difficulty tier
export const DIFFICULTY_TIERS = {
  easy: { label: "Easy", xp: 10, gold: 5, color: "easy", emoji: "🟢" },
  medium: { label: "Medium", xp: 25, gold: 15, color: "medium", emoji: "🔵" },
  hard: { label: "Hard", xp: 50, gold: 25, color: "hard", emoji: "🟠" },
  boss: { label: "Boss Fight", xp: 100, gold: 50, color: "boss", emoji: "💀" },
} as const;

export type Difficulty = keyof typeof DIFFICULTY_TIERS;
export type QuestPeriod = "daily" | "weekly" | "monthly";
export type QuestType = "habit" | "one-off";

export const PERIOD_CONFIG: Record<
  QuestPeriod,
  { label: string; emoji: string; emptyEmoji: string; emptyTitle: string; emptySubtitle: string; resetLabel: string }
> = {
  daily: {
    label: "Daily Quests",
    emoji: "⚔️",
    emptyEmoji: "🗺️",
    emptyTitle: "No daily quests yet",
    emptySubtitle: "Every great adventure starts with a single quest. Add one to begin!",
    resetLabel: "Resets every midnight",
  },
  weekly: {
    label: "Weekly Quests",
    emoji: "📅",
    emptyEmoji: "🏔️",
    emptyTitle: "No weekly quests yet",
    emptySubtitle: "Plan bigger challenges that span the whole week. Add your first weekly quest!",
    resetLabel: "Resets every Monday",
  },
  monthly: {
    label: "Monthly Quests",
    emoji: "🗓️",
    emptyEmoji: "🏰",
    emptyTitle: "No monthly quests yet",
    emptySubtitle: "Set ambitious monthly goals and chip away at them over time!",
    resetLabel: "Resets on the 1st of the month",
  },
};

export const BADGE_MILESTONES = [
  { id: "streak-7", day: 7, label: "Week Warrior", emoji: "⚔️", description: "7-day streak" },
  { id: "streak-14", day: 14, label: "Fortnight Hero", emoji: "🛡️", description: "14-day streak" },
  { id: "streak-21", day: 21, label: "Habit Forged", emoji: "🔥", description: "21-day streak" },
  { id: "streak-50", day: 50, label: "Legend", emoji: "👑", description: "50-day streak" },
  { id: "streak-100", day: 100, label: "Mythic", emoji: "🌟", description: "100-day streak" },
] as const;

export const FAILURE_BADGES = [
  { id: "fail-1", count: 1, label: "Stumbled", emoji: "🩹", description: "Failed 1 quest" },
  { id: "fail-5", count: 5, label: "Gravedigger", emoji: "🪦", description: "Failed 5 quests" },
  { id: "fail-15", count: 15, label: "Undead", emoji: "🧟", description: "Failed 15 quests" },
  { id: "fail-30", count: 30, label: "Necromancer", emoji: "💀", description: "Failed 30 quests" },
] as const;

export const XP_PER_LEVEL = 150;
export const SHIELD_INTERVAL = 7;
export const MAX_SHIELDS = 3;
export const HABIT_TRAIL_LENGTH = 21;

export interface Quest {
  id: string;
  title: string;
  difficulty: Difficulty;
  completed: boolean;
  type: QuestType;
}

export interface FailedQuest extends Quest {
  failedAt: string;
  period: QuestPeriod;
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  emoji: string;
  claimed: boolean;
}

export const DEFAULT_REWARDS: Omit<Reward, "id">[] = [
  {
    title: "Guilt-free movie night (Parasite / WALL-E)",
    cost: 100,
    emoji: "🎬",
    claimed: false,
  },
  {
    title: "Upgrade badminton racket grip",
    cost: 300,
    emoji: "🏸",
    claimed: false,
  },
  {
    title: "Buy a new tech gadget",
    cost: 1000,
    emoji: "💻",
    claimed: false,
  },
];
