import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Grid3X3,
  Home,
  Mail,
  Menu,
  Package,
  ShoppingBag,
  Sparkles,
  Store,
  X,
} from "lucide-react";
import { useState } from "react";
import { useCustomer } from "../contexts/CustomerContext";
import { useCart } from "../hooks/useCart";

interface LayoutProps {
  children: React.ReactNode;
}

const mobileNav = [
  { to: "/", label: "HOME", icon: Home, exact: true },
  { to: "/shop", label: "SHOP", icon: Grid3X3, exact: false },
  { to: "/cart", label: "BAG", icon: ShoppingBag, exact: false },
  { to: "/models", label: "MODELS", icon: Sparkles, exact: false },
  { to: "/customer/orders", label: "ORDERS", icon: Package, exact: false },
];

export function Layout({ children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { currentCustomer, isLoggedIn } = useCustomer();
  const location = useLocation();

  function isActive(to: string, exact: boolean) {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-card border-b border-border/60 shadow-elevated">
        <div className="flex items-center justify-between px-4 h-14 max-w-screen-xl mx-auto w-full">
          {/* Logo */}
          <Link
            to="/"
            data-ocid="nav.logo_link"
            className="font-display font-black text-xl tracking-tight text-gradient-primary"
          >
            TB<span className="text-foreground">ah</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {[
              { to: "/", label: "Home" },
              { to: "/shop", label: "Shop" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                data-ocid={`nav.${label.toLowerCase()}_link`}
                className={cn(
                  "text-sm font-semibold transition-smooth",
                  isActive(to, to === "/")
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </Link>
            ))}

            {/* My Orders / Models — desktop */}
            {isLoggedIn ? (
              <>
                <Link
                  to="/models"
                  data-ocid="nav.models_link"
                  className={cn(
                    "text-sm font-semibold transition-smooth flex items-center gap-1.5",
                    isActive("/models", false)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Sparkles size={13} />
                  Models
                </Link>
                <Link
                  to="/customer/orders"
                  data-ocid="nav.my_orders_link"
                  className={cn(
                    "text-sm font-semibold transition-smooth flex items-center gap-1.5",
                    isActive("/customer/orders", false)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Package size={13} />
                  My Orders
                </Link>
              </>
            ) : (
              <Link
                to="/customer/login"
                data-ocid="nav.customer_login_link"
                className={cn(
                  "text-sm font-semibold transition-smooth",
                  isActive("/customer/login", false)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Login
              </Link>
            )}

            {/* Sell on TBah — desktop */}
            <Link
              to="/seller/register"
              data-ocid="nav.sell_on_tbah_link"
              className="text-sm font-semibold text-accent hover:text-accent/80 transition-smooth flex items-center gap-1.5 border border-accent/30 rounded-lg px-3 py-1"
            >
              <Store size={13} />
              Sell on TBah
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Customer pill — desktop */}
            {isLoggedIn && (
              <Link
                to="/customer/orders"
                data-ocid="nav.customer_pill"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary/20 transition-smooth"
              >
                <span className="w-2 h-2 rounded-full bg-primary" />
                {currentCustomer?.name.split(" ")[0]}
              </Link>
            )}

            <Link
              to="/cart"
              data-ocid="nav.cart_button"
              className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground transition-smooth"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-fade-in">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              data-ocid="nav.menu_button"
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground transition-smooth"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="md:hidden border-t border-border/60 bg-card animate-slide-up">
            <nav className="flex flex-col p-4 gap-1">
              {[
                { to: "/", label: "Home" },
                { to: "/shop", label: "Shop" },
                { to: "/cart", label: "Cart" },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  data-ocid={`mobile_menu.${label.toLowerCase()}_link`}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-xl font-semibold text-sm transition-smooth",
                    isActive(to, to === "/")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {label}
                </Link>
              ))}

              {/* My Orders / Login — mobile */}
              {isLoggedIn ? (
                <>
                  <Link
                    to="/models"
                    data-ocid="mobile_menu.models_link"
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-xl font-semibold text-sm transition-smooth flex items-center gap-2",
                      isActive("/models", false)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Sparkles size={15} />
                    Models
                  </Link>
                  <Link
                    to="/customer/orders"
                    data-ocid="mobile_menu.my_orders_link"
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-xl font-semibold text-sm transition-smooth flex items-center gap-2",
                      isActive("/customer/orders", false)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Package size={15} />
                    My Orders
                    {currentCustomer && (
                      <span className="ml-auto text-xs text-primary font-bold">
                        {currentCustomer.name.split(" ")[0]}
                      </span>
                    )}
                  </Link>
                </>
              ) : (
                <Link
                  to="/customer/login"
                  data-ocid="mobile_menu.customer_login_link"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl font-semibold text-sm transition-smooth text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-2"
                >
                  Login to see orders
                </Link>
              )}

              {/* Sell on TBah — mobile */}
              <Link
                to="/seller/register"
                data-ocid="mobile_menu.sell_on_tbah_link"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl font-semibold text-sm transition-smooth text-accent hover:bg-accent/10 flex items-center gap-2"
              >
                <Store size={15} />
                Sell on TBah
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 bg-background pb-24 md:pb-0">{children}</main>

      {/* Mobile contact strip — visible above bottom nav, only on non-admin pages */}
      <div
        className="md:hidden fixed bottom-16 left-0 right-0 z-40 flex items-center justify-center gap-2 py-1.5 px-4"
        style={{
          background: "oklch(0.14 0.02 280 / 0.96)",
          borderTop: "1px solid oklch(0.28 0.015 280 / 0.5)",
        }}
      >
        <Mail size={11} className="text-primary shrink-0" />
        <p className="text-[10px] text-muted-foreground">
          Get help:{" "}
          <a
            href="mailto:atyashgupta2@gmail.com"
            className="text-primary hover:underline font-semibold"
            data-ocid="footer.contact_email_link"
          >
            atyashgupta2@gmail.com
          </a>
        </p>
      </div>

      {/* Bottom mobile nav — thumb-accessible, uses will-change + transform to prevent layout shifts */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border/60 shadow-[0_-4px_24px_rgba(0,0,0,0.4)]"
        style={{ transform: "translateZ(0)", willChange: "transform" }}
      >
        <div className="flex items-center justify-around h-16 px-2">
          {mobileNav.map(({ to, label, icon: Icon, exact }) => {
            const active = isActive(to, exact);
            return (
              <Link
                key={to}
                to={to}
                data-ocid={`bottom_nav.${label.toLowerCase()}_tab`}
                className="flex flex-col items-center gap-0.5 min-w-[60px] py-2 relative"
                aria-label={label}
              >
                <div className={cn("relative", active && "text-primary")}>
                  {to === "/cart" && itemCount > 0 ? (
                    <div className="relative">
                      <Icon
                        size={22}
                        className={
                          active ? "text-primary" : "text-muted-foreground"
                        }
                      />
                      <span className="absolute -top-1 -right-1.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-0.5">
                        {itemCount}
                      </span>
                    </div>
                  ) : (
                    <Icon
                      size={22}
                      className={
                        active ? "text-primary" : "text-muted-foreground"
                      }
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-bold tracking-wide",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <footer className="hidden md:block bg-card border-t border-border/60 mt-auto">
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="font-display font-black text-lg text-gradient-primary">
              TB<span className="text-foreground">ah</span>
            </span>
            <p className="text-muted-foreground text-sm text-center">
              © {new Date().getFullYear()}. Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 text-xs text-muted-foreground items-center">
              <span className="flex items-center gap-1">
                ⚡ Same Day Delivery
              </span>
              <span className="flex items-center gap-1">
                📦 Cash on Delivery
              </span>
              <Link
                to="/seller/register"
                data-ocid="footer.sell_on_tbah_link"
                className="flex items-center gap-1 text-accent hover:text-accent/80 transition-smooth"
              >
                <Store size={11} />
                Sell on TBah
              </Link>
              <a
                href="mailto:atyashgupta2@gmail.com"
                data-ocid="footer.contact_email_link"
                className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-smooth"
              >
                <Mail size={11} />
                Get Help
              </a>
            </div>
          </div>
          {/* Contact row */}
          <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Mail size={12} className="text-primary" />
            <span>Need help?</span>
            <a
              href="mailto:atyashgupta2@gmail.com"
              className="text-primary hover:underline font-semibold"
            >
              atyashgupta2@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
