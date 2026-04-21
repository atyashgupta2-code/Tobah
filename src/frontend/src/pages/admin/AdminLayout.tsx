import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Loader2,
  LogOut,
  Package,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag, exact: false },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const { identity, loginStatus, login, clear } = useInternetIdentity();
  const location = useLocation();

  // Not logged in — show auth gate (full-screen overlay)
  if (loginStatus !== "success" || !identity) {
    const isLoggingIn = loginStatus === "logging-in";

    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center px-4">
        {/* Decorative background blobs */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 blur-2xl" />
        </div>

        <div className="relative w-full max-w-md">
          {/* Card */}
          <div className="bg-card border border-border rounded-2xl p-10 space-y-7 shadow-2xl">
            {/* Logo area */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center shadow-lg">
                <ShieldCheck className="text-primary" size={38} />
              </div>
              <div className="text-center">
                <h1 className="font-display font-black text-4xl tracking-tight">
                  <span className="text-gradient-primary">TBah</span>
                </h1>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-0.5">
                  Admin Panel
                </p>
              </div>
            </div>

            {/* Heading + description */}
            <div className="text-center space-y-2">
              <h2 className="font-display font-bold text-xl text-foreground">
                Admin Login
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Manage your store products and orders. Secure access via
                Internet Identity.
              </p>
            </div>

            {/* Login button */}
            <div className="space-y-3">
              <Button
                data-ocid="admin.login_button"
                className="w-full h-14 text-base font-black btn-primary rounded-xl shadow-lg"
                onClick={() => login()}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={20} className="animate-spin" />
                    Connecting…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <ShieldCheck size={20} />
                    Login with Internet Identity
                  </span>
                )}
              </Button>

              {isLoggingIn && (
                <p
                  data-ocid="admin.login.loading_state"
                  className="text-center text-xs text-muted-foreground animate-pulse"
                >
                  A popup window will appear — please approve the request
                </p>
              )}
            </div>

            <p className="text-center text-xs text-muted-foreground border-t border-border pt-4">
              Only authorized principals can access this panel
            </p>
          </div>

          {/* Hint below card */}
          <p className="text-center text-xs text-muted-foreground mt-4 opacity-60">
            Go to <span className="font-mono">/admin</span> to return here
            anytime
          </p>
        </div>

        <Toaster />
      </div>
    );
  }

  function isActive(to: string, exact: boolean) {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-card border-r border-border shrink-0">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-border">
          <Link
            to="/"
            data-ocid="admin.brand_link"
            className="font-display font-black text-lg text-gradient-primary"
          >
            TBah
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5 font-semibold uppercase tracking-wider">
            Admin Panel
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, exact }) => {
            const active = isActive(to, exact);
            return (
              <Link
                key={to}
                to={to}
                data-ocid={`admin.nav.${label.toLowerCase()}_link`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-smooth",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
          <Link
            to="/admin"
            data-ocid="admin.nav.products_link"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-smooth",
              isActive("/admin/products", false)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Package size={18} />
            Products
          </Link>
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-border">
          <button
            type="button"
            data-ocid="admin.logout_button"
            onClick={() => clear()}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-smooth"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden absolute top-0 left-0 right-0 z-10 bg-card border-b border-border flex items-center justify-between px-4 h-14">
        <span className="font-display font-black text-lg text-gradient-primary">
          TBah{" "}
          <span className="text-muted-foreground text-sm font-semibold">
            Admin
          </span>
        </span>
        <div className="flex items-center gap-1">
          <Link
            to="/admin"
            data-ocid="admin.mobile_nav.dashboard_link"
            className={cn(
              "p-2 rounded-lg transition-smooth",
              isActive("/admin", true)
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-label="Dashboard"
          >
            <LayoutDashboard size={18} />
          </Link>
          <Link
            to="/admin/orders"
            data-ocid="admin.mobile_nav.orders_link"
            className={cn(
              "p-2 rounded-lg transition-smooth",
              isActive("/admin/orders", false)
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-label="Orders"
          >
            <ShoppingBag size={18} />
          </Link>
          <Link
            to="/admin"
            data-ocid="admin.mobile_nav.products_link"
            className={cn(
              "p-2 rounded-lg transition-smooth",
              isActive("/admin/products", false)
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-label="Products"
          >
            <Package size={18} />
          </Link>
          <button
            type="button"
            data-ocid="admin.mobile_logout_button"
            onClick={() => clear()}
            className="p-2 rounded-lg text-muted-foreground hover:text-destructive transition-smooth"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-background pt-14 md:pt-0">
        {children}
      </main>

      <Toaster />
    </div>
  );
}
