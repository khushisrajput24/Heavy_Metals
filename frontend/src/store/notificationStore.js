import { create } from "zustand";
import { notifications } from "../utils/constants";

export const useNotificationStore = create((set) => ({
  notification: notifications,
  setNotifications: (notification) => set({ notification }),
  addNotification: (notification) =>
    set((state) => ({ notification: [...state.notification, notification] })),
}));
