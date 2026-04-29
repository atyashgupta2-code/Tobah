import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  FulfillmentBy,
  Notification,
  Order,
  Product,
  ProductInput,
  Seller,
  SellerInput,
} from "../backend.d";

const SELLER_STORAGE_KEY = "tbah_seller_id";

interface RegisterSellerResult {
  seller: Seller;
  wasExisting: boolean;
}

export function useRegisterSeller() {
  const { actor } = useActor(createActor);
  return useMutation<RegisterSellerResult, Error, SellerInput>({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not ready");

      // First check if seller already exists by email/phone to avoid duplicates
      const existing = await actor.getSellerByEmailOrPhone(
        input.email,
        input.phone,
      );
      if (existing) {
        // Store existing seller id in localStorage (re-login flow)
        localStorage.setItem(SELLER_STORAGE_KEY, existing.id);
        return { seller: existing, wasExisting: true };
      }

      // SellerInput now includes address field
      const result = await actor.registerSeller(input);
      if (result.__kind__ === "err") throw new Error(result.err);
      const seller = result.ok;
      // Persist seller id for future sessions
      localStorage.setItem(SELLER_STORAGE_KEY, seller.id);
      return { seller, wasExisting: false };
    },
  });
}

export function useSellerProducts(sellerId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Product[]>({
    queryKey: ["seller-products", sellerId],
    queryFn: async () => {
      if (!actor || !sellerId) return [];
      return actor.getProductsBySeller(sellerId);
    },
    enabled: !!actor && !isFetching && !!sellerId,
  });
}

export function useSellerCreateProduct() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<Product, Error, ProductInput>({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.createProduct(input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({
        queryKey: ["seller-products", variables.sellerId],
      });
    },
  });
}

export function useSellerUpdateProduct() {
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
      queryClient.invalidateQueries({
        queryKey: ["seller-products", variables.input.sellerId],
      });
    },
  });
}

export function useSellerDeleteProduct() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: string; sellerId: string }>({
    mutationFn: async ({ id }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.deleteProduct(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({
        queryKey: ["seller-products", variables.sellerId],
      });
    },
  });
}

/** Poll notifications for a specific seller. Polls every 15s. */
export function useGetSellerNotifications(sellerId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Notification[]>({
    queryKey: ["notifications", "seller", sellerId],
    queryFn: async () => {
      if (!actor || !sellerId) return [];
      return actor.getNotifications(sellerId);
    },
    enabled: !!actor && !isFetching && !!sellerId,
    refetchInterval: 15_000,
  });
}

/** Mark a notification as read */
export function useMarkNotificationRead() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<
    boolean,
    Error,
    { notificationId: string; sellerId?: string }
  >({
    mutationFn: async ({ notificationId }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.markNotificationRead(notificationId);
    },
    onSuccess: (_data, variables) => {
      if (variables.sellerId) {
        queryClient.invalidateQueries({
          queryKey: ["notifications", "seller", variables.sellerId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

/** Accept an order as a seller — includes fulfillment choice */
export function useAcceptOrder() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<
    Order,
    Error,
    {
      orderId: string;
      fulfillmentChoice: FulfillmentBy;
      sellerName: string;
      sellerId?: string;
    }
  >({
    mutationFn: async ({ orderId, fulfillmentChoice, sellerName }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.acceptOrder(
        orderId,
        fulfillmentChoice,
        sellerName,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["seller-orders"] });
      if (variables.sellerId) {
        queryClient.invalidateQueries({
          queryKey: ["notifications", "seller", variables.sellerId],
        });
        queryClient.invalidateQueries({
          queryKey: ["seller-orders", variables.sellerId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

/** Reject an order as a seller */
export function useRejectOrder() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<
    Order,
    Error,
    { orderId: string; sellerName: string; sellerId?: string }
  >({
    mutationFn: async ({ orderId, sellerName }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.rejectOrder(orderId, sellerName);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["seller-orders"] });
      if (variables.sellerId) {
        queryClient.invalidateQueries({
          queryKey: ["notifications", "seller", variables.sellerId],
        });
        queryClient.invalidateQueries({
          queryKey: ["seller-orders", variables.sellerId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

/** List orders for a seller by their sellerId */
export function useListOrdersBySeller(sellerId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Order[]>({
    queryKey: ["seller-orders", sellerId],
    queryFn: async () => {
      if (!actor || !sellerId) return [];
      return actor.listOrdersBySeller(sellerId);
    },
    enabled: !!actor && !isFetching && !!sellerId,
    refetchInterval: 20_000,
  });
}

export { SELLER_STORAGE_KEY };
