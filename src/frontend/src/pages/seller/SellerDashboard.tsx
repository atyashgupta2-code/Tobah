import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  ClipboardList,
  Edit2,
  LayoutDashboard,
  MapPin,
  Package,
  Phone,
  Plus,
  Trash2,
  TrendingUp,
  Truck,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../backend";
import type { Order, Product, SellerEarnings } from "../../backend.d";
import { FulfillmentBy, OrderStatus } from "../../backend.d";
import {
  useAcceptOrder,
  useListOrdersBySeller,
  useRejectOrder,
  useSellerDeleteProduct,
  useSellerProducts,
} from "../../hooks/useSeller";

// ─── Earnings hook ────────────────────────────────────────────────────────────

function useSellerEarnings(sellerId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<SellerEarnings>({
    queryKey: ["seller-earnings", sellerId],
    queryFn: async () => {
      if (!actor || !sellerId)
        return { totalEarnings: 0n, orderCount: 0n, productBreakdown: [] };
      return actor.getSellerEarnings(sellerId);
    },
    enabled: !!actor && !isFetching && !!sellerId,
    staleTime: 1000 * 60,
  });
}

// ─── Product lookup hook (single product by ID) ───────────────────────────────

function useProduct(productId: string, productsMap: Record<string, Product>) {
  const { actor, isFetching } = useActor(createActor);
  // If already available in the map, no need to fetch
  const alreadyKnown = !!productsMap[productId];
  return useQuery<Product | null>({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!actor || !productId) return null;
      return actor.getProduct(productId);
    },
    enabled: !!actor && !isFetching && !!productId && !alreadyKnown,
    staleTime: 1000 * 60 * 5,
  });
}

// ─── Order item row with product detail ──────────────────────────────────────

