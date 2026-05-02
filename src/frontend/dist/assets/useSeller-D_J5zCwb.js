import { q as useQueryClient } from "./index-D052jQ_k.js";
import { u as useActor, a as useQuery, c as createActor } from "./backend-DMNgBj4M.js";
import { u as useMutation } from "./useMutation-DMQa2kFb.js";
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
function useAcceptOrder() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, fulfillmentChoice, sellerName }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.acceptOrder(
        orderId,
        fulfillmentChoice,
        sellerName
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["seller-orders"] });
      if (variables.sellerId) {
        queryClient.invalidateQueries({
          queryKey: ["notifications", "seller", variables.sellerId]
        });
        queryClient.invalidateQueries({
          queryKey: ["seller-orders", variables.sellerId]
        });
      }
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });
}
function useRejectOrder() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
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
          queryKey: ["notifications", "seller", variables.sellerId]
        });
        queryClient.invalidateQueries({
          queryKey: ["seller-orders", variables.sellerId]
        });
      }
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });
}
function useListOrdersBySeller(sellerId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["seller-orders", sellerId],
    queryFn: async () => {
      if (!actor || !sellerId) return [];
      return actor.listOrdersBySeller(sellerId);
    },
    enabled: !!actor && !isFetching && !!sellerId,
    refetchInterval: 2e4
  });
}
export {
  useSellerProducts as a,
  useListOrdersBySeller as b,
  useSellerDeleteProduct as c,
  useAcceptOrder as d,
  useRejectOrder as e,
  useSellerCreateProduct as f,
  useSellerUpdateProduct as g,
  useRegisterSeller as u
};
