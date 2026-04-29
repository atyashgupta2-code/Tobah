import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Bell,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Flame,
  ShoppingBag,
  Store,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Order, OrderId } from "../../backend.d";
import { FulfillmentBy, OrderStatus } from "../../backend.d";
import {
  useGetAllAdminNotifications,
  useListOrders,
  useMarkAdminNotificationRead,
  useUpdateOrderStatus,
} from "../../hooks/useAdminProducts";
import { useProducts } from "../../hooks/useProducts";
import { AdminLayout } from "./AdminLayout";

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> =
  {
    [OrderStatus.Placed]: {
      label: "Placed",
      className: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    },
    [OrderStatus.Pending]: {
      label: "Pending",
      className: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30",
    },
    [OrderStatus.Confirmed]: {
      label: "Confirmed",
      className: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    },
    [OrderStatus.Processing]: {
      label: "Processing",
      className: "bg-blue-600/15 text-blue-300 border-blue-600/30",
    },
    [OrderStatus.Shipped]: {
      label: "Shipped",
      className: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    },
    [OrderStatus.Delivered]: {
      label: "Delivered",
      className: "bg-green-500/15 text-green-400 border-green-500/30",
    },
    [OrderStatus.Cancelled]: {
      label: "Cancelled",
      className: "bg-destructive/15 text-destructive border-destructive/30",
    },
    [OrderStatus.Accepted]: {
      label: "Accepted",
      className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    },
    [OrderStatus.Rejected]: {
      label: "Rejected",
      className: "bg-red-600/15 text-red-400 border-red-600/30",
    },
  };

const ALL_STATUSES = [
  OrderStatus.Placed,
  OrderStatus.Pending,
  OrderStatus.Confirmed,
  OrderStatus.Processing,
  OrderStatus.Accepted,
  OrderStatus.Shipped,
  OrderStatus.Delivered,
  OrderStatus.Cancelled,
  OrderStatus.Rejected,
];

function formatDate(ts: bigint): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(Number(ts / 1_000_000n)));
}

