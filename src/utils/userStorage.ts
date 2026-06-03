const STORAGE_KEY = "innovaclub_user";

export interface UserProfile {
  username: string;
  email: string;
  phone: string;
  avatar?: string;
  projectName?: string;
  sector?: string;
  analysesCount: number;
  lastAnalysisDate: string;
  referredFriends: number;
  plan: "basico" | "pro" | "elite";
  role?: "Emprendedor" | "Empresario/Patrocinador";
}

export function loadUser(): UserProfile | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function saveUser(user: UserProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearUser(): void {
  localStorage.removeItem(STORAGE_KEY);
}
