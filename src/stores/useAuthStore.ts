import { create } from 'zustand';

interface UseAuthStore {
  id: string;
  email: string;
  username: string;
  role: string;
  imageUrl: string;
  setAuth: (
    id: string,
    email: string,
    username: string,
    role: string,
    imageUrl: string,
  ) => void;
  clearAuth: () => void;
}

const initialState = {
  id: '',
  email: '',
  username: '',
  role: '',
  imageUrl: '',
};

export const useAuthStore = create<UseAuthStore>((set) => ({
  ...initialState,
  setAuth: (id, email, username, role, imageUrl) =>
    set(() => ({ id, email, username, role, imageUrl })),
  clearAuth: () => set(initialState),
}));
