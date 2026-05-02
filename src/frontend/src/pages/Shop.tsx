import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, ChevronUp, Shirt } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import type { Product } from "../backend.d";
import { FeaturedProductCard, ProductCard } from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";

const SESSION_CATEGORY_KEY = "tbah_last_category";

type PriceKey = "all" | "500" | "1000" | "1500" | "2000" | "2000plus";
type CategoryKey = "all" | "Men" | "Women" | "Handicrafts" | "Other" | "Shoes";

const PRICE_OPTIONS: {
  label: string;
  key: PriceKey;
  emoji: string;
  color: string;
}[] = [
  { label: "All", key: "all", emoji: "✨", color: "oklch(0.62 0.28 315)" },
  {
    label: "Under ₹500",
    key: "500",
    emoji: "🔥",
    color: "oklch(0.68 0.22 35)",
  },
  {
    label: "₹500–1000",
    key: "1000",
    emoji: "💥",
    color: "oklch(0.65 0.24 55)",
  },
  {
    label: "₹1000–1500",
    key: "1500",
    emoji: "⚡",
    color: "oklch(0.72 0.20 80)",
  },
  {
    label: "₹1500–2000",
    key: "2000",
    emoji: "🌟",
    color: "oklch(0.65 0.18 150)",
  },
  {
    label: "₹2000+",
    key: "2000plus",
    emoji: "👑",
    color: "oklch(0.62 0.28 315)",
  },
];

interface SubFilter {
  key: string;
  label: string;
}

interface CategoryCardDef {
  key: Exclude<CategoryKey, "all">;
  label: string;
  emoji: string;
  colorClass: string;
  accentColor: string;
  genderValues: string[];
  bgImage: string;
  subFilters?: SubFilter[];
}

const OTHER_SUB_FILTERS: SubFilter[] = [
  { key: "all", label: "All" },
  { key: "Bedsheets", label: "Bedsheets" },
  { key: "Artificial Jewellery", label: "Artificial Jewellery" },
  { key: "Other", label: "Other" },
];

const SHOES_SUB_FILTERS: SubFilter[] = [
  { key: "all", label: "All" },
  { key: "Men", label: "Men" },
  { key: "Women", label: "Women" },
];

const CATEGORY_CARDS: CategoryCardDef[] = [
  {
    key: "Men",
    label: "Men",
    emoji: "👔",
    colorClass: "category-card-men",
    accentColor: "oklch(0.68 0.12 265)",
    genderValues: ["Men", "Unisex"],
    bgImage:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80",
  },
  {
    key: "Women",
    label: "Women",
    emoji: "💍",
    colorClass: "category-card-women",
    accentColor: "oklch(0.72 0.14 330)",
    genderValues: ["Women", "Unisex"],
    bgImage:
      "/assets/img_20260424_230920-019dc0a8-534a-758d-97ea-b85bf7b03f3d.jpg",
  },
  {
    key: "Handicrafts",
    label: "Handicrafts",
    emoji: "🏺",
    colorClass: "category-card-handicrafts",
    accentColor: "oklch(0.75 0.14 75)",
    genderValues: ["Handicrafts"],
    bgImage:
      "/assets/img_20260424_230751-019dc0a7-8e0c-7057-8b25-d11bf115a132.jpg",
  },
  {
    key: "Other",
    label: "Other",
    emoji: "🕶️",
    colorClass: "category-card-other",
    accentColor: "oklch(0.65 0.11 295)",
    genderValues: ["Other"],
    bgImage:
      "/assets/img_20260424_230559-019dc0a8-1cbd-719a-a372-78ada809d196.jpg",
    subFilters: OTHER_SUB_FILTERS,
  },
  {
    key: "Shoes",
    label: "Shoes",
    emoji: "👟",
    colorClass: "category-card-shoes",
    accentColor: "oklch(0.70 0.18 55)",
    genderValues: ["Shoes"],
    bgImage: "/assets/shoes-banner.png",
    subFilters: SHOES_SUB_FILTERS,
  },
];

/** Exclusive price band logic */
function matchesPrice(product: Product, priceKey: PriceKey): boolean {
  const displayPrice = Number(product.price) / 100;
  if (priceKey === "all") return true;
  if (priceKey === "500") return displayPrice < 500;
  if (priceKey === "1000") return displayPrice >= 500 && displayPrice < 1000;
  if (priceKey === "1500") return displayPrice >= 1000 && displayPrice < 1500;
  if (priceKey === "2000") return displayPrice >= 1500 && displayPrice < 2000;
  if (priceKey === "2000plus") return displayPrice >= 2000;
  return true;
}

