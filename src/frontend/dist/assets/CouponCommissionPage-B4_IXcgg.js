import { r as reactExports, O as OrderStatus, j as jsxRuntimeExports } from "./index-D052jQ_k.js";
import { u as useActor, a as useQuery, c as createActor } from "./backend-DMNgBj4M.js";
function InfoRow({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-start justify-between gap-4 py-3",
      style: { borderBottom: "1px solid oklch(0.32 0.015 280 / 0.35)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-xs font-black uppercase tracking-widest shrink-0",
            style: { color: "oklch(0.55 0.02 280)" },
            children: label
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-foreground text-right leading-snug", children: value })
      ]
    }
  );
}
function StatBox({
  value,
  label,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex-1 rounded-xl px-4 py-4 flex flex-col items-center justify-center text-center",
      style: {
        background: accent ? "oklch(0.62 0.28 315 / 0.10)" : "oklch(0.60 0.20 145 / 0.08)",
        border: accent ? "1px solid oklch(0.62 0.28 315 / 0.35)" : "1px solid oklch(0.60 0.20 145 / 0.30)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "font-display font-black text-3xl leading-none mb-1",
            style: {
              color: accent ? "oklch(0.62 0.28 315)" : "oklch(0.72 0.22 145)"
            },
            children: value
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-tight", children: label })
      ]
    }
  );
}
function CouponCommissionPage() {
  const { actor, isFetching } = useActor(createActor);
  const [code, setCode] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [coupon, setCoupon] = reactExports.useState(null);
  const [notFound, setNotFound] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [checkedCode, setCheckedCode] = reactExports.useState(null);
  const { data: allOrders = [] } = useQuery({
    queryKey: ["coupon-commission-orders", checkedCode],
    queryFn: async () => {
      if (!actor || !checkedCode) return [];
      const pairs = await actor.listOrders();
      return pairs.map(([, order]) => order);
    },
    enabled: !!actor && !isFetching && !!checkedCode,
    staleTime: 1e3 * 60 * 2
  });
  const couponOrders = checkedCode ? allOrders.filter(
    (o) => {
      var _a;
      return ((_a = o.couponCode) == null ? void 0 : _a.toUpperCase()) === checkedCode.toUpperCase();
    }
  ) : [];
  const successStatuses = [
    OrderStatus.Delivered,
    OrderStatus.Accepted,
    OrderStatus.Confirmed,
    OrderStatus.Shipped
  ];
  const successfulOrders = couponOrders.filter(
    (o) => successStatuses.includes(o.status)
  );
  async function handleCheck(e) {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "coupon_commission.page",
      className: "fixed inset-0 z-50 flex flex-col overflow-y-auto",
      style: { background: "oklch(0.10 0.02 280)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "header",
          {
            className: "px-5 py-5 flex items-center gap-3 border-b",
            style: {
              background: "oklch(0.14 0.025 280)",
              borderColor: "oklch(0.22 0.015 280 / 0.6)",
              boxShadow: "0 1px 20px oklch(0.62 0.28 315 / 0.08)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                  style: {
                    background: "linear-gradient(135deg, oklch(0.62 0.28 315), oklch(0.50 0.25 290))",
                    boxShadow: "0 2px 10px oklch(0.62 0.28 315 / 0.4)"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-black text-white text-sm", children: "T" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-black text-sm text-foreground leading-tight", children: "TBah" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground leading-tight", children: "Coupon Commission Tracker" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 flex flex-col items-center justify-center px-5 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-[10px] font-black uppercase tracking-[0.22em] mb-2",
                style: { color: "oklch(0.62 0.28 315)" },
                children: "Partner Portal"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-3xl text-foreground leading-tight tracking-tight", children: "Check Your Stats" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2 leading-relaxed", children: "Enter your coupon code to see how it's performing." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("form", { onSubmit: handleCheck, className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "coupon-code-input",
                  className: "block text-xs font-black uppercase tracking-widest mb-2",
                  style: { color: "oklch(0.55 0.02 280)" },
                  children: "Your Coupon Code"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "coupon-code-input",
                  type: "text",
                  value: code,
                  onChange: (e) => setCode(e.target.value.toUpperCase()),
                  placeholder: "e.g. TBAH20",
                  "data-ocid": "coupon_commission.code_input",
                  autoCapitalize: "characters",
                  autoComplete: "off",
                  className: "w-full rounded-xl px-4 py-3 text-sm font-bold text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all duration-200",
                  style: {
                    background: "oklch(0.17 0.02 280)",
                    border: "1px solid oklch(0.32 0.015 280 / 0.5)",
                    caretColor: "oklch(0.62 0.28 315)"
                  },
                  onFocus: (e) => {
                    e.currentTarget.style.borderColor = "oklch(0.62 0.28 315 / 0.7)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px oklch(0.62 0.28 315 / 0.12)";
                  },
                  onBlur: (e) => {
                    e.currentTarget.style.borderColor = "oklch(0.32 0.015 280 / 0.5)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "submit",
                disabled: !code.trim() || loading || isFetching,
                "data-ocid": "coupon_commission.check_button",
                className: "w-full py-3 rounded-xl text-sm font-black text-white transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed",
                style: {
                  background: "linear-gradient(135deg, oklch(0.62 0.28 315), oklch(0.50 0.25 290))",
                  boxShadow: "0 4px 20px oklch(0.62 0.28 315 / 0.25)"
                },
                children: loading ? "Checking..." : "Check My Stats"
              }
            )
          ] }) }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "coupon_commission.error_state",
              className: "rounded-xl px-4 py-3 mb-4 text-sm font-semibold text-center",
              style: {
                background: "oklch(0.55 0.22 25 / 0.12)",
                border: "1px solid oklch(0.55 0.22 25 / 0.35)",
                color: "oklch(0.75 0.18 25)"
              },
              children: error
            }
          ),
          notFound && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "coupon_commission.not_found_state",
              className: "rounded-xl px-4 py-3 mb-4 text-sm font-semibold text-center",
              style: {
                background: "oklch(0.55 0.22 25 / 0.10)",
                border: "1px solid oklch(0.55 0.22 25 / 0.30)",
                color: "oklch(0.72 0.16 25)"
              },
              children: "No coupon found with that code. Please check and try again."
            }
          ),
          coupon && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "coupon_commission.stats_card",
              className: "rounded-2xl overflow-hidden mb-6",
              style: {
                background: "oklch(0.15 0.02 280)",
                border: "1px solid oklch(0.62 0.28 315 / 0.35)",
                boxShadow: "0 4px 32px oklch(0.62 0.28 315 / 0.08)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "px-5 py-4 flex items-center justify-between border-b",
                    style: {
                      borderColor: "oklch(0.62 0.28 315 / 0.2)",
                      background: "oklch(0.62 0.28 315 / 0.06)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5", children: "Your Coupon" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "font-display font-black text-2xl tracking-widest",
                            style: { color: "oklch(0.62 0.28 315)" },
                            children: coupon.code
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "px-3 py-1.5 rounded-full text-xs font-black",
                          style: {
                            background: coupon.isActive ? "oklch(0.60 0.20 145 / 0.15)" : "oklch(0.55 0.22 25 / 0.12)",
                            border: coupon.isActive ? "1px solid oklch(0.60 0.20 145 / 0.4)" : "1px solid oklch(0.55 0.22 25 / 0.3)",
                            color: coupon.isActive ? "oklch(0.72 0.22 145)" : "oklch(0.72 0.16 25)"
                          },
                          children: coupon.isActive ? "Active" : "Inactive"
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    InfoRow,
                    {
                      label: "Discount",
                      value: `${coupon.discountPercent.toString()}% off`
                    }
                  ),
                  coupon.description && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Description", value: coupon.description })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-5 pt-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-[10px] font-black uppercase tracking-widest mb-3",
                      style: { color: "oklch(0.75 0.20 85)" },
                      children: "Usage Statistics"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(StatBox, { value: couponOrders.length, label: "Total Orders" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      StatBox,
                      {
                        value: successfulOrders.length,
                        label: "Successful Orders",
                        accent: true
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "rounded-xl px-4 py-3 flex items-center justify-between",
                      style: {
                        background: "oklch(0.60 0.20 145 / 0.08)",
                        border: "1px solid oklch(0.60 0.20 145 / 0.25)"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "p",
                            {
                              className: "text-xs font-black",
                              style: { color: "oklch(0.72 0.22 145)" },
                              children: "Successful orders through your code"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: "Accepted, Confirmed, Shipped or Delivered" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "font-display font-black text-4xl ml-4",
                            style: { color: "oklch(0.72 0.22 145)" },
                            children: successfulOrders.length
                          }
                        )
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "mx-5 mb-5 rounded-xl px-4 py-3 flex items-start gap-3",
                    style: {
                      background: "oklch(0.62 0.28 315 / 0.06)",
                      border: "1px solid oklch(0.62 0.28 315 / 0.2)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                          style: { background: "oklch(0.62 0.28 315 / 0.2)" },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "text-[10px] font-black",
                              style: { color: "oklch(0.62 0.28 315)" },
                              children: "i"
                            }
                          )
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Commission earnings are calculated and paid out by TBah admin based on verified successful orders. Contact admin for your payout details." })
                    ]
                  }
                )
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "footer",
          {
            className: "px-5 py-6 text-center border-t",
            style: { borderColor: "oklch(0.22 0.015 280 / 0.4)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: "/",
                  "data-ocid": "coupon_commission.back_to_store_link",
                  className: "text-sm font-bold transition-opacity hover:opacity-70",
                  style: { color: "oklch(0.62 0.28 315)" },
                  children: "Back to TBah Store"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground mt-2", children: [
                "© ",
                (/* @__PURE__ */ new Date()).getFullYear(),
                " TBah. Built with love using",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                      typeof window !== "undefined" ? window.location.hostname : ""
                    )}`,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "hover:opacity-70 transition-opacity",
                    style: { color: "oklch(0.62 0.28 315)" },
                    children: "caffeine.ai"
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}
export {
  CouponCommissionPage as default
};
