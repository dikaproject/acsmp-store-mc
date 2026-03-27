import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Admin auth
      user: null,
      token: null,
      isAuthenticated: false,

      // Player auth (no database, just token + minecraft name)
      minecraftName: null,
      serverTypeId: null,
      serverName: null,
      isUserLoggedIn: false,
      currentRank: null, // full string from server e.g. "VIP 27 Mar 2026 07:35"

      // Admin login
      login: (user, token) => {
        localStorage.setItem("token", token);
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      // Admin logout
      logout: () => {
        localStorage.removeItem("token");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      // Player login (just minecraft name + token)
      loginUser: (minecraftName, token, serverTypeId = null, currentRank = null, serverName = null) => {
        localStorage.setItem("token", token);
        set({
          minecraftName,
          serverTypeId,
          serverName,
          isUserLoggedIn: true,
          currentRank,
        });
      },

      // Player logout
      logoutUser: () => {
        localStorage.removeItem("token");
        set({
          minecraftName: null,
          serverTypeId: null,
          serverName: null,
          isUserLoggedIn: false,
          currentRank: null,
        });
      },

      // Check if admin
      isAdmin: () => {
        const state = get();
        return state.isAuthenticated && state.user?.role === "ADMIN";
      },

      // Check if user can shop
      canShop: () => {
        const state = get();
        return state.isUserLoggedIn && state.minecraftName;
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
