import { create } from 'zustand';

type DashboardStore = {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  setIsMobileOpen: (open: boolean) => void;
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  isCollapsed: false,
  isMobileOpen: false,
  toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  closeSidebar: () => set({ isMobileOpen: false }),
  openSidebar: () => set({ isMobileOpen: true }),
  setIsMobileOpen: (open) => set({ isMobileOpen: open }),
}));