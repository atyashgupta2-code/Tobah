import { l as useQueryClient } from "./index-CVuXwThj.js";
import { u as useActor, b as useMutation, a as useQuery, c as createActor } from "./backend-BoUXNShq.js";
const SELLER_STORAGE_KEY = "tbah_seller_id";
function useRegisterSeller() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not ready");
      const existing = await actor.getSellerByEmailOrPhone(
        input.email,
        input.phone
      );
      if (existing) {
        localStorage.setItem(SELLER_STORAGE_KEY, existing.id);
        return { seller: existing, wasExisting: true };
      }
      const result = await actor.registerSeller(input);
      if (result.__kind__ === "err") throw new Error(result.err);
      const seller = result.ok;
      localStorage.setItem(SELLER_STORAGE_KEY, seller.id);
      return { seller, wasExisting: false };
    }
  });
}
function useSellerProducts(sellerId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["seller-products", sellerId],
    queryFn: async () => {
      if (!actor || !sellerId) return [];
      return actor.getProductsBySeller(sellerId);
    },
    enabled: !!actor && !isFetching && !!sellerId
  });
}
function useSellerCreateProduct() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.createProduct(input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({
        queryKey: ["seller-products", variables.sellerId]
      });
    }
  });
}
function useSellerUpdateProduct() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
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
        queryKey: ["seller-products", variables.input.sellerId]
      });
    }
  });
}
function useSellerDeleteProduct() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.deleteProduct(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({
        queryKey: ["seller-products", variables.sellerId]
      });
    }
  });
}
function useGetSellerNotifications(sellerId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["notifications", "seller", sellerId],
    queryFn: async () => {
      if (!actor || !sellerId) return [];
      return actor.getNotifications(sellerId);
    },
    enabled: !!actor && !isFetching && !!sellerId,
    refetchInterval: 15e3
  });
}
function useMarkNotificationRead() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ notificationId }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.markNotificationRead(notificationId);
    },
    onSuccess: (_data, variables) => {
      if (variables.sellerId) {
        queryClient.invalidateQueries({
          queryKey: ["notifications", "seller", variables.sellerId]
        });
      }
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });
}
export {
  useSellerProducts as a,
  useGetSellerNotifications as b,
  useSellerDeleteProduct as c,
  useMarkNotificationRead as d,
  useSellerCreateProduct as e,
  useSellerUpdateProduct as f,
  useRegisterSeller as u
};