function OrderItemRow({
  productId,
  quantity,
  price,
  selectedSize,
  productsMap,
  index,
  orderIndex,
}: {
  productId: string;
  quantity: bigint;
  price?: bigint;
  selectedSize: string;
  productsMap: Record<string, Product>;
  index: number;
  orderIndex: number;
}) {
  const knownProduct = productsMap[productId];
  const { data: fetchedProduct, isLoading } = useProduct(
    productId,
    productsMap,
  );
  const product = knownProduct ?? fetchedProduct;

  const displayPrice = price
    ? Number(price) / 100
    : product
      ? Number(product.price) / 100
      : null;

  return (
    <div
      data-ocid={`seller.orders.order_item.${orderIndex}.${index}`}
      className="flex items-center gap-3 bg-muted/30 rounded-xl p-3 border border-border/50"
    >
      {/* Product thumbnail */}
      <div className="shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-muted border border-border">
        {isLoading && !product ? (
          <Skeleton className="w-full h-full" />
        ) : product?.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={18} className="text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="flex-1 min-w-0">
        {isLoading && !product ? (
          <Skeleton className="h-4 w-32 rounded mb-1" />
        ) : (
          <p className="text-sm font-semibold text-foreground truncate">
            {product?.name ?? `Product …${productId.slice(-6)}`}
          </p>
        )}
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {selectedSize && (
            <span className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-medium">
              Size: {selectedSize}
            </span>
          )}
          <span className="text-[11px] text-muted-foreground font-semibold">
            Qty: {Number(quantity)}
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="shrink-0 text-right">
        {displayPrice !== null ? (
          <span className="font-mono font-bold text-sm text-primary">
            ₹{(displayPrice * Number(quantity)).toLocaleString("en-IN")}
          </span>
        ) : null}
        {displayPrice !== null && Number(quantity) > 1 && (
          <p className="text-[10px] text-muted-foreground">
            ₹{displayPrice.toLocaleString("en-IN")} each
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Parse address into parts ────────────────────────────────────────────────

function parseAddress(raw: string): {
  lines: string[];
  city: string;
  pincode: string;
} {
  // Common patterns: "Street, City, State - Pincode" or "..., City PIN"
  const pincodeMatch = raw.match(/(\d{6})/);
  const pincode = pincodeMatch ? pincodeMatch[1] : "";
  const parts = raw
    .replace(pincode, "")
    .split(/[,\-|]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const city = parts.length > 1 ? parts[parts.length - 2] : (parts[0] ?? "");
  const lines = parts.slice(0, -1);
  return { lines, city: city.trim(), pincode };
}

// ─── Earnings Summary ────────────────────────────────────────────────────────

function EarningsSummary({ sellerId }: { sellerId: string }) {
  const { data: earnings, isLoading } = useSellerEarnings(sellerId);
  const totalEarnings = earnings ? Number(earnings.totalEarnings) / 100 : 0;
  const orderCount = earnings ? Number(earnings.orderCount) : 0;

  return (
    <div
      data-ocid="seller.earnings.section"
      className="rounded-2xl border overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.18 0.04 315 / 0.6), oklch(0.16 0.02 280))",
        borderColor: "oklch(0.62 0.28 315 / 0.3)",
      }}
    >
      <div
        className="px-5 py-3 flex items-center gap-2 border-b"
        style={{ borderColor: "oklch(0.62 0.28 315 / 0.2)" }}
      >
        <TrendingUp size={16} className="text-primary" />
        <span className="font-display font-black text-sm text-foreground uppercase tracking-wide">
          Earnings Summary
        </span>
      </div>
      <div className="grid grid-cols-2 divide-x divide-border/40">
        <div className="px-5 py-4 text-center">
          {isLoading ? (
            <Skeleton className="h-8 w-20 mx-auto rounded-lg mb-1" />
          ) : (
            <p
              className="font-display font-black text-2xl"
              data-ocid="seller.earnings.total"
              style={{ color: "oklch(0.75 0.22 65)" }}
            >
              ₹{totalEarnings.toLocaleString("en-IN")}
            </p>
          )}
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mt-0.5">
            Total Earned
          </p>
        </div>
        <div className="px-5 py-4 text-center">
          {isLoading ? (
            <Skeleton className="h-8 w-12 mx-auto rounded-lg mb-1" />
          ) : (
            <p
              className="font-display font-black text-2xl text-primary"
              data-ocid="seller.earnings.order_count"
            >
              {orderCount}
            </p>
          )}
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mt-0.5">
            Orders Fulfilled
          </p>
        </div>
      </div>
      {!isLoading && earnings && earnings.productBreakdown.length > 0 && (
        <div
          className="px-4 pb-4 pt-2 border-t"
          style={{ borderColor: "oklch(0.62 0.28 315 / 0.15)" }}
        >
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
            By Product
          </p>
          <div className="space-y-2">
            {earnings.productBreakdown.slice(0, 5).map((item, i) => (
              <div
                key={item.productId}
                data-ocid={`seller.earnings.breakdown.item.${i + 1}`}
                className="flex items-center justify-between gap-2 py-1.5 px-3 rounded-xl bg-muted/30"
              >
                <p className="text-xs font-semibold text-foreground truncate flex-1 min-w-0">
                  {item.productName}
                </p>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {Number(item.orderCount)} orders
                  </span>
                  <span
                    className="text-xs font-black"
                    style={{ color: "oklch(0.75 0.22 65)" }}
                  >
                    ₹{(Number(item.totalRevenue) / 100).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Product Row ─────────────────────────────────────────────────────────────

function ProductRow({
  product,
  index,
  onEdit,
  onDelete,
  isDeleting,
}: {
  product: Product;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const isSellerFulfilled =
    product.fulfillmentBy === FulfillmentBy.SellerFulfilled;

  return (
    <div
      data-ocid={`seller.dashboard.product_item.${index}`}
      className="flex items-center gap-3 p-3 bg-muted/30 border border-border rounded-xl"
    >
      <div className="shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-muted border border-border">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={20} className="text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground truncate">
          {product.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-primary font-bold text-sm">
            ₹{(Number(product.price) / 100).toLocaleString()}
          </span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            {product.gender || "Unisex"}
          </Badge>
          <span className="text-muted-foreground text-xs">
            Stock: {Number(product.stock)}
          </span>
          <span className="text-muted-foreground text-xs">
            Orders: {Number(product.orderCount)}
          </span>
        </div>
        <div className="mt-1">
          <span
            data-ocid={`seller.dashboard.fulfillment_badge.${index}`}
            className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              isSellerFulfilled
                ? "bg-accent/10 border-accent/30 text-accent"
                : "bg-primary/10 border-primary/30 text-primary"
            }`}
          >
            <Truck size={9} />
            {isSellerFulfilled ? "By Seller" : "By Admin"}
          </span>
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          data-ocid={`seller.dashboard.edit_button.${index}`}
          onClick={onEdit}
          className="h-8 w-8 text-muted-foreground hover:text-primary"
          aria-label="Edit product"
        >
          <Edit2 size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          data-ocid={`seller.dashboard.delete_button.${index}`}
          onClick={onDelete}
          disabled={isDeleting}
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          aria-label="Delete product"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  [OrderStatus.Placed]: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  [OrderStatus.Pending]:
    "bg-yellow-500/15 text-yellow-500 border-yellow-500/30",
  [OrderStatus.Confirmed]: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  [OrderStatus.Processing]: "bg-blue-600/15 text-blue-300 border-blue-600/30",
  [OrderStatus.Accepted]:
    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  [OrderStatus.Shipped]:
    "bg-purple-500/15 text-purple-400 border-purple-500/30",
  [OrderStatus.Delivered]: "bg-green-500/15 text-green-400 border-green-500/30",
  [OrderStatus.Cancelled]:
    "bg-destructive/15 text-destructive border-destructive/30",
  [OrderStatus.Rejected]: "bg-red-600/15 text-red-400 border-red-600/30",
};

// ─── Order Card for seller ────────────────────────────────────────────────────

type AcceptStep = "idle" | "chooseFulfillment";

function SellerOrderCard({
  order,
  index,
  sellerId,
  sellerName,
  productsMap,
}: {
  order: Order;
  index: number;
  sellerId: string;
  sellerName: string;
  productsMap: Record<string, Product>;
}) {
  const acceptOrder = useAcceptOrder();
  const rejectOrder = useRejectOrder();
  const [acceptStep, setAcceptStep] = useState<AcceptStep>("idle");
  const [fulfillmentChoice, setFulfillmentChoice] = useState<FulfillmentBy>(
    FulfillmentBy.SellerFulfilled,
  );
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  const shortId = order.id.slice(0, 8).toUpperCase();
  const statusClass =
    STATUS_COLORS[order.status] ??
    "bg-muted/40 text-muted-foreground border-border";

  const canAct =
    order.status === OrderStatus.Placed || order.status === OrderStatus.Pending;

  const { city, pincode } = parseAddress(order.shippingAddress);

  async function handleAccept() {
    try {
      await acceptOrder.mutateAsync({
        orderId: order.id,
        fulfillmentChoice,
        sellerName,
        sellerId,
      });
      toast.success("Order accepted! Admin has been notified.");
      setAcceptStep("idle");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to accept");
    }
  }

  async function handleReject() {
    try {
      await rejectOrder.mutateAsync({
        orderId: order.id,
        sellerName,
        sellerId,
      });
      toast.success("Order rejected. Admin has been notified.");
      setShowRejectConfirm(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reject");
    }
  }

  return (
    <div
      data-ocid={`seller.orders.item.${index}`}
      className="bg-card border border-border rounded-2xl overflow-hidden"
    >
      {/* ── Order header ─────────────────────────────────── */}
      <div className="px-4 pt-4 pb-3 border-b border-border/50 flex items-start justify-between gap-3">
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
              #{shortId}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${statusClass}`}
            >
              {order.status}
            </span>
          </div>
          {/* Date */}
          <p className="text-[11px] text-muted-foreground">
            {new Date(Number(order.createdAt) / 1_000_000).toLocaleString(
              "en-IN",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              },
            )}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-mono font-black text-base text-foreground">
            ₹{(Number(order.total) / 100).toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* ── Customer info ───────────────────────────────── */}
        <div className="bg-muted/20 rounded-xl p-3 space-y-2 border border-border/40">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground mb-1">
            Customer Details
          </p>
          <div className="flex items-center gap-2">
            <User size={13} className="text-muted-foreground shrink-0" />
            <span className="text-sm font-semibold text-foreground">
              {order.customerName || "Customer"}
            </span>
          </div>
          {order.customerPhone && (
            <div className="flex items-center gap-2">
              <Phone size={13} className="text-muted-foreground shrink-0" />
              <a
                href={`tel:${order.customerPhone}`}
                className="text-sm text-primary font-semibold hover:underline"
              >
                {order.customerPhone}
              </a>
            </div>
          )}
          <div className="flex items-start gap-2">
            <MapPin
              size={13}
              className="text-muted-foreground shrink-0 mt-0.5"
            />
            <div className="min-w-0">
              <p className="text-xs text-foreground leading-relaxed break-words">
                {order.shippingAddress}
              </p>
              {(city || pincode) && (
                <div className="flex gap-2 mt-1 flex-wrap">
                  {city && (
                    <span className="inline-flex items-center text-[11px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      📍 {city}
                    </span>
                  )}
                  {pincode && (
                    <span className="inline-flex items-center text-[11px] font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      PIN: {pincode}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Ordered Items ──────────────────────────────── */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground mb-2">
            Ordered Items
          </p>
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <OrderItemRow
                key={`${item.productId}-${i}`}
                productId={item.productId}
                quantity={item.quantity}
                selectedSize={item.selectedSize}
                productsMap={productsMap}
                index={i + 1}
                orderIndex={index}
              />
            ))}
          </div>
          {order.discountAmount && Number(order.discountAmount) > 0 ? (
            <div className="flex items-center justify-between mt-2 px-1">
              <span className="text-xs text-muted-foreground">
                Coupon discount
                {order.couponCode ? ` (${order.couponCode})` : ""}
              </span>
              <span className="text-xs font-bold text-green-400">
                −₹{(Number(order.discountAmount) / 100).toLocaleString("en-IN")}
              </span>
            </div>
          ) : null}
          <div className="flex items-center justify-between mt-1 px-1 pt-2 border-t border-border/40">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Total
            </span>
            <span className="font-mono font-black text-base text-foreground">
              ₹{(Number(order.total) / 100).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* ── Fulfillment badge (if already chosen) ──────── */}
        {order.fulfillmentChoice && (
          <div className="flex items-center gap-2">
            <Truck size={13} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Delivery by:{" "}
              <span className="font-semibold text-foreground">
                {order.fulfillmentChoice === FulfillmentBy.SellerFulfilled
                  ? "You (Seller)"
                  : "TBah Admin"}
              </span>
            </span>
          </div>
        )}

        {/* ── Action area ────────────────────────────────── */}
        {canAct && (
          <div className="space-y-2 pt-1">
            {/* Reject confirm */}
            {showRejectConfirm && (
              <div
                data-ocid={`seller.orders.reject_confirm.${index}`}
                className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 space-y-2"
              >
                <p className="text-sm font-semibold text-destructive text-center">
                  Reject this order?
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  Admin will be notified. Customer won't be told by whom.
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    data-ocid={`seller.orders.confirm_reject_button.${index}`}
                    disabled={rejectOrder.isPending}
                    onClick={handleReject}
                    className="flex-1 h-8 text-xs gap-1.5"
                  >
                    <XCircle size={13} />
                    Yes, Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    data-ocid={`seller.orders.cancel_reject_button.${index}`}
                    onClick={() => setShowRejectConfirm(false)}
                    className="flex-1 h-8 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Fulfillment choice */}
            {acceptStep === "chooseFulfillment" && (
              <div
                data-ocid={`seller.orders.fulfillment_choice.${index}`}
                className="bg-card border border-border rounded-xl p-3 space-y-3"
              >
                <p className="text-sm font-semibold text-foreground text-center">
                  Who handles delivery?
                </p>
                <div className="space-y-2">
                  {[
                    {
                      value: FulfillmentBy.SellerFulfilled,
                      label: "I'll handle it",
                      desc: "You pack and deliver",
                      icon: "🚚",
                    },
                    {
                      value: FulfillmentBy.AdminFulfilled,
                      label: "TBah handles it",
                      desc: "Admin delivers on your behalf",
                      icon: "📦",
                    },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      data-ocid={`seller.orders.fulfillment_${opt.value.toLowerCase()}.${index}`}
                      onClick={() => setFulfillmentChoice(opt.value)}
                      className={cn(
                        "w-full flex items-center gap-3 p-2.5 rounded-lg border text-left transition-smooth",
                        fulfillmentChoice === opt.value
                          ? "bg-primary/10 border-primary"
                          : "bg-muted/30 border-border hover:border-primary/40",
                      )}
                    >
                      <span className="text-lg">{opt.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {opt.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    data-ocid={`seller.orders.confirm_accept_button.${index}`}
                    disabled={acceptOrder.isPending}
                    onClick={handleAccept}
                    className="btn-primary flex-1 h-8 text-xs gap-1.5"
                  >
                    <CheckCircle2 size={13} />
                    {acceptOrder.isPending ? "Accepting…" : "Confirm Accept"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    data-ocid={`seller.orders.cancel_accept_button.${index}`}
                    onClick={() => setAcceptStep("idle")}
                    className="h-8 text-xs"
                  >
                    Back
                  </Button>
                </div>
              </div>
            )}

            {/* Main Accept / Reject */}
            {acceptStep === "idle" && !showRejectConfirm && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  data-ocid={`seller.orders.accept_button.${index}`}
                  onClick={() => setAcceptStep("chooseFulfillment")}
                  className="flex-1 h-9 text-xs gap-1.5 bg-green-600 hover:bg-green-500 text-white border-0"
                >
                  <CheckCircle2 size={13} />
                  Accept Order
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  data-ocid={`seller.orders.reject_button.${index}`}
                  onClick={() => setShowRejectConfirm(true)}
                  className="flex-1 h-9 text-xs gap-1.5"
                >
                  <XCircle size={13} />
                  Reject
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Seller Orders Section ────────────────────────────────────────────────────

function SellerOrdersSection({
  sellerId,
  sellerName,
}: {
  sellerId: string;
  sellerName: string;
}) {
  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useListOrdersBySeller(sellerId);
  const { data: sellerProducts = [] } = useSellerProducts(sellerId);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Build a map for fast product lookup without extra fetches when possible
  const productsMap = sellerProducts.reduce<Record<string, Product>>(
    (acc, p) => {
      acc[p.id] = p;
      return acc;
    },
    {},
  );

  const pendingCount = orders.filter(
    (o) => o.status === OrderStatus.Placed || o.status === OrderStatus.Pending,
  ).length;

  // Backend already sorts newest-first — no re-sort needed
  const filtered =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  const filterOptions = [
    { value: "all", label: "All" },
    { value: OrderStatus.Placed, label: "New" },
    { value: OrderStatus.Accepted, label: "Accepted" },
    { value: OrderStatus.Rejected, label: "Rejected" },
    { value: OrderStatus.Delivered, label: "Delivered" },
    { value: OrderStatus.Cancelled, label: "Cancelled" },
  ];

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-lg text-foreground">
            My Orders
          </h2>
          {pendingCount > 0 && (
            <p className="text-xs text-amber-400 font-semibold mt-0.5 animate-pulse">
              ⚡ {pendingCount} order{pendingCount > 1 ? "s" : ""} need your
              action
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          data-ocid="seller.orders.refresh_button"
          onClick={() => refetch()}
          className="text-xs gap-1.5"
        >
          Refresh
        </Button>
      </div>

      {/* Filter pills */}
      <div className="flex gap-1.5 flex-wrap">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            data-ocid={`seller.orders.filter.${opt.value}`}
            onClick={() => setStatusFilter(opt.value)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-bold transition-smooth border",
              statusFilter === opt.value
                ? "bg-primary/15 text-primary border-primary/40"
                : "bg-muted/30 text-muted-foreground border-transparent hover:border-border",
            )}
          >
            {opt.label}
            {opt.value === "all" && orders.length > 0 && (
              <span className="ml-1 text-[10px] bg-muted-foreground/20 rounded-full px-1">
                {orders.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {isLoading ? (
        <div className="space-y-3" data-ocid="seller.orders.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          data-ocid="seller.orders.empty_state"
          className="text-center py-16 bg-card border border-dashed border-border rounded-2xl"
        >
          <ClipboardList
            size={40}
            className="text-muted-foreground mx-auto mb-3"
          />
          <p className="font-semibold text-foreground mb-1">No orders yet</p>
          <p className="text-sm text-muted-foreground">
            {statusFilter === "all"
              ? "Orders for your products will appear here"
              : `No ${statusFilter.toLowerCase()} orders`}
          </p>
        </div>
      ) : (
        <div data-ocid="seller.orders.list" className="space-y-4">
          {filtered.map((order, idx) => (
            <SellerOrderCard
              key={order.id}
              order={order}
              index={idx + 1}
              sellerId={sellerId}
              sellerName={sellerName}
              productsMap={productsMap}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main SellerDashboard ─────────────────────────────────────────────────────

type SellerTab = "dashboard" | "orders";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [sellerId, setSellerId] = useState<string>("");
  const [sellerName, setSellerName] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SellerTab>("dashboard");

  const { data: products, isLoading } = useSellerProducts(sellerId);
  const { data: orders = [] } = useListOrdersBySeller(sellerId);
  const deleteProduct = useSellerDeleteProduct();

  const pendingOrderCount = orders.filter(
    (o) => o.status === OrderStatus.Placed || o.status === OrderStatus.Pending,
  ).length;

  useEffect(() => {
    const id = localStorage.getItem("tbah_seller_id");
    if (!id) {
      navigate({ to: "/seller/register" });
      return;
    }
    setSellerId(id);
    setSellerName(localStorage.getItem("tbah_seller_name") ?? "");
    setBusinessName(
      localStorage.getItem("tbah_seller_business") ?? "Your Store",
    );
  }, [navigate]);

  async function handleDelete(product: Product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeletingId(product.id);
    try {
      await deleteProduct.mutateAsync({ id: product.id, sellerId });
      toast.success("Product deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  if (!sellerId) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px]" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-8 space-y-6 pb-24">
        {/* Header */}
        <div className="bg-card border border-border rounded-2xl p-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
              <Users size={22} className="text-primary" />
            </div>
            <div>
              <h1
                data-ocid="seller.dashboard.page"
                className="font-display font-black text-xl text-foreground"
              >
                {businessName}
              </h1>
              <p className="text-muted-foreground text-sm">
                Welcome back, {sellerName}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-xs text-muted-foreground shrink-0"
            onClick={() => {
              localStorage.removeItem("tbah_seller_id");
              localStorage.removeItem("tbah_seller_name");
              localStorage.removeItem("tbah_seller_business");
              navigate({ to: "/seller/register" });
            }}
            data-ocid="seller.dashboard.logout_button"
          >
            Log out
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted/40 border border-border rounded-xl p-1">
          <button
            type="button"
            data-ocid="seller.tab.dashboard"
            onClick={() => setActiveTab("dashboard")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-smooth",
              activeTab === "dashboard"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <LayoutDashboard size={15} />
            Dashboard
          </button>
          <button
            type="button"
            data-ocid="seller.tab.orders"
            onClick={() => setActiveTab("orders")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-smooth relative",
              activeTab === "orders"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <ClipboardList size={15} />
            My Orders
            {pendingOrderCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center px-1 animate-pulse">
                {pendingOrderCount}
              </span>
            )}
          </button>
        </div>

        {/* Dashboard tab */}
        {activeTab === "dashboard" && (
          <>
            {/* Earnings Summary */}
            <EarningsSummary sellerId={sellerId} />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-primary font-display">
                  {isLoading ? "—" : (products?.length ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mt-0.5">
                  Products Listed
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-accent font-display">
                  {isLoading
                    ? "—"
                    : (products
                        ?.reduce((s, p) => s + Number(p.stock), 0)
                        .toLocaleString() ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mt-0.5">
                  Total Stock
                </p>
              </div>
            </div>

            {/* Products */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-lg text-foreground">
                  My Products
                </h2>
                <Button
                  data-ocid="seller.dashboard.add_product_button"
                  onClick={() => navigate({ to: "/seller/products/new" })}
                  className="btn-primary text-sm gap-2"
                  size="sm"
                >
                  <Plus size={15} />
                  Add Product
                </Button>
              </div>

              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-xl" />
                  ))}
                </div>
              ) : !products || products.length === 0 ? (
                <div
                  data-ocid="seller.dashboard.empty_state"
                  className="text-center py-16 bg-card border border-dashed border-border rounded-2xl"
                >
                  <Package
                    size={40}
                    className="text-muted-foreground mx-auto mb-3"
                  />
                  <p className="font-semibold text-foreground mb-1">
                    No products yet
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add your first product to start selling
                  </p>
                  <Button
                    data-ocid="seller.dashboard.empty_add_button"
                    onClick={() => navigate({ to: "/seller/products/new" })}
                    className="btn-primary gap-2"
                  >
                    <Plus size={16} />
                    Add First Product
                  </Button>
                </div>
              ) : (
                <div
                  data-ocid="seller.dashboard.product_list"
                  className="space-y-2"
                >
                  {products.map((product, index) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      index={index + 1}
                      onEdit={() =>
                        navigate({
                          to: "/seller/products/$id/edit",
                          params: { id: product.id },
                        })
                      }
                      onDelete={() => handleDelete(product)}
                      isDeleting={deletingId === product.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Orders tab */}
        {activeTab === "orders" && (
          <SellerOrdersSection sellerId={sellerId} sellerName={sellerName} />
        )}
      </div>
    </div>
  );
}