/** Category match — matches product.gender field */
function matchesCategory(product: Product, genderValues: string[]): boolean {
  return genderValues.some(
    (v) => product.gender.toLowerCase() === v.toLowerCase(),
  );
}

// ─── Beautiful Price Chip ──────────────────────────────────────────────────────
interface PriceChipProps {
  label: string;
  emoji: string;
  active: boolean;
  color: string;
  onClick: () => void;
  ocid: string;
}

function PriceChip({
  label,
  emoji,
  active,
  color,
  onClick,
  ocid,
}: PriceChipProps) {
  return (
    <button
      type="button"
      data-ocid={ocid}
      onClick={onClick}
      className={cn(
        "shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-black border transition-colors duration-150 whitespace-nowrap select-none relative overflow-hidden",
        active
          ? "border-transparent text-[oklch(0.98_0.005_280)] shadow-lg"
          : "bg-card/50 text-muted-foreground border-border/40 hover:border-border hover:text-foreground hover:bg-card",
      )}
      style={
        active
          ? {
              background: `linear-gradient(135deg, ${color}, ${color.replace(")", " / 0.75)")})`,
              boxShadow: `0 0 18px 3px ${color.replace("oklch(", "oklch(").replace(")", " / 0.4)")}`,
            }
          : undefined
      }
    >
      {active && (
        <span
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 30%, oklch(1 0 0 / 0.4), transparent 60%)",
          }}
        />
      )}
      <span className="text-sm leading-none relative z-10">{emoji}</span>
      <span className="relative z-10">{label}</span>
    </button>
  );
}

// ─── Sub-classification Filter Tabs ────────────────────────────────────────────
interface SubFilterTabsProps {
  filters: SubFilter[];
  active: string;
  onChange: (key: string) => void;
  ocidPrefix: string;
}

