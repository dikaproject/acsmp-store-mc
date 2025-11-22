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
      isUserLoggedIn: false,

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
      loginUser: (minecraftName, token) => {
        localStorage.setItem("token", token);
        set({
          minecraftName,
          isUserLoggedIn: true,
        });
      },

      // Player logout
      logoutUser: () => {
        localStorage.removeItem("token");
        set({
          minecraftName: null,
          isUserLoggedIn: false,
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
