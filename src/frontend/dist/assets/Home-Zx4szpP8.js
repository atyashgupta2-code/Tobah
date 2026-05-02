import { r as reactExports, j as jsxRuntimeExports, S as Skeleton, c as cn, L as Link } from "./index-D052jQ_k.js";
import { u as useActor, a as useQuery, c as createActor } from "./backend-DMNgBj4M.js";
import { P as ProductCard, S as Shirt } from "./ProductCard-Bp6B0Sgp.js";
import { u as useProducts } from "./useProducts-DyZ_1eTC.js";
import { B as Banknote, A as AnimatePresence } from "./USPBadge-BIgvRwNC.js";
import { m as motion } from "./proxy-C33ykiGb.js";
import { C as ChevronDown, a as ChevronUp } from "./chevron-up-Cke4yqf8.js";
import { C as ChevronRight } from "./chevron-right-h2xJECdo.js";
import "./zap-B65XmDvH.js";
import "./useMutation-DMQa2kFb.js";
import "./clock-iLbq_9WR.js";
const SESSION_CATEGORY_KEY = "tbah_last_category";
const OTHER_SUB_FILTERS = [
  { key: "all", label: "All" },
  { key: "Bedsheets", label: "Bedsheets" },
  { key: "Artificial Jewellery", label: "Artificial Jewellery" },
  { key: "Other", label: "Other" }
];
const SHOES_SUB_FILTERS = [
  { key: "all", label: "All" },
  { key: "Men", label: "Men" },
  { key: "Women", label: "Women" }
];
const CATEGORIES = [
  {
    key: "Men",
    label: "Men",
    emoji: "👔",
    description: "Latest Trends",
    cardClass: "category-card-men",
    genderValues: ["Men", "Unisex"],
    bgImage: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80"
  },
  {
    key: "Women",
    label: "Women",
    emoji: "👗",
    description: "Style Icons",
    cardClass: "category-card-women",
    genderValues: ["Women", "Unisex"],
    bgImage: "/assets/img_20260424_230920-019dc0a8-534a-758d-97ea-b85bf7b03f3d.jpg"
  },
  {
    key: "Handicrafts",
    label: "Handicrafts",
    emoji: "🏺",
    description: "Artisan Crafts",
    cardClass: "category-card-handicrafts",
    genderValues: ["Handicrafts"],
    bgImage: "/assets/img_20260424_230751-019dc0a7-8e0c-7057-8b25-d11bf115a132.jpg"
  },
  {
    key: "Other",
    label: "Other",
    emoji: "✨",
    description: "Unique Finds",
    cardClass: "category-card-other",
    genderValues: ["Other"],
    bgImage: "/assets/img_20260424_230559-019dc0a8-1cbd-719a-a372-78ada809d196.jpg",
    subFilters: OTHER_SUB_FILTERS
  },
  {
    key: "Shoes",
    label: "Shoes",
    emoji: "👟",
    description: "Step in Style",
    cardClass: "category-card-shoes",
    genderValues: ["Shoes"],
    bgImage: "/assets/shoes-banner.png",
    subFilters: SHOES_SUB_FILTERS
  }
];
const USP_CARDS = [
  {
    imageUrl: "/assets/img_20260424_232245-019dc0a7-8a8c-73da-8f47-0f07dc6b862c.jpg",
    title: "Pay When It Arrives"
  },
  {
    imageUrl: "/assets/delivered-today.png",
    title: "Delivered Today"
  },
  {
    imageUrl: "/assets/img_20260424_231923-019dc0a7-86e1-7320-9074-673617197854.jpg",
    title: "Pay After Fit & Try"
  }
];
function useNewArrivals() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["new-arrivals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNewArrivals();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1e3 * 60 * 5
  });
}
function USPImageCard({ imageUrl, title }) {
  const isDeliveredToday = title === "Delivered Today";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative rounded-2xl overflow-hidden group cursor-default flex flex-col w-full",
      style: { minHeight: 280 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "relative w-full overflow-hidden",
            style: { minHeight: 240, flex: "1 1 auto" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: imageUrl || "/assets/images/placeholder.svg",
                alt: title,
                className: "absolute inset-0 w-full h-full object-cover",
                style: { objectPosition: "center center" },
                loading: "lazy",
                decoding: "async",
                width: 400,
                height: 500,
                onError: (e) => {
                  e.currentTarget.style.display = "none";
                }
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-full px-3 py-2.5 text-center flex-shrink-0",
            style: {
              background: "oklch(0.14 0.02 280)",
              borderTop: "1px solid oklch(0.32 0.015 280 / 0.4)"
            },
            children: isDeliveredToday ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-black text-sm leading-tight tracking-tight text-foreground", children: [
              "Delivered Today",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-black",
                  style: {
                    color: "oklch(0.82 0.20 85)",
                    textShadow: "0 0 8px oklch(0.82 0.20 85 / 0.6)",
                    letterSpacing: "0.02em"
                  },
                  children: "(Jammu)"
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-black text-sm leading-tight tracking-tight text-foreground", children: title })
          }
        )
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
      style: { height: "90vh", minHeight: "420px" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: "/assets/hero-main.png",
            alt: "TBah Fashion — Shop Womens & Mens",
            className: "absolute inset-0 w-full h-full object-cover object-center",
            loading: "eager",
            width: 800,
            height: 1067,
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
            className: "relative flex flex-col items-center justify-end text-center px-5 pb-8 pt-8",
            style: { height: "90vh", minHeight: "420px", zIndex: 2 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.h1,
                {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.3, delay: 0.1 },
                  className: "font-display font-black text-3xl sm:text-5xl md:text-6xl leading-[0.92] tracking-tight mb-3",
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
                  initial: { opacity: 0, scale: 0.95 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { duration: 0.25, delay: 0.3 },
                  type: "button",
                  onClick: onScrollToProducts,
                  "data-ocid": "home.shop_now_button",
                  className: "btn-primary text-sm px-6 py-3 flex items-center gap-2 mt-2",
                  children: [
                    "Shop the Drop",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 15 })
                  ]
                }
              )
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
      loading: "lazy",
      width: 800,
      height: 500
    }
  ) });
}
function USPSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "home.usp_section",
      className: "border-y border-border/30 py-8 px-3",
      style: {
        background: "linear-gradient(180deg, oklch(0.14 0.03 280) 0%, oklch(0.16 0.03 315 / 0.6) 100%)"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-screen-md mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground mb-1", children: "Why everyone's obsessed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-2xl text-foreground leading-tight tracking-tight", children: "The TBah Difference" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mt-2" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-row gap-2 flex-nowrap items-stretch", children: USP_CARDS.map((card, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 32 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.25, delay: i * 0.08 },
            className: "flex-1 min-w-0 flex flex-col",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(USPImageCard, { ...card })
          },
          card.title
        )) })
      ] })
    }
  );
}
function CategoryCard({
  category,
  isSelected,
  onClick,
  index
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.button,
    {
      type: "button",
      onClick,
      "data-ocid": `home.category_card.${category.key.toLowerCase()}`,
      initial: { opacity: 0, y: 24 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.2, delay: index * 0.06 },
      className: cn(
        "relative rounded-2xl overflow-hidden w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-all duration-200 active:scale-95",
        isSelected && "ring-4 ring-foreground/60 ring-offset-2 ring-offset-background scale-[1.02]"
      ),
      style: { minHeight: 160 },
      "aria-pressed": isSelected,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: category.bgImage,
            alt: category.label,
            className: "absolute inset-0 w-full h-full object-cover object-center",
            loading: "lazy",
            width: 400,
            height: 200,
            style: { filter: "brightness(1.1) saturate(1.0)" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0",
            style: {
              background: isSelected ? "linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.35))" : "linear-gradient(135deg, rgba(0,0,0,0.40), rgba(0,0,0,0.22))"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative z-10 p-4 flex flex-col justify-between h-full",
            style: { minHeight: 160 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl leading-none drop-shadow-sm", children: category.emoji }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-display leading-tight",
                    style: {
                      color: "rgba(255,255,255,0.97)",
                      textShadow: "0 2px 10px rgba(0,0,0,0.7)",
                      fontWeight: 900,
                      fontSize: "1.25rem",
                      letterSpacing: "0.04em",
                      fontStyle: "italic",
                      background: "linear-gradient(135deg, #ffffff 0%, #e0d5ff 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent"
                    },
                    children: category.label
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-[10px] font-semibold uppercase tracking-widest mt-0.5",
                    style: {
                      color: "rgba(255,255,255,0.80)",
                      textShadow: "0 1px 4px rgba(0,0,0,0.5)"
                    },
                    children: category.description
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center z-10",
            style: { background: "rgba(255,255,255,0.85)" },
            children: isSelected ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 12, color: "#111", strokeWidth: 2.5 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 12, color: "#111", strokeWidth: 2 })
          }
        )
      ]
    }
  );
}
function SubFilterTabs({
  filters,
  active,
  onChange,
  ocidPrefix
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-3 pb-2 border-b border-border/20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-black uppercase tracking-[0.22em] text-muted-foreground mb-2", children: "Filter by type" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto scrollbar-none pb-0.5", children: filters.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        "data-ocid": `${ocidPrefix}.subtab.${f.key.toLowerCase().replace(/\s+/g, "_")}`,
        onClick: () => onChange(f.key),
        className: cn(
          "shrink-0 px-3 py-1.5 rounded-full text-[11px] font-black border transition-colors duration-150 whitespace-nowrap",
          active === f.key ? "text-foreground border-transparent" : "bg-card/50 text-muted-foreground border-border/40 hover:border-border hover:text-foreground"
        ),
        style: active === f.key ? {
          background: "linear-gradient(135deg, oklch(0.62 0.28 315), oklch(0.62 0.28 315 / 0.75))",
          boxShadow: "0 0 12px 2px oklch(0.62 0.28 315 / 0.35)"
        } : void 0,
        children: f.label
      },
      f.key
    )) })
  ] });
}
function InlineCategoryProducts({
  products,
  isLoading,
  category,
  productsRef
}) {
  const [subFilter, setSubFilter] = reactExports.useState("all");
  const hasSubFilters = category.subFilters && category.subFilters.length > 0;
  const filtered = products.filter((p) => {
    if (!category.genderValues.includes(p.gender ?? "")) return false;
    if (hasSubFilters && subFilter !== "all") {
      return (p.subcategory ?? "") === subFilter;
    }
    return true;
  }).sort((a, b) => {
    const aTrending = a.isTrending ? 1 : 0;
    const bTrending = b.isTrending ? 1 : 0;
    if (bTrending !== aTrending) return bTrending - aTrending;
    return Number(b.orderCount) - Number(a.orderCount);
  }).slice(0, 8);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      ref: productsRef,
      "data-ocid": `home.category_products.${category.key.toLowerCase()}`,
      initial: { opacity: 0, height: 0 },
      animate: { opacity: 1, height: "auto" },
      exit: { opacity: 0, height: 0 },
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
      className: "overflow-hidden col-span-2",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "mt-2 mb-1 rounded-2xl overflow-hidden border border-border/40",
          style: {
            background: "linear-gradient(180deg, oklch(0.17 0.02 280) 0%, oklch(0.14 0.01 280) 100%)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-4 pb-3 flex items-center justify-between border-b border-border/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: category.emoji }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-black text-sm text-foreground leading-tight", children: [
                    "Trending in ",
                    category.label
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Top picks for you 🔥" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/shop",
                  search: { category: category.key },
                  "data-ocid": `home.category_products.view_all.${category.key.toLowerCase()}`,
                  className: "flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors shrink-0",
                  children: [
                    "View all",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 13 })
                  ]
                }
              )
            ] }),
            hasSubFilters && /* @__PURE__ */ jsxRuntimeExports.jsx(
              SubFilterTabs,
              {
                filters: category.subFilters,
                active: subFilter,
                onChange: setSubFilter,
                ocidPrefix: `home.category_products.${category.key.toLowerCase()}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [1, 2, 3, 4].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[4/5] w-full rounded-xl" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-3/4 rounded" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2 rounded" })
            ] }, k)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `home.category_products.empty_state.${category.key.toLowerCase()}`,
                className: "flex flex-col items-center justify-center py-10 text-center",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-muted/60 flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shirt, { size: 22, className: "text-muted-foreground" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-bold text-sm text-foreground mb-1", children: [
                    "No ",
                    category.label,
                    " drops yet"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "New styles are on the way — check back soon." }),
                  hasSubFilters && subFilter !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setSubFilter("all"),
                      className: "text-xs font-bold text-primary hover:text-primary/70 mt-2",
                      children: [
                        "✕ Show all ",
                        category.label
                      ]
                    }
                  )
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: filtered.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                onClick: () => {
                  try {
                    sessionStorage.setItem(
                      SESSION_CATEGORY_KEY,
                      category.key
                    );
                  } catch {
                  }
                },
                onKeyDown: (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    try {
                      sessionStorage.setItem(
                        SESSION_CATEGORY_KEY,
                        category.key
                      );
                    } catch {
                    }
                  }
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p, index: i })
              },
              p.id
            )) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-4 pt-1 border-t border-border/20 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/shop",
                search: { category: category.key },
                "data-ocid": `home.category_products.see_more.${category.key.toLowerCase()}`,
                className: "flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-sm uppercase tracking-wide transition-all duration-200 hover:opacity-90 active:scale-95",
                style: {
                  background: "linear-gradient(135deg, oklch(0.62 0.28 315 / 0.15), oklch(0.62 0.28 315 / 0.08))",
                  border: "1px solid oklch(0.62 0.28 315 / 0.4)",
                  color: "oklch(0.62 0.28 315)"
                },
                children: [
                  "See more in shop section",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 15 })
                ]
              }
            ) })
          ]
        }
      )
    }
  );
}
function TrendingSection({
  products,
  isLoading
}) {
  const [selectedCategory, setSelectedCategory] = reactExports.useState(
    null
  );
  const expandedRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_CATEGORY_KEY);
      if (saved && ["Men", "Women", "Handicrafts", "Other", "Shoes"].includes(saved)) {
        setSelectedCategory(saved);
        sessionStorage.removeItem(SESSION_CATEGORY_KEY);
      }
    } catch {
    }
  }, []);
  function handleCategorySelect(key) {
    if (selectedCategory === key) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(key);
      setTimeout(() => {
        var _a;
        (_a = expandedRef.current) == null ? void 0 : _a.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      }, 100);
    }
  }
  const selectedIndex = selectedCategory ? CATEGORIES.findIndex((c) => c.key === selectedCategory) : -1;
  const row0HasExpanded = selectedIndex === 0 || selectedIndex === 1;
  const row1HasExpanded = selectedIndex === 2 || selectedIndex === 3;
  const row2HasExpanded = selectedIndex === 4;
  const expandedCategoryDef = selectedCategory ? CATEGORIES.find((c) => c.key === selectedCategory) ?? null : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "home.trending_section",
      className: "py-8 px-4",
      style: {
        background: "linear-gradient(180deg, oklch(0.13 0.02 290) 0%, oklch(0.14 0.02 280) 100%)"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-screen-md mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground mb-1", children: "Most Popular" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-3xl text-foreground leading-tight tracking-tight", children: selectedCategory ? `🔥 Trending in ${selectedCategory}` : "🔥 Trending" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Tap a category to see what's hot ✨" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          CATEGORIES.slice(0, 2).map((cat, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            CategoryCard,
            {
              category: cat,
              isSelected: selectedCategory === cat.key,
              onClick: () => handleCategorySelect(cat.key),
              index: i
            },
            cat.key
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: row0HasExpanded && expandedCategoryDef && /* @__PURE__ */ jsxRuntimeExports.jsx(
            InlineCategoryProducts,
            {
              products,
              isLoading,
              category: expandedCategoryDef,
              productsRef: expandedRef
            },
            `trending-row0-${selectedCategory}`
          ) }),
          CATEGORIES.slice(2, 4).map((cat, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            CategoryCard,
            {
              category: cat,
              isSelected: selectedCategory === cat.key,
              onClick: () => handleCategorySelect(cat.key),
              index: i + 2
            },
            cat.key
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: row1HasExpanded && expandedCategoryDef && /* @__PURE__ */ jsxRuntimeExports.jsx(
            InlineCategoryProducts,
            {
              products,
              isLoading,
              category: expandedCategoryDef,
              productsRef: expandedRef
            },
            `trending-row1-${selectedCategory}`
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 flex justify-end pr-[2px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-[calc(50%-6px)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            CategoryCard,
            {
              category: CATEGORIES[4],
              isSelected: selectedCategory === CATEGORIES[4].key,
              onClick: () => handleCategorySelect(CATEGORIES[4].key),
              index: 4
            },
            CATEGORIES[4].key
          ) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: row2HasExpanded && expandedCategoryDef && /* @__PURE__ */ jsxRuntimeExports.jsx(
            InlineCategoryProducts,
            {
              products,
              isLoading,
              category: expandedCategoryDef,
              productsRef: expandedRef
            },
            `trending-row2-${selectedCategory}`
          ) })
        ] })
      ] })
    }
  );
}
function NewArrivalsSection() {
  const { data: newArrivals = [], isLoading } = useNewArrivals();
  if (!isLoading && newArrivals.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "home.new_arrivals_section",
      className: "py-8 px-4 border-t border-border/20",
      style: {
        background: "linear-gradient(180deg, oklch(0.15 0.025 280) 0%, oklch(0.13 0.02 290) 100%)"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-screen-md mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground mb-1", children: "Just Dropped" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-3xl text-foreground leading-tight tracking-tight", children: "✨ New Arrivals" })
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [1, 2, 3, 4].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[4/5] w-full rounded-xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-3/4 rounded" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2 rounded" })
        ] }, k)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: newArrivals.slice(0, 8).map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 16 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.2, delay: i * 0.05 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p, index: i })
          },
          p.id
        )) })
      ] })
    }
  );
}
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
    /* @__PURE__ */ jsxRuntimeExports.jsx(USPSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: productsRef, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingSection, { products, isLoading }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NewArrivalsSection, {}),
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
