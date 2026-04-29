import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  ShoppingBag,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useCustomer } from "../contexts/CustomerContext";
import {
  isOrderCancelled,
  useCancelOrder,
  useOrder,
  useProduct,
} from "../hooks/useProducts";
import { DeliveryOption, OrderStatus, PaymentMethod } from "../types";

function deliveryMeta(option: DeliveryOption): {
  label: string;
  eta: string;
  icon: React.ReactNode;
} {
  if (option === DeliveryOption.SameDay)
    return {
      label: "Same-Day Delivery",
      eta: "Today by 8 PM",
      icon: <Zap size={14} className="text-accent fill-accent" />,
    };
  if (option === DeliveryOption.NextDay)
    return {
      label: "Next Day Delivery",
      eta: "Tomorrow by 8 PM",
      icon: <Package size={14} className="text-primary" />,
    };
  return {
    label: "Standard Delivery",
    eta: "3–5 Business Days",
    icon: <Package size={14} className="text-muted-foreground" />,
  };
}

function StatusBadge({
  status,
  cancelled,
}: {
  status: OrderStatus;
  cancelled: boolean;
}) {
  const isCancelled = cancelled || status === OrderStatus.Cancelled;

  if (isCancelled) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-red-500/15 border border-red-500/30 text-red-400">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
        Cancelled
      </span>
    );
  }
  // Handle new #Placed status (shown as confirmed/green)
  if ((status as string) === "Placed" || status === OrderStatus.Confirmed) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        {(status as string) === "Placed" ? "Placed ✓" : "Confirmed"}
      </span>
    );
  }
  if (status === OrderStatus.Delivered) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-accent/15 border border-accent/30 text-accent">
        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        Delivered
      </span>
    );
  }
  if (status === OrderStatus.Shipped) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-blue-500/15 border border-blue-500/30 text-blue-400">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        Shipped
      </span>
    );
  }
  if (status === OrderStatus.Processing) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-orange-500/15 border border-orange-500/30 text-orange-400">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
        Processing
      </span>
    );
  }
  // Pending / any other status
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-yellow-500/15 border border-yellow-500/30 text-yellow-400">
      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
      {String(status)}
    </span>
  );
}

