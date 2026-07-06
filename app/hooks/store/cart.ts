'use client'

import { CartItem } from "@/Interface";
import { create } from "zustand";

interface CartStore {
      carts: CartItem[];
      add: (item: CartItem) => void;
      remove: (id: string) => void;
      emptyCart: () => void;
      increaseQty: (id: string) => void;
      decreaseQty: (id: string) => void;
      cartTotal: () => number;
      cartItemCount: () => number
}

const useCartStore = create<CartStore>((set, get) => {

      return {

            carts: typeof window !== "undefined"
                  ? JSON.parse(localStorage.getItem("carts") || "[]")
                  : [],

            add: (item) => {

                  const productExistInCart = get().carts.find(c => c.productObj._id === item.productObj._id);

                  if (productExistInCart && item.productType === "Single") {
                        set((store) => ({
                              carts: store.carts.map(c =>
                                    c.productObj._id === item.productObj._id ? { ...c, cartQty: c.cartQty + 1 } : c
                              )
                        }));
                  } else {
                        set((store) => ({ carts: [...store.carts, item] }));
                  }
            },

            remove: (id) => {
                  set((store) => ({
                        carts: store.carts.filter((c) => c.id !== id),
                  }));
            },

            emptyCart: () => {
                  set(() => ({ carts: [] }));
            },

            increaseQty: (id) => {
                  set((store) => ({
                        carts: store.carts.map((c) =>
                              c.id === id ? { ...c, cartQty: c.cartQty + 1 } : c
                        ),
                  }));
            },

            decreaseQty: (id) => {
                  set((store) => ({
                        carts: store.carts.map((c) =>
                              c.id === id ? { ...c, cartQty: c.cartQty - 1 } : c
                        ),
                  }));
            },

            cartItemCount: () => {
                  const { carts } = get();
                  return carts.reduce((total, item) => total + item.cartQty, 0);
            },

            cartTotal: () => {
                  const { carts } = get();
                  return carts.reduce((total, item) => total + (item.productType === "Bundles" ? item.bundleVariation!.price : (item.productObj.price * item.cartQty)), 0);
            }
      }
});

if (typeof window !== "undefined") {
      useCartStore.subscribe((store) => {
            localStorage.setItem("carts", JSON.stringify(store.carts));
      });
}

export default useCartStore;

