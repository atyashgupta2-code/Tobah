import { a as createLucideIcon, r as reactExports, u as useCart, b as useNavigate, j as jsxRuntimeExports, L as Link, c as cn, d as ShoppingBag, D as DeliveryOption } from "./index-BDCmUi92.js";
import { U as USPBadge } from "./USPBadge-Q4xQDQx1.js";
import { Z as Zap } from "./zap-Dd4_jfuv.js";
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
      d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
      key: "1vdc57"
    }
  ],
  ["path", { d: "M5 21h14", key: "11awu3" }]
];
const Crown = createLucideIcon("crown", __iconNode$1);
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
      d: "M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z",
      key: "1wgbhj"
    }
  ]
];
const Shirt = createLucideIcon("shirt", __iconNode);
function FeaturedProductCard({
  product,
  index
}) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const price = Number(product.price) / 100;
  const orderCount = Number(product.orderCount);
  const defaultSize = product.sizes[0] ?? "M";
  function handleBuyNow(e) {
    e.preventDefault();
    e.stopPropagation();
    const delivery = product.hasSameDayDelivery ? DeliveryOption.SameDay : DeliveryOption.Standard;
    addItem(product.id, defaultSize, delivery);
    navigate({ to: "/checkout" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/product/$id",
      params: { id: product.id },
      "data-ocid": `product.featured.item.${index + 1}`,
      className: "col-span-2 relative overflow-hidden rounded-2xl group block",
      style: {
        background: "linear-gradient(135deg, oklch(0.18 0.04 280), oklch(0.14 0.03 260))",
        border: "1px solid oklch(0.75 0.22 65 / 0.4)",
        boxShadow: "0 0 24px 4px oklch(0.75 0.22 65 / 0.15), inset 0 1px 0 oklch(0.75 0.22 65 / 0.2)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none",
            style: {
              background: "radial-gradient(circle, oklch(0.75 0.22 65 / 0.25) 0%, transparent 70%)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-40 shrink-0 aspect-[3/4] rounded-xl overflow-hidden bg-muted", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: product.imageUrl || "/assets/generated/placeholder-product.jpg",
                alt: product.name,
                loading: "lazy",
                decoding: "async",
                className: "w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wide",
                style: {
                  background: "linear-gradient(135deg, oklch(0.75 0.22 65), oklch(0.65 0.24 55))",
                  color: "oklch(0.12 0.02 270)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { size: 9 }),
                  "BEST SELLER"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col justify-between flex-1 min-w-0 py-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "text-xs font-black mb-2 tabular-nums",
                  style: { color: "oklch(0.75 0.22 65)" },
                  children: [
                    "🔥 ",
                    orderCount.toLocaleString(),
                    " orders"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-black text-base text-foreground line-clamp-2 leading-tight mb-1", children: product.name }),
              product.gender && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "inline-block text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest mb-2",
                  style: {
                    background: "oklch(0.75 0.22 65 / 0.15)",
                    color: "oklch(0.75 0.22 65)",
                    border: "1px solid oklch(0.75 0.22 65 / 0.3)"
                  },
                  children: product.gender
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "font-black text-2xl",
                  style: { color: "oklch(0.75 0.22 65)" },
                  children: [
                    "₹",
                    price.toFixed(0)
                  ]
                }
              ),
              product.sizes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 flex-wrap mt-1.5", children: product.sizes.slice(0, 4).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-[9px] font-bold px-1.5 py-0.5 rounded border text-muted-foreground",
                  style: { borderColor: "oklch(0.75 0.22 65 / 0.3)" },
                  children: s
                },
                s
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: handleBuyNow,
                "data-ocid": `product.featured.buy_now_button.${index + 1}`,
                className: "w-full text-xs py-2.5 rounded-xl font-black uppercase tracking-wide flex items-center justify-center gap-1.5 transition-smooth min-h-[44px]",
                style: {
                  background: "linear-gradient(135deg, oklch(0.75 0.22 65), oklch(0.65 0.24 55))",
                  color: "oklch(0.12 0.02 270)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 12 }),
                  "Buy Now"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function ProductCard({
  product,
  index = 0,
  layout = "grid"
}) {
  const [added, setAdded] = reactExports.useState(false);
  const { addItem } = useCart();
  const navigate = useNavigate();
  const price = Number(product.price) / 100;
  const defaultSize = product.sizes[0] ?? "M";
  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    const delivery = product.hasSameDayDelivery ? DeliveryOption.SameDay : DeliveryOption.Standard;
    addItem(product.id, defaultSize, delivery);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }
  function handleBuyNow(e) {
    e.preventDefault();
    e.stopPropagation();
    const delivery = product.hasSameDayDelivery ? DeliveryOption.SameDay : DeliveryOption.Standard;
    addItem(product.id, defaultSize, delivery);
    navigate({ to: "/checkout" });
  }
  if (layout === "list") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/product/$id",
        params: { id: product.id },
        "data-ocid": `product.item.${index + 1}`,
        className: "flex gap-3 bg-card rounded-xl border border-border overflow-hidden transition-smooth hover:shadow-elevated hover:border-primary/30 group",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-28 h-28 shrink-0 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: product.imageUrl || "/assets/generated/placeholder-product.jpg",
              alt: product.name,
              loading: "lazy",
              decoding: "async",
              className: "w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col justify-between py-2 pr-2 flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 flex-wrap mb-1", children: product.hasSameDayDelivery && /* @__PURE__ */ jsxRuntimeExports.jsx(USPBadge, { type: "sameday", size: "sm", animated: true }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-sm text-foreground truncate", children: product.name }),
              product.gender && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground uppercase tracking-wider mt-0.5", children: product.gender }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-primary font-bold text-base", children: [
                "₹",
                price.toFixed(0)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: handleAddToCart,
                  "data-ocid": `product.add_button.${index + 1}`,
                  className: cn(
                    "btn-white text-xs py-2 px-3 flex-1 min-h-[44px] flex items-center justify-center",
                    added && "bg-accent text-accent-foreground"
                  ),
                  children: added ? "✓ Added" : "ADD TO BAG"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleBuyNow,
                  "data-ocid": `product.buy_now_button.${index + 1}`,
                  className: "btn-pink text-xs py-2 px-3 flex items-center gap-1 font-bold min-h-[44px]",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 11 }),
                    "BUY"
                  ]
                }
              )
            ] })
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/product/$id",
      params: { id: product.id },
      "data-ocid": `product.item.${index + 1}`,
      className: "relative bg-card rounded-2xl border border-border overflow-hidden transition-smooth hover:shadow-elevated hover:border-primary/30 hover:-translate-y-0.5 group flex flex-col",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[4/5] overflow-hidden bg-muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: product.imageUrl || "/assets/generated/placeholder-product.jpg",
              alt: product.name,
              loading: "lazy",
              decoding: "async",
              className: "w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2.5 left-2.5 flex flex-col gap-1", children: product.hasSameDayDelivery && /* @__PURE__ */ jsxRuntimeExports.jsx(USPBadge, { type: "sameday", size: "sm", animated: true }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex flex-col gap-2 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-sm text-foreground line-clamp-2 leading-tight", children: product.name }),
            product.gender && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground uppercase tracking-wider mt-1", children: product.gender }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-primary font-bold text-lg mt-0.5", children: [
              "₹",
              price.toFixed(0)
            ] })
          ] }),
          product.sizes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 flex-wrap", children: [
            product.sizes.slice(0, 4).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[10px] font-semibold px-1.5 py-0.5 rounded border border-border text-muted-foreground",
                children: s
              },
              s
            )),
            product.sizes.length > 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
              "+",
              product.sizes.length - 4
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 mt-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: handleBuyNow,
                "data-ocid": `product.buy_now_button.${index + 1}`,
                className: "btn-pink w-full text-xs py-2.5 flex items-center justify-center gap-1.5 font-black uppercase tracking-wide min-h-[44px]",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 12 }),
                  "Buy Now"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: handleAddToCart,
                "data-ocid": `product.add_button.${index + 1}`,
                className: cn(
                  "btn-white w-full text-xs py-2.5 flex items-center justify-center gap-1.5 min-h-[44px]",
                  added && "bg-accent text-accent-foreground border-accent"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 11 }),
                  added ? "ADDED!" : "ADD TO BAG"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
export {
  FeaturedProductCard as F,
  ProductCard as P,
  Shirt as S
};
