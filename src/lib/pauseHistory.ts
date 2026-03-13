export interface PauseEntry {
  id: string;
  date: string;
  emotions: string[];
  action: string;
}

const STORAGE_KEY = "pause-button-history";

export const saveEntry = (entry: Omit<PauseEntry, "id" | "date">) => {
  const history = getHistory();
  const newEntry: PauseEntry = {
    ...entry,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };
  history.unshift(newEntry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return newEntry;
};

export const getHistory = (): PauseEntry[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};
