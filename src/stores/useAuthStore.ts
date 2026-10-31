import { create } from 'zustand';

interface UseAuthStore {
  id: string;
  email: string;
  name: string;
  role: string;
  imageUrl: string;
  setAuth: (
    id: string,
    email: string,
    name: string,
    role: string,
    imageUrl: string,
  ) => void;
  clearAuth: () => void;
}

const initialState = {
  id: '',
  email: '',
  name: '',
  role: '',
  imageUrl: '',
};

export const useAuthStore = create<UseAuthStore>((set) => ({
  ...initialState,
  setAuth: (id, email, name, role, imageUrl) =>
    set(() => ({ id, email, name, role, imageUrl })),
  clearAuth: () => set(initialState),
}));
