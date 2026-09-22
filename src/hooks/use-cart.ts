import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/lib/validation/schemas';

export interface CartItem extends Product {
  cartQuantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === product.id);
        
        if (existingItem) {
          // Check stock before adding
          if (existingItem.cartQuantity + quantity > product.stockQuantity) {
            // Cannot add more than stock
            return;
          }
          
          set({
            items: currentItems.map((item) =>
              item.id === product.id
                ? { ...item, cartQuantity: item.cartQuantity + quantity }
                : item
            ),
          });
        } else {
          if (quantity > product.stockQuantity) return;
          set({ items: [...currentItems, { ...product, cartQuantity: quantity }] });
        }
      },
      
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set({
          items: get().items.map((item) => {
            if (item.id === productId) {
              // Ensure we don't exceed stock
              const newQuantity = Math.min(quantity, item.stockQuantity);
              return { ...item, cartQuantity: newQuantity };
            }
            return item;
          }),
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getCartTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.cartQuantity,
          0
        );
      },
      
      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.cartQuantity, 0);
      },
    }),
    {
      name: 'food-xpress-cart', // name of the item in the storage (must be unique)
    }
  )
);
