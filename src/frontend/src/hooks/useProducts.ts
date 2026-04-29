import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  CartItem,
  Coupon,
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
    staleTime: 1000 * 60 * 30, // 30 min — keep images cached longer
    gcTime: 1000 * 60 * 60, // 60 min GC
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
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
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
      customerId: string;
      couponCode?: string | null;
    }
  >({
    mutationFn: async ({
      items,
      address,
      deliveryOption,
      paymentMethod,
      customerName,
      customerPhone,
      customerId,
      couponCode,
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createOrder(
        items,
        address,
        deliveryOption,
        paymentMethod,
        customerName,
        customerPhone,
        customerId,
        couponCode ?? null,
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

/** Cancel order — calls backend (Result<(), Text>) and also marks in localStorage */
export function useCancelOrder() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (orderId) => {
      const key = "tbah_cancelled_orders";
      const existing: string[] = JSON.parse(localStorage.getItem(key) ?? "[]");
      if (!existing.includes(orderId)) {
        localStorage.setItem(key, JSON.stringify([...existing, orderId]));
      }
      if (!actor) return;
      const result = await actor.cancelOrder(orderId);
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
    },
    onSuccess: (_data, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["customer_orders"] });
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

/** Fetch a coupon by code — returns Coupon or null */
export function useGetCoupon() {
  const { actor } = useActor(createActor);
  return useMutation<Coupon | null, Error, string>({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getCoupon(code);
    },
  });
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

/**
 * List all orders for a specific customer by phone number.
 */
export function useListOrdersByCustomer(phone: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Order[]>({
    queryKey: ["customer_orders", phone],
    queryFn: async () => {
      if (!actor || !phone) return [];
      const allOrders = await actor.listOrders();
      return allOrders
        .map(([, order]) => order)
        .filter((o) => o.customerPhone === phone);
    },
    enabled: !!actor && !isFetching && !!phone,
    staleTime: 1000 * 30,
    refetchInterval: 30_000,
  });
}

/** List all model photos for the public models gallery */
export function useListModelPhotos() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["model-photos"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listModelPhotos();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
}

export { DeliveryOption, PaymentMethod };
