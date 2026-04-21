import { l as useQueryClient } from "./index-CVuXwThj.js";
import { u as useActor, a as useQuery, b as useMutation, c as createActor } from "./backend-BoUXNShq.js";
function useProducts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1e3 * 60 * 5
  });
}
function useProduct(id) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching && !!id,
    staleTime: 1e3 * 60 * 5
  });
}
function useOrder(id) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOrder(id);
    },
    enabled: !!actor && !isFetching && !!id,
    refetchInterval: 15e3
  });
}
function useCreateOrder() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      items,
      address,
      deliveryOption,
      paymentMethod,
      customerName,
      customerPhone
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createOrder(
        items,
        address,
        deliveryOption,
        paymentMethod,
        customerName,
        customerPhone
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });
}
function useCancelOrder() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId) => {
      const key = "tbah_cancelled_orders";
      const existing = JSON.parse(localStorage.getItem(key) ?? "[]");
      if (!existing.includes(orderId)) {
        localStorage.setItem(key, JSON.stringify([...existing, orderId]));
      }
      if (!actor) return true;
      return actor.cancelOrder(orderId);
    },
    onSuccess: (_data, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  });
}
function isOrderCancelled(orderId) {
  try {
    const key = "tbah_cancelled_orders";
    const existing = JSON.parse(localStorage.getItem(key) ?? "[]");
    return existing.includes(orderId);
  } catch {
    return false;
  }
}
export {
  useProduct as a,
  useCreateOrder as b,
  useOrder as c,
  useCancelOrder as d,
  isOrderCancelled as i,
  useProducts as u
};
