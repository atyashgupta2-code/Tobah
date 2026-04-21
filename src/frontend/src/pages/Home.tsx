import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Banknote,
  ChevronDown,
  Shirt,
  Shirt as ShirtIcon,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";

// ─── USP Card (redesigned — bold, vivid, Gen Z premium) ───────────────────────
interface USPCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  subtitle: string;
  tag: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  tagBg: string;
  tagColor: string;
  border: string;
}

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
  border,
}: USPCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4 flex flex-col gap-3 relative overflow-hidden",
        border,
      )}
      style={{ background: gradient }}
    >
      {/* Glow orb */}
      <div
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-30 blur-2xl pointer-events-none"
        style={{ background: gradient }}
      />

      {/* Icon */}
      <div
        className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
          iconBg,
        )}
      >
        <Icon size={24} className={iconColor} />
      </div>

      {/* Tag pill */}
      <span
        className={cn(
          "self-start text-[9px] font-black uppercase tracking-[0.18em] px-2.5 py-1 rounded-full",
          tagBg,
          tagColor,
        )}
      >
        {tag}
      </span>

      {/* Text */}
      <div>
        <p className="font-display font-black text-base text-foreground leading-tight tracking-tight">
          {title}
        </p>
        <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection({
  onScrollToProducts,
}: { onScrollToProducts: () => void }) {
  return (
    <div
      data-ocid="home.hero_section"
      className="relative overflow-hidden"
      style={{ minHeight: "92vh" }}
    >
      {/* Hero image — full bleed */}
      <img
        src="/assets/hero-fashion.jpg"
        alt="TBah Fashion — Shop Womens & Mens"
        className="absolute inset-0 w-full h-full object-cover object-top"
        style={{ zIndex: 0 }}
      />

      {/* Dark gradient overlay — bottom only so photo is clean on top */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            "linear-gradient(to top, oklch(0.10 0.02 280 / 0.97) 0%, oklch(0.10 0.02 280 / 0.75) 35%, oklch(0.10 0.02 280 / 0.20) 65%, transparent 100%)",
        }}
      />

      {/* Content — anchored to bottom */}
      <div
        className="relative flex flex-col items-center justify-end text-center px-5 pb-14 pt-12"
        style={{ minHeight: "92vh", zIndex: 2 }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="font-display font-black text-5xl sm:text-7xl leading-[0.92] tracking-tight mb-4"
        >
          <span className="text-foreground block">Shop</span>
          <span className="text-gradient-primary block">Different.</span>
          <span className="text-foreground block">Pay After</span>
          <span className="text-foreground block">Fit &amp; Try.</span>
        </motion.h1>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.4 }}
          type="button"
          onClick={onScrollToProducts}
          data-ocid="home.shop_now_button"
          className="btn-primary text-base px-8 py-3.5 flex items-center gap-2 mt-4"
        >
          Shop the Drop
          <ChevronDown size={16} />
        </motion.button>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <div className="w-5 h-8 rounded-full border-2 border-border/40 flex items-start justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.6,
                ease: "easeInOut",
              }}
              className="w-1 h-1.5 bg-muted-foreground rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Promo Banner (second image — clean, no overlay, no text) ─────────────────
function PromoBanner() {
  return (
    <div data-ocid="home.promo_banner">
      <img
        src="/assets/img_20260419_001138-019da6b1-ad95-719f-ba5d-16fd10293042.jpg"
        alt="TBah — New Collection"
        className="w-full block object-cover"
        loading="lazy"
      />
    </div>
  );
}

// ─── USP section data ──────────────────────────────────────────────────────────
const USP_CARDS: USPCardProps[] = [
  {
    icon: Banknote,
    title: "Pay When It Arrives",
    subtitle:
      "Zero risk. Cash on delivery on every single order. No card needed.",
    tag: "COD",
    gradient:
      "linear-gradient(135deg, oklch(0.18 0.06 315 / 0.85), oklch(0.14 0.03 315 / 0.5))",
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
    tagBg: "bg-primary/20",
    tagColor: "text-primary",
    border: "border-primary/30",
  },
  {
    icon: Zap,
    title: "Delivered Today",
    subtitle: "Order before 2 PM — same-day delivery right to your door.",
    tag: "Same Day",
    gradient:
      "linear-gradient(135deg, oklch(0.20 0.06 65 / 0.85), oklch(0.15 0.03 65 / 0.5))",
    iconBg: "bg-accent/20",
    iconColor: "text-accent",
    tagBg: "bg-accent/20",
    tagColor: "text-accent",
    border: "border-accent/30",
  },
  {
    icon: ShirtIcon,
    title: "Pay After Fit & Try",
    subtitle:
      "Try your fits at home first. Pay only if you love it — no stress.",
    tag: "Fit & Try",
    gradient:
      "linear-gradient(135deg, oklch(0.18 0.07 200 / 0.85), oklch(0.13 0.03 200 / 0.5))",
    iconBg: "bg-[oklch(0.55_0.22_200)]/20",
    iconColor: "text-[oklch(0.70_0.20_200)]",
    tagBg: "bg-[oklch(0.55_0.22_200)]/20",
    tagColor: "text-[oklch(0.70_0.20_200)]",
    border: "border-[oklch(0.55_0.22_200)]/30",
  },
];

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

      {/* 2. Promo banner image — clean, full width, no text */}
      <section data-ocid="home.promo_section" className="bg-background">
        <PromoBanner />
      </section>

      {/* 3. Why Everyone's Obsessed — bold, vivid, Gen Z */}
      <section
        data-ocid="home.usp_section"
        className="border-y border-border/30 py-10 px-4"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.14 0.03 280) 0%, oklch(0.16 0.03 315 / 0.6) 100%)",
        }}
      >
        <div className="max-w-screen-md mx-auto">
          <div className="text-center mb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground mb-1">
              Why everyone's obsessed
            </p>
            <div className="w-10 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full mx-auto" />
          </div>

          {/* 3-column grid on sm+, 1-col stacked on xs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {USP_CARDS.map((card) => (
              <USPCard key={card.tag} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Products Grid */}
      <section
        ref={productsRef}
        data-ocid="home.products_section"
        className="border-t border-border/30 pt-8 pb-6 px-4"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.13 0.02 280) 0%, oklch(0.11 0.01 280) 100%)",
        }}
      >
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <h2 className="font-display font-black text-2xl text-foreground leading-tight">
              Trending Now 🔥
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Fresh drops · Limited stock
            </p>
          </div>
        </div>

        {isLoading ? (
          <div
            data-ocid="home.products.loading_state"
            className="grid grid-cols-2 gap-3"
          >
            {Array.from({ length: 4 }, (_, i) => `skel-${i}`).map((key) => (
              <div key={key} className="space-y-2">
                <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-4 w-1/2 rounded" />
                <Skeleton className="h-8 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div
            data-ocid="home.products.empty_state"
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4">
              <Shirt size={28} className="text-muted-foreground" />
            </div>
            <p className="font-display font-bold text-base text-foreground mb-1">
              Drops Coming Soon
            </p>
            <p className="text-xs text-muted-foreground">
              New styles are on the way — check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* 5. COD reminder strip */}
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
