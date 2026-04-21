import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  CartItem,
  FitAndTryRequest,
  Notification,
  Order,
  Product,
} from "../backend.d";
import { DeliveryOption, PaymentMethod } from "../backend.d";

export function useProducts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProduct(id: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Product | null>({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching && !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useOrder(id: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Order | null>({
    queryKey: ["order", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOrder(id);
    },
    enabled: !!actor && !isFetching && !!id,
    refetchInterval: 15_000,
  });
}

export function useCreateOrder() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<
    Order,
    Error,
    {
      items: CartItem[];
      address: string;
      deliveryOption: DeliveryOption;
      paymentMethod: PaymentMethod;
      customerName: string;
      customerPhone: string;
    }
  >({
    mutationFn: async ({
      items,
      address,
      deliveryOption,
      paymentMethod,
      customerName,
      customerPhone,
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createOrder(
        items,
        address,
        deliveryOption,
        paymentMethod,
        customerName,
        customerPhone,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useSubmitFitAndTry() {
  const { actor } = useActor(createActor);
  return useMutation<string, Error, FitAndTryRequest>({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitFitAndTryRequest(req);
    },
  });
}

/** Cancel order — calls backend and also marks in localStorage for instant UI update */
export function useCancelOrder() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, string>({
    mutationFn: async (orderId) => {
      // Mark in localStorage immediately for fast UI feedback
      const key = "tbah_cancelled_orders";
      const existing: string[] = JSON.parse(localStorage.getItem(key) ?? "[]");
      if (!existing.includes(orderId)) {
        localStorage.setItem(key, JSON.stringify([...existing, orderId]));
      }
      if (!actor) return true; // optimistic local-only fallback
      return actor.cancelOrder(orderId);
    },
    onSuccess: (_data, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

/** Check if an order was cancelled (backend status or local fallback) */
export function isOrderCancelled(orderId: string): boolean {
  try {
    const key = "tbah_cancelled_orders";
    const existing: string[] = JSON.parse(localStorage.getItem(key) ?? "[]");
    return existing.includes(orderId);
  } catch {
    return false;
  }
}

/** Poll customer-facing notifications (no seller filter). Polls every 10s. */
export function useGetOrderNotifications() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Notification[]>({
    queryKey: ["notifications", "customer"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotifications(null);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10_000,
  });
}

export { DeliveryOption, PaymentMethod };
