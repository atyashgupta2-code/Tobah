import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Banknote,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Shirt,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { createActor } from "../backend";
import type { Product } from "../backend.d";
import { FeaturedProductCard, ProductCard } from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";

const SESSION_CATEGORY_KEY = "tbah_last_category";

// ─── Category definition ───────────────────────────────────────────────────────
type CategoryKey = "Men" | "Women" | "Handicrafts" | "Other" | "Shoes";

interface CategoryDef {
  key: CategoryKey;
  label: string;
  emoji: string;
  description: string;
  cardClass: string;
  genderValues: string[];
  bgImage: string;
  subFilters?: SubFilter[];
}

interface SubFilter {
  key: string;
  label: string;
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

const CATEGORIES: CategoryDef[] = [
  {
    key: "Men",
    label: "Men",
    emoji: "👔",
    description: "Latest Trends",
    cardClass: "category-card-men",
    genderValues: ["Men", "Unisex"],
    bgImage:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80",
  },
  {
    key: "Women",
    label: "Women",
    emoji: "👗",
    description: "Style Icons",
    cardClass: "category-card-women",
    genderValues: ["Women", "Unisex"],
    bgImage:
      "/assets/img_20260424_230920-019dc0a8-534a-758d-97ea-b85bf7b03f3d.jpg",
  },
  {
    key: "Handicrafts",
    label: "Handicrafts",
    emoji: "🏺",
    description: "Artisan Crafts",
    cardClass: "category-card-handicrafts",
    genderValues: ["Handicrafts"],
    bgImage:
      "/assets/img_20260424_230751-019dc0a7-8e0c-7057-8b25-d11bf115a132.jpg",
  },
  {
    key: "Other",
    label: "Other",
    emoji: "✨",
    description: "Unique Finds",
    cardClass: "category-card-other",
    genderValues: ["Other"],
    bgImage:
      "/assets/img_20260424_230559-019dc0a8-1cbd-719a-a372-78ada809d196.jpg",
    subFilters: OTHER_SUB_FILTERS,
  },
  {
    key: "Shoes",
    label: "Shoes",
    emoji: "👟",
    description: "Step in Style",
    cardClass: "category-card-shoes",
    genderValues: ["Shoes"],
    bgImage: "/assets/shoes-banner.png",
    subFilters: SHOES_SUB_FILTERS,
  },
];

// ─── USP data with user photos ──────────────────────────────────────────────────
interface USPCardData {
  imageUrl: string;
  title: string;
}

const USP_CARDS: USPCardData[] = [
  {
    imageUrl:
      "/assets/img_20260424_232245-019dc0a7-8a8c-73da-8f47-0f07dc6b862c.jpg",
    title: "Pay When It Arrives",
  },
  {
    imageUrl: "/assets/delivered-today.png",
    title: "Delivered Today",
  },
  {
    imageUrl:
      "/assets/img_20260424_231923-019dc0a7-86e1-7320-9074-673617197854.jpg",
    title: "Pay After Fit & Try",
  },
];

// ─── New Arrivals hook ──────────────────────────────────────────────────────────
function useNewArrivals() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Product[]>({
    queryKey: ["new-arrivals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNewArrivals();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

// ─── USP Image Card ─────────────────────────────────────────────────────────────
function USPImageCard({ imageUrl, title }: USPCardData) {
  const isDeliveredToday = title === "Delivered Today";

  return (
    <div
      className="relative rounded-2xl overflow-hidden group cursor-default flex flex-col w-full"
      style={{ minHeight: 280 }}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ minHeight: 240, flex: "1 1 auto" }}
      >
        <img
          src={imageUrl || "/assets/images/placeholder.svg"}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center center" }}
          loading="lazy"
          decoding="async"
          width={400}
          height={500}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
      <div
        className="w-full px-3 py-2.5 text-center flex-shrink-0"
        style={{
          background: "oklch(0.14 0.02 280)",
          borderTop: "1px solid oklch(0.32 0.015 280 / 0.4)",
        }}
      >
        {isDeliveredToday ? (
          <p className="font-display font-black text-sm leading-tight tracking-tight text-foreground">
            Delivered Today{" "}
            <span
              className="font-black"
              style={{
                color: "oklch(0.82 0.20 85)",
                textShadow: "0 0 8px oklch(0.82 0.20 85 / 0.6)",
                letterSpacing: "0.02em",
              }}
            >
              (Jammu)
            </span>
          </p>
        ) : (
          <p className="font-display font-black text-sm leading-tight tracking-tight text-foreground">
            {title}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Hero Section ──────────────────────────────────────────────────────────────
function HeroSection({
  onScrollToProducts,
}: { onScrollToProducts: () => void }) {
  return (
    <div
      data-ocid="home.hero_section"
      className="relative overflow-hidden"
      style={{ height: "90vh", minHeight: "420px" }}
    >
      <img
        src="/assets/hero-main.png"
        alt="TBah Fashion — Shop Womens & Mens"
        className="absolute inset-0 w-full h-full object-cover object-center"
        loading="eager"
        width={800}
        height={1067}
        style={{ zIndex: 0 }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            "linear-gradient(to top, oklch(0.10 0.02 280 / 0.97) 0%, oklch(0.10 0.02 280 / 0.75) 35%, oklch(0.10 0.02 280 / 0.20) 65%, transparent 100%)",
        }}
      />
      <div
        className="relative flex flex-col items-center justify-end text-center px-5 pb-8 pt-8"
        style={{ height: "90vh", minHeight: "420px", zIndex: 2 }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="font-display font-black text-3xl sm:text-5xl md:text-6xl leading-[0.92] tracking-tight mb-3"
        >
          <span className="text-foreground block">Shop</span>
          <span className="text-gradient-primary block">Different.</span>
          <span className="text-foreground block">Pay After</span>
          <span className="text-foreground block">Fit &amp; Try.</span>
        </motion.h1>

        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, delay: 0.3 }}
          type="button"
          onClick={onScrollToProducts}
          data-ocid="home.shop_now_button"
          className="btn-primary text-sm px-6 py-3 flex items-center gap-2 mt-2"
        >
          Shop the Drop
          <ChevronDown size={15} />
        </motion.button>
      </div>
    </div>
  );
}

// ─── Promo Banner ──────────────────────────────────────────────────────────────
function PromoBanner() {
  return (
    <div data-ocid="home.promo_banner">
      <img
        src="/assets/img_20260419_001138-019da6b1-ad95-719f-ba5d-16fd10293042.jpg"
        alt="TBah — New Collection"
        className="w-full block object-cover"
        loading="lazy"
        width={800}
        height={500}
      />
    </div>
  );
}

// ─── USP Section ───────────────────────────────────────────────────────────────
function USPSection() {
  return (
    <section
      data-ocid="home.usp_section"
      className="border-y border-border/30 py-8 px-3"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.14 0.03 280) 0%, oklch(0.16 0.03 315 / 0.6) 100%)",
      }}
    >
      <div className="max-w-screen-md mx-auto">
        <div className="text-center mb-5">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground mb-1">
            Why everyone's obsessed
          </p>
          <h2 className="font-display font-black text-2xl text-foreground leading-tight tracking-tight">
            The TBah Difference
          </h2>
          <div className="w-10 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mt-2" />
        </div>
        <div className="flex flex-row gap-2 flex-nowrap items-stretch">
          {USP_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: i * 0.08 }}
              className="flex-1 min-w-0 flex flex-col"
            >
              <USPImageCard {...card} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Category Card ─────────────────────────────────────────────────────────────
interface CategoryCardProps {
  category: CategoryDef;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

function CategoryCard({
  category,
  isSelected,
  onClick,
  index,
}: CategoryCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      data-ocid={`home.category_card.${category.key.toLowerCase()}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.2, delay: index * 0.06 }}
      className={cn(
        "relative rounded-2xl overflow-hidden w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-all duration-200 active:scale-95",
        isSelected &&
          "ring-4 ring-foreground/60 ring-offset-2 ring-offset-background scale-[1.02]",
      )}
      style={{ minHeight: 160 }}
      aria-pressed={isSelected}
    >
      <img
        src={category.bgImage}
        alt={category.label}
        className="absolute inset-0 w-full h-full object-cover object-center"
        loading="lazy"
        width={400}
        height={200}
        style={{ filter: "brightness(1.1) saturate(1.0)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: isSelected
            ? "linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.35))"
            : "linear-gradient(135deg, rgba(0,0,0,0.40), rgba(0,0,0,0.22))",
        }}
      />
      <div
        className="relative z-10 p-4 flex flex-col justify-between h-full"
        style={{ minHeight: 160 }}
      >
        <span className="text-2xl leading-none drop-shadow-sm">
          {category.emoji}
        </span>
        <div>
          <p
            className="font-display leading-tight"
            style={{
              color: "rgba(255,255,255,0.97)",
              textShadow: "0 2px 10px rgba(0,0,0,0.7)",
              fontWeight: 900,
              fontSize: "1.25rem",
              letterSpacing: "0.04em",
              fontStyle: "italic",
              background: "linear-gradient(135deg, #ffffff 0%, #e0d5ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {category.label}
          </p>
          <p
            className="text-[10px] font-semibold uppercase tracking-widest mt-0.5"
            style={{
              color: "rgba(255,255,255,0.80)",
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            }}
          >
            {category.description}
          </p>
        </div>
      </div>
      <div
        className="absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center z-10"
        style={{ background: "rgba(255,255,255,0.85)" }}
      >
        {isSelected ? (
          <ChevronUp size={12} color="#111" strokeWidth={2.5} />
        ) : (
          <ChevronDown size={12} color="#111" strokeWidth={2} />
        )}
      </div>
    </motion.button>
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

// ─── Inline Category Products (accordion content) ──────────────────────────────
interface InlineCategoryProductsProps {
  products: Product[];
  isLoading: boolean;
  category: CategoryDef;
  productsRef: RefObject<HTMLDivElement | null>;
}

function InlineCategoryProducts({
  products,
  isLoading,
  category,
  productsRef,
}: InlineCategoryProductsProps) {
  const [subFilter, setSubFilter] = useState<string>("all");

  // Reset sub-filter when category changes
  const hasSubFilters = category.subFilters && category.subFilters.length > 0;

  const filtered = products
    .filter((p) => {
      // Category match
      if (!category.genderValues.includes(p.gender ?? "")) return false;
      // Sub-filter match (only for categories with sub-filters)
      if (hasSubFilters && subFilter !== "all") {
        return (p.subcategory ?? "") === subFilter;
      }
      return true;
    })
    .sort((a, b) => {
      const aTrending = (a as Product & { isTrending?: boolean }).isTrending
        ? 1
        : 0;
      const bTrending = (b as Product & { isTrending?: boolean }).isTrending
        ? 1
        : 0;
      if (bTrending !== aTrending) return bTrending - aTrending;
      return Number(b.orderCount) - Number(a.orderCount);
    })
    .slice(0, 8);

  return (
    <motion.div
      ref={productsRef}
      data-ocid={`home.category_products.${category.key.toLowerCase()}`}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="overflow-hidden col-span-2"
    >
      <div
        className="mt-2 mb-1 rounded-2xl overflow-hidden border border-border/40"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.17 0.02 280) 0%, oklch(0.14 0.01 280) 100%)",
        }}
      >
        {/* Header strip */}
        <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-border/30">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{category.emoji}</span>
            <div>
              <p className="font-display font-black text-sm text-foreground leading-tight">
                Trending in {category.label}
              </p>
              <p className="text-[10px] text-muted-foreground">
                Top picks for you 🔥
              </p>
            </div>
          </div>
          <Link
            to="/shop"
            search={{ category: category.key }}
            data-ocid={`home.category_products.view_all.${category.key.toLowerCase()}`}
            className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors shrink-0"
          >
            View all
            <ChevronRight size={13} />
          </Link>
        </div>

        {/* Sub-classification tabs (for Shoes and Other) */}
        {hasSubFilters && (
          <SubFilterTabs
            filters={category.subFilters!}
            active={subFilter}
            onChange={setSubFilter}
            ocidPrefix={`home.category_products.${category.key.toLowerCase()}`}
          />
        )}

        <div className="p-3">
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
              data-ocid={`home.category_products.empty_state.${category.key.toLowerCase()}`}
              className="flex flex-col items-center justify-center py-10 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-muted/60 flex items-center justify-center mb-3">
                <Shirt size={22} className="text-muted-foreground" />
              </div>
              <p className="font-display font-bold text-sm text-foreground mb-1">
                No {category.label} drops yet
              </p>
              <p className="text-xs text-muted-foreground">
                New styles are on the way — check back soon.
              </p>
              {hasSubFilters && subFilter !== "all" && (
                <button
                  type="button"
                  onClick={() => setSubFilter("all")}
                  className="text-xs font-bold text-primary hover:text-primary/70 mt-2"
                >
                  ✕ Show all {category.label}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((p, i) => (
                <div
                  key={p.id}
                  onClick={() => {
                    try {
                      sessionStorage.setItem(
                        SESSION_CATEGORY_KEY,
                        category.key,
                      );
                    } catch {
                      /* noop */
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      try {
                        sessionStorage.setItem(
                          SESSION_CATEGORY_KEY,
                          category.key,
                        );
                      } catch {
                        /* noop */
                      }
                    }
                  }}
                >
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* See more in shop section link */}
        <div className="px-4 pb-4 pt-1 border-t border-border/20 mt-1">
          <Link
            to="/shop"
            search={{ category: category.key }}
            data-ocid={`home.category_products.see_more.${category.key.toLowerCase()}`}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-sm uppercase tracking-wide transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.62 0.28 315 / 0.15), oklch(0.62 0.28 315 / 0.08))",
              border: "1px solid oklch(0.62 0.28 315 / 0.4)",
              color: "oklch(0.62 0.28 315)",
            }}
          >
            See more in shop section
            <ChevronRight size={15} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Trending Section — heading + five category cards ─────────────────────────
function TrendingSection({
  products,
  isLoading,
}: { products: Product[]; isLoading: boolean }) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(
    null,
  );
  const expandedRef = useRef<HTMLDivElement>(null);

  // Restore last-opened category from sessionStorage (back navigation)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_CATEGORY_KEY);
      if (
        saved &&
        ["Men", "Women", "Handicrafts", "Other", "Shoes"].includes(saved)
      ) {
        setSelectedCategory(saved as CategoryKey);
        sessionStorage.removeItem(SESSION_CATEGORY_KEY);
      }
    } catch {
      // sessionStorage may be unavailable
    }
  }, []);

  function handleCategorySelect(key: CategoryKey) {
    if (selectedCategory === key) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(key);
      setTimeout(() => {
        expandedRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
    }
  }

  const selectedIndex = selectedCategory
    ? CATEGORIES.findIndex((c) => c.key === selectedCategory)
    : -1;

  // Row layout: [0,1], [2,3], [4 centered]
  // Accordion injects after the row containing the selected card
  const row0HasExpanded = selectedIndex === 0 || selectedIndex === 1;
  const row1HasExpanded = selectedIndex === 2 || selectedIndex === 3;
  const row2HasExpanded = selectedIndex === 4;

  const expandedCategoryDef = selectedCategory
    ? (CATEGORIES.find((c) => c.key === selectedCategory) ?? null)
    : null;

  return (
    <section
      data-ocid="home.trending_section"
      className="py-8 px-4"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.13 0.02 290) 0%, oklch(0.14 0.02 280) 100%)",
      }}
    >
      <div className="max-w-screen-md mx-auto">
        {/* Heading */}
        <div className="mb-5">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground mb-1">
            Most Popular
          </p>
          <h2 className="font-display font-black text-3xl text-foreground leading-tight tracking-tight">
            {selectedCategory
              ? `🔥 Trending in ${selectedCategory}`
              : "🔥 Trending"}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Tap a category to see what's hot ✨
          </p>
        </div>

        {/* 5 category cards: 2×2 + 1 centered */}
        <div className="grid grid-cols-2 gap-3">
          {/* Row 0: Men, Women */}
          {CATEGORIES.slice(0, 2).map((cat, i) => (
            <CategoryCard
              key={cat.key}
              category={cat}
              isSelected={selectedCategory === cat.key}
              onClick={() => handleCategorySelect(cat.key)}
              index={i}
            />
          ))}

          {/* Accordion for row 0 */}
          <AnimatePresence>
            {row0HasExpanded && expandedCategoryDef && (
              <InlineCategoryProducts
                key={`trending-row0-${selectedCategory}`}
                products={products}
                isLoading={isLoading}
                category={expandedCategoryDef}
                productsRef={expandedRef}
              />
            )}
          </AnimatePresence>

          {/* Row 1: Handicrafts, Other */}
          {CATEGORIES.slice(2, 4).map((cat, i) => (
            <CategoryCard
              key={cat.key}
              category={cat}
              isSelected={selectedCategory === cat.key}
              onClick={() => handleCategorySelect(cat.key)}
              index={i + 2}
            />
          ))}

          {/* Accordion for row 1 */}
          <AnimatePresence>
            {row1HasExpanded && expandedCategoryDef && (
              <InlineCategoryProducts
                key={`trending-row1-${selectedCategory}`}
                products={products}
                isLoading={isLoading}
                category={expandedCategoryDef}
                productsRef={expandedRef}
              />
            )}
          </AnimatePresence>

          {/* Row 2: Shoes — same size as others, shifted right to sit between/under Handicrafts and Other */}
          <div className="col-span-2 flex justify-end pr-[2px]">
            <div className="w-[calc(50%-6px)]">
              <CategoryCard
                key={CATEGORIES[4].key}
                category={CATEGORIES[4]}
                isSelected={selectedCategory === CATEGORIES[4].key}
                onClick={() => handleCategorySelect(CATEGORIES[4].key)}
                index={4}
              />
            </div>
          </div>

          {/* Accordion for row 2 (Shoes) */}
          <AnimatePresence>
            {row2HasExpanded && expandedCategoryDef && (
              <InlineCategoryProducts
                key={`trending-row2-${selectedCategory}`}
                products={products}
                isLoading={isLoading}
                category={expandedCategoryDef}
                productsRef={expandedRef}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ─── New Arrivals Section ──────────────────────────────────────────────────────
function NewArrivalsSection() {
  const { data: newArrivals = [], isLoading } = useNewArrivals();

  if (!isLoading && newArrivals.length === 0) return null;

  return (
    <section
      data-ocid="home.new_arrivals_section"
      className="py-8 px-4 border-t border-border/20"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.15 0.025 280) 0%, oklch(0.13 0.02 290) 100%)",
      }}
    >
      <div className="max-w-screen-md mx-auto">
        <div className="mb-5">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground mb-1">
            Just Dropped
          </p>
          <h2 className="font-display font-black text-3xl text-foreground leading-tight tracking-tight">
            ✨ New Arrivals
          </h2>
        </div>

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
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {newArrivals.slice(0, 8).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <ProductCard product={p} index={i} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const { data: products = [], isLoading } = useProducts();
  const productsRef = useRef<HTMLDivElement>(null);

  function scrollToProducts() {
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div data-ocid="home.page" className="min-h-screen bg-background">
      {/* 1. Hero */}
      <HeroSection onScrollToProducts={scrollToProducts} />

      {/* 2. Promo banner */}
      <section data-ocid="home.promo_section" className="bg-background">
        <PromoBanner />
      </section>

      {/* 3. Why Everyone is Obsessed */}
      <USPSection />

      {/* 4. Trending section — heading + five category cards + inline accordion */}
      <div ref={productsRef}>
        <TrendingSection products={products} isLoading={isLoading} />
      </div>

      {/* 5. New Arrivals */}
      <NewArrivalsSection />

      {/* 6. COD reminder strip */}
      <div className="mx-4 mb-8 mt-2 rounded-2xl overflow-hidden">
        <div
          className="py-3 px-5 flex items-center justify-center gap-3"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.62 0.28 315 / 0.15), oklch(0.14 0.01 280), oklch(0.62 0.28 315 / 0.15))",
          }}
        >
          <Banknote size={16} className="text-primary shrink-0" />
          <p className="text-xs font-bold text-center text-foreground tracking-wide uppercase">
            Cash on Delivery · Pay After Fit &amp; Try
          </p>
          <Banknote size={16} className="text-primary shrink-0" />
        </div>
      </div>
    </div>
  );
}
