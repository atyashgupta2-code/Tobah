import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Check,
  Package,
  Pencil,
  Plus,
  ShoppingBag,
  Store,
  Trash2,
  TriangleAlert,
  UserX,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { OrderStatus } from "../../backend";
import type { Notification, Product, Seller } from "../../backend.d";
import {
  useDeleteProduct,
  useGetAdminNotifications,
  useListOrders,
  useListSellers,
  useMarkAdminNotificationRead,
  useRemoveSeller,
} from "../../hooks/useAdminProducts";
import { useProducts } from "../../hooks/useProducts";
import { AdminLayout } from "./AdminLayout";

// ─── Helpers ────────────────────────────────────────────────────────────────

function relativeTime(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  const diff = Date.now() - ms;
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

// ─── Notifications Panel ─────────────────────────────────────────────────────

function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const { data: notifications = [], isLoading } = useGetAdminNotifications();
  const markRead = useMarkAdminNotificationRead();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  async function handleMarkRead(id: string) {
    try {
      await markRead.mutateAsync(id);
    } catch {
      toast.error("Failed to mark as read");
    }
  }

  const unread = notifications.filter((n) => !n.isRead);

  return (
    <div
      ref={panelRef}
      data-ocid="admin.notifications.panel"
      className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-primary" />
          <span className="font-bold text-sm text-foreground">
            Notifications
          </span>
          {unread.length > 0 && (
            <span className="text-[10px] font-black bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
              {unread.length}
            </span>
          )}
        </div>
        <button
          type="button"
          data-ocid="admin.notifications.close_button"
          onClick={onClose}
          className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
          aria-label="Close notifications"
        >
          <X size={14} />
        </button>
      </div>

      <div className="overflow-y-auto max-h-80">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div
            data-ocid="admin.notifications.empty_state"
            className="py-10 flex flex-col items-center gap-2 text-center px-4"
          >
            <Bell size={28} className="text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              No notifications yet
            </p>
          </div>
        ) : (
          notifications.map((n: Notification) => (
            <div
              key={n.id}
              data-ocid={`admin.notifications.item.${n.id}`}
              className={cn(
                "px-4 py-3 border-b border-border/40 flex items-start gap-3 transition-smooth",
                !n.isRead ? "bg-primary/5" : "opacity-60",
              )}
            >
              <div
                className={cn(
                  "w-2 h-2 rounded-full mt-1.5 shrink-0",
                  !n.isRead ? "bg-primary" : "bg-muted-foreground/30",
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-snug">
                  {n.message}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {relativeTime(n.createdAt)}
                </p>
              </div>
              {!n.isRead && (
                <button
                  type="button"
                  data-ocid={`admin.notifications.mark_read.${n.id}`}
                  onClick={() => handleMarkRead(n.id)}
                  disabled={markRead.isPending}
                  className="shrink-0 p-1 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth"
                  aria-label="Mark as read"
                >
                  <Check size={13} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Bell Button ─────────────────────────────────────────────────────────────

function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const { data: notifications = [] } = useGetAdminNotifications();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      <button
        type="button"
        data-ocid="admin.notifications.bell_button"
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth"
        aria-label="Notifications"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-black flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      {open && <NotificationsPanel onClose={() => setOpen(false)} />}
    </div>
  );
}

// ─── Product Row ─────────────────────────────────────────────────────────────

function ProductRow({ product, index }: { product: Product; index: number }) {
  const navigate = useNavigate();
  const deleteProduct = useDeleteProduct();

  async function handleDelete() {
    try {
      await deleteProduct.mutateAsync(product.id);
      toast.success(`"${product.name}" deleted`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <tr
      data-ocid={`admin.products.item.${index}`}
      className="border-b border-border hover:bg-muted/30 transition-smooth"
    >
      <td className="px-4 py-3">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-12 h-12 rounded-lg object-cover bg-muted"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/assets/generated/placeholder.svg";
          }}
        />
      </td>
      <td className="px-4 py-3">
        <p className="font-semibold text-sm text-foreground truncate max-w-[160px]">
          {product.name}
        </p>
        <p className="text-xs text-muted-foreground truncate max-w-[160px]">
          {product.category}
        </p>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="font-mono text-sm font-semibold text-foreground">
          ₹{Number(product.price).toLocaleString()}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <span
          className={
            Number(product.stock) > 0
              ? "text-sm font-semibold text-foreground"
              : "text-sm font-semibold text-destructive"
          }
        >
          {Number(product.stock)}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="font-mono text-sm font-bold text-primary">
          {Number(product.orderCount)}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {product.hasSameDayDelivery && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
              ⚡ Same Day
            </Badge>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 justify-end">
          <Button
            variant="ghost"
            size="icon"
            data-ocid={`admin.products.edit_button.${index}`}
            onClick={() =>
              navigate({ to: `/admin/products/${product.id}/edit` })
            }
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="Edit product"
          >
            <Pencil size={15} />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                data-ocid={`admin.products.delete_button.${index}`}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                aria-label="Delete product"
              >
                <Trash2 size={15} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent data-ocid="admin.delete_dialog">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <TriangleAlert size={18} className="text-destructive" />
                  Delete Product
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete{" "}
                  <strong className="text-foreground">"{product.name}"</strong>?
                  This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel data-ocid="admin.delete_dialog.cancel_button">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  data-ocid="admin.delete_dialog.confirm_button"
                  onClick={handleDelete}
                  disabled={deleteProduct.isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteProduct.isPending ? "Deleting…" : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </td>
    </tr>
  );
}

// ─── Seller Row ───────────────────────────────────────────────────────────────

function SellerRow({
  seller,
  index,
}: {
  seller: Seller;
  index: number;
}) {
  const removeSeller = useRemoveSeller();

  async function handleRemove() {
    try {
      await removeSeller.mutateAsync(seller.id);
      toast.success(`${seller.businessName} removed`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Remove failed");
    }
  }

  return (
    <tr
      data-ocid={`admin.sellers.item.${index}`}
      className="border-b border-border hover:bg-muted/30 transition-smooth"
    >
      <td className="px-4 py-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Store size={16} className="text-primary" />
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="font-bold text-sm text-foreground">
          {seller.businessName}
        </p>
        <p className="text-xs text-muted-foreground">{seller.name}</p>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-foreground">{seller.email || "—"}</p>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-foreground">{seller.phone || "—"}</p>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-muted-foreground">N/A</p>
      </td>
      <td className="px-4 py-3">
        <Badge
          variant={seller.isApproved ? "default" : "secondary"}
          className="text-[10px]"
        >
          {seller.isApproved ? "✓ Approved" : "Pending"}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              data-ocid={`admin.sellers.remove_button.${index}`}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              aria-label={`Remove ${seller.businessName}`}
            >
              <UserX size={15} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent data-ocid="admin.remove_seller_dialog">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <TriangleAlert size={18} className="text-destructive" />
                Remove Seller
              </AlertDialogTitle>
              <AlertDialogDescription>
                Remove{" "}
                <strong className="text-foreground">
                  {seller.businessName}
                </strong>
                ? This will delete their account and all their listed products.
                Past orders remain visible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-ocid="admin.remove_seller_dialog.cancel_button">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                data-ocid="admin.remove_seller_dialog.confirm_button"
                onClick={handleRemove}
                disabled={removeSeller.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {removeSeller.isPending ? "Removing…" : "Remove Seller"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </td>
    </tr>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

type Tab = "products" | "sellers";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const { data: products, isLoading, isError } = useProducts();
  const { data: orders } = useListOrders();
  const {
    data: sellers,
    isLoading: sellersLoading,
    isError: sellersError,
  } = useListSellers();

  const totalProducts = products?.length ?? 0;
  const totalStock =
    products?.reduce((sum, p) => sum + Number(p.stock), 0) ?? 0;
  const sameDayCount =
    products?.filter((p) => p.hasSameDayDelivery).length ?? 0;
  const pendingOrders =
    orders?.filter(([, o]) => o.status === OrderStatus.Pending).length ?? 0;

  return (
    <AdminLayout>
      <div
        data-ocid="admin.dashboard.page"
        className="p-6 max-w-screen-xl mx-auto space-y-6 pb-24"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-black text-2xl text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Manage your TBah inventory &amp; sellers
            </p>
          </div>
          <div className="flex items-center gap-2">
            <NotificationsBell />
            <Link to="/admin/orders">
              <Button
                variant="outline"
                data-ocid="admin.view_orders_button"
                className="gap-2 text-sm relative"
              >
                <ShoppingBag size={15} />
                Orders
                {pendingOrders > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-black flex items-center justify-center">
                    {pendingOrders}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/admin/products/new">
              <Button
                data-ocid="admin.add_product_button"
                className="btn-primary gap-2"
              >
                <Plus size={16} />
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Products", value: totalProducts, icon: "📦" },
            { label: "Total Stock", value: totalStock, icon: "🏷️" },
            { label: "Same-Day Enabled", value: sameDayCount, icon: "⚡" },
            { label: "Pending Orders", value: pendingOrders, icon: "🕐" },
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

        {/* Tabs */}
        <div className="flex gap-1 bg-muted/40 border border-border rounded-xl p-1 w-fit">
          {(["products", "sellers"] as Tab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              data-ocid={`admin.tab.${tab}`}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-5 py-2 rounded-lg text-sm font-bold capitalize transition-smooth",
                activeTab === tab
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab === "products" ? "📦 Products" : "🏪 Sellers"}
              {tab === "sellers" && sellers && sellers.length > 0 && (
                <span className="ml-1.5 text-[10px] bg-primary/20 text-primary rounded-full px-1.5 py-0.5 font-black">
                  {sellers.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {isLoading ? (
              <div
                className="p-6 space-y-3"
                data-ocid="admin.products.loading_state"
              >
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div
                className="p-12 text-center"
                data-ocid="admin.products.error_state"
              >
                <p className="text-destructive font-semibold">
                  Failed to load products
                </p>
              </div>
            ) : !products || products.length === 0 ? (
              <div
                data-ocid="admin.products.empty_state"
                className="flex flex-col items-center justify-center py-20 px-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Package size={28} className="text-muted-foreground" />
                </div>
                <h2 className="font-display font-bold text-lg text-foreground">
                  No products yet
                </h2>
                <p className="text-muted-foreground text-sm mt-1 mb-6 max-w-xs">
                  Add your first product to start selling on TBah
                </p>
                <Link to="/admin/products/new">
                  <Button
                    data-ocid="admin.empty_add_product_button"
                    className="btn-primary gap-2"
                  >
                    <Plus size={16} />
                    Add First Product
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border">
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Image
                      </th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Product
                      </th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">
                        Price
                      </th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">
                        Stock
                      </th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">
                        Orders
                      </th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Features
                      </th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody data-ocid="admin.products.table">
                    {products.map((product, idx) => (
                      <ProductRow
                        key={product.id}
                        product={product}
                        index={idx + 1}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Sellers Tab */}
        {activeTab === "sellers" && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {sellersLoading ? (
              <div
                className="p-6 space-y-3"
                data-ocid="admin.sellers.loading_state"
              >
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="w-9 h-9 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            ) : sellersError ? (
              <div
                className="p-12 text-center"
                data-ocid="admin.sellers.error_state"
              >
                <p className="text-destructive font-semibold">
                  Failed to load sellers
                </p>
              </div>
            ) : !sellers || sellers.length === 0 ? (
              <div
                data-ocid="admin.sellers.empty_state"
                className="flex flex-col items-center justify-center py-20 px-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Store size={28} className="text-muted-foreground" />
                </div>
                <h2 className="font-display font-bold text-lg text-foreground">
                  No sellers yet
                </h2>
                <p className="text-muted-foreground text-sm mt-1 max-w-xs">
                  Sellers who register at /seller/register will appear here
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border">
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        &nbsp;
                      </th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Business / Name
                      </th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Email
                      </th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Address
                      </th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Status
                      </th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody data-ocid="admin.sellers.table">
                    {sellers.map((seller, idx) => (
                      <SellerRow
                        key={seller.id}
                        seller={seller}
                        index={idx + 1}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
