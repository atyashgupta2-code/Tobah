import { r as reactExports, j as jsxRuntimeExports, c as cn, S as Skeleton } from "./index-CVuXwThj.js";
import { S as Shirt, F as FeaturedProductCard, P as ProductCard } from "./ProductCard-CC-7w4Xa.js";
import { u as useProducts } from "./useProducts-kP_jMEzd.js";
import "./USPBadge-SPfBQePC.js";
import "./clock-DNJcM7Cg.js";
import "./zap-BsATmOI3.js";
import "./backend-BoUXNShq.js";
const PRICE_OPTIONS = [
  { label: "All", key: "all", emoji: "✨" },
  { label: "Under ₹500", key: "500", emoji: "🔥" },
  { label: "₹500–1000", key: "1000", emoji: "💥" },
  { label: "₹1000–1500", key: "1500", emoji: "⚡" },
  { label: "₹1500–2000", key: "2000", emoji: "🌟" },
  { label: "₹2000+", key: "2000plus", emoji: "👑" }
];
const GENDER_OPTIONS = [
  { label: "All", key: "all", emoji: "🛍️" },
  { label: "Men", key: "Men", emoji: "🧔" },
  { label: "Women", key: "Women", emoji: "👩" },
  { label: "Unisex", key: "Unisex", emoji: "🤝" }
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
function matchesGender(product, genderKey) {
  if (genderKey === "all") return true;
  return product.gender.toLowerCase() === genderKey.toLowerCase();
}
function FilterChip({ label, emoji, active, onClick, ocid }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      "data-ocid": ocid,
      onClick,
      className: cn(
        "shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-black border transition-all duration-200 whitespace-nowrap select-none",
        active ? "text-primary-foreground border-transparent shadow-[0_0_12px_2px_oklch(0.62_0.28_315/0.45)]" : "bg-card/60 text-muted-foreground border-border/50 hover:border-primary/50 hover:text-foreground hover:bg-card"
      ),
      style: active ? {
        background: "linear-gradient(135deg, oklch(0.62 0.28 315), oklch(0.55 0.28 290))"
      } : void 0,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm leading-none", children: emoji }),
        label
      ]
    }
  );
}
function GenderPill({ label, emoji, active, onClick, ocid }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      "data-ocid": ocid,
      onClick,
      className: cn(
        "shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black border-2 transition-all duration-200 whitespace-nowrap select-none",
        active ? "border-transparent text-background shadow-[0_0_14px_3px_oklch(0.75_0.22_65/0.5)]" : "bg-transparent text-muted-foreground border-border/40 hover:border-accent/60 hover:text-foreground"
      ),
      style: active ? {
        background: "linear-gradient(135deg, oklch(0.75 0.22 65), oklch(0.65 0.24 55))"
      } : void 0,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm leading-none", children: emoji }),
        label
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
function Shop() {
  const { data: products = [], isLoading } = useProducts();
  const [priceFilter, setPriceFilter] = reactExports.useState("all");
  const [genderFilter, setGenderFilter] = reactExports.useState("all");
  const [filterBarVisible, setFilterBarVisible] = reactExports.useState(true);
  const lastScrollY = reactExports.useRef(0);
  const filterBarRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("price");
    const g = params.get("gender");
    if (p && ["500", "1000", "1500", "2000", "2000plus"].includes(p)) {
      setPriceFilter(p);
    }
    if (g && ["Men", "Women", "Unisex"].includes(g)) {
      setGenderFilter(g);
    }
  }, []);
  reactExports.useEffect(() => {
    const params = new URLSearchParams();
    if (priceFilter !== "all") params.set("price", priceFilter);
    if (genderFilter !== "all") params.set("gender", genderFilter);
    const search = params.toString();
    const newUrl = search ? `${window.location.pathname}?${search}` : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }, [priceFilter, genderFilter]);
  reactExports.useEffect(() => {
    const SCROLL_THRESHOLD = 60;
    function onScroll() {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;
      if (currentY < SCROLL_THRESHOLD) {
        setFilterBarVisible(true);
      } else if (diff > 4) {
        setFilterBarVisible(false);
      } else if (diff < -4) {
        setFilterBarVisible(true);
      }
      lastScrollY.current = currentY;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const filtered = reactExports.useMemo(() => {
    return products.filter(
      (p) => matchesPrice(p, priceFilter) && matchesGender(p, genderFilter)
    );
  }, [products, priceFilter, genderFilter]);
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
  const hasActiveFilters = priceFilter !== "all" || genderFilter !== "all";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "shop.page", className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-6 pb-4 border-b border-border/30 bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-3xl text-foreground leading-tight uppercase tracking-tight", children: "All Drops" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: isLoading ? "Loading…" : `${products.length} styles available` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref: filterBarRef,
        "data-ocid": "shop.filter_bar",
        className: cn(
          "sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border/30 px-4 py-3 space-y-3",
          "transition-all duration-300 ease-in-out overflow-hidden",
          filterBarVisible ? "max-h-[200px] opacity-100 visible" : "max-h-0 opacity-0 invisible py-0"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2", children: "For" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto scrollbar-none pb-0.5", children: GENDER_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              GenderPill,
              {
                label: opt.label,
                emoji: opt.emoji,
                active: genderFilter === opt.key,
                onClick: () => setGenderFilter(opt.key),
                ocid: `shop.filter.gender.${opt.key}`
              },
              opt.key
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2", children: "Price" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5", children: PRICE_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              FilterChip,
              {
                label: opt.label,
                emoji: opt.emoji,
                active: priceFilter === opt.key,
                onClick: () => setPriceFilter(opt.key),
                ocid: `shop.filter.price.${opt.key}`
              },
              opt.key
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                "data-ocid": "shop.product_count",
                className: "text-xs text-muted-foreground",
                children: isLoading ? "Loading…" : hasActiveFilters ? `${filtered.length} product${filtered.length !== 1 ? "s" : ""} found` : `${filtered.length} styles`
              }
            ),
            hasActiveFilters && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "shop.filter.clear_button",
                onClick: () => {
                  setPriceFilter("all");
                  setGenderFilter("all");
                },
                className: "text-[11px] font-black text-primary hover:text-primary/70 transition-smooth",
                children: "✕ Clear filters"
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-5 pb-24", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "shop.products.loading_state",
        className: "grid grid-cols-2 gap-3",
        children: Array.from({ length: 6 }, (_, i) => `skel-${i}`).map((key) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[4/5] w-full rounded-2xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4 rounded" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/2 rounded" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full rounded-lg" })
        ] }, key))
      }
    ) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "shop.products.empty_state",
        className: "flex flex-col items-center justify-center py-20 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shirt, { size: 28, className: "text-muted-foreground" }) }),
          hasActiveFilters ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-base text-foreground mb-1", children: "No products found for these filters" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Try adjusting your price or gender filter." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "shop.empty_state.clear_button",
                onClick: () => {
                  setPriceFilter("all");
                  setGenderFilter("all");
                },
                className: "btn-primary text-sm py-2 px-5",
                children: "Clear Filters"
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-base text-foreground mb-1", children: "Drops Coming Soon" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "New styles are on the way — check back soon." })
          ] })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: gridItems.map((item) => {
      if (item.type === "featured") {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          FeaturedProductCard,
          {
            product: item.product,
            index: item.featuredIndex
          },
          `featured-${item.featuredIndex}`
        );
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        ProductCard,
        {
          product: item.product,
          index: item.gridIndex
        },
        item.product.id
      );
    }) }) })
  ] });
}
export {
  Shop as default
};
