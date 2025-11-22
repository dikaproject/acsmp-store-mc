import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      serverTypeId: null,

      addItem: (product, quantity = 1) => {
        const { items, serverTypeId } = get();

        // Check if cart has items from different server
        if (items.length > 0 && serverTypeId !== product.serverTypeId) {
          // Clear cart if switching server
          set({
            items: [{ ...product, quantity }],
            serverTypeId: product.serverTypeId,
          });
          return;
        }

        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [...items, { ...product, quantity }],
            serverTypeId: product.serverTypeId,
          });
        }
      },

      removeItem: (productId) => {
        const { items } = get();
        const newItems = items.filter((item) => item.id !== productId);

        set({
          items: newItems,
          serverTypeId: newItems.length > 0 ? get().serverTypeId : null,
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;

        set({
          items: get().items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [], serverTypeId: null });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