// Parse "name, phone, address, city - pincode" OR JSON
interface ParsedAddress {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

function parseAddress(raw: string): ParsedAddress {
  try {
    const obj = JSON.parse(raw) as Record<string, string>;
    return {
      customerName: obj.customerName ?? obj.name ?? "",
      phone: obj.phone ?? obj.phoneNumber ?? "",
      address: obj.address ?? "",
      city: obj.city ?? "",
      pincode: obj.pincode ?? obj.zip ?? "",
    };
  } catch {
    const parts = raw.split(",").map((s) => s.trim());
    const namePart = parts[0] ?? "";
    const phonePart = parts[1] ?? "";
    const addressPart = parts[2] ?? "";
    const cityPinRaw = parts.slice(3).join(",").trim();
    const dashIdx = cityPinRaw.lastIndexOf("-");
    const city =
      dashIdx > -1 ? cityPinRaw.slice(0, dashIdx).trim() : cityPinRaw;
    const pincode = dashIdx > -1 ? cityPinRaw.slice(dashIdx + 1).trim() : "";
    return {
      customerName: namePart,
      phone: phonePart,
      address: addressPart,
      city,
      pincode,
    };
  }
}

// ─── Fulfillment Badge — prominent, easy to spot ──────────────────────────────
function FulfillmentBadge({ choice }: { choice?: FulfillmentBy }) {
  if (!choice) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border bg-yellow-500/10 border-yellow-500/30 text-yellow-400">
        ⏳ <span className="font-black">Awaiting delivery choice</span>
      </span>
    );
  }
  const isSeller = choice === FulfillmentBy.SellerFulfilled;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl border ${
        isSeller
          ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
          : "bg-blue-500/15 border-blue-500/40 text-blue-300"
      }`}
    >
      {isSeller ? "🚴" : "🏢"}
      <span>
        {isSeller ? "Supplier handles delivery" : "Admin handles delivery"}
      </span>
    </span>
  );
}

function AdminNotificationPanel({
  onClose,
}: {
  onClose: () => void;
}) {
  const { data: notifications = [] } = useGetAllAdminNotifications();
  const markRead = useMarkAdminNotificationRead();

  const unread = notifications.filter((n) => !n.isRead);
  const sorted = [
    ...notifications.filter((n) => !n.isRead),
    ...notifications.filter((n) => n.isRead),
  ];

  return (
    <div
      data-ocid="admin.notifications.panel"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 pointer-events-none"
    >
      <div className="pointer-events-auto w-full max-w-sm bg-card border border-border rounded-2xl shadow-elevated overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
          <span className="font-semibold text-sm text-foreground flex items-center gap-2">
            <Bell size={14} className="text-primary" />
            Supplier Actions
            {unread.length > 0 && (
              <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {unread.length}
              </span>
            )}
          </span>
          <button
            type="button"
            data-ocid="admin.notifications.close_button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-smooth"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>
        <div className="max-h-[400px] overflow-y-auto divide-y divide-border">
          {sorted.length === 0 ? (
            <div
              data-ocid="admin.notifications.empty_state"
              className="py-10 text-center text-sm text-muted-foreground"
            >
              <Bell size={28} className="mx-auto mb-2 opacity-40" />
              No supplier actions yet
            </div>
          ) : (
            sorted.map((n, i) => (
              <div
                key={n.id}
                data-ocid={`admin.notifications.item.${i + 1}`}
                className={`px-4 py-3 flex items-start gap-3 ${n.isRead ? "opacity-60" : "bg-primary/5"}`}
              >
                <div
                  className={`mt-1 shrink-0 w-2 h-2 rounded-full ${n.isRead ? "bg-muted-foreground/40" : "bg-primary"}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug">
                    {n.message}
                  </p>
                  {n.orderId && (
                    <span className="font-mono text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded mt-1 inline-block">
                      #{n.orderId.slice(0, 8).toUpperCase()}
                    </span>
                  )}
                </div>
                {!n.isRead && (
                  <button
                    type="button"
                    data-ocid={`admin.notifications.mark_read_button.${i + 1}`}
                    onClick={() => markRead.mutate(n.id)}
                    className="shrink-0 p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary transition-smooth"
                    aria-label="Mark as read"
                  >
                    <CheckCheck size={13} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function OrderCard({
  orderId,
  order,
  index,
  productOrderCounts,
  productNames,
  productSellerNames,
}: {
  orderId: OrderId;
  order: Order;
  index: number;
  productOrderCounts: Record<string, number>;
  productNames: Record<string, string>;
  productSellerNames: Record<string, string>;
}) {
  const updateStatus = useUpdateOrderStatus();
  const [expanded, setExpanded] = useState(false);
  const parsed = parseAddress(order.shippingAddress);
  const config =
    STATUS_CONFIG[order.status] ?? STATUS_CONFIG[OrderStatus.Pending];
  const shortId = orderId.slice(0, 8).toUpperCase();

  // Collect unique seller names from this order's items
  const sellerNames = Array.from(
    new Set(
      order.items
        .map((item) => productSellerNames[item.productId])
        .filter(Boolean),
    ),
  );

  async function handleStatusChange(newStatus: string) {
    try {
      await updateStatus.mutateAsync({
        id: orderId,
        status: newStatus as OrderStatus,
      });
      toast.success(`Order #${shortId} updated to ${newStatus}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  return (
    <div
      data-ocid={`admin.orders.item.${index}`}
      className="bg-card border border-border rounded-2xl overflow-hidden"
    >
      {/* Summary row */}
      <div className="p-4 flex flex-col gap-3">
        {/* Top row: ID, status, order meta */}
        <div className="flex items-start gap-3 flex-wrap">
          <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
            #{shortId}
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${config.className}`}
          >
            {config.label}
          </span>
          <Badge variant="outline" className="text-[10px] px-1.5 capitalize">
            {order.deliveryOption === "SameDay"
              ? "⚡ Same Day"
              : order.deliveryOption === "NextDay"
                ? "🚀 Next Day"
                : "📦 Standard"}
          </Badge>
          <Badge variant="secondary" className="text-[10px] px-1.5">
            {order.paymentMethod === "CashOnDelivery" ? "💵 COD" : "💳 Card"}
          </Badge>
        </div>

        {/* Fulfillment badge — prominent, full row on mobile */}
        <div>
          <FulfillmentBadge choice={order.fulfillmentChoice} />
        </div>

        {/* Customer info */}
        <div className="space-y-0.5">
          <p className="font-bold text-base text-foreground">
            {parsed.customerName || order.customerName || "Unknown Customer"}
          </p>
          {(parsed.phone || order.customerPhone) && (
            <p className="text-sm text-muted-foreground">
              📞 {parsed.phone || order.customerPhone}
            </p>
          )}
          {sellerNames.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Store size={11} className="text-muted-foreground shrink-0" />
              {sellerNames.map((name) => (
                <span
                  key={name}
                  className="text-[11px] font-semibold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-md"
                >
                  {name}
                </span>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Bottom row: total + controls */}
        <div className="flex items-center gap-3">
          <div>
            <p className="font-mono font-black text-lg text-foreground">
              ₹{Number(order.total).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {order.items.length} {order.items.length === 1 ? "item" : "items"}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Select
              value={order.status}
              onValueChange={handleStatusChange}
              disabled={updateStatus.isPending}
            >
              <SelectTrigger
                data-ocid={`admin.orders.status_select.${index}`}
                className="h-8 text-xs w-[120px]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">
                    {STATUS_CONFIG[s].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              data-ocid={`admin.orders.expand_button.${index}`}
              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth"
              aria-label={
                expanded ? "Collapse order details" : "Expand order details"
              }
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded detail panel */}
      {expanded && (
        <div
          data-ocid={`admin.orders.detail.${index}`}
          className="border-t border-border/60 bg-muted/20 px-4 py-4 space-y-4"
        >
          {/* Full customer info */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
              Customer & Delivery Info
            </p>
            <div className="bg-card rounded-xl border border-border p-3 space-y-1.5 text-sm">
              {[
                {
                  label: "Name",
                  value: parsed.customerName || order.customerName,
                },
                { label: "Phone", value: parsed.phone || order.customerPhone },
                { label: "Address", value: parsed.address },
                { label: "City", value: parsed.city },
                { label: "Pincode", value: parsed.pincode },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-2">
                  <span className="text-muted-foreground w-24 shrink-0 text-xs font-semibold uppercase tracking-wide">
                    {label}
                  </span>
                  <span className="text-foreground break-words min-w-0 font-medium">
                    {value || "—"}
                  </span>
                </div>
              ))}
              {/* Fulfillment row — highlighted */}
              <div className="flex gap-2 pt-1 border-t border-border/40 mt-1">
                <span className="text-muted-foreground w-24 shrink-0 text-xs font-semibold uppercase tracking-wide">
                  Fulfillment
                </span>
                <div>
                  <FulfillmentBadge choice={order.fulfillmentChoice} />
                </div>
              </div>
            </div>
          </div>

          {/* Products ordered with order counts */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
              Items Ordered
            </p>
            <div className="space-y-2">
              {order.items.map((item, i) => {
                const name = productNames[item.productId];
                const orderCount = productOrderCounts[item.productId] ?? 0;
                return (
                  <div
                    key={`${item.productId}-${item.selectedSize}-${i}`}
                    className="bg-card rounded-xl border border-border p-3 flex items-start gap-3"
                    data-ocid={`admin.orders.order_item.${index}.${i + 1}`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 border border-border">
                      <ShoppingBag
                        size={16}
                        className="text-muted-foreground"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      {name ? (
                        <p className="text-sm font-bold text-foreground truncate">
                          {name}
                        </p>
                      ) : (
                        <p className="text-sm font-semibold text-foreground truncate">
                          Product:{" "}
                          <span className="font-mono text-primary text-xs">
                            {item.productId}
                          </span>
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-xs text-muted-foreground">
                          Size:{" "}
                          <span className="font-bold text-foreground">
                            {item.selectedSize}
                          </span>
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Qty:{" "}
                          <span className="font-bold text-foreground">
                            {Number(item.quantity)}
                          </span>
                        </span>
                        {orderCount > 0 && (
                          <span className="flex items-center gap-0.5 text-xs font-bold text-amber-400">
                            <Flame size={11} className="text-amber-400" />
                            {orderCount.toLocaleString()} total orders
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-card rounded-xl border border-border p-3 flex items-center justify-between">
            <div className="text-xs text-muted-foreground space-y-0.5">
              <p>
                Delivery:{" "}
                <span className="text-foreground font-semibold">
                  {order.deliveryOption === "SameDay"
                    ? "Same Day"
                    : order.deliveryOption === "NextDay"
                      ? "Next Day"
                      : "Standard"}
                </span>
              </p>
              <p>
                Payment:{" "}
                <span className="text-foreground font-semibold">
                  {order.paymentMethod === "CashOnDelivery"
                    ? "Cash on Delivery"
                    : "Card"}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Order Total</p>
              <p className="font-mono font-black text-xl text-foreground">
                ₹{Number(order.total).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrders() {
  const { data: orders, isLoading, isError, refetch } = useListOrders();
  const { data: products = [] } = useProducts();
  const { data: allNotifications = [] } = useGetAllAdminNotifications();
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  // Build lookup maps: productId → orderCount and productId → name
  const productOrderCounts = useMemo<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    for (const p of products) {
      map[p.id] = Number(p.orderCount);
    }
    return map;
  }, [products]);

  const productNames = useMemo<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const p of products) {
      map[p.id] = p.name;
    }
    return map;
  }, [products]);

  const productSellerNames = useMemo<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const p of products) {
      if (p.sellerName) map[p.id] = p.sellerName;
    }
    return map;
  }, [products]);

  const totalRevenue =
    orders?.reduce((sum, [, o]) => sum + Number(o.total), 0) ?? 0;
  const pendingCount =
    orders?.filter(([, o]) => o.status === OrderStatus.Pending).length ?? 0;
  const deliveredCount =
    orders?.filter(([, o]) => o.status === OrderStatus.Delivered).length ?? 0;

  const unreadNotifCount = allNotifications.filter((n) => !n.isRead).length;

  return (
    <AdminLayout>
      <div
        data-ocid="admin.orders.page"
        className="p-6 max-w-screen-xl mx-auto space-y-6 pb-24"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-black text-2xl text-foreground">
              Orders
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Click any order to see full customer info and product order
              history
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Admin supplier action notifications */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                data-ocid="admin.orders.supplier_notifications_button"
                onClick={() => setShowNotifPanel((v) => !v)}
                className="gap-2 text-sm relative"
              >
                <Bell size={15} />
                Supplier Actions
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center px-1">
                    {unreadNotifCount > 9 ? "9+" : unreadNotifCount}
                  </span>
                )}
              </Button>
              {showNotifPanel && (
                <AdminNotificationPanel
                  onClose={() => setShowNotifPanel(false)}
                />
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              data-ocid="admin.orders.refresh_button"
              onClick={() => refetch()}
              className="gap-2 text-sm"
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Orders", value: orders?.length ?? 0, icon: "📋" },
            { label: "Pending", value: pendingCount, icon: "🕐" },
            {
              label: "Revenue",
              value: `₹${totalRevenue.toLocaleString()}`,
              icon: "💰",
            },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="bg-card border border-border rounded-xl p-4"
            >
              <div className="text-2xl mb-1">{icon}</div>
              <p className="font-display font-black text-xl text-foreground">
                {value}
              </p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Orders list */}
        {isLoading ? (
          <div className="space-y-3" data-ocid="admin.orders.loading_state">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-2xl p-4 space-y-2"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="h-6 w-20 rounded-md" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-16 ml-auto" />
                  <Skeleton className="h-8 w-24 rounded-md" />
                </div>
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div
            className="bg-card border border-border rounded-2xl p-12 text-center"
            data-ocid="admin.orders.error_state"
          >
            <p className="text-destructive font-semibold">
              Failed to load orders
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => refetch()}
            >
              Try again
            </Button>
          </div>
        ) : !orders || orders.length === 0 ? (
          <div
            data-ocid="admin.orders.empty_state"
            className="bg-card border border-border rounded-2xl flex flex-col items-center justify-center py-20 px-6 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingBag size={28} className="text-muted-foreground" />
            </div>
            <h2 className="font-display font-bold text-lg text-foreground">
              No orders yet
            </h2>
            <p className="text-muted-foreground text-sm mt-1 max-w-xs">
              Orders placed by customers will appear here. Click any order to
              see full customer details.
            </p>
          </div>
        ) : (
          <div data-ocid="admin.orders.list" className={cn("space-y-3")}>
            {orders.map(([id, order], idx) => (
              <OrderCard
                key={id}
                orderId={id}
                order={order}
                index={idx + 1}
                productOrderCounts={productOrderCounts}
                productNames={productNames}
                productSellerNames={productSellerNames}
              />
            ))}
          </div>
        )}

        {deliveredCount > 0 && (
          <p className="text-xs text-muted-foreground text-right">
            {deliveredCount} order{deliveredCount !== 1 ? "s" : ""} delivered so
            far
          </p>
        )}
      </div>
    </AdminLayout>
  );
}
