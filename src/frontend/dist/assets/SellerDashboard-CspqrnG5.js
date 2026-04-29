import { a as createLucideIcon, b as useNavigate, r as reactExports, O as OrderStatus, j as jsxRuntimeExports, c as cn, S as Skeleton, h as Package, F as FulfillmentBy } from "./index-BDCmUi92.js";
import { B as Badge } from "./badge-BZw-Jrxz.js";
import { B as Button } from "./button-CZHlOgul.js";
import { u as useActor, a as useQuery, c as createActor } from "./backend-DZh8k5AL.js";
import { u as ue } from "./index-B2ZYc5Mm.js";
import { a as useSellerProducts, b as useListOrdersBySeller, c as useSellerDeleteProduct, d as useAcceptOrder, e as useRejectOrder } from "./useSeller-WJgrwpvn.js";
import { L as LayoutDashboard } from "./layout-dashboard-BvOga2iE.js";
import { P as Plus } from "./plus-D6RxTZf3.js";
import { T as TrendingUp } from "./trending-up-DrLn-WxE.js";
import { T as Truck } from "./truck-Uf165eFb.js";
import { T as Trash2 } from "./trash-2-DK5l0FOa.js";
import { C as CircleCheck } from "./circle-check-CH6FQYTB.js";
import "./useMutation-CCDQEC_w.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "M12 11h4", key: "1jrz19" }],
  ["path", { d: "M12 16h4", key: "n85exb" }],
  ["path", { d: "M8 11h.01", key: "1dfujw" }],
  ["path", { d: "M8 16h.01", key: "18s6g9" }]
];
const ClipboardList = createLucideIcon("clipboard-list", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
];
const Pen = createLucideIcon("pen", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode);
function useSellerEarnings(sellerId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["seller-earnings", sellerId],
    queryFn: async () => {
      if (!actor || !sellerId) {
        return { totalEarnings: 0n, orderCount: 0n, productBreakdown: [] };
      }
      return actor.getSellerEarnings(sellerId);
    },
    enabled: !!actor && !isFetching && !!sellerId,
    staleTime: 1e3 * 60
  });
}
function EarningsSummary({ sellerId }) {
  const { data: earnings, isLoading } = useSellerEarnings(sellerId);
  const totalEarnings = earnings ? Number(earnings.totalEarnings) / 100 : 0;
  const orderCount = earnings ? Number(earnings.orderCount) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "seller.earnings.section",
      className: "rounded-2xl border overflow-hidden",
      style: {
        background: "linear-gradient(135deg, oklch(0.18 0.04 315 / 0.6), oklch(0.16 0.02 280))",
        borderColor: "oklch(0.62 0.28 315 / 0.3)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-5 py-3 flex items-center gap-2 border-b",
            style: { borderColor: "oklch(0.62 0.28 315 / 0.2)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 16, className: "text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-black text-sm text-foreground uppercase tracking-wide", children: "Earnings Summary" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 divide-x divide-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 text-center", children: [
            isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-20 mx-auto rounded-lg mb-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "font-display font-black text-2xl",
                "data-ocid": "seller.earnings.total",
                style: { color: "oklch(0.75 0.22 65)" },
                children: [
                  "₹",
                  totalEarnings.toLocaleString("en-IN")
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-semibold uppercase tracking-wide mt-0.5", children: "Total Earned" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 text-center", children: [
            isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-12 mx-auto rounded-lg mb-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "font-display font-black text-2xl text-primary",
                "data-ocid": "seller.earnings.order_count",
                children: orderCount
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-semibold uppercase tracking-wide mt-0.5", children: "Orders Fulfilled" })
          ] })
        ] }),
        !isLoading && earnings && earnings.productBreakdown.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-4 pb-4 pt-2 border-t",
            style: { borderColor: "oklch(0.62 0.28 315 / 0.15)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2", children: "By Product" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: earnings.productBreakdown.slice(0, 5).map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": `seller.earnings.breakdown.item.${i + 1}`,
                  className: "flex items-center justify-between gap-2 py-1.5 px-3 rounded-xl bg-muted/30",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground truncate flex-1 min-w-0", children: item.productName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                        Number(item.orderCount),
                        " orders"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "text-xs font-black",
                          style: { color: "oklch(0.75 0.22 65)" },
                          children: [
                            "₹",
                            (Number(item.totalRevenue) / 100).toLocaleString("en-IN")
                          ]
                        }
                      )
                    ] })
                  ]
                },
                item.productId
              )) })
            ]
          }
        )
      ]
    }
  );
}
function ProductRow({
  product,
  index,
  onEdit,
  onDelete,
  isDeleting
}) {
  const isSellerFulfilled = product.fulfillmentBy === FulfillmentBy.SellerFulfilled;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `seller.dashboard.product_item.${index}`,
      className: "flex items-center gap-3 p-3 bg-muted/30 border border-border rounded-xl",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-muted border border-border", children: product.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: product.imageUrl,
            alt: product.name,
            className: "w-full h-full object-cover",
            onError: (e) => {
              e.target.style.display = "none";
            }
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 20, className: "text-muted-foreground" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: product.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-bold text-sm", children: [
              "₹",
              (Number(product.price) / 100).toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px] px-1.5 py-0", children: product.gender || "Unisex" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs", children: [
              "Stock: ",
              Number(product.stock)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs", children: [
              "Orders: ",
              Number(product.orderCount)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              "data-ocid": `seller.dashboard.fulfillment_badge.${index}`,
              className: `inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${isSellerFulfilled ? "bg-accent/10 border-accent/30 text-accent" : "bg-primary/10 border-primary/30 text-primary"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 9 }),
                isSellerFulfilled ? "By Seller" : "By Admin"
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              "data-ocid": `seller.dashboard.edit_button.${index}`,
              onClick: onEdit,
              className: "h-8 w-8 text-muted-foreground hover:text-primary",
              "aria-label": "Edit product",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 14 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              "data-ocid": `seller.dashboard.delete_button.${index}`,
              onClick: onDelete,
              disabled: isDeleting,
              className: "h-8 w-8 text-muted-foreground hover:text-destructive",
              "aria-label": "Delete product",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 })
            }
          )
        ] })
      ]
    }
  );
}
const STATUS_COLORS = {
  [OrderStatus.Placed]: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  [OrderStatus.Pending]: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30",
  [OrderStatus.Confirmed]: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  [OrderStatus.Processing]: "bg-blue-600/15 text-blue-300 border-blue-600/30",
  [OrderStatus.Accepted]: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  [OrderStatus.Shipped]: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  [OrderStatus.Delivered]: "bg-green-500/15 text-green-400 border-green-500/30",
  [OrderStatus.Cancelled]: "bg-destructive/15 text-destructive border-destructive/30",
  [OrderStatus.Rejected]: "bg-red-600/15 text-red-400 border-red-600/30"
};
function SellerOrderCard({
  order,
  index,
  sellerId,
  sellerName
}) {
  const acceptOrder = useAcceptOrder();
  const rejectOrder = useRejectOrder();
  const [acceptStep, setAcceptStep] = reactExports.useState("idle");
  const [fulfillmentChoice, setFulfillmentChoice] = reactExports.useState(
    FulfillmentBy.SellerFulfilled
  );
  const [showRejectConfirm, setShowRejectConfirm] = reactExports.useState(false);
  const [expanded, setExpanded] = reactExports.useState(false);
  const shortId = order.id.slice(0, 8).toUpperCase();
  const statusClass = STATUS_COLORS[order.status] ?? "bg-muted/40 text-muted-foreground border-border";
  const canAct = order.status === OrderStatus.Placed || order.status === OrderStatus.Pending;
  async function handleAccept() {
    try {
      await acceptOrder.mutateAsync({
        orderId: order.id,
        fulfillmentChoice,
        sellerName,
        sellerId
      });
      ue.success("Order accepted! Admin has been notified.");
      setAcceptStep("idle");
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Failed to accept");
    }
  }
  async function handleReject() {
    try {
      await rejectOrder.mutateAsync({
        orderId: order.id,
        sellerName,
        sellerId
      });
      ue.success("Order rejected. Admin has been notified.");
      setShowRejectConfirm(false);
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Failed to reject");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-ocid": `seller.orders.item.${index}`,
      className: "bg-card border border-border rounded-2xl overflow-hidden",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md", children: [
                "#",
                shortId
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${statusClass}`,
                  children: order.status
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm text-foreground", children: order.customerName || "Customer" }),
            order.customerPhone && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "📞 ",
              order.customerPhone
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono font-black text-base text-foreground", children: [
              "₹",
              (Number(order.total) / 100).toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              order.items.length,
              " item",
              order.items.length !== 1 ? "s" : ""
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": `seller.orders.expand_button.${index}`,
            onClick: () => setExpanded((v) => !v),
            className: "text-xs text-primary hover:underline text-left",
            children: expanded ? "Hide items ▲" : "View items ▼"
          }
        ),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-1", children: [
          order.items.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `seller.orders.order_item.${index}.${i + 1}`,
              className: "flex items-center gap-2 bg-muted/30 rounded-lg p-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 14, className: "text-muted-foreground shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-foreground truncate", children: [
                    "Product: ",
                    item.productId.slice(0, 8),
                    "…"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
                    "Size: ",
                    item.selectedSize,
                    " · Qty: ",
                    Number(item.quantity)
                  ] })
                ] })
              ]
            },
            `${item.productId}-${i}`
          )),
          order.shippingAddress && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground pt-1", children: [
            "📍 ",
            order.shippingAddress.slice(0, 80)
          ] })
        ] }),
        canAct && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 space-y-2", children: [
          showRejectConfirm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `seller.orders.reject_confirm.${index}`,
              className: "bg-destructive/10 border border-destructive/30 rounded-xl p-3 space-y-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-destructive text-center", children: "Reject this order?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: "Admin will be notified. Customer won't be told by whom." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      variant: "destructive",
                      "data-ocid": `seller.orders.confirm_reject_button.${index}`,
                      disabled: rejectOrder.isPending,
                      onClick: handleReject,
                      className: "flex-1 h-8 text-xs gap-1.5",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 13 }),
                        "Yes, Reject"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      "data-ocid": `seller.orders.cancel_reject_button.${index}`,
                      onClick: () => setShowRejectConfirm(false),
                      className: "flex-1 h-8 text-xs",
                      children: "Cancel"
                    }
                  )
                ] })
              ]
            }
          ),
          acceptStep === "chooseFulfillment" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `seller.orders.fulfillment_choice.${index}`,
              className: "bg-card border border-border rounded-xl p-3 space-y-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground text-center", children: "Who handles delivery?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [
                  {
                    value: FulfillmentBy.SellerFulfilled,
                    label: "I'll handle it",
                    desc: "You pack and deliver",
                    icon: "🚚"
                  },
                  {
                    value: FulfillmentBy.AdminFulfilled,
                    label: "TBah handles it",
                    desc: "Admin delivers on your behalf",
                    icon: "📦"
                  }
                ].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `seller.orders.fulfillment_${opt.value.toLowerCase()}.${index}`,
                    onClick: () => setFulfillmentChoice(opt.value),
                    className: cn(
                      "w-full flex items-center gap-3 p-2.5 rounded-lg border text-left transition-smooth",
                      fulfillmentChoice === opt.value ? "bg-primary/10 border-primary" : "bg-muted/30 border-border hover:border-primary/40"
                    ),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: opt.icon }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: opt.label }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: opt.desc })
                      ] })
                    ]
                  },
                  opt.value
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      "data-ocid": `seller.orders.confirm_accept_button.${index}`,
                      disabled: acceptOrder.isPending,
                      onClick: handleAccept,
                      className: "btn-primary flex-1 h-8 text-xs gap-1.5",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 13 }),
                        acceptOrder.isPending ? "Accepting…" : "Confirm Accept"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      "data-ocid": `seller.orders.cancel_accept_button.${index}`,
                      onClick: () => setAcceptStep("idle"),
                      className: "h-8 text-xs",
                      children: "Back"
                    }
                  )
                ] })
              ]
            }
          ),
          acceptStep === "idle" && !showRejectConfirm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                "data-ocid": `seller.orders.accept_button.${index}`,
                onClick: () => setAcceptStep("chooseFulfillment"),
                className: "flex-1 h-8 text-xs gap-1.5 bg-green-600 hover:bg-green-500 text-white border-0",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 13 }),
                  "Accept Order"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "destructive",
                "data-ocid": `seller.orders.reject_button.${index}`,
                onClick: () => setShowRejectConfirm(true),
                className: "flex-1 h-8 text-xs gap-1.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 13 }),
                  "Reject"
                ]
              }
            )
          ] })
        ] })
      ] })
    }
  );
}
function SellerOrdersSection({
  sellerId,
  sellerName
}) {
  const {
    data: orders = [],
    isLoading,
    refetch
  } = useListOrdersBySeller(sellerId);
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const pendingCount = orders.filter(
    (o) => o.status === OrderStatus.Placed || o.status === OrderStatus.Pending
  ).length;
  const filtered = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);
  const filterOptions = [
    { value: "all", label: "All Orders" },
    { value: OrderStatus.Placed, label: "New" },
    { value: OrderStatus.Accepted, label: "Accepted" },
    { value: OrderStatus.Rejected, label: "Rejected" },
    { value: OrderStatus.Delivered, label: "Delivered" },
    { value: OrderStatus.Cancelled, label: "Cancelled" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-foreground", children: "My Orders" }),
        pendingCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-400 font-semibold mt-0.5 animate-pulse", children: [
          "⚡ ",
          pendingCount,
          " order",
          pendingCount > 1 ? "s" : "",
          " need your action"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          "data-ocid": "seller.orders.refresh_button",
          onClick: () => refetch(),
          className: "text-xs gap-1.5",
          children: "Refresh"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 flex-wrap", children: filterOptions.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": `seller.orders.filter.${opt.value}`,
        onClick: () => setStatusFilter(opt.value),
        className: cn(
          "px-3 py-1 rounded-full text-xs font-bold transition-smooth border",
          statusFilter === opt.value ? "bg-primary/15 text-primary border-primary/40" : "bg-muted/30 text-muted-foreground border-transparent hover:border-border"
        ),
        children: [
          opt.label,
          opt.value === "all" && orders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-[10px] bg-muted-foreground/20 rounded-full px-1", children: orders.length })
        ]
      },
      opt.value
    )) }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "seller.orders.loading_state", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 w-full rounded-2xl" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "seller.orders.empty_state",
        className: "text-center py-16 bg-card border border-dashed border-border rounded-2xl",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ClipboardList,
            {
              size: 40,
              className: "text-muted-foreground mx-auto mb-3"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground mb-1", children: "No orders yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: statusFilter === "all" ? "Orders for your products will appear here" : `No ${statusFilter.toLowerCase()} orders` })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "seller.orders.list", className: "space-y-3", children: filtered.map((order, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      SellerOrderCard,
      {
        order,
        index: idx + 1,
        sellerId,
        sellerName
      },
      order.id
    )) })
  ] });
}
function SellerDashboard() {
  const navigate = useNavigate();
  const [sellerId, setSellerId] = reactExports.useState("");
  const [sellerName, setSellerName] = reactExports.useState("");
  const [businessName, setBusinessName] = reactExports.useState("");
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const [activeTab, setActiveTab] = reactExports.useState("dashboard");
  const { data: products, isLoading } = useSellerProducts(sellerId);
  const { data: orders = [] } = useListOrdersBySeller(sellerId);
  const deleteProduct = useSellerDeleteProduct();
  const pendingOrderCount = orders.filter(
    (o) => o.status === OrderStatus.Placed || o.status === OrderStatus.Pending
  ).length;
  reactExports.useEffect(() => {
    const id = localStorage.getItem("tbah_seller_id");
    if (!id) {
      navigate({ to: "/seller/register" });
      return;
    }
    setSellerId(id);
    setSellerName(localStorage.getItem("tbah_seller_name") ?? "");
    setBusinessName(
      localStorage.getItem("tbah_seller_business") ?? "Your Store"
    );
  }, [navigate]);
  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeletingId(product.id);
    try {
      await deleteProduct.mutateAsync({ id: product.id, sellerId });
      ue.success("Product deleted");
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }
  if (!sellerId) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed inset-0 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px]" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-2xl mx-auto px-4 py-8 space-y-6 pb-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-5 flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 22, className: "text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h1",
              {
                "data-ocid": "seller.dashboard.page",
                className: "font-display font-black text-xl text-foreground",
                children: businessName
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm", children: [
              "Welcome back, ",
              sellerName
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "text-xs text-muted-foreground shrink-0",
            onClick: () => {
              localStorage.removeItem("tbah_seller_id");
              localStorage.removeItem("tbah_seller_name");
              localStorage.removeItem("tbah_seller_business");
              navigate({ to: "/seller/register" });
            },
            "data-ocid": "seller.dashboard.logout_button",
            children: "Log out"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 bg-muted/40 border border-border rounded-xl p-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "seller.tab.dashboard",
            onClick: () => setActiveTab("dashboard"),
            className: cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-smooth",
              activeTab === "dashboard" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { size: 15 }),
              "Dashboard"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "seller.tab.orders",
            onClick: () => setActiveTab("orders"),
            className: cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-smooth relative",
              activeTab === "orders" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 15 }),
              "My Orders",
              pendingOrderCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center px-1 animate-pulse", children: pendingOrderCount })
            ]
          }
        )
      ] }),
      activeTab === "dashboard" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(EarningsSummary, { sellerId }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-black text-primary font-display", children: isLoading ? "—" : (products == null ? void 0 : products.length) ?? 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-semibold uppercase tracking-wide mt-0.5", children: "Products Listed" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-black text-accent font-display", children: isLoading ? "—" : (products == null ? void 0 : products.reduce((s, p) => s + Number(p.stock), 0).toLocaleString()) ?? 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-semibold uppercase tracking-wide mt-0.5", children: "Total Stock" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-foreground", children: "My Products" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "seller.dashboard.add_product_button",
                onClick: () => navigate({ to: "/seller/products/new" }),
                className: "btn-primary text-sm gap-2",
                size: "sm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 15 }),
                  "Add Product"
                ]
              }
            )
          ] }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-xl" }, i)) }) : !products || products.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "seller.dashboard.empty_state",
              className: "text-center py-16 bg-card border border-dashed border-border rounded-2xl",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Package,
                  {
                    size: 40,
                    className: "text-muted-foreground mx-auto mb-3"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground mb-1", children: "No products yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Add your first product to start selling" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    "data-ocid": "seller.dashboard.empty_add_button",
                    onClick: () => navigate({ to: "/seller/products/new" }),
                    className: "btn-primary gap-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
                      "Add First Product"
                    ]
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "seller.dashboard.product_list",
              className: "space-y-2",
              children: products.map((product, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                ProductRow,
                {
                  product,
                  index: index + 1,
                  onEdit: () => navigate({
                    to: "/seller/products/$id/edit",
                    params: { id: product.id }
                  }),
                  onDelete: () => handleDelete(product),
                  isDeleting: deletingId === product.id
                },
                product.id
              ))
            }
          )
        ] })
      ] }),
      activeTab === "orders" && /* @__PURE__ */ jsxRuntimeExports.jsx(SellerOrdersSection, { sellerId, sellerName })
    ] })
  ] });
}
export {
  SellerDashboard as default
};