function SubFilterTabs({
  filters,
  active,
  onChange,
  ocidPrefix,
}: SubFilterTabsProps) {
  return (
    <div className="px-4 pt-3 pb-2 border-b border-border/20">
      <p className="text-[9px] font-black uppercase tracking-[0.22em] text-muted-foreground mb-2">
        Filter by type
      </p>
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            data-ocid={`${ocidPrefix}.subtab.${f.key.toLowerCase().replace(/\s+/g, "_")}`}
            onClick={() => onChange(f.key)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-full text-[11px] font-black border transition-colors duration-150 whitespace-nowrap",
              active === f.key
                ? "text-foreground border-transparent"
                : "bg-card/50 text-muted-foreground border-border/40 hover:border-border hover:text-foreground",
            )}
            style={
              active === f.key
                ? {
                    background:
                      "linear-gradient(135deg, oklch(0.62 0.28 315), oklch(0.62 0.28 315 / 0.75))",
                    boxShadow: "0 0 12px 2px oklch(0.62 0.28 315 / 0.35)",
                  }
                : undefined
            }
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Category Card ─────────────────────────────────────────────────────────────
interface ShopCategoryCardProps {
  cat: CategoryCardDef;
  isActive: boolean;
  onToggle: () => void;
}

function ShopCategoryCard({ cat, isActive, onToggle }: ShopCategoryCardProps) {
  return (
    <button
      type="button"
      data-ocid={`shop.category_card.${cat.key.toLowerCase()}`}
      onClick={onToggle}
      className={cn(
        "relative rounded-2xl overflow-hidden min-h-[130px] transition-all duration-150 select-none active:scale-95",
        isActive ? "scale-[1.02]" : "opacity-90 hover:opacity-100",
      )}
      style={
        isActive
          ? {
              outline: `3px solid ${cat.accentColor}`,
              outlineOffset: "2px",
              boxShadow: `0 0 22px 5px ${cat.accentColor}55`,
            }
          : undefined
      }
      aria-pressed={isActive}
    >
      <img
        src={cat.bgImage}
        alt={cat.label}
        className="absolute inset-0 w-full h-full object-cover object-center"
        loading="lazy"
        width={400}
        height={200}
        style={{ filter: "brightness(1.1) saturate(1.0)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: isActive
            ? "linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.35))"
            : "linear-gradient(135deg, rgba(0,0,0,0.40), rgba(0,0,0,0.22))",
        }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center gap-2 py-5 px-3 h-full min-h-[130px]">
        <span className="text-4xl leading-none drop-shadow-sm">
          {cat.emoji}
        </span>
        <span
          className="font-display leading-none text-center"
          style={{
            fontWeight: 900,
            fontSize: "1.05rem",
            letterSpacing: "0.04em",
            fontStyle: "italic",
            textShadow: "0 2px 10px rgba(0,0,0,0.7)",
            background: "linear-gradient(135deg, #ffffff 0%, #e0d5ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {cat.label}
        </span>
      </div>
      <span
        className="absolute bottom-2 right-2 w-5 h-5 rounded-full flex items-center justify-center z-10"
        style={{ background: "rgba(255,255,255,0.85)" }}
      >
        {isActive ? (
          <ChevronUp size={11} color="#111" strokeWidth={2.5} />
        ) : (
          <ChevronDown size={11} color="#111" strokeWidth={2} />
        )}
      </span>
    </button>
  );
}

// ─── Build grid items with featured card injection ─────────────────────────────
type GridItem =
  | { type: "product"; product: Product; gridIndex: number }
  | { type: "featured"; product: Product; featuredIndex: number };

function buildGridItems(
  filtered: Product[],
  bestSeller: Product | null,
): GridItem[] {
  const items: GridItem[] = [];
  let featuredCount = 0;
  for (let i = 0; i < filtered.length; i++) {
    if (bestSeller && i > 0 && i % 6 === 0) {
      items.push({
        type: "featured",
        product: bestSeller,
        featuredIndex: featuredCount,
      });
      featuredCount++;
    }
    items.push({ type: "product", product: filtered[i], gridIndex: i });
  }
  return items;
}

// ─── Inline accordion product panel ────────────────────────────────────────────
interface InlineProductsProps {
  products: Product[];
  isLoading: boolean;
  cat: CategoryCardDef;
  priceFilter: PriceKey;
  setPriceFilter: (k: PriceKey) => void;
  expandedRef: RefObject<HTMLDivElement | null>;
}

function InlineProducts({
  products,
  isLoading,
  cat,
  priceFilter,
  setPriceFilter,
  expandedRef,
}: InlineProductsProps) {
  const [subFilter, setSubFilter] = useState<string>("all");

  const hasSubFilters = cat.subFilters && cat.subFilters.length > 0;

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (!matchesCategory(p, cat.genderValues)) return false;
      if (!matchesPrice(p, priceFilter)) return false;
      if (hasSubFilters && subFilter !== "all") {
        return (p.subcategory ?? "") === subFilter;
      }
      return true;
    });
  }, [products, cat.genderValues, priceFilter, subFilter, hasSubFilters]);

  const bestSeller = useMemo<Product | null>(() => {
    if (products.length === 0) return null;
    return products.reduce((best, p) =>
      Number(p.orderCount) > Number(best.orderCount) ? p : best,
    );
  }, [products]);

  const gridItems = useMemo(
    () => buildGridItems(filtered, bestSeller),
    [filtered, bestSeller],
  );

  return (
    <motion.div
      ref={expandedRef}
      data-ocid={`shop.category_products.${cat.key.toLowerCase()}`}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="overflow-hidden col-span-2"
    >
      <div
        className="mt-2 rounded-2xl overflow-hidden border border-border/40"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.17 0.02 280) 0%, oklch(0.14 0.01 280) 100%)",
        }}
      >
        {/* Box header */}
        <div className="px-4 pt-4 pb-3 border-b border-border/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{cat.emoji}</span>
            <div>
              <p className="font-display font-black text-sm text-foreground">
                {cat.label}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {isLoading ? "Loading…" : `${filtered.length} styles`}
              </p>
            </div>
          </div>
          <a
            href={`/shop?category=${cat.key}`}
            data-ocid={`shop.category_products.view_all.${cat.key.toLowerCase()}`}
            className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
          >
            See all
            <ChevronRight size={13} />
          </a>
        </div>

        {/* Sub-classification tabs (for Shoes and Other) */}
        {hasSubFilters && (
          <SubFilterTabs
            filters={cat.subFilters!}
            active={subFilter}
            onChange={setSubFilter}
            ocidPrefix={`shop.category_products.${cat.key.toLowerCase()}`}
          />
        )}

        {/* Price filter row inside the panel */}
        <div className="px-4 py-3 border-b border-border/20">
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-muted-foreground mb-2.5">
            Filter by price
          </p>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            {PRICE_OPTIONS.map((opt) => (
              <PriceChip
                key={opt.key}
                label={opt.label}
                emoji={opt.emoji}
                active={priceFilter === opt.key}
                color={opt.color}
                onClick={() => setPriceFilter(opt.key)}
                ocid={`shop.inline.price.${opt.key}.${cat.key.toLowerCase()}`}
              />
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="p-3 pb-5">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((k) => (
                <div key={k} className="space-y-2">
                  <Skeleton className="aspect-[4/5] w-full rounded-xl" />
                  <Skeleton className="h-3 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              data-ocid={`shop.category_products.empty_state.${cat.key.toLowerCase()}`}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-muted/60 flex items-center justify-center mb-3">
                <Shirt size={22} className="text-muted-foreground" />
              </div>
              <p className="font-display font-bold text-sm text-foreground mb-1">
                No products in this range
              </p>
              <div className="flex flex-col gap-1.5 items-center mt-1">
                {priceFilter !== "all" && (
                  <button
                    type="button"
                    data-ocid={`shop.category_products.clear_price.${cat.key.toLowerCase()}`}
                    onClick={() => setPriceFilter("all")}
                    className="text-xs font-bold text-primary hover:text-primary/70"
                  >
                    ✕ Clear price filter
                  </button>
                )}
                {hasSubFilters && subFilter !== "all" && (
                  <button
                    type="button"
                    onClick={() => setSubFilter("all")}
                    className="text-xs font-bold text-primary hover:text-primary/70"
                  >
                    ✕ Show all {cat.label}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {gridItems.map((item) => {
                if (item.type === "featured") {
                  return (
                    <div
                      key={`featured-${item.featuredIndex}`}
                      onClick={() => {
                        try {
                          sessionStorage.setItem(SESSION_CATEGORY_KEY, cat.key);
                        } catch {
                          /* noop */
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          try {
                            sessionStorage.setItem(
                              SESSION_CATEGORY_KEY,
                              cat.key,
                            );
                          } catch {
                            /* noop */
                          }
                        }
                      }}
                    >
                      <FeaturedProductCard
                        product={item.product}
                        index={item.featuredIndex}
                      />
                    </div>
                  );
                }
                return (
                  <div
                    key={item.product.id}
                    onClick={() => {
                      try {
                        sessionStorage.setItem(SESSION_CATEGORY_KEY, cat.key);
                      } catch {
                        /* noop */
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        try {
                          sessionStorage.setItem(SESSION_CATEGORY_KEY, cat.key);
                        } catch {
                          /* noop */
                        }
                      }
                    }}
                  >
                    <ProductCard
                      product={item.product}
                      index={item.gridIndex}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Shop Page ─────────────────────────────────────────────────────────────────
export default function Shop() {
  const { data: products = [], isLoading } = useProducts();
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [priceFilter, setPriceFilter] = useState<PriceKey>("all");
  const expandedRef = useRef<HTMLDivElement>(null);

  // Sync category from URL on mount; also restore from sessionStorage (back navigation)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get("category");
    if (c && ["Men", "Women", "Handicrafts", "Other", "Shoes"].includes(c)) {
      setActiveCategory(c as CategoryKey);
      return;
    }
    try {
      const saved = sessionStorage.getItem(SESSION_CATEGORY_KEY);
      if (
        saved &&
        ["Men", "Women", "Handicrafts", "Other", "Shoes"].includes(saved)
      ) {
        setActiveCategory(saved as CategoryKey);
        sessionStorage.removeItem(SESSION_CATEGORY_KEY);
      }
    } catch {
      // sessionStorage may be unavailable
    }
    const p = params.get("price");
    if (p && ["500", "1000", "1500", "2000", "2000plus"].includes(p)) {
      setPriceFilter(p as PriceKey);
    }
  }, []);

  function handleCategoryToggle(key: CategoryKey) {
    if (activeCategory === key) {
      setActiveCategory("all");
    } else {
      setActiveCategory(key);
      setPriceFilter("all");
      setTimeout(() => {
        expandedRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
    }
  }

  const activeCategoryDef =
    CATEGORY_CARDS.find((c) => c.key === activeCategory) ?? null;
  const selectedIndex =
    activeCategory !== "all"
      ? CATEGORY_CARDS.findIndex((c) => c.key === activeCategory)
      : -1;

  // Row layout: [0,1], [2,3], [4 centered]
  const row0HasExpanded = selectedIndex === 0 || selectedIndex === 1;
  const row1HasExpanded = selectedIndex === 2 || selectedIndex === 3;
  const row2HasExpanded = selectedIndex === 4;

  const headerLabel =
    activeCategory !== "all"
      ? (CATEGORY_CARDS.find((c) => c.key === activeCategory)?.label ??
        "All Drops")
      : "All Drops";

  return (
    <div data-ocid="shop.page" className="min-h-screen pb-24">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 border-b border-border/30 bg-card">
        <h1 className="font-display font-black text-3xl text-foreground leading-tight uppercase tracking-tight">
          {headerLabel}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          {isLoading ? "Loading…" : `${products.length} styles available`}
        </p>
      </div>

      {/* Category Card Accordion Grid */}
      <div className="px-4 pt-5 pb-2">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground mb-3">
          Browse by Category
        </p>

        {/* 2-col grid with accordion inject after rows */}
        <div className="grid grid-cols-2 gap-3">
          {/* Row 0: Men, Women */}
          {CATEGORY_CARDS.slice(0, 2).map((cat) => (
            <ShopCategoryCard
              key={cat.key}
              cat={cat}
              isActive={activeCategory === cat.key}
              onToggle={() => handleCategoryToggle(cat.key)}
            />
          ))}

          {/* Row 0 accordion */}
          <AnimatePresence>
            {row0HasExpanded && activeCategoryDef && (
              <InlineProducts
                key={`shop-expand-row0-${activeCategory}`}
                products={products}
                isLoading={isLoading}
                cat={activeCategoryDef}
                priceFilter={priceFilter}
                setPriceFilter={setPriceFilter}
                expandedRef={expandedRef}
              />
            )}
          </AnimatePresence>

          {/* Row 1: Handicrafts, Other */}
          {CATEGORY_CARDS.slice(2, 4).map((cat) => (
            <ShopCategoryCard
              key={cat.key}
              cat={cat}
              isActive={activeCategory === cat.key}
              onToggle={() => handleCategoryToggle(cat.key)}
            />
          ))}

          {/* Row 1 accordion */}
          <AnimatePresence>
            {row1HasExpanded && activeCategoryDef && (
              <InlineProducts
                key={`shop-expand-row1-${activeCategory}`}
                products={products}
                isLoading={isLoading}
                cat={activeCategoryDef}
                priceFilter={priceFilter}
                setPriceFilter={setPriceFilter}
                expandedRef={expandedRef}
              />
            )}
          </AnimatePresence>

          {/* Row 2: Shoes — same size as others, shifted right to sit between/under Handicrafts and Other */}
          <div className="col-span-2 flex justify-end pr-[2px]">
            <div className="w-[calc(50%-6px)]">
              <ShopCategoryCard
                key={CATEGORY_CARDS[4].key}
                cat={CATEGORY_CARDS[4]}
                isActive={activeCategory === CATEGORY_CARDS[4].key}
                onToggle={() => handleCategoryToggle(CATEGORY_CARDS[4].key)}
              />
            </div>
          </div>

          {/* Row 2 accordion (Shoes) */}
          <AnimatePresence>
            {row2HasExpanded && activeCategoryDef && (
              <InlineProducts
                key={`shop-expand-row2-${activeCategory}`}
                products={products}
                isLoading={isLoading}
                cat={activeCategoryDef}
                priceFilter={priceFilter}
                setPriceFilter={setPriceFilter}
                expandedRef={expandedRef}
              />
            )}
          </AnimatePresence>
        </div>

        {activeCategory !== "all" && (
          <button
            type="button"
            data-ocid="shop.category.clear_button"
            onClick={() => setActiveCategory("all")}
            className="mt-3 w-full text-center text-[11px] font-black text-primary hover:text-primary/70 transition-smooth"
          >
            ✕ Show all categories
          </button>
        )}
      </div>

      {/* When no category is selected, show a subtle hint only */}
      {activeCategory === "all" && (
        <div className="px-4 pt-5 pb-10 text-center">
          <p className="text-muted-foreground text-sm">
            👆 Tap a category above to browse products &amp; filter by price
          </p>
        </div>
      )}
    </div>
  );
}
