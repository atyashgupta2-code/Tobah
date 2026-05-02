import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { createActor } from "../backend";
import type { Coupon } from "../backend.d";
import { OrderStatus } from "../backend.d";

// ─── Helpers ───────────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex items-start justify-between gap-4 py-3"
      style={{ borderBottom: "1px solid oklch(0.32 0.015 280 / 0.35)" }}
    >
      <span
        className="text-xs font-black uppercase tracking-widest shrink-0"
        style={{ color: "oklch(0.55 0.02 280)" }}
      >
        {label}
      </span>
      <span className="text-sm font-bold text-foreground text-right leading-snug">
        {value}
      </span>
    </div>
  );
}

// ─── Stat Box ──────────────────────────────────────────────────────────────────
function StatBox({
  value,
  label,
  accent,
}: {
  value: number | string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className="flex-1 rounded-xl px-4 py-4 flex flex-col items-center justify-center text-center"
      style={{
        background: accent
          ? "oklch(0.62 0.28 315 / 0.10)"
          : "oklch(0.60 0.20 145 / 0.08)",
        border: accent
          ? "1px solid oklch(0.62 0.28 315 / 0.35)"
          : "1px solid oklch(0.60 0.20 145 / 0.30)",
      }}
    >
      <p
        className="font-display font-black text-3xl leading-none mb-1"
        style={{
          color: accent ? "oklch(0.62 0.28 315)" : "oklch(0.72 0.22 145)",
        }}
      >
        {value}
      </p>
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-tight">
        {label}
      </p>
    </div>
  );
}

