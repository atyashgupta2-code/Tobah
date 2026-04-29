import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import { Crown, ShoppingBag, Zap } from "lucide-react";
import { useState } from "react";
import type { Product } from "../backend.d";
import { DeliveryOption } from "../backend.d";
import { useCart } from "../hooks/useCart";
import { USPBadge } from "./USPBadge";

interface ProductCardProps {
  product: Product;
  index?: number;
  layout?: "grid" | "list";
}

// ─── Featured / Best Seller Card ───────────────────────────────────────────────
interface FeaturedProductCardProps {
  product: Product;
  index: number;
}

export function FeaturedProductCard({
  product,
  index,
}: FeaturedProductCardProps) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const price = Number(product.price) / 100;
  const orderCount = Number(product.orderCount);
  const defaultSize = product.sizes[0] ?? "M";

  function handleBuyNow(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const delivery = product.hasSameDayDelivery
      ? DeliveryOption.SameDay
      : DeliveryOption.Standard;
    addItem(product.id, defaultSize, delivery);
    navigate({ to: "/checkout" });
  }

  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      data-ocid={`product.featured.item.${index + 1}`}
      className="col-span-2 relative overflow-hidden rounded-2xl group block"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.18 0.04 280), oklch(0.14 0.03 260))",
        border: "1px solid oklch(0.75 0.22 65 / 0.4)",
        boxShadow:
          "0 0 24px 4px oklch(0.75 0.22 65 / 0.15), inset 0 1px 0 oklch(0.75 0.22 65 / 0.2)",
      }}
    >
      <div
        className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.75 0.22 65 / 0.25) 0%, transparent 70%)",
        }}
      />

      <div className="flex gap-4 p-4">
        <div className="relative w-40 shrink-0 aspect-[3/4] rounded-xl overflow-hidden bg-muted">
          <img
            src={
              product.imageUrl || "/assets/generated/placeholder-product.jpg"
            }
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90"
          />
          <div
            className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wide"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.75 0.22 65), oklch(0.65 0.24 55))",
              color: "oklch(0.12 0.02 270)",
            }}
          >
            <Crown size={9} />
            BEST SELLER
          </div>
        </div>

        <div className="flex flex-col justify-between flex-1 min-w-0 py-1">
          <div>
            <p
              className="text-xs font-black mb-2 tabular-nums"
              style={{ color: "oklch(0.75 0.22 65)" }}
            >
              🔥 {orderCount.toLocaleString()} orders
            </p>

            <p className="font-display font-black text-base text-foreground line-clamp-2 leading-tight mb-1">
              {product.name}
            </p>

            {product.gender && (
              <span
                className="inline-block text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest mb-2"
                style={{
                  background: "oklch(0.75 0.22 65 / 0.15)",
                  color: "oklch(0.75 0.22 65)",
                  border: "1px solid oklch(0.75 0.22 65 / 0.3)",
                }}
              >
                {product.gender}
              </span>
            )}

            <p
              className="font-black text-2xl"
              style={{ color: "oklch(0.75 0.22 65)" }}
            >
              ₹{price.toFixed(0)}
            </p>

            {product.sizes.length > 0 && (
              <div className="flex gap-1 flex-wrap mt-1.5">
                {product.sizes.slice(0, 4).map((s) => (
                  <span
                    key={s}
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded border text-muted-foreground"
                    style={{ borderColor: "oklch(0.75 0.22 65 / 0.3)" }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleBuyNow}
            data-ocid={`product.featured.buy_now_button.${index + 1}`}
            className="w-full text-xs py-2.5 rounded-xl font-black uppercase tracking-wide flex items-center justify-center gap-1.5 transition-smooth min-h-[44px]"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.75 0.22 65), oklch(0.65 0.24 55))",
              color: "oklch(0.12 0.02 270)",
            }}
          >
            <Zap size={12} />
            Buy Now
          </button>
        </div>
      </div>
    </Link>
  );
}

