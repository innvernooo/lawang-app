import { create } from 'zustand';

interface UseAuthStore {
  email: string;
  username: string;
  role: string;
  setAuth: (email: string, username: string, role: string) => void;
}

export const useAuthStore = create<UseAuthStore>((set) => ({
  email: '',
  username: '',
  role: '',
  setAuth: (email, username, role) => set(() => ({ email, username, role })),
}));
