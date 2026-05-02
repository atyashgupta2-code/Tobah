import { g as useCustomer, b as useNavigate, r as reactExports, j as jsxRuntimeExports, S as Skeleton, d as ShoppingBag, L as Link, O as OrderStatus, X, h as Package } from "./index-D052jQ_k.js";
import { B as Badge } from "./badge-J-EtU_X6.js";
import { B as Button } from "./button-DGA_N2XK.js";
import { e as useCancelOrder, f as useListOrdersByCustomer, i as isOrderCancelled, a as useProduct } from "./useProducts-DyZ_1eTC.js";
import { L as LogOut } from "./log-out-BYm4t2DN.js";
import { C as Clock } from "./clock-iLbq_9WR.js";
import { T as TriangleAlert } from "./triangle-alert-C-5lgGAD.js";
import "./backend-DMNgBj4M.js";
import "./useMutation-DMQa2kFb.js";
function StatusBadge({
  status,
  cancelled
}) {
  if (cancelled || status === OrderStatus.Cancelled) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-red-500/15 border border-red-500/30 text-red-400 font-black uppercase text-[10px] tracking-wide rounded-full px-3", children: "Cancelled" });
  }
  if (status === OrderStatus.Delivered) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-accent/15 border border-accent/30 text-accent font-black uppercase text-[10px] tracking-wide rounded-full px-3", children: "Delivered" });
  }
  if (status === OrderStatus.Shipped) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-blue-500/15 border border-blue-500/30 text-blue-400 font-black uppercase text-[10px] tracking-wide rounded-full px-3", children: "Shipped" });
  }
  if (status === OrderStatus.Confirmed) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-black uppercase text-[10px] tracking-wide rounded-full px-3", children: "Confirmed" });
  }
  if (status === OrderStatus.Processing) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-orange-500/15 border border-orange-500/30 text-orange-400 font-black uppercase text-[10px] tracking-wide rounded-full px-3", children: "Processing" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 font-black uppercase text-[10px] tracking-wide rounded-full px-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse inline-block mr-1" }),
    "Pending"
  ] });
}
function OrderItemPreview({
  productId,
  quantity,
  selectedSize
}) {
  const { data: product } = useProduct(productId);
  const unitPrice = product ? Number(product.price) / 100 : 0;
  const lineTotal = unitPrice * Number(quantity);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 py-2.5 border-b border-border/50 last:border-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0 border border-border", children: (product == null ? void 0 : product.imageUrl) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: product.imageUrl,
        alt: product.name,
        className: "w-full h-full object-cover",
        loading: "lazy"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 16, className: "text-muted-foreground" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: (product == null ? void 0 : product.name) ?? "Loading…" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
        "Size: ",
        selectedSize,
        " · Qty: ",
        Number(quantity)
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-black text-sm text-primary shrink-0", children: [
      "₹",
      lineTotal.toFixed(0)
    ] })
  ] });
}
function CancelModal({
  onConfirm,
  onClose,
  isPending
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "my_orders.cancel_dialog",
      className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4",
      "aria-modal": "true",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "absolute inset-0 bg-background/80 backdrop-blur-sm",
            onClick: onClose,
            "aria-label": "Close"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-sm bg-card border border-border rounded-2xl p-6 space-y-5 shadow-2xl animate-slide-up", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "my_orders.close_button",
              onClick: onClose,
              className: "absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-smooth",
              "aria-label": "Close",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/25 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 26, className: "text-red-400" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-black text-lg text-foreground uppercase tracking-tight", children: "Cancel This Order?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "This action can't be undone. Are you sure you want to cancel?" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "my_orders.confirm_button",
                onClick: onConfirm,
                disabled: isPending,
                className: "w-full py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-smooth border-2 border-red-500/70 text-red-400 hover:bg-red-500/10 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      "data-ocid": "my_orders.loading_state",
                      className: "w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"
                    }
                  ),
                  "Cancelling…"
                ] }) : "Yes, Cancel Order"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "my_orders.cancel_button",
                onClick: onClose,
                disabled: isPending,
                className: "w-full py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-smooth bg-primary text-primary-foreground hover:bg-primary/80 active:scale-[0.97]",
                children: "Keep My Order"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
