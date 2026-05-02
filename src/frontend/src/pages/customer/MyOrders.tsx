import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Clock,
  LogOut,
  Package,
  ShoppingBag,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useCustomer } from "../../contexts/CustomerContext";
import {
  isOrderCancelled,
  useCancelOrder,
  useListOrdersByCustomer,
  useProduct,
} from "../../hooks/useProducts";
import { OrderStatus } from "../../types";

function StatusBadge({
  status,
  cancelled,
}: {
  status: OrderStatus;
  cancelled: boolean;
}) {
  if (cancelled || status === OrderStatus.Cancelled) {
    return (
      <Badge className="bg-red-500/15 border border-red-500/30 text-red-400 font-black uppercase text-[10px] tracking-wide rounded-full px-3">
        Cancelled
      </Badge>
    );
  }
  if (status === OrderStatus.Delivered) {
    return (
      <Badge className="bg-accent/15 border border-accent/30 text-accent font-black uppercase text-[10px] tracking-wide rounded-full px-3">
        Delivered
      </Badge>
    );
  }
  if (status === OrderStatus.Shipped) {
    return (
      <Badge className="bg-blue-500/15 border border-blue-500/30 text-blue-400 font-black uppercase text-[10px] tracking-wide rounded-full px-3">
        Shipped
      </Badge>
    );
  }
  if (status === OrderStatus.Confirmed) {
    return (
      <Badge className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-black uppercase text-[10px] tracking-wide rounded-full px-3">
        Confirmed
      </Badge>
    );
  }
  if (status === OrderStatus.Processing) {
    return (
      <Badge className="bg-orange-500/15 border border-orange-500/30 text-orange-400 font-black uppercase text-[10px] tracking-wide rounded-full px-3">
        Processing
      </Badge>
    );
  }
  return (
    <Badge className="bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 font-black uppercase text-[10px] tracking-wide rounded-full px-3">
      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse inline-block mr-1" />
      Pending
    </Badge>
  );
}

function OrderItemPreview({
  productId,
  quantity,
  selectedSize,
}: {
  productId: string;
  quantity: bigint;
  selectedSize: string;
}) {
  const { data: product } = useProduct(productId);
  const unitPrice = product ? Number(product.price) / 100 : 0;
  const lineTotal = unitPrice * Number(quantity);

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border/50 last:border-0">
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
        {product?.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={16} className="text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground truncate">
          {product?.name ?? "Loading…"}
        </p>
        <p className="text-[11px] text-muted-foreground">
          Size: {selectedSize} · Qty: {Number(quantity)}
        </p>
      </div>
      <span className="font-black text-sm text-primary shrink-0">
        ₹{lineTotal.toFixed(0)}
      </span>
    </div>
  );
}

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
      data-ocid="my_orders.cancel_dialog"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      aria-modal="true"
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
          data-ocid="my_orders.close_button"
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
            This action can't be undone. Are you sure you want to cancel?
          </p>
        </div>
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            data-ocid="my_orders.confirm_button"
            onClick={onConfirm}
            disabled={isPending}
            className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-smooth border-2 border-red-500/70 text-red-400 hover:bg-red-500/10 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <span
                  data-ocid="my_orders.loading_state"
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
            data-ocid="my_orders.cancel_button"
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

const INITIAL_VISIBLE = 5;

