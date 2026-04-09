import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UiState {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'ui-preferences',
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    },
  ),
)