function OrderItemRow({
  productId,
  selectedSize,
  quantity,
  index,
}: {
  productId: string;
  selectedSize: string;
  quantity: bigint;
  index: number;
}) {
  const { data: product } = useProduct(productId);
  const name = product?.name ?? "Loading…";
  const unitPrice = product ? Number(product.price) / 100 : 0;
  const lineTotal = unitPrice * Number(quantity);
  const orderCount = product ? Number(product.orderCount) : 0;

  return (
    <div
      data-ocid={`order_confirmation.item.${index + 1}`}
      className="flex items-center gap-3 py-3 border-b border-border last:border-0"
    >
      {/* Thumbnail */}
      {product?.imageUrl ? (
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
          <img
            src={product.imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-xl bg-muted shrink-0 border border-border flex items-center justify-center">
          <Package size={18} className="text-muted-foreground" />
        </div>
      )}

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-foreground leading-tight truncate">
          {name}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-[11px] text-muted-foreground">
            Size: {selectedSize}
          </span>
          <span className="text-[10px] text-muted-foreground">·</span>
          <span className="text-[11px] text-muted-foreground">
            Qty: {Number(quantity)}
          </span>
          {orderCount > 0 && (
            <>
              <span className="text-[10px] text-muted-foreground">·</span>
              <span className="text-[10px] text-primary font-semibold">
                🔥 {orderCount} ordered
              </span>
            </>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="text-right shrink-0">
        <p className="font-black text-sm text-primary">
          ₹{lineTotal.toFixed(0)}
        </p>
        {Number(quantity) > 1 && (
          <p className="text-[10px] text-muted-foreground">
            ₹{unitPrice.toFixed(0)} each
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Cancel Confirm Modal ──────────────────────────────────────────────────────
function CancelModal({
  onConfirm,
  onClose,
  isPending,
}: {
  onConfirm: () => void;
  onClose: () => void;
  isPending: boolean;
}) {
  return (
    <div
      data-ocid="order_confirmation.cancel_dialog"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      aria-modal="true"
      aria-label="Cancel order confirmation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative w-full max-w-sm bg-card border border-border rounded-2xl p-6 space-y-5 shadow-2xl animate-slide-up">
        <button
          type="button"
          data-ocid="order_confirmation.close_button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-smooth"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/25 flex items-center justify-center">
            <AlertTriangle size={26} className="text-red-400" />
          </div>
        </div>

        <div className="text-center space-y-1.5">
          <p className="font-display font-black text-lg text-foreground uppercase tracking-tight">
            Cancel This Order?
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This action can't be undone. Are you sure you want to cancel your
            order?
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            data-ocid="order_confirmation.confirm_button"
            onClick={onConfirm}
            disabled={isPending}
            className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-smooth border-2 border-red-500/70 text-red-400 hover:bg-red-500/10 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <span
                  data-ocid="order_confirmation.loading_state"
                  className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"
                />
                Cancelling…
              </>
            ) : (
              "Yes, Cancel Order"
            )}
          </button>
          <button
            type="button"
            data-ocid="order_confirmation.cancel_button"
            onClick={onClose}
            disabled={isPending}
            className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-smooth bg-primary text-primary-foreground hover:bg-primary/80 active:scale-[0.97]"
          >
            Keep My Order
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function OrderConfirmation() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: order, isLoading, isError } = useOrder(id ?? "");
  const cancelMutation = useCancelOrder();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { isLoggedIn } = useCustomer();

  // Scroll to top when page mounts — ensures "Order Placed!" heading is visible
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const localCancelled = id ? isOrderCancelled(id) : false;
  const cancelled = localCancelled || order?.status === OrderStatus.Cancelled;

  if (isLoading) {
    return (
      <div
        data-ocid="order_confirmation.loading_state"
        className="max-w-screen-sm mx-auto px-4 py-10 space-y-4"
      >
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div
        data-ocid="order_confirmation.error_state"
        className="max-w-screen-sm mx-auto px-4 py-20 text-center space-y-4"
      >
        <p className="font-display font-black text-xl text-foreground">
          Order not found
        </p>
        <p className="text-muted-foreground text-sm">
          We couldn&apos;t find order #{id}. It may still be processing.
        </p>
        <Link to="/shop" data-ocid="order_confirmation.shop_link">
          <Button className="mt-4">CONTINUE SHOPPING</Button>
        </Link>
      </div>
    );
  }

  const delivery = deliveryMeta(order.deliveryOption);
  const orderNumber = `ORD-${order.id.slice(0, 8).toUpperCase()}`;
  const total = Number(order.total) / 100;
  const isCOD = order.paymentMethod === PaymentMethod.CashOnDelivery;
  const createdDate = new Date(Number(order.createdAt) / 1_000_000);
  const canCancel =
    order.status !== OrderStatus.Shipped &&
    order.status !== OrderStatus.Delivered &&
    order.status !== OrderStatus.Cancelled &&
    order.status !== OrderStatus.Rejected &&
    !cancelled;

  function handleCancelConfirm() {
    cancelMutation.mutate(order!.id, {
      onSuccess: () => setShowCancelModal(false),
    });
  }

  return (
    <>
      {showCancelModal && (
        <CancelModal
          onConfirm={handleCancelConfirm}
          onClose={() => setShowCancelModal(false)}
          isPending={cancelMutation.isPending}
        />
      )}

      <div
        data-ocid="order_confirmation.page"
        className="max-w-screen-sm mx-auto px-4 py-6 space-y-5 pb-24"
      >
        {/* Hero banner */}
        <div
          className={`relative overflow-hidden border rounded-2xl p-6 text-center space-y-3 ${
            cancelled
              ? "bg-gradient-to-br from-red-500/15 via-red-500/5 to-transparent border-red-500/25"
              : "bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10 border-primary/30"
          }`}
        >
          <div className="flex justify-center">
            <div className="relative">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  cancelled ? "bg-red-500/20" : "bg-primary/20"
                }`}
              >
                {cancelled ? (
                  <X size={36} className="text-red-400" />
                ) : (
                  <CheckCircle2 size={40} className="text-primary" />
                )}
              </div>
              {!cancelled && (
                <span className="absolute -top-1 -right-1 text-xl animate-bounce">
                  🎉
                </span>
              )}
            </div>
          </div>

          <div>
            <p className="font-display font-black text-2xl text-foreground uppercase tracking-tight">
              {cancelled ? "Order Cancelled" : "Order Placed!"}
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              {cancelled
                ? "Your order has been cancelled. Hope to see you again."
                : "Your fits are locked in. Get ready to slay."}
            </p>
          </div>

          {/* Order ID chip */}
          <div className="inline-flex items-center gap-2 bg-card/80 border border-border rounded-full px-4 py-2">
            <span className="text-xs text-muted-foreground font-medium">
              Order ID
            </span>
            <span className="font-display font-black text-primary text-sm tracking-widest">
              {orderNumber}
            </span>
          </div>

          {/* Status badge */}
          <div className="flex justify-center">
            <StatusBadge status={order.status} cancelled={!!cancelled} />
          </div>

          <p className="text-[10px] text-muted-foreground">
            Placed on{" "}
            {createdDate.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Delivery info */}
        <div
          data-ocid="order_confirmation.delivery_section"
          className="bg-card rounded-2xl border border-border p-4 space-y-3"
        >
          <h2 className="font-display font-black text-sm uppercase tracking-widest text-foreground flex items-center gap-2">
            <Clock size={14} className="text-primary" />
            Delivery Info
          </h2>

          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border">
            <div className="flex items-center gap-2">
              {delivery.icon}
              <div>
                <p className="font-semibold text-sm text-foreground">
                  {delivery.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  Estimated: {delivery.eta}
                </p>
              </div>
            </div>
            {order.deliveryOption === DeliveryOption.SameDay && (
              <span className="badge-usp text-[9px]">TODAY</span>
            )}
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/20 border border-border">
            <MapPin
              size={14}
              className="text-muted-foreground mt-0.5 shrink-0"
            />
            <div className="min-w-0">
              {order.customerName && (
                <p className="font-semibold text-sm text-foreground">
                  {order.customerName}
                </p>
              )}
              {order.customerPhone && (
                <p className="text-xs text-muted-foreground">
                  📱 {order.customerPhone}
                </p>
              )}
              <p className="text-muted-foreground text-xs leading-snug mt-0.5">
                {order.shippingAddress}
              </p>
            </div>
          </div>
        </div>

        {/* Items ordered */}
        {order.items.length > 0 && (
          <div
            data-ocid="order_confirmation.items_section"
            className="bg-card rounded-2xl border border-border p-4 space-y-1"
          >
            <h2 className="font-display font-black text-sm uppercase tracking-widest text-foreground mb-2">
              Items Ordered ({order.items.length})
            </h2>
            <div>
              {order.items.map((item, i) => (
                <OrderItemRow
                  key={`${item.productId}-${i}`}
                  productId={item.productId}
                  selectedSize={item.selectedSize}
                  quantity={item.quantity}
                  index={i}
                />
              ))}
            </div>
            {/* Total row */}
            <div className="flex justify-between items-center pt-3 mt-1 border-t border-border">
              <span className="text-sm font-semibold text-muted-foreground">
                Order Total
              </span>
              <span className="font-display font-black text-primary text-xl">
                ₹{total.toFixed(0)}
              </span>
            </div>
          </div>
        )}

        {/* Payment info */}
        <div
          data-ocid="order_confirmation.payment_section"
          className="bg-card rounded-2xl border border-border p-4 space-y-3"
        >
          <h2 className="font-display font-black text-sm uppercase tracking-widest text-foreground">
            Payment
          </h2>

          {isCOD ? (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-accent/10 border border-accent/20">
              <span className="text-xl shrink-0">💵</span>
              <div>
                <p className="font-bold text-sm text-foreground">
                  Cash on Delivery
                </p>
                <p className="text-xs text-accent font-medium mt-0.5">
                  No payment due now. Pay the delivery agent on arrival.
                </p>
              </div>
              <span className="ml-auto shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-accent/20 border border-accent/30 text-accent">
                COD
              </span>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border">
              <span className="text-xl shrink-0">💳</span>
              <div>
                <p className="font-bold text-sm text-foreground">
                  Card Payment
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Payment processed securely.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cancel Order — only when pending/processing and not already cancelled */}
        {canCancel && (
          <div
            className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 space-y-3"
            data-ocid="order_confirmation.cancel_section"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={16}
                className="text-red-400 shrink-0 mt-0.5"
              />
              <div>
                <p className="font-black text-sm text-foreground">
                  Need to cancel?
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  You can cancel your order at any time before it's shipped or
                  delivered.
                </p>
              </div>
            </div>
            <button
              type="button"
              data-ocid="order_confirmation.delete_button"
              onClick={() => setShowCancelModal(true)}
              disabled={cancelMutation.isPending}
              className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-widest border-2 border-red-500/60 text-red-400 hover:bg-red-500/10 active:scale-[0.98] transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {cancelMutation.isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                  Cancelling…
                </>
              ) : (
                "Cancel Order"
              )}
            </button>
          </div>
        )}

        {/* Cancelled state message */}
        {cancelled && (
          <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center space-y-1">
            <p className="font-display font-black text-sm text-foreground">
              Order Cancelled
            </p>
            <p className="text-xs text-muted-foreground">
              If you paid via COD, no payment is needed. See you next time! 👋
            </p>
          </div>
        )}

        {/* Hype message — only when not cancelled */}
        {!cancelled && (
          <div className="text-center space-y-2 py-2">
            <p className="font-display font-black text-lg text-foreground">
              You&apos;re about to look 🔥
            </p>
            <p className="text-muted-foreground text-sm">
              We&apos;re prepping your order right now. Expect dopamine soon.
            </p>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          {/* View All Orders — shown when logged in */}
          <Link
            to={isLoggedIn ? "/customer/orders" : "/customer/login"}
            data-ocid="order_confirmation.my_orders_link"
            className="block"
          >
            <Button
              variant="outline"
              size="lg"
              className="w-full font-black text-sm py-5 rounded-xl uppercase tracking-widest border-primary/40 text-primary hover:bg-primary/10 transition-smooth"
            >
              <Package size={16} className="mr-2" />
              {isLoggedIn ? "VIEW ALL MY ORDERS →" : "TRACK YOUR ORDERS →"}
            </Button>
          </Link>

          <Link
            to="/shop"
            data-ocid="order_confirmation.continue_shopping_button"
            className="block"
          >
            <Button
              size="lg"
              className="w-full bg-primary text-primary-foreground font-black text-base py-6 rounded-xl uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-smooth shadow-lg"
            >
              <ShoppingBag size={18} className="mr-2" />
              CONTINUE SHOPPING
            </Button>
          </Link>

          <Link
            to="/"
            data-ocid="order_confirmation.home_link"
            className="block"
          >
            <Button
              variant="outline"
              size="lg"
              className="w-full font-black text-sm py-5 rounded-xl uppercase tracking-widest border-border hover:bg-muted/30 transition-smooth"
            >
              BACK TO HOME
            </Button>
          </Link>
        </div>

        <p className="text-center text-[10px] text-muted-foreground">
          Questions? Contact us · Free returns within 7 days
        </p>
      </div>
    </>
  );
}
