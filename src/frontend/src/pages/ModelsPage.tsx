import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { ShoppingBag, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import type { ModelPhoto } from "../backend.d";
import { useListModelPhotos } from "../hooks/useProducts";

// ─── localStorage helper — reads product links set by admin ──────────────────
function getModelProductLinks(): Record<string, string> {
  try {
    const raw = localStorage.getItem("tbah_model_product_links");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// ─── Model Photo Card — single column, special effects ────────────────────────
function ModelCard({
  photo,
  index,
  linkedProductId,
}: {
  photo: ModelPhoto;
  index: number;
  linkedProductId?: string;
}) {
  const navigate = useNavigate();
  const hasProduct = Boolean(linkedProductId);

  function handleClick() {
    if (hasProduct && linkedProductId) {
      navigate({ to: "/product/$id", params: { id: linkedProductId } });
    }
  }

  return (
    <motion.div
      key={photo.id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.55,
        delay: Math.min(index * 0.08, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
      data-ocid={`models.photo_card.${index + 1}`}
      onClick={hasProduct ? handleClick : undefined}
      className="group relative w-full rounded-3xl overflow-hidden"
      style={{
        background: "oklch(0.18 0.015 280)",
        border: hasProduct
          ? "1px solid oklch(0.62 0.28 315 / 0.6)"
          : "1px solid oklch(0.32 0.015 280 / 0.5)",
        boxShadow: hasProduct
          ? "0 4px 32px oklch(0.62 0.28 315 / 0.12)"
          : "0 4px 24px oklch(0.62 0.28 315 / 0.06)",
        cursor: hasProduct ? "pointer" : "default",
        transition:
          "transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1.015)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = hasProduct
          ? "0 0 0 2px oklch(0.62 0.28 315 / 0.9), 0 8px 40px oklch(0.62 0.28 315 / 0.3)"
          : "0 0 0 2px oklch(0.62 0.28 315 / 0.7), 0 8px 40px oklch(0.62 0.28 315 / 0.25)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = hasProduct
          ? "0 4px 32px oklch(0.62 0.28 315 / 0.12)"
          : "0 4px 24px oklch(0.62 0.28 315 / 0.06)";
      }}
    >
      {/* Image — portrait, full width */}
      <div className="aspect-[3/4] relative overflow-hidden w-full">
        <img
          src={photo.imageUrl}
          alt={photo.caption ?? `Model ${index + 1}`}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          width={600}
          height={800}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />

        {/* Hover caption overlay — slides up on hover/tap */}
        {photo.caption && (
          <div
            className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out px-5 py-4 flex items-end"
            style={{
              background:
                "linear-gradient(to top, oklch(0.10 0.02 280 / 0.92) 0%, transparent 100%)",
              transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <p
              className="font-display font-black text-base text-foreground leading-tight tracking-tight"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}
            >
              {photo.caption}
            </p>
          </div>
        )}

        {/* View Product badge — shown when linked to a product */}
        {hasProduct && (
          <div
            className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              background: "oklch(0.62 0.28 315 / 0.92)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 12px oklch(0.62 0.28 315 / 0.4)",
            }}
          >
            <ShoppingBag size={12} color="white" strokeWidth={2.5} />
            <span className="text-[10px] font-black text-white tracking-wide">
              View Product
            </span>
          </div>
        )}

        {/* Subtle permanent glow at bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, oklch(0.10 0.02 280 / 0.55) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* Caption below image (non-hover always visible fallback for mobile) */}
      {photo.caption && (
        <div
          className="px-4 py-3 sm:hidden"
          style={{ borderTop: "1px solid oklch(0.32 0.015 280 / 0.4)" }}
        >
          <p className="text-sm font-semibold text-foreground/80 leading-tight text-center">
            {photo.caption}
          </p>
        </div>
      )}

      {/* Mobile tap-to-shop hint for linked products */}
      {hasProduct && (
        <div
          className="px-4 py-2.5 flex items-center justify-center gap-2 sm:hidden"
          style={{
            borderTop: "1px solid oklch(0.62 0.28 315 / 0.3)",
            background: "oklch(0.62 0.28 315 / 0.08)",
          }}
        >
          <ShoppingBag size={12} style={{ color: "oklch(0.62 0.28 315)" }} />
          <span
            className="text-xs font-black"
            style={{ color: "oklch(0.62 0.28 315)" }}
          >
            Tap to view this product
          </span>
        </div>
      )}
    </motion.div>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <motion.div
      data-ocid="models.empty_state"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="flex flex-col items-center justify-center py-20 text-center px-6"
    >
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.62 0.28 315 / 0.15), oklch(0.62 0.28 315 / 0.06))",
          border: "1px solid oklch(0.62 0.28 315 / 0.3)",
        }}
      >
        <Sparkles size={32} className="text-primary" />
      </div>
      <h2 className="font-display font-black text-xl text-foreground mb-2 leading-tight">
        Coming Soon
      </h2>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
        Our model showcase is being set up — stunning looks featuring our latest
        collection will appear here soon.
      </p>
    </motion.div>
  );
}

// ─── Skeleton List ─────────────────────────────────────────────────────────────
const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c"];

function SkeletonList() {
  return (
    <div className="flex flex-col gap-6">
      {SKELETON_KEYS.map((k) => (
        <div key={k} className="rounded-3xl overflow-hidden">
          <Skeleton className="aspect-[3/4] w-full rounded-3xl" />
        </div>
      ))}
    </div>
  );
}

// ─── Models Page ───────────────────────────────────────────────────────────────
export default function ModelsPage() {
  const { data: photos = [], isLoading } = useListModelPhotos();
  const productLinks = getModelProductLinks();

  return (
    <div data-ocid="models.page" className="min-h-screen pb-24">
      {/* Header */}
      <div
        className="px-4 pt-8 pb-6 border-b border-border/30"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.18 0.02 315 / 0.5) 0%, oklch(0.14 0.01 280) 100%)",
        }}
      >
        <div className="max-w-screen-sm mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-1">
            Style Gallery
          </p>
          <h1 className="font-display font-black text-4xl text-foreground leading-tight tracking-tight">
            Our Models
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Real styles. Real looks. Exclusively TBah.
          </p>
        </div>
      </div>

      {/* Gallery — single column, max width kept narrow for portrait focus */}
      <div className="px-4 pt-6 pb-4 max-w-screen-sm mx-auto">
        {isLoading ? (
          <SkeletonList />
        ) : photos.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-6">
            {photos.map((photo, i) => (
              <ModelCard
                key={photo.id}
                photo={photo}
                index={i}
                linkedProductId={productLinks[photo.id]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
