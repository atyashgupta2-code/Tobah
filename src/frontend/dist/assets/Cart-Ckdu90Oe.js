import { a as createLucideIcon, u as useCart, j as jsxRuntimeExports, L as Link, d as ShoppingBag, S as Skeleton, D as DeliveryOption } from "./index-BDCmUi92.js";
import { B as Badge } from "./badge-BZw-Jrxz.js";
import { B as Button } from "./button-CZHlOgul.js";
import { a as useProduct } from "./useProducts-Bh5lsULI.js";
import { P as Plus } from "./plus-D6RxTZf3.js";
import { T as Trash2 } from "./trash-2-DK5l0FOa.js";
import { Z as Zap } from "./zap-Dd4_jfuv.js";
import "./backend-DZh8k5AL.js";
import "./useMutation-CCDQEC_w.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode);
function DeliveryBadge({ option }) {
  if (option === DeliveryOption.SameDay) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30 uppercase tracking-wide", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 9, className: "fill-accent" }),
      "Same Day"
    ] });
  }
  if (option === DeliveryOption.NextDay) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 uppercase tracking-wide", children: "Next Day" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border uppercase tracking-wide", children: "Standard" });
}
function CartRow({
  productId,
  quantity,
  selectedSize,
  deliveryOption,
  index,
  onRemove,
  onIncrease,
  onDecrease
}) {
  const { data: product, isLoading } = useProduct(productId);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 p-3 bg-card rounded-2xl border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-24 h-24 rounded-xl shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2 py-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-28" })
      ] })
    ] });
  }
  if (!product) return null;
  const price = Number(product.price) / 100;
  const itemTotal = price * quantity;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `cart.item.${index + 1}`,
      className: "flex gap-3 p-3 bg-card rounded-2xl border border-border hover:border-primary/30 transition-smooth",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: product.imageUrl || "/assets/generated/placeholder-product.jpg",
            alt: product.name,
            className: "w-full h-full object-cover"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 flex flex-col justify-between gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-sm text-foreground line-clamp-2 leading-tight", children: product.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  variant: "secondary",
                  className: "text-[10px] px-1.5 py-0 font-semibold",
                  children: [
                    "SIZE: ",
                    selectedSize
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DeliveryBadge, { option: deliveryOption })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onDecrease,
                  "data-ocid": `cart.decrease_button.${index + 1}`,
                  className: "w-7 h-7 rounded-lg bg-muted hover:bg-secondary border border-border flex items-center justify-center transition-smooth active:scale-95",
                  "aria-label": "Decrease quantity",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 12 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 text-center text-sm font-bold text-foreground tabular-nums", children: quantity }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onIncrease,
                  "data-ocid": `cart.increase_button.${index + 1}`,
                  className: "w-7 h-7 rounded-lg bg-muted hover:bg-secondary border border-border flex items-center justify-center transition-smooth active:scale-95",
                  "aria-label": "Increase quantity",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-black text-primary text-base", children: [
                "₹",
                itemTotal.toFixed(0)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onRemove,
                  "data-ocid": `cart.delete_button.${index + 1}`,
                  className: "p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth",
                  "aria-label": "Remove item",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 })
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  );
}
function CartSummary({
  items
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-base text-foreground uppercase tracking-wide", children: "Order Summary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          items.reduce((s, i) => s + i.quantity, 0),
          " item",
          items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic text-xs", children: "Prices shown per item above" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Delivery" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-semibold", children: "FREE" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Payment" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Cash on Delivery" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide", children: "Pay on delivery" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "No payment needed now" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-usp", children: "COD" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/checkout", "data-ocid": "cart.checkout_button", className: "block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        size: "lg",
        className: "w-full bg-primary text-primary-foreground font-black text-base py-6 rounded-xl uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-smooth shadow-lg",
        children: "PROCEED TO CHECKOUT →"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-[10px] text-muted-foreground", children: "🔒 Secure checkout · Pay when agent arrives" })
  ] });
}
function Cart() {
  const { items, removeItem, updateQuantity } = useCart();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-screen-sm mx-auto px-4 py-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-black text-2xl text-foreground", children: [
        "MY BAG",
        items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-primary text-xl", children: [
          "(",
          items.length,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/shop",
          "data-ocid": "cart.continue_shopping_link",
          className: "text-xs font-semibold text-muted-foreground hover:text-primary transition-smooth",
          children: "Continue Shopping →"
        }
      )
    ] }),
    items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "cart.empty_state",
        className: "flex flex-col items-center justify-center py-20 text-center gap-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 36, className: "text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-black text-xl text-foreground", children: "Your bag is empty" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Add some fire fits to get started" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", "data-ocid": "cart.shop_link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-2", size: "lg", children: "SHOP NOW" }) })
        ]
      }
    ),
    items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: items.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        CartRow,
        {
          productId: item.productId,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          deliveryOption: item.deliveryOption,
          index: i,
          onRemove: () => removeItem(item.productId, item.selectedSize),
          onIncrease: () => updateQuantity(
            item.productId,
            item.selectedSize,
            item.quantity + 1
          ),
          onDecrease: () => updateQuantity(
            item.productId,
            item.selectedSize,
            item.quantity - 1
          )
        },
        `${item.productId}-${item.selectedSize}`
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CartSummary, { items })
    ] })
  ] });
}
export {
  Cart as default
};
