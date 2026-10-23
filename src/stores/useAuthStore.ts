import { create } from 'zustand';

interface UseAuthStore {
  id: string;
  email: string;
  username: string;
  role: string;
  setAuth: (id: string, email: string, username: string, role: string) => void;
}

export const useAuthStore = create<UseAuthStore>((set) => ({
  id: '',
  email: '',
  username: '',
  role: '',
  setAuth: (id, email, username, role) =>
    set(() => ({ id, email, username, role })),
}));
