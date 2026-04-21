import { r as reactExports, j as jsxRuntimeExports, S as Skeleton, c as cn } from "./index-CVuXwThj.js";
import { S as Shirt, P as ProductCard } from "./ProductCard-CC-7w4Xa.js";
import { u as useProducts } from "./useProducts-kP_jMEzd.js";
import { B as Banknote } from "./USPBadge-SPfBQePC.js";
import { Z as Zap } from "./zap-BsATmOI3.js";
import { m as motion } from "./proxy-BgVQaqs9.js";
import { C as ChevronDown } from "./chevron-down-BpgrK5JY.js";
import "./backend-BoUXNShq.js";
import "./clock-DNJcM7Cg.js";
function USPCard({
  icon: Icon,
  title,
  subtitle,
  tag,
  gradient,
  iconBg,
  iconColor,
  tagBg,
  tagColor,
  border
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "rounded-2xl border p-4 flex flex-col gap-3 relative overflow-hidden",
        border
      ),
      style: { background: gradient },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-30 blur-2xl pointer-events-none",
            style: { background: gradient }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
              iconBg
            ),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 24, className: iconColor })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: cn(
              "self-start text-[9px] font-black uppercase tracking-[0.18em] px-2.5 py-1 rounded-full",
              tagBg,
              tagColor
            ),
            children: tag
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-black text-base text-foreground leading-tight tracking-tight", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-1.5 leading-relaxed", children: subtitle })
        ] })
      ]
    }
  );
}
function HeroSection({
  onScrollToProducts
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "home.hero_section",
      className: "relative overflow-hidden",
      style: { minHeight: "92vh" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: "/assets/hero-fashion.jpg",
            alt: "TBah Fashion — Shop Womens & Mens",
            className: "absolute inset-0 w-full h-full object-cover object-top",
            style: { zIndex: 0 }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 pointer-events-none",
            style: {
              zIndex: 1,
              background: "linear-gradient(to top, oklch(0.10 0.02 280 / 0.97) 0%, oklch(0.10 0.02 280 / 0.75) 35%, oklch(0.10 0.02 280 / 0.20) 65%, transparent 100%)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative flex flex-col items-center justify-end text-center px-5 pb-14 pt-12",
            style: { minHeight: "92vh", zIndex: 2 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.h1,
                {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.55, delay: 0.15 },
                  className: "font-display font-black text-5xl sm:text-7xl leading-[0.92] tracking-tight mb-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground block", children: "Shop" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-primary block", children: "Different." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground block", children: "Pay After" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground block", children: "Fit & Try." })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.button,
                {
                  initial: { opacity: 0, scale: 0.9 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { duration: 0.45, delay: 0.4 },
                  type: "button",
                  onClick: onScrollToProducts,
                  "data-ocid": "home.shop_now_button",
                  className: "btn-primary text-base px-8 py-3.5 flex items-center gap-2 mt-4",
                  children: [
                    "Shop the Drop",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16 })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-8 rounded-full border-2 border-border/40 flex items-start justify-center pt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  animate: { y: [0, 8, 0] },
                  transition: {
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 1.6,
                    ease: "easeInOut"
                  },
                  className: "w-1 h-1.5 bg-muted-foreground rounded-full"
                }
              ) }) })
            ]
          }
        )
      ]
    }
  );
}
function PromoBanner() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "home.promo_banner", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "img",
    {
      src: "/assets/img_20260419_001138-019da6b1-ad95-719f-ba5d-16fd10293042.jpg",
      alt: "TBah — New Collection",
      className: "w-full block object-cover",
      loading: "lazy"
    }
  ) });
}
const USP_CARDS = [
  {
    icon: Banknote,
    title: "Pay When It Arrives",
    subtitle: "Zero risk. Cash on delivery on every single order. No card needed.",
    tag: "COD",
    gradient: "linear-gradient(135deg, oklch(0.18 0.06 315 / 0.85), oklch(0.14 0.03 315 / 0.5))",
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
    tagBg: "bg-primary/20",
    tagColor: "text-primary",
    border: "border-primary/30"
  },
  {
    icon: Zap,
    title: "Delivered Today",
    subtitle: "Order before 2 PM — same-day delivery right to your door.",
    tag: "Same Day",
    gradient: "linear-gradient(135deg, oklch(0.20 0.06 65 / 0.85), oklch(0.15 0.03 65 / 0.5))",
    iconBg: "bg-accent/20",
    iconColor: "text-accent",
    tagBg: "bg-accent/20",
    tagColor: "text-accent",
    border: "border-accent/30"
  },
  {
    icon: Shirt,
    title: "Pay After Fit & Try",
    subtitle: "Try your fits at home first. Pay only if you love it — no stress.",
    tag: "Fit & Try",
    gradient: "linear-gradient(135deg, oklch(0.18 0.07 200 / 0.85), oklch(0.13 0.03 200 / 0.5))",
    iconBg: "bg-[oklch(0.55_0.22_200)]/20",
    iconColor: "text-[oklch(0.70_0.20_200)]",
    tagBg: "bg-[oklch(0.55_0.22_200)]/20",
    tagColor: "text-[oklch(0.70_0.20_200)]",
    border: "border-[oklch(0.55_0.22_200)]/30"
  }
];
function Home() {
  const { data: products = [], isLoading } = useProducts();
  const productsRef = reactExports.useRef(null);
  function scrollToProducts() {
    var _a;
    (_a = productsRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "home.page", className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeroSection, { onScrollToProducts: scrollToProducts }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "data-ocid": "home.promo_section", className: "bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PromoBanner, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        "data-ocid": "home.usp_section",
        className: "border-y border-border/30 py-10 px-4",
        style: {
          background: "linear-gradient(180deg, oklch(0.14 0.03 280) 0%, oklch(0.16 0.03 315 / 0.6) 100%)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-screen-md mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground mb-1", children: "Why everyone's obsessed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full mx-auto" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: USP_CARDS.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsx(USPCard, { ...card }, card.tag)) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        ref: productsRef,
        "data-ocid": "home.products_section",
        className: "border-t border-border/30 pt-8 pb-6 px-4",
        style: {
          background: "linear-gradient(180deg, oklch(0.13 0.02 280) 0%, oklch(0.11 0.01 280) 100%)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-baseline justify-between mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-2xl text-foreground leading-tight", children: "Trending Now 🔥" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Fresh drops · Limited stock" })
          ] }) }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "home.products.loading_state",
              className: "grid grid-cols-2 gap-3",
              children: Array.from({ length: 4 }, (_, i) => `skel-${i}`).map((key) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[4/5] w-full rounded-2xl" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4 rounded" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/2 rounded" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full rounded-lg" })
              ] }, key))
            }
          ) : products.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "home.products.empty_state",
              className: "flex flex-col items-center justify-center py-16 text-center",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shirt, { size: 28, className: "text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-base text-foreground mb-1", children: "Drops Coming Soon" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "New styles are on the way — check back soon." })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: products.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p, index: i }, p.id)) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-4 mb-8 mt-2 rounded-2xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "py-3 px-5 flex items-center justify-center gap-3",
        style: {
          background: "linear-gradient(90deg, oklch(0.62 0.28 315 / 0.15), oklch(0.14 0.01 280), oklch(0.62 0.28 315 / 0.15))"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { size: 16, className: "text-primary shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-center text-foreground tracking-wide uppercase", children: "Cash on Delivery · Pay After Fit & Try" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { size: 16, className: "text-primary shrink-0" })
        ]
      }
    ) })
  ] });
}
export {
  Home as default
};
