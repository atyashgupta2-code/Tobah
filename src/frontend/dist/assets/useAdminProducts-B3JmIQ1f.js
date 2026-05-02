import { q as useQueryClient } from "./index-D052jQ_k.js";
import { u as useActor, a as useQuery, c as createActor } from "./backend-DMNgBj4M.js";
import { u as useMutation } from "./useMutation-DMQa2kFb.js";
function useCreateProduct() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.createProduct(input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });
}
function useUpdateProduct() {
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
    }
  });
}
function useDeleteProduct() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.deleteProduct(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });
}
function useListOrders() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listOrders();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3e4
  });
}
function useUpdateOrderStatus() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.updateOrderStatus(id, status);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  });
}
function useListSellers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["sellers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSellers();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1e3 * 60
  });
}
function useRemoveSeller() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sellerId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.removeSeller(sellerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });
}
function useGetAdminNotifications() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["notifications", "admin"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotifications(null);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15e3
  });
}
function useGetAllAdminNotifications() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["notifications", "admin", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNotifications();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15e3
  });
}
function useMarkAdminNotificationRead() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.markNotificationRead(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "admin"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "admin", "all"]
      });
    }
  });
}
function useSetProductTrending() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, trending }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.setProductTrending(productId, trending);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });
}
function useListCoupons() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCoupons();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1e3 * 30
  });
}
function useCreateCoupon() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.createCoupon(input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    }
  });
}
function useDeleteCoupon() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.deleteCoupon(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    }
  });
}
function useToggleCoupon() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.toggleCoupon(id);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    }
  });
}
function useAddModelPhoto() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ imageUrl, caption }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addModelPhoto(imageUrl, caption);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["model-photos"] });
    }
  });
}
function useDeleteModelPhoto() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteModelPhoto(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["model-photos"] });
    }
  });
}
export {
  useListSellers as a,
  useGetAdminNotifications as b,
  useDeleteProduct as c,
  useSetProductTrending as d,
  useRemoveSeller as e,
  useListCoupons as f,
  useCreateCoupon as g,
  useMarkAdminNotificationRead as h,
  useDeleteCoupon as i,
  useToggleCoupon as j,
  useGetAllAdminNotifications as k,
  useUpdateOrderStatus as l,
  useCreateProduct as m,
  useUpdateProduct as n,
  useAddModelPhoto as o,
  useDeleteModelPhoto as p,
  useListOrders as u
};
