import { e as useParams, f as useRouter, b as useNavigate, u as useCart, r as reactExports, D as DeliveryOption, j as jsxRuntimeExports, S as Skeleton, c as cn, d as ShoppingBag } from "./index-D052jQ_k.js";
import { B as Badge } from "./badge-J-EtU_X6.js";
import { B as Button } from "./button-DGA_N2XK.js";
import { u as ue } from "./index-ks9U_z6o.js";
import { U as USPBadge, A as AnimatePresence } from "./USPBadge-BIgvRwNC.js";
import { a as useProduct } from "./useProducts-DyZ_1eTC.js";
import { Z as Zap } from "./zap-B65XmDvH.js";
import { T as Truck } from "./truck-Bay1O7fV.js";
import { A as ArrowLeft } from "./arrow-left-B9PDxwSs.js";
import { C as ChevronRight } from "./chevron-right-h2xJECdo.js";
import { m as motion } from "./proxy-C33ykiGb.js";
import { T as TrendingUp } from "./trending-up-BROzVnYX.js";
import { C as CircleCheck } from "./circle-check-CiIya3CL.js";
import "./clock-iLbq_9WR.js";
import "./backend-DMNgBj4M.js";
import "./useMutation-DMQa2kFb.js";
function formatINR(price) {
  return `₹${(Number(price) / 100).toLocaleString("en-IN")}`;
}
function getDeliveryDate(option) {
  const now = /* @__PURE__ */ new Date();
  const days = option === DeliveryOption.SameDay ? 0 : option === DeliveryOption.NextDay ? 1 : 3;
  now.setDate(now.getDate() + days);
  if (days === 0) return "Today by 10 PM";
  return now.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}
