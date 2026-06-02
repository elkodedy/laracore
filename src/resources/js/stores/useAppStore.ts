/**
 * Zustand store for global application state
 *
 * Use this for global state that needs to be shared across components.
 * For server state, use TanStack Query (React Query) instead.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Global UI state
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // User state
  user: any | null;
  setUser: (user: any) => void;

  // Loading state
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      user: null,
      setUser: (user) => set({ user }),

      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        isSidebarOpen: state.isSidebarOpen,
      }),
    },
  ),
);
