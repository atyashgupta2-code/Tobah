import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Shirt } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "../backend.d";
import { FeaturedProductCard, ProductCard } from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";

type PriceKey = "all" | "500" | "1000" | "1500" | "2000" | "2000plus";
type GenderKey = "all" | "Men" | "Women" | "Unisex";

const PRICE_OPTIONS: { label: string; key: PriceKey; emoji: string }[] = [
  { label: "All", key: "all", emoji: "✨" },
  { label: "Under ₹500", key: "500", emoji: "🔥" },
  { label: "₹500–1000", key: "1000", emoji: "💥" },
  { label: "₹1000–1500", key: "1500", emoji: "⚡" },
  { label: "₹1500–2000", key: "2000", emoji: "🌟" },
  { label: "₹2000+", key: "2000plus", emoji: "👑" },
];

const GENDER_OPTIONS: { label: string; key: GenderKey; emoji: string }[] = [
  { label: "All", key: "all", emoji: "🛍️" },
  { label: "Men", key: "Men", emoji: "🧔" },
  { label: "Women", key: "Women", emoji: "👩" },
  { label: "Unisex", key: "Unisex", emoji: "🤝" },
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

/** Case-insensitive gender match */
function matchesGender(product: Product, genderKey: GenderKey): boolean {
  if (genderKey === "all") return true;
  return product.gender.toLowerCase() === genderKey.toLowerCase();
}

// ─── Filter Chip ───────────────────────────────────────────────────────────────
interface FilterChipProps {
  label: string;
  emoji: string;
  active: boolean;
  onClick: () => void;
  ocid: string;
}

function FilterChip({ label, emoji, active, onClick, ocid }: FilterChipProps) {
  return (
    <button
      type="button"
      data-ocid={ocid}
      onClick={onClick}
      className={cn(
        "shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-black border transition-all duration-200 whitespace-nowrap select-none",
        active
          ? "text-primary-foreground border-transparent shadow-[0_0_12px_2px_oklch(0.62_0.28_315/0.45)]"
          : "bg-card/60 text-muted-foreground border-border/50 hover:border-primary/50 hover:text-foreground hover:bg-card",
      )}
      style={
        active
          ? {
              background:
                "linear-gradient(135deg, oklch(0.62 0.28 315), oklch(0.55 0.28 290))",
            }
          : undefined
      }
    >
      <span className="text-sm leading-none">{emoji}</span>
      {label}
    </button>
  );
}

// ─── Gender Pill ───────────────────────────────────────────────────────────────
interface GenderPillProps {
  label: string;
  emoji: string;
  active: boolean;
  onClick: () => void;
  ocid: string;
}

function GenderPill({ label, emoji, active, onClick, ocid }: GenderPillProps) {
  return (
    <button
      type="button"
      data-ocid={ocid}
      onClick={onClick}
      className={cn(
        "shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black border-2 transition-all duration-200 whitespace-nowrap select-none",
        active
          ? "border-transparent text-background shadow-[0_0_14px_3px_oklch(0.75_0.22_65/0.5)]"
          : "bg-transparent text-muted-foreground border-border/40 hover:border-accent/60 hover:text-foreground",
      )}
      style={
        active
          ? {
              background:
                "linear-gradient(135deg, oklch(0.75 0.22 65), oklch(0.65 0.24 55))",
            }
          : undefined
      }
    >
      <span className="text-sm leading-none">{emoji}</span>
      {label}
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
    // Inject featured card after every 6th product slot (before index 6, 13, 20…)
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

// ─── Shop Page ─────────────────────────────────────────────────────────────────
export default function Shop() {
  const { data: products = [], isLoading } = useProducts();

  const [priceFilter, setPriceFilter] = useState<PriceKey>("all");
  const [genderFilter, setGenderFilter] = useState<GenderKey>("all");

  // Hide-on-scroll state
  const [filterBarVisible, setFilterBarVisible] = useState(true);
  const lastScrollY = useRef(0);
  const filterBarRef = useRef<HTMLDivElement>(null);

  // Sync from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("price");
    const g = params.get("gender");
    if (p && ["500", "1000", "1500", "2000", "2000plus"].includes(p)) {
      setPriceFilter(p as PriceKey);
    }
    if (g && ["Men", "Women", "Unisex"].includes(g)) {
      setGenderFilter(g as GenderKey);
    }
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (priceFilter !== "all") params.set("price", priceFilter);
    if (genderFilter !== "all") params.set("gender", genderFilter);
    const search = params.toString();
    const newUrl = search
      ? `${window.location.pathname}?${search}`
      : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }, [priceFilter, genderFilter]);

  // Hide filter bar when scrolling down, show when scrolling up or near top
  useEffect(() => {
    const SCROLL_THRESHOLD = 60;

    function onScroll() {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;

      if (currentY < SCROLL_THRESHOLD) {
        // Near top of page — always show
        setFilterBarVisible(true);
      } else if (diff > 4) {
        // Scrolling down — hide
        setFilterBarVisible(false);
      } else if (diff < -4) {
        // Scrolling up — show
        setFilterBarVisible(true);
      }

      lastScrollY.current = currentY;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = useMemo(() => {
    return products.filter(
      (p) => matchesPrice(p, priceFilter) && matchesGender(p, genderFilter),
    );
  }, [products, priceFilter, genderFilter]);

  // Best seller = product with highest orderCount across ALL loaded products
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

  const hasActiveFilters = priceFilter !== "all" || genderFilter !== "all";

  return (
    <div data-ocid="shop.page" className="min-h-screen">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 border-b border-border/30 bg-card">
        <h1 className="font-display font-black text-3xl text-foreground leading-tight uppercase tracking-tight">
          All Drops
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          {isLoading ? "Loading…" : `${products.length} styles available`}
        </p>
      </div>

      {/* Filter Bar — collapses on scroll down, fully hidden to avoid blank space */}
      <div
        ref={filterBarRef}
        data-ocid="shop.filter_bar"
        className={cn(
          "sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border/30 px-4 py-3 space-y-3",
          "transition-all duration-300 ease-in-out overflow-hidden",
          filterBarVisible
            ? "max-h-[200px] opacity-100 visible"
            : "max-h-0 opacity-0 invisible py-0",
        )}
      >
        {/* Gender filters */}
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
            For
          </p>
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
            {GENDER_OPTIONS.map((opt) => (
              <GenderPill
                key={opt.key}
                label={opt.label}
                emoji={opt.emoji}
                active={genderFilter === opt.key}
                onClick={() => setGenderFilter(opt.key)}
                ocid={`shop.filter.gender.${opt.key}`}
              />
            ))}
          </div>
        </div>

        {/* Price filters */}
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Price
          </p>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            {PRICE_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.key}
                label={opt.label}
                emoji={opt.emoji}
                active={priceFilter === opt.key}
                onClick={() => setPriceFilter(opt.key)}
                ocid={`shop.filter.price.${opt.key}`}
              />
            ))}
          </div>
        </div>

        {/* Product count + clear */}
        <div className="flex items-center justify-between pt-0.5">
          <p
            data-ocid="shop.product_count"
            className="text-xs text-muted-foreground"
          >
            {isLoading
              ? "Loading…"
              : hasActiveFilters
                ? `${filtered.length} product${filtered.length !== 1 ? "s" : ""} found`
                : `${filtered.length} styles`}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              data-ocid="shop.filter.clear_button"
              onClick={() => {
                setPriceFilter("all");
                setGenderFilter("all");
              }}
              className="text-[11px] font-black text-primary hover:text-primary/70 transition-smooth"
            >
              ✕ Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 pt-5 pb-24">
        {isLoading ? (
          <div
            data-ocid="shop.products.loading_state"
            className="grid grid-cols-2 gap-3"
          >
            {Array.from({ length: 6 }, (_, i) => `skel-${i}`).map((key) => (
              <div key={key} className="space-y-2">
                <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-4 w-1/2 rounded" />
                <Skeleton className="h-8 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            data-ocid="shop.products.empty_state"
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4">
              <Shirt size={28} className="text-muted-foreground" />
            </div>
            {hasActiveFilters ? (
              <>
                <p className="font-display font-bold text-base text-foreground mb-1">
                  No products found for these filters
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Try adjusting your price or gender filter.
                </p>
                <button
                  type="button"
                  data-ocid="shop.empty_state.clear_button"
                  onClick={() => {
                    setPriceFilter("all");
                    setGenderFilter("all");
                  }}
                  className="btn-primary text-sm py-2 px-5"
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <p className="font-display font-bold text-base text-foreground mb-1">
                  Drops Coming Soon
                </p>
                <p className="text-xs text-muted-foreground">
                  New styles are on the way — check back soon.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {gridItems.map((item) => {
              if (item.type === "featured") {
                return (
                  <FeaturedProductCard
                    key={`featured-${item.featuredIndex}`}
                    product={item.product}
                    index={item.featuredIndex}
                  />
                );
              }
              return (
                <ProductCard
                  key={item.product.id}
                  product={item.product}
                  index={item.gridIndex}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
