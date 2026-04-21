import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useNavigate, useParams, useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  ShoppingBag,
  TrendingUp,
  Truck,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { USPBadge } from "../components/USPBadge";
import { useCart } from "../hooks/useCart";
import { DeliveryOption, useProduct } from "../hooks/useProducts";

function formatINR(price: bigint): string {
  return `₹${Number(price).toLocaleString("en-IN")}`;
}

function getDeliveryDate(option: DeliveryOption): string {
  const now = new Date();
  const days =
    option === DeliveryOption.SameDay
      ? 0
      : option === DeliveryOption.NextDay
        ? 1
        : 3;
  now.setDate(now.getDate() + days);
  if (days === 0) return "Today by 10 PM";
  return now.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/* ─── Main Page ─── */
export default function ProductDetail() {
  const { id } = useParams({ from: "/product/$id" });
  const router = useRouter();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id);
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption>(
    DeliveryOption.Standard,
  );
  const [activeThumb, setActiveThumb] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const thumbnails = useMemo(() => {
    const img = product?.imageUrl ?? "";
    return [img, img, img, img].slice(0, 4);
  }, [product?.imageUrl]);

  useEffect(() => {
    if (product?.sizes?.length && !selectedSize) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product, selectedSize]);

  useEffect(() => {
    if (product?.hasSameDayDelivery) {
      setSelectedDelivery(DeliveryOption.SameDay);
    }
  }, [product]);

  function handleAddToCart() {
    if (!product || !selectedSize) return;
    addItem(product.id, selectedSize, selectedDelivery);
    setAddedToCart(true);
    toast.success(`${product.name} added to bag!`, {
      description: `Size ${selectedSize} · ${selectedDelivery}`,
    });
    setTimeout(() => setAddedToCart(false), 2000);
  }

  function handleBuyNow() {
    if (!product || !selectedSize) return;
    addItem(product.id, selectedSize, selectedDelivery);
    navigate({ to: "/checkout" });
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-background"
        data-ocid="product_detail.loading_state"
      >
        <div className="relative w-full aspect-[4/5] bg-card">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="p-4 space-y-4">
          <Skeleton className="h-8 w-3/4 rounded-xl" />
          <Skeleton className="h-6 w-1/3 rounded-xl" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-14 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="min-h-[60vh] flex flex-col items-center justify-center gap-4 p-8"
        data-ocid="product_detail.error_state"
      >
        <span className="text-5xl">👀</span>
        <p className="font-display font-black text-2xl text-center">
          Product not found
        </p>
        <Button
          variant="outline"
          onClick={() => router.history.back()}
          data-ocid="product_detail.back_button"
        >
          Go back
        </Button>
      </div>
    );
  }

  const stockCount = Number(product.stock);
  const isLowStock = stockCount > 0 && stockCount <= 5;
  const isOutOfStock = stockCount === 0;
  const orderCount = Number(product.orderCount ?? 0);
  const isTrending = orderCount >= 5;

  const deliveryOptions: Array<{
    option: DeliveryOption;
    label: string;
    sublabel: string;
    available: boolean;
    icon: React.ReactNode;
  }> = [
    {
      option: DeliveryOption.SameDay,
      label: "Same Day",
      sublabel: getDeliveryDate(DeliveryOption.SameDay),
      available: product.hasSameDayDelivery,
      icon: <Zap size={16} className="text-accent shrink-0" />,
    },
    {
      option: DeliveryOption.NextDay,
      label: "Next Day",
      sublabel: getDeliveryDate(DeliveryOption.NextDay),
      available: true,
      icon: <Truck size={16} className="text-muted-foreground shrink-0" />,
    },
    {
      option: DeliveryOption.Standard,
      label: "Standard",
      sublabel: getDeliveryDate(DeliveryOption.Standard),
      available: true,
      icon: <Truck size={16} className="text-muted-foreground shrink-0" />,
    },
  ];

  return (
    <div
      className="min-h-screen bg-background pb-40"
      data-ocid="product_detail.page"
    >
      {/* ── Breadcrumb / Back ── */}
      <div className="flex items-center gap-2 px-4 py-3 bg-card border-b border-border sticky top-0 z-20">
        <button
          type="button"
          onClick={() => router.history.back()}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Go back"
          data-ocid="product_detail.back_button"
        >
          <ArrowLeft size={18} />
        </button>
        <ChevronRight size={14} className="text-muted-foreground/40" />
        <span className="text-xs text-muted-foreground uppercase tracking-wider truncate max-w-[180px]">
          {product.category}
        </span>
        <ChevronRight size={14} className="text-muted-foreground/40" />
        <span className="text-xs text-foreground font-semibold truncate max-w-[120px]">
          {product.name}
        </span>
      </div>

      {/* ── Hero Image ── */}
      <div className="relative w-full aspect-[4/5] bg-card overflow-hidden">
        <motion.img
          key={activeThumb}
          src={thumbnails[activeThumb] || "/assets/images/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, oklch(0.14 0.01 280 / 0.85) 0%, transparent 55%)",
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {product.hasSameDayDelivery && (
              <USPBadge type="sameday" animated size="sm" />
            )}
            {isTrending && (
              <span className="inline-flex items-center gap-1 bg-accent/20 text-accent text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                <TrendingUp size={10} />
                {orderCount} ordered
              </span>
            )}
          </div>
          <h1 className="font-display font-black text-2xl text-foreground leading-tight uppercase">
            {product.name}
          </h1>
        </div>
      </div>

      {/* ── Thumbnail Strip ── */}
      <div className="flex gap-2 px-4 py-3 bg-card border-b border-border overflow-x-auto scrollbar-none">
        {thumbnails.map((_thumb, i) => (
          <button
            type="button"
            key={`thumbnail-view-${i + 1}`}
            onClick={() => setActiveThumb(i)}
            className={cn(
              "flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-smooth",
              activeThumb === i
                ? "border-primary"
                : "border-border opacity-60 hover:opacity-90",
            )}
            data-ocid={`product_detail.thumbnail.${i + 1}`}
          >
            <img
              src={thumbnails[i] || "/assets/images/placeholder.svg"}
              alt={`View ${i + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* ── Product Info ── */}
      <div className="px-4 pt-5 space-y-6">
        {/* Name + Price + Category + Order Count */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h2 className="font-display font-black text-xl text-foreground uppercase leading-tight">
              {product.name}
            </h2>
            <Badge
              variant="secondary"
              className="shrink-0 bg-secondary text-secondary-foreground uppercase text-[10px] tracking-wider font-bold"
            >
              {product.category}
            </Badge>
          </div>

          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span
              className="font-display font-black text-3xl text-gradient-primary"
              data-ocid="product_detail.price"
            >
              {formatINR(product.price)}
            </span>
            {isOutOfStock ? (
              <span
                className="text-destructive text-xs font-bold uppercase tracking-wider"
                data-ocid="product_detail.out_of_stock"
              >
                Out of stock
              </span>
            ) : isLowStock ? (
              <span
                className="text-accent text-xs font-bold uppercase tracking-wider"
                data-ocid="product_detail.low_stock"
              >
                Only {stockCount} left!
              </span>
            ) : (
              <span
                className="text-muted-foreground text-xs uppercase tracking-wider"
                data-ocid="product_detail.in_stock"
              >
                In stock
              </span>
            )}
          </div>

          {/* Order count + gender row */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {product.gender && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-secondary text-secondary-foreground uppercase tracking-wider">
                For: {product.gender}
              </span>
            )}
            {orderCount > 0 && (
              <span
                className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-primary/15 text-primary uppercase tracking-wider"
                data-ocid="product_detail.order_count"
              >
                <TrendingUp size={11} />
                {orderCount} {orderCount === 1 ? "order" : "orders"}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-muted-foreground text-sm leading-relaxed">
            {product.description}
          </p>
        )}

        {/* ── Inline Quick Buy (visible above fold on mobile) ── */}
        <div className="flex gap-3" data-ocid="product_detail.quick_buy_row">
          <Button
            className="flex-1 btn-accent font-display font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 h-12"
            disabled={isOutOfStock || !selectedSize}
            onClick={handleBuyNow}
            data-ocid="product_detail.quick_buy_now_button"
          >
            <Zap size={16} />
            {isOutOfStock
              ? "Out of Stock"
              : !selectedSize
                ? "Pick a Size First"
                : `Buy Now · ${formatINR(product.price)}`}
          </Button>
        </div>

        {/* Size Selector */}
        {product.sizes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold uppercase tracking-widest text-foreground">
                Select Size
              </span>
              {selectedSize && (
                <span className="text-xs text-primary font-semibold">
                  Size {selectedSize} selected
                </span>
              )}
            </div>
            <div
              className="flex flex-wrap gap-3"
              data-ocid="product_detail.size_selector"
            >
              {product.sizes.map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "min-w-[52px] h-12 px-3 rounded-xl border-2 font-bold text-base transition-smooth",
                    selectedSize === size
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
                  )}
                  data-ocid={`product_detail.size_button.${size}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Delivery Option Selector */}
        <div>
          <span className="text-sm font-bold uppercase tracking-widest text-foreground block mb-3">
            Delivery Option
          </span>
          <div
            className="space-y-3"
            data-ocid="product_detail.delivery_selector"
          >
            {deliveryOptions
              .filter((d) => d.available)
              .map(({ option, label, sublabel, icon }) => (
                <label
                  key={option}
                  className={cn(
                    "flex items-center gap-3 px-4 rounded-xl border-2 cursor-pointer transition-smooth min-h-[56px]",
                    selectedDelivery === option
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/40",
                  )}
                  data-ocid={`product_detail.delivery_option.${option.toLowerCase()}`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={option}
                    checked={selectedDelivery === option}
                    onChange={() => setSelectedDelivery(option)}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                      selectedDelivery === option
                        ? "border-primary"
                        : "border-muted-foreground",
                    )}
                  >
                    {selectedDelivery === option && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {icon}
                    <span className="font-semibold text-base text-foreground">
                      {label}
                    </span>
                    {option === DeliveryOption.SameDay && (
                      <span className="text-[10px] bg-accent/20 text-accent font-bold px-2 py-0.5 rounded-full uppercase">
                        Hot
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground shrink-0">
                    {sublabel}
                  </span>
                </label>
              ))}
          </div>
        </div>

        {/* Cash on Delivery note */}
        <div className="flex items-center gap-3 bg-muted/40 border border-border rounded-xl p-4">
          <span className="text-xl">💵</span>
          <div>
            <p className="text-sm font-bold text-foreground">
              Cash on Delivery
            </p>
            <p className="text-xs text-muted-foreground">
              Pay when your order arrives — no prepayment needed
            </p>
          </div>
        </div>
      </div>

      {/* ── Sticky CTA Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 border-t border-border px-4 py-3">
        <div className="flex gap-3 max-w-lg mx-auto">
          {/* Add to Bag */}
          <Button
            className={cn(
              "flex-1 font-display font-black uppercase tracking-wider text-sm transition-smooth h-12",
              addedToCart ? "bg-green-600/80 text-foreground" : "btn-primary",
            )}
            disabled={isOutOfStock || !selectedSize}
            onClick={handleAddToCart}
            data-ocid="product_detail.add_to_cart_button"
          >
            <AnimatePresence mode="wait">
              {addedToCart ? (
                <motion.span
                  key="added"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  Added!
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingBag size={16} />
                  {isOutOfStock
                    ? "Out of Stock"
                    : !selectedSize
                      ? "Pick a Size"
                      : "Add to Bag"}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>

          {/* Buy Now */}
          <Button
            className="flex-1 btn-accent font-display font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 h-12"
            disabled={isOutOfStock || !selectedSize}
            onClick={handleBuyNow}
            data-ocid="product_detail.buy_now_button"
          >
            <Zap size={16} />
            {isOutOfStock
              ? "Out of Stock"
              : !selectedSize
                ? "Pick a Size"
                : "Buy Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
