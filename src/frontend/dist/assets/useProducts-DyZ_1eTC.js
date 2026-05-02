import { q as useQueryClient } from "./index-D052jQ_k.js";
import { u as useActor, a as useQuery, c as createActor } from "./backend-DMNgBj4M.js";
import { u as useMutation } from "./useMutation-DMQa2kFb.js";
function useProducts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1e3 * 60 * 30,
    // 30 min — keep images cached longer
    gcTime: 1e3 * 60 * 60
    // 60 min GC
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
    staleTime: 1e3 * 60 * 30,
    gcTime: 1e3 * 60 * 60
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
      customerPhone,
      customerId,
      couponCode
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
        couponCode ?? null
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
function useGetCoupon() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (code) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getCoupon(code);
    }
  });
}
function useListOrdersByCustomer(phone) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["customer_orders", phone],
    queryFn: async () => {
      if (!actor || !phone) return [];
      const allOrders = await actor.listOrders();
      return allOrders.map(([, order]) => order).filter((o) => o.customerPhone === phone);
    },
    enabled: !!actor && !isFetching && !!phone,
    staleTime: 1e3 * 30,
    refetchInterval: 3e4
  });
}
function useListModelPhotos() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["model-photos"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listModelPhotos();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1e3 * 60 * 30,
    gcTime: 1e3 * 60 * 60
  });
}
export {
  useProduct as a,
  useCreateOrder as b,
  useGetCoupon as c,
  useOrder as d,
  useCancelOrder as e,
  useListOrdersByCustomer as f,
  useListModelPhotos as g,
  isOrderCancelled as i,
  useProducts as u
};