// ─── Standard Product Card ──────────────────────────────────────────────────────
export function ProductCard({
  product,
  index = 0,
  layout = "grid",
}: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const navigate = useNavigate();

  const price = Number(product.price) / 100;
  const defaultSize = product.sizes[0] ?? "M";

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const delivery = product.hasSameDayDelivery
      ? DeliveryOption.SameDay
      : DeliveryOption.Standard;
    addItem(product.id, defaultSize, delivery);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const delivery = product.hasSameDayDelivery
      ? DeliveryOption.SameDay
      : DeliveryOption.Standard;
    addItem(product.id, defaultSize, delivery);
    navigate({ to: "/checkout" });
  }

  if (layout === "list") {
    return (
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        data-ocid={`product.item.${index + 1}`}
        className="flex gap-3 bg-card rounded-xl border border-border overflow-hidden transition-smooth hover:shadow-elevated hover:border-primary/30 group"
      >
        <div className="relative w-28 h-28 shrink-0 overflow-hidden">
          <img
            src={
              product.imageUrl || "/assets/generated/placeholder-product.jpg"
            }
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90"
          />
        </div>
        <div className="flex flex-col justify-between py-2 pr-2 flex-1 min-w-0">
          <div>
            <div className="flex gap-1 flex-wrap mb-1">
              {product.hasSameDayDelivery && (
                <USPBadge type="sameday" size="sm" animated />
              )}
            </div>
            <p className="font-display font-bold text-sm text-foreground truncate">
              {product.name}
            </p>
            {product.gender && (
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground uppercase tracking-wider mt-0.5">
                {product.gender}
              </span>
            )}
            <p className="text-primary font-bold text-base">
              ₹{price.toFixed(0)}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              data-ocid={`product.add_button.${index + 1}`}
              className={cn(
                "btn-white text-xs py-2 px-3 flex-1 min-h-[44px] flex items-center justify-center",
                added && "bg-accent text-accent-foreground",
              )}
            >
              {added ? "✓ Added" : "ADD TO BAG"}
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              data-ocid={`product.buy_now_button.${index + 1}`}
              className="btn-pink text-xs py-2 px-3 flex items-center gap-1 font-bold min-h-[44px]"
            >
              <Zap size={11} />
              BUY
            </button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      data-ocid={`product.item.${index + 1}`}
      className="relative bg-card rounded-2xl border border-border overflow-hidden transition-smooth hover:shadow-elevated hover:border-primary/30 hover:-translate-y-0.5 group flex flex-col"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={product.imageUrl || "/assets/generated/placeholder-product.jpg"}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90"
        />
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {product.hasSameDayDelivery && (
            <USPBadge type="sameday" size="sm" animated />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
      </div>

      <div className="p-3 flex flex-col gap-2 flex-1">
        <div>
          <p className="font-display font-bold text-sm text-foreground line-clamp-2 leading-tight">
            {product.name}
          </p>
          {product.gender && (
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground uppercase tracking-wider mt-1">
              {product.gender}
            </span>
          )}
          <p className="text-primary font-bold text-lg mt-0.5">
            ₹{price.toFixed(0)}
          </p>
        </div>

        {product.sizes.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {product.sizes.slice(0, 4).map((s) => (
              <span
                key={s}
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded border border-border text-muted-foreground"
              >
                {s}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-[10px] text-muted-foreground">
                +{product.sizes.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 mt-auto">
          <button
            type="button"
            onClick={handleBuyNow}
            data-ocid={`product.buy_now_button.${index + 1}`}
            className="btn-pink w-full text-xs py-2.5 flex items-center justify-center gap-1.5 font-black uppercase tracking-wide min-h-[44px]"
          >
            <Zap size={12} />
            Buy Now
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            data-ocid={`product.add_button.${index + 1}`}
            className={cn(
              "btn-white w-full text-xs py-2.5 flex items-center justify-center gap-1.5 min-h-[44px]",
              added && "bg-accent text-accent-foreground border-accent",
            )}
          >
            <ShoppingBag size={11} />
            {added ? "ADDED!" : "ADD TO BAG"}
          </button>
        </div>
      </div>
    </Link>
  );
}
