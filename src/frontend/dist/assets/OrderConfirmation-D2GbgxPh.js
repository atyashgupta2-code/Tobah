import { a as createLucideIcon, e as useParams, r as reactExports, O as OrderStatus, j as jsxRuntimeExports, S as Skeleton, L as Link, P as PaymentMethod, X, D as DeliveryOption, d as ShoppingBag } from "./index-CVuXwThj.js";
import { B as Button } from "./button-Ts1_c3Ah.js";
import { c as useOrder, d as useCancelOrder, i as isOrderCancelled, a as useProduct } from "./useProducts-kP_jMEzd.js";
import { C as CircleCheck } from "./circle-check-DZyO2W5r.js";
import { C as Clock } from "./clock-DNJcM7Cg.js";
import { T as TriangleAlert } from "./triangle-alert-D2EcABkV.js";
import { Z as Zap } from "./zap-BsATmOI3.js";
import { P as Package } from "./package-BRnKlhsg.js";
import "./backend-BoUXNShq.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
const MapPin = createLucideIcon("map-pin", __iconNode);
function deliveryMeta(option) {
  if (option === DeliveryOption.SameDay)
    return {
      label: "Same-Day Delivery",
      eta: "Today by 8 PM",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 14, className: "text-accent fill-accent" })
    };
  if (option === DeliveryOption.NextDay)
    return {
      label: "Next Day Delivery",
      eta: "Tomorrow by 8 PM",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 14, className: "text-primary" })
    };
  return {
    label: "Standard Delivery",
    eta: "3–5 Business Days",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 14, className: "text-muted-foreground" })
  };
}
function StatusBadge({
  status,
  cancelled
}) {
  const isCancelled = cancelled || status === OrderStatus.Cancelled;
  if (isCancelled) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-red-500/15 border border-red-500/30 text-red-400", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-red-400" }),
      "Cancelled"
    ] });
  }
  if (status === OrderStatus.Confirmed) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-emerald-500/15 border border-emerald-500/30 text-emerald-400", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-400" }),
      "Confirmed"
    ] });
  }
  if (status === OrderStatus.Delivered) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-accent/15 border border-accent/30 text-accent", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-accent" }),
      "Delivered"
    ] });
  }
  if (status === OrderStatus.Shipped) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-blue-500/15 border border-blue-500/30 text-blue-400", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-blue-400" }),
      "Shipped"
    ] });
  }
  if (status === OrderStatus.Processing) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-orange-500/15 border border-orange-500/30 text-orange-400", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-orange-400" }),
      "Processing"
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-yellow-500/15 border border-yellow-500/30 text-yellow-400", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" }),
    "Pending"
  ] });
}
function OrderItemRow({
  productId,
  selectedSize,
  quantity,
  index
}) {
  const { data: product } = useProduct(productId);
  const name = (product == null ? void 0 : product.name) ?? "Loading…";
  const unitPrice = product ? Number(product.price) / 100 : 0;
  const lineTotal = unitPrice * Number(quantity);
  const orderCount = product ? Number(product.orderCount) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `order_confirmation.item.${index + 1}`,
      className: "flex items-center gap-3 py-3 border-b border-border last:border-0",
      children: [
        (product == null ? void 0 : product.imageUrl) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl overflow-hidden bg-muted shrink-0 border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: product.imageUrl,
            alt: name,
            className: "w-full h-full object-cover",
            loading: "lazy"
          }
        ) }),
        !(product == null ? void 0 : product.imageUrl) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-muted shrink-0 border border-border flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 18, className: "text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm text-foreground leading-tight truncate", children: name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground", children: [
              "Size: ",
              selectedSize
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "·" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground", children: [
              "Qty: ",
              Number(quantity)
            ] }),
            orderCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "·" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-primary font-semibold", children: [
                "🔥 ",
                orderCount,
                " ordered"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-black text-sm text-primary", children: [
            "₹",
            lineTotal.toFixed(0)
          ] }),
          Number(quantity) > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
            "₹",
            unitPrice.toFixed(0),
            " each"
          ] })
        ] })
      ]
    }
  );
}
function CancelModal({
  onConfirm,
  onClose,
  isPending
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "order_confirmation.cancel_dialog",
      className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4",
      "aria-modal": "true",
      "aria-label": "Cancel order confirmation",
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
              "data-ocid": "order_confirmation.close_button",
              onClick: onClose,
              className: "absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-smooth",
              "aria-label": "Close",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/25 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 26, className: "text-red-400" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-black text-lg text-foreground uppercase tracking-tight", children: "Cancel This Order?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "This action can't be undone. Are you sure you want to cancel your order?" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "order_confirmation.confirm_button",
                onClick: onConfirm,
                disabled: isPending,
                className: "w-full py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-smooth border-2 border-red-500/70 text-red-400 hover:bg-red-500/10 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      "data-ocid": "order_confirmation.loading_state",
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
                "data-ocid": "order_confirmation.cancel_button",
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
function OrderConfirmation() {
  const { id } = useParams({ strict: false });
  const { data: order, isLoading, isError } = useOrder(id ?? "");
  const cancelMutation = useCancelOrder();
  const [showCancelModal, setShowCancelModal] = reactExports.useState(false);
  const localCancelled = id ? isOrderCancelled(id) : false;
  const cancelled = localCancelled || (order == null ? void 0 : order.status) === OrderStatus.Cancelled;
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "order_confirmation.loading_state",
        className: "max-w-screen-sm mx-auto px-4 py-10 space-y-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full rounded-2xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-2xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full rounded-2xl" })
        ]
      }
    );
  }
  if (isError || !order) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "order_confirmation.error_state",
        className: "max-w-screen-sm mx-auto px-4 py-20 text-center space-y-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-black text-xl text-foreground", children: "Order not found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm", children: [
            "We couldn't find order #",
            id,
            ". It may still be processing."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", "data-ocid": "order_confirmation.shop_link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-4", children: "CONTINUE SHOPPING" }) })
        ]
      }
    );
  }
  const delivery = deliveryMeta(order.deliveryOption);
  const orderNumber = `ORD-${order.id.slice(0, 8).toUpperCase()}`;
  const total = Number(order.total) / 100;
  const isCOD = order.paymentMethod === PaymentMethod.CashOnDelivery;
  const createdDate = new Date(Number(order.createdAt) / 1e6);
  const canCancel = (order.status === OrderStatus.Pending || order.status === OrderStatus.Processing) && !cancelled;
  function handleCancelConfirm() {
    cancelMutation.mutate(order.id, {
      onSuccess: () => setShowCancelModal(false)
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    showCancelModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CancelModal,
      {
        onConfirm: handleCancelConfirm,
        onClose: () => setShowCancelModal(false),
        isPending: cancelMutation.isPending
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "order_confirmation.page",
        className: "max-w-screen-sm mx-auto px-4 py-6 space-y-5 pb-24",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `relative overflow-hidden border rounded-2xl p-6 text-center space-y-3 ${cancelled ? "bg-gradient-to-br from-red-500/15 via-red-500/5 to-transparent border-red-500/25" : "bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10 border-primary/30"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `w-16 h-16 rounded-full flex items-center justify-center ${cancelled ? "bg-red-500/20" : "bg-primary/20"}`,
                      children: cancelled ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 36, className: "text-red-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 40, className: "text-primary" })
                    }
                  ),
                  !cancelled && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-1 text-xl animate-bounce", children: "🎉" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-black text-2xl text-foreground uppercase tracking-tight", children: cancelled ? "Order Cancelled" : "Order Placed!" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: cancelled ? "Your order has been cancelled. Hope to see you again." : "Your fits are locked in. Get ready to slay." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 bg-card/80 border border-border rounded-full px-4 py-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium", children: "Order ID" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-black text-primary text-sm tracking-widest", children: orderNumber })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: order.status, cancelled: !!cancelled }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                  "Placed on",
                  " ",
                  createdDate.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "order_confirmation.delivery_section",
              className: "bg-card rounded-2xl border border-border p-4 space-y-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-black text-sm uppercase tracking-widest text-foreground flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 14, className: "text-primary" }),
                  "Delivery Info"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    delivery.icon,
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: delivery.label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                        "Estimated: ",
                        delivery.eta
                      ] })
                    ] })
                  ] }),
                  order.deliveryOption === DeliveryOption.SameDay && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-usp text-[9px]", children: "TODAY" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 p-3 rounded-xl bg-muted/20 border border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    MapPin,
                    {
                      size: 14,
                      className: "text-muted-foreground mt-0.5 shrink-0"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    order.customerName && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: order.customerName }),
                    order.customerPhone && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      "📱 ",
                      order.customerPhone
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs leading-snug mt-0.5", children: order.shippingAddress })
                  ] })
                ] })
              ]
            }
          ),
          order.items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "order_confirmation.items_section",
              className: "bg-card rounded-2xl border border-border p-4 space-y-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-black text-sm uppercase tracking-widest text-foreground mb-2", children: [
                  "Items Ordered (",
                  order.items.length,
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: order.items.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  OrderItemRow,
                  {
                    productId: item.productId,
                    selectedSize: item.selectedSize,
                    quantity: item.quantity,
                    index: i
                  },
                  `${item.productId}-${i}`
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pt-3 mt-1 border-t border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-muted-foreground", children: "Order Total" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-black text-primary text-xl", children: [
                    "₹",
                    total.toFixed(0)
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "order_confirmation.payment_section",
              className: "bg-card rounded-2xl border border-border p-4 space-y-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-sm uppercase tracking-widest text-foreground", children: "Payment" }),
                isCOD ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-3 rounded-xl bg-accent/10 border border-accent/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl shrink-0", children: "💵" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm text-foreground", children: "Cash on Delivery" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-accent font-medium mt-0.5", children: "No payment due now. Pay the delivery agent on arrival." })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-accent/20 border border-accent/30 text-accent", children: "COD" })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl shrink-0", children: "💳" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm text-foreground", children: "Card Payment" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Payment processed securely." })
                  ] })
                ] })
              ]
            }
          ),
          canCancel && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-2xl border border-red-500/20 bg-red-500/5 p-4 space-y-3",
              "data-ocid": "order_confirmation.cancel_section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    TriangleAlert,
                    {
                      size: 16,
                      className: "text-red-400 shrink-0 mt-0.5"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-black text-sm text-foreground", children: "Need to cancel?" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "You can cancel while your order is still pending. Once confirmed, it can't be cancelled." })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "order_confirmation.delete_button",
                    onClick: () => setShowCancelModal(true),
                    disabled: cancelMutation.isPending,
                    className: "w-full py-3 rounded-xl font-black text-sm uppercase tracking-widest border-2 border-red-500/60 text-red-400 hover:bg-red-500/10 active:scale-[0.98] transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                    children: cancelMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" }),
                      "Cancelling…"
                    ] }) : "Cancel Order"
                  }
                )
              ]
            }
          ),
          cancelled && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-muted/30 p-4 text-center space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-black text-sm text-foreground", children: "Order Cancelled" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "If you paid via COD, no payment is needed. See you next time! 👋" })
          ] }),
          !cancelled && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-black text-lg text-foreground", children: "You're about to look 🔥" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "We're prepping your order right now. Expect dopamine soon." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/shop",
                "data-ocid": "order_confirmation.continue_shopping_button",
                className: "block",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "lg",
                    className: "w-full bg-primary text-primary-foreground font-black text-base py-6 rounded-xl uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-smooth shadow-lg",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 18, className: "mr-2" }),
                      "CONTINUE SHOPPING"
                    ]
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/",
                "data-ocid": "order_confirmation.home_link",
                className: "block",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "lg",
                    className: "w-full font-black text-sm py-5 rounded-xl uppercase tracking-widest border-border hover:bg-muted/30 transition-smooth",
                    children: "BACK TO HOME"
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-[10px] text-muted-foreground", children: "Questions? Contact us · Free returns within 7 days" })
        ]
      }
    )
  ] });
}
export {
  OrderConfirmation as default
};
