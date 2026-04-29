import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  Coupon,
  CouponInput,
  Notification,
  Order,
  OrderId,
  OrderStatus,
  Product,
  ProductInput,
  Seller,
} from "../backend.d";

export function useCreateProduct() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<Product, Error, ProductInput>({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.createProduct(input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<Product, Error, { id: string; input: ProductInput }>({
    mutationFn: async ({ id, input }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.updateProduct(id, input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.deleteProduct(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useListOrders() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Array<[OrderId, Order]>>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listOrders();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<Order, Error, { id: OrderId; status: OrderStatus }>({
    mutationFn: async ({ id, status }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.updateOrderStatus(id, status);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

/** List all registered sellers */
export function useListSellers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Seller[]>({
    queryKey: ["sellers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSellers();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60,
  });
}

/** Remove a seller and all their products */
export function useRemoveSeller() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, string>({
    mutationFn: async (sellerId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.removeSeller(sellerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

/** Poll all notifications for admin (no seller filter). Polls every 15s. */
export function useGetAdminNotifications() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Notification[]>({
    queryKey: ["notifications", "admin"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotifications(null);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15_000,
  });
}

/** Poll ALL notifications globally (for admin overview panel). Polls every 15s. */
export function useGetAllAdminNotifications() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Notification[]>({
    queryKey: ["notifications", "admin", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNotifications();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15_000,
  });
}

/** Mark a notification as read (admin side) */
export function useMarkAdminNotificationRead() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, string>({
    mutationFn: async (notificationId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.markNotificationRead(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "admin"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "admin", "all"],
      });
    },
  });
}

/** Mark or unmark a product as trending (admin only) */
export function useSetProductTrending() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<
    { __kind__: "ok"; ok: Product } | { __kind__: "err"; err: string },
    Error,
    { productId: string; trending: boolean }
  >({
    mutationFn: async ({ productId, trending }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.setProductTrending(productId, trending);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// ─── Coupon hooks ──────────────────────────────────────────────────────────────

export function useListCoupons() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Coupon[]>({
    queryKey: ["coupons"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCoupons();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 30,
  });
}

export function useCreateCoupon() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<Coupon, Error, CouponInput>({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.createCoupon(input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });
}

export function useDeleteCoupon() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.deleteCoupon(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });
}

export function useToggleCoupon() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<Coupon, Error, string>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.toggleCoupon(id);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });
}

// ─── Model Photo hooks ─────────────────────────────────────────────────────────

/** Add a model photo (admin only) */
export function useAddModelPhoto() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<
    | { __kind__: "ok"; ok: import("../backend.d").ModelPhoto }
    | { __kind__: "err"; err: string },
    Error,
    { imageUrl: string; caption: string | null }
  >({
    mutationFn: async ({ imageUrl, caption }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addModelPhoto(imageUrl, caption);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["model-photos"] });
    },
  });
}

/** Delete a model photo (admin only) */
export function useDeleteModelPhoto() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<
    { __kind__: "ok"; ok: null } | { __kind__: "err"; err: string },
    Error,
    string
  >({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteModelPhoto(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["model-photos"] });
    },
  });
}
