import { useCallback, useEffect, useState } from "react";
import { type CartItemFE, type CartState, DeliveryOption } from "../types";

const CART_KEY = "dropzone_cart";

function loadCart(): CartItemFE[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItemFE[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItemFE[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function useCart(): CartState {
  const [items, setItems] = useState<CartItemFE[]>(loadCart);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = useCallback(
    (
      productId: string,
      size: string,
      deliveryOption: DeliveryOption = DeliveryOption.Standard,
    ) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.productId === productId && i.selectedSize === size,
        );
        if (existing) {
          return prev.map((i) =>
            i.productId === productId && i.selectedSize === size
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          );
        }
        return [
          ...prev,
          { productId, quantity: 1, selectedSize: size, deliveryOption },
        ];
      });
    },
    [],
  );

  const removeItem = useCallback((productId: string, size: string) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.productId === productId && i.selectedSize === size),
      ),
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, size: string, quantity: number) => {
      if (quantity <= 0) {
        setItems((prev) =>
          prev.filter(
            (i) => !(i.productId === productId && i.selectedSize === size),
          ),
        );
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId && i.selectedSize === size
            ? { ...i, quantity }
            : i,
        ),
      );
    },
    [],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const cartTotal = items.reduce((sum, i) => sum + i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    cartTotal,
    itemCount,
  };
}
