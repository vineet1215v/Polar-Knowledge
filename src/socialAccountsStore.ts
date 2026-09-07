// Reactive store for managing connected social media accounts with persistence

export interface SocialAccount {
  id: "twitter" | "facebook" | "instagram" | "linkedin" | "telegram" | "whatsapp";
  name: string;
  handle: string;
  icon: string;
  color: string;
  bgLight: string;
  connected: boolean;
  avatarText: string;
  followers: string;
  permissions: string[];
  autoPublish: boolean;
}

const DEFAULT_ACCOUNTS: SocialAccount[] = [
  {
    id: "twitter",
    name: "Twitter / 𝕏",
    handle: "@NCPOR_Goa",
    icon: "𝕏",
    color: "#000000",
    bgLight: "#f1f5f9",
    connected: false,
    avatarText: "",
    followers: "42.8K followers",
    permissions: ["Post updates", "Upload media"],
    autoPublish: true,
  },
  {
    id: "facebook",
    name: "Facebook",
    handle: "NCPOR Official Page",
    icon: "",
    color: "#1877F2",
    bgLight: "#eff6ff",
    connected: false,
    avatarText: "IND",
    followers: "28.5K followers",
    permissions: ["Manage page posts", "Read insights"],
    autoPublish: true,
  },
  {
    id: "instagram",
    name: "Instagram",
    handle: "@ncpor_antarctica",
    icon: "",
    color: "#E1306C",
    bgLight: "#fdf2f8",
    connected: false,
    avatarText: "Antarctica",
    followers: "54.1K followers",
    permissions: ["Share posts & reels", "Sync graphics"],
    autoPublish: true,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    handle: "National Centre for Polar and Ocean Research",
    icon: "",
    color: "#0A66C2",
    bgLight: "#eff6ff",
    connected: false,
    avatarText: "in",
    followers: "16.4K members",
    permissions: ["Publish scientific briefs", "Institutional attribution"],
    autoPublish: true,
  },
  {
    id: "telegram",
    name: "Telegram Channel",
    handle: "@ncpor_polar_updates",
    icon: "",
    color: "#229ED9",
    bgLight: "#f0f9ff",
    connected: false,
    avatarText: "",
    followers: "11.2K subscribers",
    permissions: ["Broadcast to channel", "Instant telemetry alerts"],
    autoPublish: true,
  },
  {
    id: "whatsapp",
    name: "WhatsApp Community",
    handle: "NCPOR Polar Science Hub",
    icon: "",
    color: "#25D366",
    bgLight: "#f0fdf4",
    connected: false,
    avatarText: "",
    followers: "4,200 participants",
    permissions: ["Send community bulletins", "Broadcast alerts"],
    autoPublish: true,
  },
];

const STORAGE_KEY = "ncpor_social_accounts_v1";

class SocialAccountsStore {
  private accounts: SocialAccount[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    this.load();
  }

  private load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.accounts = DEFAULT_ACCOUNTS.map(def => {
            const found = parsed.find((p: any) => p.id === def.id);
            return found ? { ...def, ...found } : def;
          });
          return;
        }
      }
    } catch {
      // Fallback
    }
    this.accounts = [...DEFAULT_ACCOUNTS];
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.accounts));
    } catch {
      // Storage error
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getAccounts(): SocialAccount[] {
    return [...this.accounts];
  }

  public getConnectedAccounts(): SocialAccount[] {
    return this.accounts.filter(a => a.connected);
  }

  public isAnyConnected(): boolean {
    return this.accounts.some(a => a.connected);
  }

  public connectAccount(id: string, handle?: string) {
    this.accounts = this.accounts.map(a => {
      if (a.id === id) {
        return { ...a, connected: true, handle: handle || a.handle };
      }
      return a;
    });
    this.save();
  }

  public disconnectAccount(id: string) {
    this.accounts = this.accounts.map(a => {
      if (a.id === id) {
        return { ...a, connected: false };
      }
      return a;
    });
    this.save();
  }

  public connectAllDemo() {
    this.accounts = this.accounts.map(a => ({ ...a, connected: true }));
    this.save();
  }

  public disconnectAll() {
    this.accounts = this.accounts.map(a => ({ ...a, connected: false }));
    this.save();
  }

  public toggleAutoPublish(id: string) {
    this.accounts = this.accounts.map(a => {
      if (a.id === id) {
        return { ...a, autoPublish: !a.autoPublish };
      }
      return a;
    });
    this.save();
  }
}

export const socialStore = new SocialAccountsStore();