export default function MyOrders() {
  const { currentCustomer, logout, isLoggedIn } = useCustomer();
  const navigate = useNavigate();
  const cancelMutation = useCancelOrder();
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate({ to: "/customer/login" });
    }
  }, [isLoggedIn, navigate]);

  const { data: orders, isLoading } = useListOrdersByCustomer(
    currentCustomer?.phone ?? "",
  );

  if (!isLoggedIn) return null;

  function handleCancelConfirm() {
    if (!cancelTargetId) return;
    cancelMutation.mutate(cancelTargetId, {
      onSuccess: () => setCancelTargetId(null),
    });
  }

  const sortedOrders = orders
    ? [...orders].sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    : [];

  const visibleOrders = showAll
    ? sortedOrders
    : sortedOrders.slice(0, INITIAL_VISIBLE);
  const hasMore = sortedOrders.length > INITIAL_VISIBLE;

  return (
    <>
      {cancelTargetId && (
        <CancelModal
          onConfirm={handleCancelConfirm}
          onClose={() => setCancelTargetId(null)}
          isPending={cancelMutation.isPending}
        />
      )}

      <div
        data-ocid="my_orders.page"
        className="max-w-screen-sm mx-auto px-4 py-6 pb-28 space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-black text-2xl text-foreground uppercase tracking-tight">
              My Orders
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              <span className="text-primary font-semibold">
                {currentCustomer?.name}
              </span>{" "}
              · 📱 {currentCustomer?.phone}
            </p>
          </div>
          <button
            type="button"
            data-ocid="my_orders.logout_button"
            onClick={logout}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-smooth p-2 rounded-lg hover:bg-muted"
            aria-label="Log out"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div data-ocid="my_orders.loading_state" className="space-y-4">
            {[1, 2].map((n) => (
              <Skeleton key={n} className="h-40 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && sortedOrders.length === 0 && (
          <div
            data-ocid="my_orders.empty_state"
            className="text-center py-16 space-y-4"
          >
            <div className="w-20 h-20 rounded-full bg-muted/60 border border-border flex items-center justify-center mx-auto">
              <ShoppingBag size={36} className="text-muted-foreground" />
            </div>
            <div>
              <p className="font-display font-black text-xl text-foreground">
                No orders yet
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                You haven't placed any orders with this number.
              </p>
            </div>
            <Link to="/shop" data-ocid="my_orders.shop_link">
              <Button className="bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-xl px-8">
                START SHOPPING
              </Button>
            </Link>
          </div>
        )}

        {/* Order cards */}
        {!isLoading &&
          visibleOrders.map((order, idx) => {
            const localCancelled = isOrderCancelled(order.id);
            const cancelled =
              localCancelled || order.status === OrderStatus.Cancelled;
            const canCancel =
              order.status !== OrderStatus.Shipped &&
              order.status !== OrderStatus.Delivered &&
              order.status !== OrderStatus.Cancelled &&
              order.status !== OrderStatus.Rejected &&
              !cancelled;
            const total = Number(order.total) / 100;
            const orderNum = `ORD-${order.id.slice(0, 8).toUpperCase()}`;
            const createdDate = new Date(Number(order.createdAt) / 1_000_000);

            return (
              <div
                key={order.id}
                data-ocid={`my_orders.item.${idx + 1}`}
                className={`bg-card border rounded-2xl p-4 space-y-4 ${
                  cancelled ? "border-red-500/20" : "border-border"
                }`}
              >
                {/* Order header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display font-black text-sm text-primary tracking-widest">
                      {orderNum}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock size={10} />
                      {createdDate.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <StatusBadge status={order.status} cancelled={cancelled} />
                </div>

                {/* Items */}
                <div className="border-t border-border/50 pt-3">
                  {order.items.map((item, i) => (
                    <OrderItemPreview
                      key={`${item.productId}-${i}`}
                      productId={item.productId}
                      quantity={item.quantity}
                      selectedSize={item.selectedSize}
                    />
                  ))}
                </div>

                {/* Total + address */}
                <div className="flex items-center justify-between pt-1 border-t border-border/50">
                  <div className="text-xs text-muted-foreground">
                    📍{" "}
                    {order.shippingAddress
                      .split(",")
                      .slice(-2)
                      .join(",")
                      .trim()}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Total
                    </p>
                    <p className="font-display font-black text-primary text-lg leading-tight">
                      ₹{total.toFixed(0)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <Link
                    to="/order/$id"
                    params={{ id: order.id }}
                    data-ocid={`my_orders.view_button.${idx + 1}`}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full font-bold text-xs uppercase tracking-wide border-border hover:bg-muted/30 rounded-xl"
                    >
                      View Details
                    </Button>
                  </Link>
                  {canCancel && (
                    <button
                      type="button"
                      data-ocid={`my_orders.delete_button.${idx + 1}`}
                      onClick={() => setCancelTargetId(order.id)}
                      disabled={cancelMutation.isPending}
                      className="flex-1 py-2 rounded-xl font-black text-xs uppercase tracking-wide border-2 border-red-500/50 text-red-400 hover:bg-red-500/10 transition-smooth active:scale-[0.97] disabled:opacity-50"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            );
          })}

        {/* Show More / Show Less */}
        {!isLoading && hasMore && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              data-ocid="my_orders.show_more_button"
              onClick={() => setShowAll((prev) => !prev)}
              className="px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest border-2 border-primary/40 text-primary hover:bg-primary/10 transition-smooth active:scale-[0.97]"
            >
              {showAll
                ? "Show Less"
                : `Show More Orders (${sortedOrders.length - INITIAL_VISIBLE} more)`}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