function ProductDetail() {
  const { id } = useParams({ from: "/product/$id" });
  const router = useRouter();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id);
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = reactExports.useState("");
  const [selectedDelivery, setSelectedDelivery] = reactExports.useState(
    DeliveryOption.Standard
  );
  const [activeThumb, setActiveThumb] = reactExports.useState(0);
  const [addedToCart, setAddedToCart] = reactExports.useState(false);
  const thumbnails = reactExports.useMemo(() => {
    const img = (product == null ? void 0 : product.imageUrl) ?? "";
    return [img, img, img, img].slice(0, 4);
  }, [product == null ? void 0 : product.imageUrl]);
  reactExports.useEffect(() => {
    var _a;
    if (((_a = product == null ? void 0 : product.sizes) == null ? void 0 : _a.length) && !selectedSize) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product, selectedSize]);
  reactExports.useEffect(() => {
    if (product == null ? void 0 : product.hasSameDayDelivery) {
      setSelectedDelivery(DeliveryOption.SameDay);
    }
  }, [product]);
  function handleAddToCart() {
    if (!product || !selectedSize) return;
    addItem(product.id, selectedSize, selectedDelivery);
    setAddedToCart(true);
    ue.success(`${product.name} added to bag!`, {
      description: `Size ${selectedSize} · ${selectedDelivery}`
    });
    setTimeout(() => setAddedToCart(false), 2e3);
  }
  function handleBuyNow() {
    if (!product || !selectedSize) return;
    addItem(product.id, selectedSize, selectedDelivery);
    navigate({ to: "/checkout" });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "min-h-screen bg-background",
        "data-ocid": "product_detail.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full aspect-[4/5] bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full h-full" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-3/4 rounded-xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-1/3 rounded-xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-14 rounded-xl" }, i)) })
          ] })
        ]
      }
    );
  }
  if (!product) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "min-h-[60vh] flex flex-col items-center justify-center gap-4 p-8",
        "data-ocid": "product_detail.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl", children: "👀" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-black text-2xl text-center", children: "Product not found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => router.history.back(),
              "data-ocid": "product_detail.back_button",
              children: "Go back"
            }
          )
        ]
      }
    );
  }
  const stockCount = Number(product.stock);
  const isLowStock = stockCount > 0 && stockCount <= 5;
  const isOutOfStock = stockCount === 0;
  const orderCount = Number(product.orderCount ?? 0);
  const isTrending = orderCount >= 5;
  const deliveryOptions = [
    {
      option: DeliveryOption.SameDay,
      label: "Same Day",
      sublabel: getDeliveryDate(DeliveryOption.SameDay),
      available: product.hasSameDayDelivery,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 16, className: "text-accent shrink-0" })
    },
    {
      option: DeliveryOption.NextDay,
      label: "Next Day",
      sublabel: getDeliveryDate(DeliveryOption.NextDay),
      available: true,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 16, className: "text-muted-foreground shrink-0" })
    },
    {
      option: DeliveryOption.Standard,
      label: "Standard",
      sublabel: getDeliveryDate(DeliveryOption.Standard),
      available: true,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 16, className: "text-muted-foreground shrink-0" })
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background pb-40",
      "data-ocid": "product_detail.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-3 bg-card border-b border-border sticky top-0 z-20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => router.history.back(),
              className: "flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors",
              "aria-label": "Go back",
              "data-ocid": "product_detail.back_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 18 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14, className: "text-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground uppercase tracking-wider truncate max-w-[180px]", children: product.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14, className: "text-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground font-semibold truncate max-w-[120px]", children: product.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full aspect-[4/5] bg-card overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.img,
            {
              src: thumbnails[activeThumb] || "/assets/images/placeholder.svg",
              alt: product.name,
              className: "w-full h-full object-cover",
              initial: { opacity: 0, scale: 1.03 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: 0.35 }
            },
            activeThumb
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 pointer-events-none",
              style: {
                background: "linear-gradient(to top, oklch(0.14 0.01 280 / 0.85) 0%, transparent 55%)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 mb-2", children: [
              product.hasSameDayDelivery && /* @__PURE__ */ jsxRuntimeExports.jsx(USPBadge, { type: "sameday", animated: true, size: "sm" }),
              isTrending && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 bg-accent/20 text-accent text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 10 }),
                orderCount,
                " ordered"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-2xl text-foreground leading-tight uppercase", children: product.name })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 px-4 py-3 bg-card border-b border-border overflow-x-auto scrollbar-none", children: thumbnails.map((_thumb, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setActiveThumb(i),
            className: cn(
              "flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-smooth",
              activeThumb === i ? "border-primary" : "border-border opacity-60 hover:opacity-90"
            ),
            "data-ocid": `product_detail.thumbnail.${i + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: thumbnails[i] || "/assets/images/placeholder.svg",
                alt: `View ${i + 1}`,
                className: "w-full h-full object-cover",
                loading: "lazy"
              }
            )
          },
          `thumbnail-view-${i + 1}`
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-5 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-xl text-foreground uppercase leading-tight", children: product.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: "shrink-0 bg-secondary text-secondary-foreground uppercase text-[10px] tracking-wider font-bold",
                  children: product.category
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-display font-black text-3xl text-gradient-primary",
                  "data-ocid": "product_detail.price",
                  children: formatINR(product.price)
                }
              ),
              isOutOfStock ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-destructive text-xs font-bold uppercase tracking-wider",
                  "data-ocid": "product_detail.out_of_stock",
                  children: "Out of stock"
                }
              ) : isLowStock ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "text-accent text-xs font-bold uppercase tracking-wider",
                  "data-ocid": "product_detail.low_stock",
                  children: [
                    "Only ",
                    stockCount,
                    " left!"
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-muted-foreground text-xs uppercase tracking-wider",
                  "data-ocid": "product_detail.in_stock",
                  children: "In stock"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mt-2", children: [
              product.gender && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-secondary text-secondary-foreground uppercase tracking-wider", children: [
                "For: ",
                product.gender
              ] }),
              orderCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-primary/15 text-primary uppercase tracking-wider",
                  "data-ocid": "product_detail.order_count",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 11 }),
                    orderCount,
                    " ",
                    orderCount === 1 ? "order" : "orders"
                  ]
                }
              )
            ] })
          ] }),
          product.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: product.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", "data-ocid": "product_detail.quick_buy_row", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "flex-1 btn-pink font-display font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 h-12",
              disabled: isOutOfStock || !selectedSize,
              onClick: handleBuyNow,
              "data-ocid": "product_detail.quick_buy_now_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 16 }),
                isOutOfStock ? "Out of Stock" : !selectedSize ? "Pick a Size First" : `Buy Now · ${formatINR(product.price)}`
              ]
            }
          ) }),
          product.sizes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold uppercase tracking-widest text-foreground", children: "Select Size" }),
              selectedSize && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-primary font-semibold", children: [
                "Size ",
                selectedSize,
                " selected"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex flex-wrap gap-3",
                "data-ocid": "product_detail.size_selector",
                children: product.sizes.map((size) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setSelectedSize(size),
                    className: cn(
                      "min-w-[52px] h-12 px-3 rounded-xl border-2 font-bold text-base transition-smooth",
                      selectedSize === size ? "border-primary bg-primary/20 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    ),
                    "data-ocid": `product_detail.size_button.${size}`,
                    children: size
                  },
                  size
                ))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold uppercase tracking-widest text-foreground block mb-3", children: "Delivery Option" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "space-y-3",
                "data-ocid": "product_detail.delivery_selector",
                children: deliveryOptions.filter((d) => d.available).map(({ option, label, sublabel, icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "label",
                  {
                    className: cn(
                      "flex items-center gap-3 px-4 rounded-xl border-2 cursor-pointer transition-smooth min-h-[56px]",
                      selectedDelivery === option ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/40"
                    ),
                    "data-ocid": `product_detail.delivery_option.${option.toLowerCase()}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "radio",
                          name: "delivery",
                          value: option,
                          checked: selectedDelivery === option,
                          onChange: () => setSelectedDelivery(option),
                          className: "sr-only"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                            selectedDelivery === option ? "border-primary" : "border-muted-foreground"
                          ),
                          children: selectedDelivery === option && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-primary" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-1 min-w-0", children: [
                        icon,
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-base text-foreground", children: label }),
                        option === DeliveryOption.SameDay && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-accent/20 text-accent font-bold px-2 py-0.5 rounded-full uppercase", children: "Hot" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground shrink-0", children: sublabel })
                    ]
                  },
                  option
                ))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-muted/40 border border-border rounded-xl p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: "💵" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: "Cash on Delivery" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Pay when your order arrives — no prepayment needed" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-0 left-0 right-0 z-30 bg-card/95 border-t border-border px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 max-w-lg mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: cn(
                "flex-1 font-display font-black uppercase tracking-wider text-sm transition-smooth h-12",
                addedToCart ? "bg-green-600/80 text-foreground" : "btn-white"
              ),
              disabled: isOutOfStock || !selectedSize,
              onClick: handleAddToCart,
              "data-ocid": "product_detail.add_to_cart_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: addedToCart ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.span,
                {
                  initial: { scale: 0.8, opacity: 0 },
                  animate: { scale: 1, opacity: 1 },
                  exit: { scale: 0.8, opacity: 0 },
                  className: "flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 16 }),
                    "Added!"
                  ]
                },
                "added"
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.span,
                {
                  initial: { scale: 0.8, opacity: 0 },
                  animate: { scale: 1, opacity: 1 },
                  exit: { scale: 0.8, opacity: 0 },
                  className: "flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 16 }),
                    isOutOfStock ? "Out of Stock" : !selectedSize ? "Pick a Size" : "Add to Bag"
                  ]
                },
                "add"
              ) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "flex-1 btn-pink font-display font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 h-12",
              disabled: isOutOfStock || !selectedSize,
              onClick: handleBuyNow,
              "data-ocid": "product_detail.buy_now_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 16 }),
                isOutOfStock ? "Out of Stock" : !selectedSize ? "Pick a Size" : "Buy Now"
              ]
            }
          )
        ] }) })
      ]
    }
  );
}
export {
  ProductDetail as default
};
