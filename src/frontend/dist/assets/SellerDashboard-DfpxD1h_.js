import { a as createLucideIcon, b as useNavigate, r as reactExports, j as jsxRuntimeExports, S as Skeleton, X, F as FulfillmentBy } from "./index-CVuXwThj.js";
import { B as Badge } from "./badge-B48huT70.js";
import { B as Button } from "./button-Ts1_c3Ah.js";
import { u as ue } from "./index-0M-KuH2C.js";
import { a as useSellerProducts, b as useGetSellerNotifications, c as useSellerDeleteProduct, d as useMarkNotificationRead } from "./useSeller-EwE8E-7B.js";
import { B as Bell } from "./bell-B8UXr7Nb.js";
import { P as Plus, T as Trash2 } from "./trash-2-CZOBzo2w.js";
import { P as Package } from "./package-BRnKlhsg.js";
import { T as Truck } from "./truck-DMCpHHiL.js";
import "./backend-BoUXNShq.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M18 6 7 17l-5-5", key: "116fxf" }],
  ["path", { d: "m22 10-7.5 7.5L13 16", key: "ke71qq" }]
];
const CheckCheck = createLucideIcon("check-check", __iconNode$2);
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
function formatTimestamp(ts) {
  const ms = Number(ts) / 1e6;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return "";
  const now = Date.now();
  const diff = now - date.getTime();
  if (diff < 6e4) return "Just now";
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
  return date.toLocaleDateString();
}
function NotificationPanel({
  notifications,
  sellerId,
  onClose
}) {
  const markRead = useMarkNotificationRead();
  const panelRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);
  async function handleMarkRead(notificationId) {
    try {
      await markRead.mutateAsync({ notificationId, sellerId });
    } catch {
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: panelRef,
      "data-ocid": "seller.notifications.panel",
      className: "absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-elevated z-50 overflow-hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground", children: "Notifications" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "seller.notifications.close_button",
              onClick: onClose,
              className: "p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-smooth",
              "aria-label": "Close notifications",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-80 overflow-y-auto divide-y divide-border", children: notifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "seller.notifications.empty_state",
            className: "py-10 text-center text-sm text-muted-foreground",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 28, className: "mx-auto mb-2 opacity-40" }),
              "No notifications yet"
            ]
          }
        ) : notifications.map((n, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `seller.notifications.item.${i + 1}`,
            className: `px-4 py-3 flex items-start gap-3 transition-smooth ${n.isRead ? "opacity-60" : "bg-primary/5"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `mt-0.5 shrink-0 w-2 h-2 rounded-full ${n.isRead ? "bg-muted-foreground/40" : "bg-primary"}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-snug", children: n.message }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: formatTimestamp(n.createdAt) })
              ] }),
              !n.isRead && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": `seller.notifications.mark_read_button.${i + 1}`,
                  onClick: () => handleMarkRead(n.id),
                  className: "shrink-0 p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary transition-smooth",
                  "aria-label": "Mark as read",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { size: 13 })
                }
              )
            ]
          },
          n.id
        )) })
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
              "PKR ",
              Number(product.price).toLocaleString()
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
function SellerDashboard() {
  const navigate = useNavigate();
  const [sellerId, setSellerId] = reactExports.useState("");
  const [sellerName, setSellerName] = reactExports.useState("");
  const [businessName, setBusinessName] = reactExports.useState("");
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const [showNotifications, setShowNotifications] = reactExports.useState(false);
  const { data: products, isLoading } = useSellerProducts(sellerId);
  const { data: notifications } = useGetSellerNotifications(sellerId);
  const deleteProduct = useSellerDeleteProduct();
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
  const unreadCount = (notifications == null ? void 0 : notifications.filter((n) => !n.isRead).length) ?? 0;
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                size: "icon",
                "data-ocid": "seller.dashboard.notifications_button",
                onClick: () => setShowNotifications((v) => !v),
                className: "h-9 w-9 relative text-muted-foreground hover:text-foreground",
                "aria-label": "Notifications",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 18 }),
                  unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      "data-ocid": "seller.dashboard.notification_count",
                      className: "absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center px-1",
                      children: unreadCount > 9 ? "9+" : unreadCount
                    }
                  )
                ]
              }
            ),
            showNotifications && /* @__PURE__ */ jsxRuntimeExports.jsx(
              NotificationPanel,
              {
                notifications: notifications ?? [],
                sellerId,
                onClose: () => setShowNotifications(false)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "text-xs text-muted-foreground",
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
        ] })
      ] }),
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
    ] })
  ] });
}
export {
  SellerDashboard as default
};
