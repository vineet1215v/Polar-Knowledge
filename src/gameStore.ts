// Global Polar Science Gamification Store
export interface Quest {
  id: string;
  title: string;
  desc: string;
  xpReward: number;
  crystalReward: number;
  completed: boolean;
  claimed: boolean;
  category: "daily" | "weekly" | "special";
  icon: string;
}

export interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
}

export interface PlayerStats {
  level: number;
  xp: number;
  nextLevelXp: number;
  rank: string;
  crystals: number;
  streak: number;
  questsCompleted: number;
  badgesUnlocked: number;
}

const RANKS = [
  "Polar Cadet",
  "Junior Field Scout",
  "Glacier Specialist",
  "Ice Core Profiler",
  "Cryosphere Ranger",
  "Aurora Watcher",
  "Expedition Navigator",
  "Station Commander",
  "Master Polar Scientist",
  "Polar Legend",
];

const INITIAL_QUESTS: Quest[] = [
  {
    id: "q_weather",
    title: "Inspect Station Telemetry",
    desc: "Check live temperatures and wind vectors at Maitri or Bharati station.",
    xpReward: 35,
    crystalReward: 10,
    completed: true,
    claimed: false,
    category: "daily",
    icon: "",
  },
  {
    id: "q_survival",
    title: "Survive Antarctic Expedition",
    desc: "Complete the Antarctic Survival RPG with positive scientific data.",
    xpReward: 100,
    crystalReward: 30,
    completed: false,
    claimed: false,
    category: "daily",
    icon: "",
  },
  {
    id: "q_icecore",
    title: "Extract Ancient Ice Core",
    desc: "Drill into the ice sheet and recover 100,000-year-old climate air bubbles.",
    xpReward: 80,
    crystalReward: 25,
    completed: false,
    claimed: false,
    category: "daily",
    icon: "",
  },
  {
    id: "q_quiz",
    title: "Ace Polar Speed Trivia",
    desc: "Score at least 3 correct answers in the Speed Battle Arena.",
    xpReward: 75,
    crystalReward: 20,
    completed: false,
    claimed: false,
    category: "daily",
    icon: "",
  },
  {
    id: "q_tour",
    title: "Virtual Station Explorer",
    desc: "Launch an interactive 360° virtual tour of an Indian polar station.",
    xpReward: 50,
    crystalReward: 15,
    completed: true,
    claimed: false,
    category: "daily",
    icon: "⊙",
  },
];

const INITIAL_BADGES: Badge[] = [
  { id: "b_first_step", name: "Frost Walker", desc: "First expedition entry logged into polar archive.", icon: "", unlocked: true, rarity: "Common" },
  { id: "b_penguin", name: "Penguin Whisperer", desc: "Identified Emperor and Adélie penguin breeding grounds.", icon: "EXP", unlocked: true, rarity: "Rare" },
  { id: "b_ice_master", name: "Deep Ice Driller", desc: "Successfully extracted 100k-year air sample with 95%+ purity.", icon: "", unlocked: false, rarity: "Epic" },
  { id: "b_aurora", name: "Aurora Chaser", desc: "Documented geomagnetic substorms during polar night.", icon: "", unlocked: true, rarity: "Rare" },
  { id: "b_survivor", name: "Blizzard Survivor", desc: "Completed the Expedition Survival simulator without losing crew.", icon: "", unlocked: false, rarity: "Legendary" },
  { id: "b_quiz_master", name: "Cryo Quiz Master", desc: "Scored 100% in the Polar Speed Trivia Arena.", icon: "", unlocked: false, rarity: "Epic" },
  { id: "b_bharati", name: "Bharati Station Commander", desc: "Mastered high-tech operations at Larsemann Hills.", icon: "", unlocked: false, rarity: "Legendary" },
];

class GameStore {
  private xp = 380;
  private crystals = 145;
  private streak = 4;
  private quests = INITIAL_QUESTS;
  private badges = INITIAL_BADGES;
  private listeners: (() => void)[] = [];
  private recentNotification: { text: string; sub?: string; icon?: string } | null = null;

  constructor() {
    this.load();
  }

  private load() {
    try {
      const saved = localStorage.getItem("polar_gamestore");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.xp) this.xp = parsed.xp;
        if (parsed.crystals) this.crystals = parsed.crystals;
        if (parsed.streak) this.streak = parsed.streak;
        if (parsed.quests) this.quests = parsed.quests;
        if (parsed.badges) this.badges = parsed.badges;
      }
    } catch {}
  }

  private save() {
    try {
      localStorage.setItem("polar_gamestore", JSON.stringify({
        xp: this.xp,
        crystals: this.crystals,
        streak: this.streak,
        quests: this.quests,
        badges: this.badges,
      }));
    } catch {}
    this.notify();
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  public getStats(): PlayerStats {
    const level = Math.floor(this.xp / 200) + 1;
    const nextLevelXp = level * 200;
    const rankIndex = Math.min(level - 1, RANKS.length - 1);
    const rank = RANKS[rankIndex];
    return {
      level,
      xp: this.xp,
      nextLevelXp,
      rank,
      crystals: this.crystals,
      streak: this.streak,
      questsCompleted: this.quests.filter(q => q.completed).length,
      badgesUnlocked: this.badges.filter(b => b.unlocked).length,
    };
  }

  public getQuests(): Quest[] {
    return this.quests;
  }

  public getBadges(): Badge[] {
    return this.badges;
  }

  public getNotification() {
    return this.recentNotification;
  }

  public clearNotification() {
    this.recentNotification = null;
    this.notify();
  }

  public addXP(amount: number, reason: string, crystalsGained = 5) {
    const prevLevel = Math.floor(this.xp / 200) + 1;
    this.xp += amount;
    this.crystals += crystalsGained;
    const newLevel = Math.floor(this.xp / 200) + 1;

    if (newLevel > prevLevel) {
      this.recentNotification = {
        icon: "",
        text: `LEVEL UP! You are now Level ${newLevel}!`,
        sub: `Rank Promoted: ${RANKS[Math.min(newLevel - 1, RANKS.length - 1)]} (+${amount} XP, +${crystalsGained} )`,
      };
    } else {
      this.recentNotification = {
        icon: "",
        text: `+${amount} XP Earned!`,
        sub: `${reason} (+${crystalsGained}  Polar Crystals)`,
      };
    }

    this.save();
  }

  public addXp(amount: number, reason: string, crystalsGained = 5) {
    this.addXP(amount, reason, crystalsGained);
  }

  public completeQuest(questId: string) {
    const q = this.quests.find(x => x.id === questId);
    if (q && !q.completed) {
      q.completed = true;
      this.addXP(q.xpReward, `Completed Quest: ${q.title}`, q.crystalReward);
    }
  }

  public claimQuest(questId: string) {
    const q = this.quests.find(x => x.id === questId);
    if (q && q.completed && !q.claimed) {
      q.claimed = true;
      this.save();
    }
  }

  public unlockBadge(badgeId: string) {
    const b = this.badges.find(x => x.id === badgeId);
    if (b && !b.unlocked) {
      b.unlocked = true;
      b.unlockedAt = "Just now";
      this.addXP(150, `Unlocked Badge: ${b.name}`, 50);
      this.recentNotification = {
        icon: "",
        text: `Achievement Unlocked: ${b.name}!`,
        sub: `${b.desc} (+150 XP, +50 )`,
      };
      this.save();
    }
  }
}

export const gameStore = new GameStore();

