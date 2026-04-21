import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  CheckCheck,
  Edit2,
  Package,
  Plus,
  Trash2,
  Truck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Notification, Product } from "../../backend.d";
import { FulfillmentBy } from "../../backend.d";
import {
  useGetSellerNotifications,
  useMarkNotificationRead,
  useSellerDeleteProduct,
  useSellerProducts,
} from "../../hooks/useSeller";

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return "";
  const now = Date.now();
  const diff = now - date.getTime();
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return date.toLocaleDateString();
}

function NotificationPanel({
  notifications,
  sellerId,
  onClose,
}: {
  notifications: Notification[];
  sellerId: string;
  onClose: () => void;
}) {
  const markRead = useMarkNotificationRead();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  async function handleMarkRead(notificationId: string) {
    try {
      await markRead.mutateAsync({ notificationId, sellerId });
    } catch {
      // silent
    }
  }

  return (
    <div
      ref={panelRef}
      data-ocid="seller.notifications.panel"
      className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-elevated z-50 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="font-semibold text-sm text-foreground">
          Notifications
        </span>
        <button
          type="button"
          data-ocid="seller.notifications.close_button"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-smooth"
          aria-label="Close notifications"
        >
          <X size={14} />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-border">
        {notifications.length === 0 ? (
          <div
            data-ocid="seller.notifications.empty_state"
            className="py-10 text-center text-sm text-muted-foreground"
          >
            <Bell size={28} className="mx-auto mb-2 opacity-40" />
            No notifications yet
          </div>
        ) : (
          notifications.map((n, i) => (
            <div
              key={n.id}
              data-ocid={`seller.notifications.item.${i + 1}`}
              className={`px-4 py-3 flex items-start gap-3 transition-smooth ${
                n.isRead ? "opacity-60" : "bg-primary/5"
              }`}
            >
              <div
                className={`mt-0.5 shrink-0 w-2 h-2 rounded-full ${n.isRead ? "bg-muted-foreground/40" : "bg-primary"}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-snug">
                  {n.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatTimestamp(n.createdAt)}
                </p>
              </div>
              {!n.isRead && (
                <button
                  type="button"
                  data-ocid={`seller.notifications.mark_read_button.${i + 1}`}
                  onClick={() => handleMarkRead(n.id)}
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
  );
}

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
      {/* Thumbnail */}
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

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground truncate">
          {product.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-primary font-bold text-sm">
            PKR {Number(product.price).toLocaleString()}
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
        {/* Fulfillment badge */}
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

      {/* Actions */}
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

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [sellerId, setSellerId] = useState<string>("");
  const [sellerName, setSellerName] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const { data: products, isLoading } = useSellerProducts(sellerId);
  const { data: notifications } = useGetSellerNotifications(sellerId);
  const deleteProduct = useSellerDeleteProduct();

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

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

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

          <div className="flex items-center gap-2 shrink-0">
            {/* Notification bell */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                data-ocid="seller.dashboard.notifications_button"
                onClick={() => setShowNotifications((v) => !v)}
                className="h-9 w-9 relative text-muted-foreground hover:text-foreground"
                aria-label="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span
                    data-ocid="seller.dashboard.notification_count"
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center px-1"
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>

              {showNotifications && (
                <NotificationPanel
                  notifications={notifications ?? []}
                  sellerId={sellerId}
                  onClose={() => setShowNotifications(false)}
                />
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="text-xs text-muted-foreground"
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
        </div>

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
      </div>
    </div>
  );
}
