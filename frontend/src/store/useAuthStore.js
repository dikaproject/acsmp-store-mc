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
      isUserLoggedIn: false,
      currentRank: null, // rank name from /rankcheck, e.g. "VIP" or null

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
      loginUser: (minecraftName, token, serverTypeId = null, currentRank = null) => {
        localStorage.setItem("token", token);
        set({
          minecraftName,
          serverTypeId,
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