// ─── CouponCommissionPage ──────────────────────────────────────────────────────
export default function CouponCommissionPage() {
  const { actor, isFetching } = useActor(createActor);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkedCode, setCheckedCode] = useState<string | null>(null);

  // Fetch all orders to compute coupon usage stats
  const { data: allOrders = [] } = useQuery({
    queryKey: ["coupon-commission-orders", checkedCode],
    queryFn: async () => {
      if (!actor || !checkedCode) return [];
      const pairs = await actor.listOrders();
      return pairs.map(([, order]) => order);
    },
    enabled: !!actor && !isFetching && !!checkedCode,
    staleTime: 1000 * 60 * 2,
  });

  // Filter orders by this coupon code
  const couponOrders = checkedCode
    ? allOrders.filter(
        (o) => o.couponCode?.toUpperCase() === checkedCode.toUpperCase(),
      )
    : [];

  const successStatuses: OrderStatus[] = [
    OrderStatus.Delivered,
    OrderStatus.Accepted,
    OrderStatus.Confirmed,
    OrderStatus.Shipped,
  ];

  const successfulOrders = couponOrders.filter((o) =>
    successStatuses.includes(o.status),
  );

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !code.trim()) return;
    setLoading(true);
    setNotFound(false);
    setCoupon(null);
    setError(null);
    setCheckedCode(null);
    try {
      const result = await actor.getCoupon(code.trim().toUpperCase());
      if (result) {
        setCoupon(result);
        setCheckedCode(code.trim().toUpperCase());
      } else {
        setNotFound(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      data-ocid="coupon_commission.page"
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto"
      style={{ background: "oklch(0.10 0.02 280)" }}
    >
      {/* Header */}
      <header
        className="px-5 py-5 flex items-center gap-3 border-b"
        style={{
          background: "oklch(0.14 0.025 280)",
          borderColor: "oklch(0.22 0.015 280 / 0.6)",
          boxShadow: "0 1px 20px oklch(0.62 0.28 315 / 0.08)",
        }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.62 0.28 315), oklch(0.50 0.25 290))",
            boxShadow: "0 2px 10px oklch(0.62 0.28 315 / 0.4)",
          }}
        >
          <span className="font-display font-black text-white text-sm">T</span>
        </div>
        <div>
          <p className="font-display font-black text-sm text-foreground leading-tight">
            TBah
          </p>
          <p className="text-[10px] text-muted-foreground leading-tight">
            Coupon Commission Tracker
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          {/* Title */}
          <div className="text-center mb-8">
            <p
              className="text-[10px] font-black uppercase tracking-[0.22em] mb-2"
              style={{ color: "oklch(0.62 0.28 315)" }}
            >
              Partner Portal
            </p>
            <h1 className="font-display font-black text-3xl text-foreground leading-tight tracking-tight">
              Check Your Stats
            </h1>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Enter your coupon code to see how it's performing.
            </p>
          </div>

          {/* Search form */}
          <form onSubmit={handleCheck} className="mb-6">
            <div className="flex flex-col gap-3">
              <div>
                <label
                  htmlFor="coupon-code-input"
                  className="block text-xs font-black uppercase tracking-widest mb-2"
                  style={{ color: "oklch(0.55 0.02 280)" }}
                >
                  Your Coupon Code
                </label>
                <input
                  id="coupon-code-input"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. TBAH20"
                  data-ocid="coupon_commission.code_input"
                  autoCapitalize="characters"
                  autoComplete="off"
                  className="w-full rounded-xl px-4 py-3 text-sm font-bold text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all duration-200"
                  style={{
                    background: "oklch(0.17 0.02 280)",
                    border: "1px solid oklch(0.32 0.015 280 / 0.5)",
                    caretColor: "oklch(0.62 0.28 315)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor =
                      "oklch(0.62 0.28 315 / 0.7)";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px oklch(0.62 0.28 315 / 0.12)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      "oklch(0.32 0.015 280 / 0.5)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={!code.trim() || loading || isFetching}
                data-ocid="coupon_commission.check_button"
                className="w-full py-3 rounded-xl text-sm font-black text-white transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.62 0.28 315), oklch(0.50 0.25 290))",
                  boxShadow: "0 4px 20px oklch(0.62 0.28 315 / 0.25)",
                }}
              >
                {loading ? "Checking..." : "Check My Stats"}
              </button>
            </div>
          </form>

          {/* Error */}
          {error && (
            <div
              data-ocid="coupon_commission.error_state"
              className="rounded-xl px-4 py-3 mb-4 text-sm font-semibold text-center"
              style={{
                background: "oklch(0.55 0.22 25 / 0.12)",
                border: "1px solid oklch(0.55 0.22 25 / 0.35)",
                color: "oklch(0.75 0.18 25)",
              }}
            >
              {error}
            </div>
          )}

          {/* Not found */}
          {notFound && (
            <div
              data-ocid="coupon_commission.not_found_state"
              className="rounded-xl px-4 py-3 mb-4 text-sm font-semibold text-center"
              style={{
                background: "oklch(0.55 0.22 25 / 0.10)",
                border: "1px solid oklch(0.55 0.22 25 / 0.30)",
                color: "oklch(0.72 0.16 25)",
              }}
            >
              No coupon found with that code. Please check and try again.
            </div>
          )}

          {/* Coupon stats card */}
          {coupon && (
            <div
              data-ocid="coupon_commission.stats_card"
              className="rounded-2xl overflow-hidden mb-6"
              style={{
                background: "oklch(0.15 0.02 280)",
                border: "1px solid oklch(0.62 0.28 315 / 0.35)",
                boxShadow: "0 4px 32px oklch(0.62 0.28 315 / 0.08)",
              }}
            >
              {/* Card header */}
              <div
                className="px-5 py-4 flex items-center justify-between border-b"
                style={{
                  borderColor: "oklch(0.62 0.28 315 / 0.2)",
                  background: "oklch(0.62 0.28 315 / 0.06)",
                }}
              >
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">
                    Your Coupon
                  </p>
                  <p
                    className="font-display font-black text-2xl tracking-widest"
                    style={{ color: "oklch(0.62 0.28 315)" }}
                  >
                    {coupon.code}
                  </p>
                </div>
                <div
                  className="px-3 py-1.5 rounded-full text-xs font-black"
                  style={{
                    background: coupon.isActive
                      ? "oklch(0.60 0.20 145 / 0.15)"
                      : "oklch(0.55 0.22 25 / 0.12)",
                    border: coupon.isActive
                      ? "1px solid oklch(0.60 0.20 145 / 0.4)"
                      : "1px solid oklch(0.55 0.22 25 / 0.3)",
                    color: coupon.isActive
                      ? "oklch(0.72 0.22 145)"
                      : "oklch(0.72 0.16 25)",
                  }}
                >
                  {coupon.isActive ? "Active" : "Inactive"}
                </div>
              </div>

              {/* Info rows */}
              <div className="px-5">
                <InfoRow
                  label="Discount"
                  value={`${coupon.discountPercent.toString()}% off`}
                />
                {coupon.description && (
                  <InfoRow label="Description" value={coupon.description} />
                )}
              </div>

              {/* ─── Usage Stats ─────────────────────────────────── */}
              <div className="px-5 pb-5 pt-4">
                <p
                  className="text-[10px] font-black uppercase tracking-widest mb-3"
                  style={{ color: "oklch(0.75 0.20 85)" }}
                >
                  Usage Statistics
                </p>
                <div className="flex gap-3 mb-4">
                  <StatBox value={couponOrders.length} label="Total Orders" />
                  <StatBox
                    value={successfulOrders.length}
                    label="Successful Orders"
                    accent
                  />
                </div>

                {/* Successful orders breakdown */}
                <div
                  className="rounded-xl px-4 py-3 flex items-center justify-between"
                  style={{
                    background: "oklch(0.60 0.20 145 / 0.08)",
                    border: "1px solid oklch(0.60 0.20 145 / 0.25)",
                  }}
                >
                  <div>
                    <p
                      className="text-xs font-black"
                      style={{ color: "oklch(0.72 0.22 145)" }}
                    >
                      Successful orders through your code
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Accepted, Confirmed, Shipped or Delivered
                    </p>
                  </div>
                  <p
                    className="font-display font-black text-4xl ml-4"
                    style={{ color: "oklch(0.72 0.22 145)" }}
                  >
                    {successfulOrders.length}
                  </p>
                </div>
              </div>

              {/* Commission note */}
              <div
                className="mx-5 mb-5 rounded-xl px-4 py-3 flex items-start gap-3"
                style={{
                  background: "oklch(0.62 0.28 315 / 0.06)",
                  border: "1px solid oklch(0.62 0.28 315 / 0.2)",
                }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "oklch(0.62 0.28 315 / 0.2)" }}
                >
                  <span
                    className="text-[10px] font-black"
                    style={{ color: "oklch(0.62 0.28 315)" }}
                  >
                    i
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Commission earnings are calculated and paid out by TBah admin
                  based on verified successful orders. Contact admin for your
                  payout details.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="px-5 py-6 text-center border-t"
        style={{ borderColor: "oklch(0.22 0.015 280 / 0.4)" }}
      >
        <a
          href="/"
          data-ocid="coupon_commission.back_to_store_link"
          className="text-sm font-bold transition-opacity hover:opacity-70"
          style={{ color: "oklch(0.62 0.28 315)" }}
        >
          Back to TBah Store
        </a>
        <p className="text-[10px] text-muted-foreground mt-2">
          &copy; {new Date().getFullYear()} TBah. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
            style={{ color: "oklch(0.62 0.28 315)" }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