const INITIAL_VISIBLE = 5;
function MyOrders() {
  const { currentCustomer, logout, isLoggedIn } = useCustomer();
  const navigate = useNavigate();
  const cancelMutation = useCancelOrder();
  const [cancelTargetId, setCancelTargetId] = reactExports.useState(null);
  const [showAll, setShowAll] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!isLoggedIn) {
      navigate({ to: "/customer/login" });
    }
  }, [isLoggedIn, navigate]);
  const { data: orders, isLoading } = useListOrdersByCustomer(
    (currentCustomer == null ? void 0 : currentCustomer.phone) ?? ""
  );
  if (!isLoggedIn) return null;
  function handleCancelConfirm() {
    if (!cancelTargetId) return;
    cancelMutation.mutate(cancelTargetId, {
      onSuccess: () => setCancelTargetId(null)
    });
  }
  const sortedOrders = orders ? [...orders].sort((a, b) => Number(b.createdAt) - Number(a.createdAt)) : [];
  const visibleOrders = showAll ? sortedOrders : sortedOrders.slice(0, INITIAL_VISIBLE);
  const hasMore = sortedOrders.length > INITIAL_VISIBLE;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    cancelTargetId && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CancelModal,
      {
        onConfirm: handleCancelConfirm,
        onClose: () => setCancelTargetId(null),
        isPending: cancelMutation.isPending
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "my_orders.page",
        className: "max-w-screen-sm mx-auto px-4 py-6 pb-28 space-y-5",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-2xl text-foreground uppercase tracking-tight", children: "My Orders" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mt-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: currentCustomer == null ? void 0 : currentCustomer.name }),
                " ",
                "· 📱 ",
                currentCustomer == null ? void 0 : currentCustomer.phone
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "my_orders.logout_button",
                onClick: logout,
                className: "flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-smooth p-2 rounded-lg hover:bg-muted",
                "aria-label": "Log out",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 14 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Log out" })
                ]
              }
            )
          ] }),
          isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "my_orders.loading_state", className: "space-y-4", children: [1, 2].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 w-full rounded-2xl" }, n)) }),
          !isLoading && sortedOrders.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "my_orders.empty_state",
              className: "text-center py-16 space-y-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-muted/60 border border-border flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 36, className: "text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-black text-xl text-foreground", children: "No orders yet" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "You haven't placed any orders with this number." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", "data-ocid": "my_orders.shop_link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-xl px-8", children: "START SHOPPING" }) })
              ]
            }
          ),
          !isLoading && visibleOrders.map((order, idx) => {
            const localCancelled = isOrderCancelled(order.id);
            const cancelled = localCancelled || order.status === OrderStatus.Cancelled;
            const canCancel = order.status !== OrderStatus.Shipped && order.status !== OrderStatus.Delivered && order.status !== OrderStatus.Cancelled && order.status !== OrderStatus.Rejected && !cancelled;
            const total = Number(order.total) / 100;
            const orderNum = `ORD-${order.id.slice(0, 8).toUpperCase()}`;
            const createdDate = new Date(Number(order.createdAt) / 1e6);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `my_orders.item.${idx + 1}`,
                className: `bg-card border rounded-2xl p-4 space-y-4 ${cancelled ? "border-red-500/20" : "border-border"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-black text-sm text-primary tracking-widest", children: orderNum }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 10 }),
                        createdDate.toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: order.status, cancelled })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/50 pt-3", children: order.items.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    OrderItemPreview,
                    {
                      productId: item.productId,
                      quantity: item.quantity,
                      selectedSize: item.selectedSize
                    },
                    `${item.productId}-${i}`
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-1 border-t border-border/50", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                      "📍",
                      " ",
                      order.shippingAddress.split(",").slice(-2).join(",").trim()
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: "Total" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-black text-primary text-lg leading-tight", children: [
                        "₹",
                        total.toFixed(0)
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Link,
                      {
                        to: "/order/$id",
                        params: { id: order.id },
                        "data-ocid": `my_orders.view_button.${idx + 1}`,
                        className: "flex-1",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            variant: "outline",
                            size: "sm",
                            className: "w-full font-bold text-xs uppercase tracking-wide border-border hover:bg-muted/30 rounded-xl",
                            children: "View Details"
                          }
                        )
                      }
                    ),
                    canCancel && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": `my_orders.delete_button.${idx + 1}`,
                        onClick: () => setCancelTargetId(order.id),
                        disabled: cancelMutation.isPending,
                        className: "flex-1 py-2 rounded-xl font-black text-xs uppercase tracking-wide border-2 border-red-500/50 text-red-400 hover:bg-red-500/10 transition-smooth active:scale-[0.97] disabled:opacity-50",
                        children: "Cancel Order"
                      }
                    )
                  ] })
                ]
              },
              order.id
            );
          }),
          !isLoading && hasMore && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "my_orders.show_more_button",
              onClick: () => setShowAll((prev) => !prev),
              className: "px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest border-2 border-primary/40 text-primary hover:bg-primary/10 transition-smooth active:scale-[0.97]",
              children: showAll ? "Show Less" : `Show More Orders (${sortedOrders.length - INITIAL_VISIBLE} more)`
            }
          ) })
        ]
      }
    )
  ] });
}
export {
  MyOrders as default
};
