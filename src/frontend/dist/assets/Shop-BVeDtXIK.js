import { r as reactExports, j as jsxRuntimeExports, c as cn, S as Skeleton } from "./index-D052jQ_k.js";
import { S as Shirt, F as FeaturedProductCard, P as ProductCard } from "./ProductCard-Bp6B0Sgp.js";
import { u as useProducts } from "./useProducts-DyZ_1eTC.js";
import { A as AnimatePresence } from "./USPBadge-BIgvRwNC.js";
import { a as ChevronUp, C as ChevronDown } from "./chevron-up-Cke4yqf8.js";
import { m as motion } from "./proxy-C33ykiGb.js";
import { C as ChevronRight } from "./chevron-right-h2xJECdo.js";
import "./zap-B65XmDvH.js";
import "./backend-DMNgBj4M.js";
import "./useMutation-DMQa2kFb.js";
import "./clock-iLbq_9WR.js";
const SESSION_CATEGORY_KEY = "tbah_last_category";
const PRICE_OPTIONS = [
  { label: "All", key: "all", emoji: "✨", color: "oklch(0.62 0.28 315)" },
  {
    label: "Under ₹500",
    key: "500",
    emoji: "🔥",
    color: "oklch(0.68 0.22 35)"
  },
  {
    label: "₹500–1000",
    key: "1000",
    emoji: "💥",
    color: "oklch(0.65 0.24 55)"
  },
  {
    label: "₹1000–1500",
    key: "1500",
    emoji: "⚡",
    color: "oklch(0.72 0.20 80)"
  },
  {
    label: "₹1500–2000",
    key: "2000",
    emoji: "🌟",
    color: "oklch(0.65 0.18 150)"
  },
  {
    label: "₹2000+",
    key: "2000plus",
    emoji: "👑",
    color: "oklch(0.62 0.28 315)"
  }
];
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
const CATEGORY_CARDS = [
  {
    key: "Men",
    label: "Men",
    emoji: "👔",
    colorClass: "category-card-men",
    accentColor: "oklch(0.68 0.12 265)",
    genderValues: ["Men", "Unisex"],
    bgImage: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80"
  },
  {
    key: "Women",
    label: "Women",
    emoji: "💍",
    colorClass: "category-card-women",
    accentColor: "oklch(0.72 0.14 330)",
    genderValues: ["Women", "Unisex"],
    bgImage: "/assets/img_20260424_230920-019dc0a8-534a-758d-97ea-b85bf7b03f3d.jpg"
  },
  {
    key: "Handicrafts",
    label: "Handicrafts",
    emoji: "🏺",
    colorClass: "category-card-handicrafts",
    accentColor: "oklch(0.75 0.14 75)",
    genderValues: ["Handicrafts"],
    bgImage: "/assets/img_20260424_230751-019dc0a7-8e0c-7057-8b25-d11bf115a132.jpg"
  },
  {
    key: "Other",
    label: "Other",
    emoji: "🕶️",
    colorClass: "category-card-other",
    accentColor: "oklch(0.65 0.11 295)",
    genderValues: ["Other"],
    bgImage: "/assets/img_20260424_230559-019dc0a8-1cbd-719a-a372-78ada809d196.jpg",
    subFilters: OTHER_SUB_FILTERS
  },
  {
    key: "Shoes",
    label: "Shoes",
    emoji: "👟",
    colorClass: "category-card-shoes",
    accentColor: "oklch(0.70 0.18 55)",
    genderValues: ["Shoes"],
    bgImage: "/assets/shoes-banner.png",
    subFilters: SHOES_SUB_FILTERS
  }
];
function matchesPrice(product, priceKey) {
  const displayPrice = Number(product.price) / 100;
  if (priceKey === "all") return true;
  if (priceKey === "500") return displayPrice < 500;
  if (priceKey === "1000") return displayPrice >= 500 && displayPrice < 1e3;
  if (priceKey === "1500") return displayPrice >= 1e3 && displayPrice < 1500;
  if (priceKey === "2000") return displayPrice >= 1500 && displayPrice < 2e3;
  if (priceKey === "2000plus") return displayPrice >= 2e3;
  return true;
}
function matchesCategory(product, genderValues) {
  return genderValues.some(
    (v) => product.gender.toLowerCase() === v.toLowerCase()
  );
}
function PriceChip({
  label,
  emoji,
  active,
  color,
  onClick,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      "data-ocid": ocid,
      onClick,
      className: cn(
        "shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-black border transition-colors duration-150 whitespace-nowrap select-none relative overflow-hidden",
        active ? "border-transparent text-[oklch(0.98_0.005_280)] shadow-lg" : "bg-card/50 text-muted-foreground border-border/40 hover:border-border hover:text-foreground hover:bg-card"
      ),
      style: active ? {
        background: `linear-gradient(135deg, ${color}, ${color.replace(")", " / 0.75)")})`,
        boxShadow: `0 0 18px 3px ${color.replace("oklch(", "oklch(").replace(")", " / 0.4)")}`
      } : void 0,
      children: [
        active && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "absolute inset-0 opacity-20 pointer-events-none",
            style: {
              background: "radial-gradient(ellipse at 30% 30%, oklch(1 0 0 / 0.4), transparent 60%)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm leading-none relative z-10", children: emoji }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative z-10", children: label })
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
function ShopCategoryCard({ cat, isActive, onToggle }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      "data-ocid": `shop.category_card.${cat.key.toLowerCase()}`,
      onClick: onToggle,
      className: cn(
        "relative rounded-2xl overflow-hidden min-h-[130px] transition-all duration-150 select-none active:scale-95",
        isActive ? "scale-[1.02]" : "opacity-90 hover:opacity-100"
      ),
      style: isActive ? {
        outline: `3px solid ${cat.accentColor}`,
        outlineOffset: "2px",
        boxShadow: `0 0 22px 5px ${cat.accentColor}55`
      } : void 0,
      "aria-pressed": isActive,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: cat.bgImage,
            alt: cat.label,
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
              background: isActive ? "linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.35))" : "linear-gradient(135deg, rgba(0,0,0,0.40), rgba(0,0,0,0.22))"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col items-center justify-center gap-2 py-5 px-3 h-full min-h-[130px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl leading-none drop-shadow-sm", children: cat.emoji }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-display leading-none text-center",
              style: {
                fontWeight: 900,
                fontSize: "1.05rem",
                letterSpacing: "0.04em",
                fontStyle: "italic",
                textShadow: "0 2px 10px rgba(0,0,0,0.7)",
                background: "linear-gradient(135deg, #ffffff 0%, #e0d5ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              },
              children: cat.label
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "absolute bottom-2 right-2 w-5 h-5 rounded-full flex items-center justify-center z-10",
            style: { background: "rgba(255,255,255,0.85)" },
            children: isActive ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 11, color: "#111", strokeWidth: 2.5 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 11, color: "#111", strokeWidth: 2 })
          }
        )
      ]
    }
  );
}
function buildGridItems(filtered, bestSeller) {
  const items = [];
  let featuredCount = 0;
  for (let i = 0; i < filtered.length; i++) {
    if (bestSeller && i > 0 && i % 6 === 0) {
      items.push({
        type: "featured",
        product: bestSeller,
        featuredIndex: featuredCount
      });
      featuredCount++;
    }
    items.push({ type: "product", product: filtered[i], gridIndex: i });
  }
  return items;
}
function InlineProducts({
  products,
  isLoading,
  cat,
  priceFilter,
  setPriceFilter,
  expandedRef
}) {
  const [subFilter, setSubFilter] = reactExports.useState("all");
  const hasSubFilters = cat.subFilters && cat.subFilters.length > 0;
  const filtered = reactExports.useMemo(() => {
    return products.filter((p) => {
      if (!matchesCategory(p, cat.genderValues)) return false;
      if (!matchesPrice(p, priceFilter)) return false;
      if (hasSubFilters && subFilter !== "all") {
        return (p.subcategory ?? "") === subFilter;
      }
      return true;
    });
  }, [products, cat.genderValues, priceFilter, subFilter, hasSubFilters]);
  const bestSeller = reactExports.useMemo(() => {
    if (products.length === 0) return null;
    return products.reduce(
      (best, p) => Number(p.orderCount) > Number(best.orderCount) ? p : best
    );
  }, [products]);
  const gridItems = reactExports.useMemo(
    () => buildGridItems(filtered, bestSeller),
    [filtered, bestSeller]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      ref: expandedRef,
      "data-ocid": `shop.category_products.${cat.key.toLowerCase()}`,
      initial: { opacity: 0, height: 0 },
      animate: { opacity: 1, height: "auto" },
      exit: { opacity: 0, height: 0 },
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
      className: "overflow-hidden col-span-2",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "mt-2 rounded-2xl overflow-hidden border border-border/40",
          style: {
            background: "linear-gradient(180deg, oklch(0.17 0.02 280) 0%, oklch(0.14 0.01 280) 100%)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-4 pb-3 border-b border-border/30 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: cat.emoji }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-black text-sm text-foreground", children: cat.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: isLoading ? "Loading…" : `${filtered.length} styles` })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: `/shop?category=${cat.key}`,
                  "data-ocid": `shop.category_products.view_all.${cat.key.toLowerCase()}`,
                  className: "flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors",
                  children: [
                    "See all",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 13 })
                  ]
                }
              )
            ] }),
            hasSubFilters && /* @__PURE__ */ jsxRuntimeExports.jsx(
              SubFilterTabs,
              {
                filters: cat.subFilters,
                active: subFilter,
                onChange: setSubFilter,
                ocidPrefix: `shop.category_products.${cat.key.toLowerCase()}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-b border-border/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-black uppercase tracking-[0.22em] text-muted-foreground mb-2.5", children: "Filter by price" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5", children: PRICE_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                PriceChip,
                {
                  label: opt.label,
                  emoji: opt.emoji,
                  active: priceFilter === opt.key,
                  color: opt.color,
                  onClick: () => setPriceFilter(opt.key),
                  ocid: `shop.inline.price.${opt.key}.${cat.key.toLowerCase()}`
                },
                opt.key
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 pb-5", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [1, 2, 3, 4].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[4/5] w-full rounded-xl" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-3/4 rounded" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2 rounded" })
            ] }, k)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `shop.category_products.empty_state.${cat.key.toLowerCase()}`,
                className: "flex flex-col items-center justify-center py-12 text-center",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-muted/60 flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shirt, { size: 22, className: "text-muted-foreground" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-sm text-foreground mb-1", children: "No products in this range" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 items-center mt-1", children: [
                    priceFilter !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": `shop.category_products.clear_price.${cat.key.toLowerCase()}`,
                        onClick: () => setPriceFilter("all"),
                        className: "text-xs font-bold text-primary hover:text-primary/70",
                        children: "✕ Clear price filter"
                      }
                    ),
                    hasSubFilters && subFilter !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => setSubFilter("all"),
                        className: "text-xs font-bold text-primary hover:text-primary/70",
                        children: [
                          "✕ Show all ",
                          cat.label
                        ]
                      }
                    )
                  ] })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: gridItems.map((item) => {
              if (item.type === "featured") {
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    onClick: () => {
                      try {
                        sessionStorage.setItem(SESSION_CATEGORY_KEY, cat.key);
                      } catch {
                      }
                    },
                    onKeyDown: (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        try {
                          sessionStorage.setItem(
                            SESSION_CATEGORY_KEY,
                            cat.key
                          );
                        } catch {
                        }
                      }
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      FeaturedProductCard,
                      {
                        product: item.product,
                        index: item.featuredIndex
                      }
                    )
                  },
                  `featured-${item.featuredIndex}`
                );
              }
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  onClick: () => {
                    try {
                      sessionStorage.setItem(SESSION_CATEGORY_KEY, cat.key);
                    } catch {
                    }
                  },
                  onKeyDown: (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      try {
                        sessionStorage.setItem(SESSION_CATEGORY_KEY, cat.key);
                      } catch {
                      }
                    }
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ProductCard,
                    {
                      product: item.product,
                      index: item.gridIndex
                    }
                  )
                },
                item.product.id
              );
            }) }) })
          ]
        }
      )
    }
  );
}
function Shop() {
  var _a;
  const { data: products = [], isLoading } = useProducts();
  const [activeCategory, setActiveCategory] = reactExports.useState("all");
  const [priceFilter, setPriceFilter] = reactExports.useState("all");
  const expandedRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get("category");
    if (c && ["Men", "Women", "Handicrafts", "Other", "Shoes"].includes(c)) {
      setActiveCategory(c);
      return;
    }
    try {
      const saved = sessionStorage.getItem(SESSION_CATEGORY_KEY);
      if (saved && ["Men", "Women", "Handicrafts", "Other", "Shoes"].includes(saved)) {
        setActiveCategory(saved);
        sessionStorage.removeItem(SESSION_CATEGORY_KEY);
      }
    } catch {
    }
    const p = params.get("price");
    if (p && ["500", "1000", "1500", "2000", "2000plus"].includes(p)) {
      setPriceFilter(p);
    }
  }, []);
  function handleCategoryToggle(key) {
    if (activeCategory === key) {
      setActiveCategory("all");
    } else {
      setActiveCategory(key);
      setPriceFilter("all");
      setTimeout(() => {
        var _a2;
        (_a2 = expandedRef.current) == null ? void 0 : _a2.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      }, 100);
    }
  }
  const activeCategoryDef = CATEGORY_CARDS.find((c) => c.key === activeCategory) ?? null;
  const selectedIndex = activeCategory !== "all" ? CATEGORY_CARDS.findIndex((c) => c.key === activeCategory) : -1;
  const row0HasExpanded = selectedIndex === 0 || selectedIndex === 1;
  const row1HasExpanded = selectedIndex === 2 || selectedIndex === 3;
  const row2HasExpanded = selectedIndex === 4;
  const headerLabel = activeCategory !== "all" ? ((_a = CATEGORY_CARDS.find((c) => c.key === activeCategory)) == null ? void 0 : _a.label) ?? "All Drops" : "All Drops";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "shop.page", className: "min-h-screen pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-6 pb-4 border-b border-border/30 bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-3xl text-foreground leading-tight uppercase tracking-tight", children: headerLabel }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: isLoading ? "Loading…" : `${products.length} styles available` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-5 pb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground mb-3", children: "Browse by Category" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        CATEGORY_CARDS.slice(0, 2).map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ShopCategoryCard,
          {
            cat,
            isActive: activeCategory === cat.key,
            onToggle: () => handleCategoryToggle(cat.key)
          },
          cat.key
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: row0HasExpanded && activeCategoryDef && /* @__PURE__ */ jsxRuntimeExports.jsx(
          InlineProducts,
          {
            products,
            isLoading,
            cat: activeCategoryDef,
            priceFilter,
            setPriceFilter,
            expandedRef
          },
          `shop-expand-row0-${activeCategory}`
        ) }),
        CATEGORY_CARDS.slice(2, 4).map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ShopCategoryCard,
          {
            cat,
            isActive: activeCategory === cat.key,
            onToggle: () => handleCategoryToggle(cat.key)
          },
          cat.key
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: row1HasExpanded && activeCategoryDef && /* @__PURE__ */ jsxRuntimeExports.jsx(
          InlineProducts,
          {
            products,
            isLoading,
            cat: activeCategoryDef,
            priceFilter,
            setPriceFilter,
            expandedRef
          },
          `shop-expand-row1-${activeCategory}`
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 flex justify-end pr-[2px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-[calc(50%-6px)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ShopCategoryCard,
          {
            cat: CATEGORY_CARDS[4],
            isActive: activeCategory === CATEGORY_CARDS[4].key,
            onToggle: () => handleCategoryToggle(CATEGORY_CARDS[4].key)
          },
          CATEGORY_CARDS[4].key
        ) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: row2HasExpanded && activeCategoryDef && /* @__PURE__ */ jsxRuntimeExports.jsx(
          InlineProducts,
          {
            products,
            isLoading,
            cat: activeCategoryDef,
            priceFilter,
            setPriceFilter,
            expandedRef
          },
          `shop-expand-row2-${activeCategory}`
        ) })
      ] }),
      activeCategory !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "shop.category.clear_button",
          onClick: () => setActiveCategory("all"),
          className: "mt-3 w-full text-center text-[11px] font-black text-primary hover:text-primary/70 transition-smooth",
          children: "✕ Show all categories"
        }
      )
    ] }),
    activeCategory === "all" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-5 pb-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "👆 Tap a category above to browse products & filter by price" }) })
  ] });
}
export {
  Shop as default
};
