import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  Notification,
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

export { SELLER_STORAGE_KEY };
