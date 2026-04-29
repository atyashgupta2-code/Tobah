import { a as createLucideIcon, j as jsxRuntimeExports, S as Skeleton, i as Sparkles, b as useNavigate, d as ShoppingBag, r as reactExports, X } from "./index-BDCmUi92.js";
import { g as useListModelPhotos } from "./useProducts-Bh5lsULI.js";
import { m as motion } from "./proxy-BXt9ZINK.js";
import "./backend-DZh8k5AL.js";
import "./useMutation-CCDQEC_w.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
const Copy = createLucideIcon("copy", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode);
function getModelProductLinks() {
  try {
    const raw = localStorage.getItem("tbah_model_product_links");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function InstagramShareModal({
  photo,
  index,
  onClose
}) {
  const [copied, setCopied] = reactExports.useState(false);
  const siteUrl = window.location.origin;
  const caption = `Check out TBah — Bold fashion for Gen Z! Shop at ${siteUrl} #TBah #Fashion #GenZ #Style #OOTDInspiration`;
  function handleCopy() {
    navigator.clipboard.writeText(caption).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
    });
  }
  function handleOpenInstagram() {
    window.open("https://www.instagram.com", "_blank", "noopener,noreferrer");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0",
      style: { background: "rgba(0,0,0,0.72)" },
      onClick: (e) => {
        if (e.target === e.currentTarget) onClose();
      },
      onKeyDown: (e) => {
        if (e.key === "Escape") onClose();
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 40 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 40 },
          transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
          className: "relative w-full max-w-sm rounded-3xl overflow-hidden",
          style: {
            background: "oklch(0.16 0.02 280)",
            border: "1px solid oklch(0.32 0.015 280 / 0.5)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between px-5 py-4 border-b",
                style: { borderColor: "oklch(0.32 0.015 280 / 0.4)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                        style: {
                          background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                          boxShadow: "0 2px 12px rgba(220,39,67,0.4)"
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-black text-xs", children: "IG" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-black text-sm text-foreground leading-tight", children: "Share on Instagram" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Promote TBah to your followers" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: onClose,
                      "data-ocid": `models.instagram_modal.close_button.${index + 1}`,
                      className: "w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-muted/50",
                      "aria-label": "Close",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16, className: "text-muted-foreground" })
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-full rounded-2xl overflow-hidden",
                style: { aspectRatio: "3/2" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: photo.imageUrl,
                    alt: photo.caption ?? `Model ${index + 1}`,
                    className: "w-full h-full object-cover object-center",
                    loading: "lazy"
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2", children: "Ready-to-paste caption" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "rounded-xl p-3 text-xs text-foreground/90 leading-relaxed select-all",
                  style: {
                    background: "oklch(0.13 0.015 280)",
                    border: "1px solid oklch(0.32 0.015 280 / 0.4)",
                    fontFamily: "inherit"
                  },
                  children: caption
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleCopy,
                  "data-ocid": `models.instagram_modal.copy_button.${index + 1}`,
                  className: "mt-2.5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all duration-200 hover:opacity-90 active:scale-95",
                  style: {
                    background: copied ? "oklch(0.60 0.20 145 / 0.2)" : "oklch(0.32 0.015 280 / 0.5)",
                    border: copied ? "1px solid oklch(0.60 0.20 145 / 0.5)" : "1px solid oklch(0.40 0.015 280 / 0.4)",
                    color: copied ? "oklch(0.72 0.22 145)" : "oklch(0.80 0.01 280)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 13 }),
                    copied ? "Copied!" : "Copy Caption"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-3 pb-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleOpenInstagram,
                  "data-ocid": `models.instagram_modal.open_instagram_button.${index + 1}`,
                  className: "w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-black text-white transition-all duration-200 hover:opacity-90 active:scale-95",
                  style: {
                    background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                    boxShadow: "0 4px 20px rgba(220,39,67,0.3)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 15 }),
                    "Open Instagram"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground text-center mt-3 leading-relaxed px-2", children: "Save the image above, then open Instagram and paste this caption when posting to promote TBah." })
            ] })
          ]
        }
      )
    }
  );
}
function InstagramShareButton({
  photo,
  index
}) {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        },
        "data-ocid": `models.instagram_share_button.${index + 1}`,
        "aria-label": "Share on Instagram",
        className: "absolute bottom-3 right-3 z-20 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95",
        style: {
          background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
          boxShadow: "0 2px 12px rgba(220,39,67,0.5)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-black text-[11px] leading-none", children: "IG" })
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(
      InstagramShareModal,
      {
        photo,
        index,
        onClose: () => setOpen(false)
      }
    )
  ] });
}
function ModelCard({
  photo,
  index,
  linkedProductId
}) {
  const navigate = useNavigate();
  const hasProduct = Boolean(linkedProductId);
  function handleClick() {
    if (hasProduct && linkedProductId) {
      navigate({ to: "/product/$id", params: { id: linkedProductId } });
    }
  }
  const inner = /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 40 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-60px" },
      transition: {
        duration: 0.55,
        delay: Math.min(index * 0.08, 0.4),
        ease: [0.22, 1, 0.36, 1]
      },
      "data-ocid": `models.photo_card.${index + 1}`,
      onClick: hasProduct ? handleClick : void 0,
      className: "group relative w-full rounded-3xl overflow-hidden",
      style: {
        background: "oklch(0.18 0.015 280)",
        border: hasProduct ? "1px solid oklch(0.62 0.28 315 / 0.6)" : "1px solid oklch(0.32 0.015 280 / 0.5)",
        boxShadow: hasProduct ? "0 4px 32px oklch(0.62 0.28 315 / 0.12)" : "0 4px 24px oklch(0.62 0.28 315 / 0.06)",
        cursor: hasProduct ? "pointer" : "default",
        transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.transform = "scale(1.015)";
        e.currentTarget.style.boxShadow = hasProduct ? "0 0 0 2px oklch(0.62 0.28 315 / 0.9), 0 8px 40px oklch(0.62 0.28 315 / 0.3)" : "0 0 0 2px oklch(0.62 0.28 315 / 0.7), 0 8px 40px oklch(0.62 0.28 315 / 0.25)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = hasProduct ? "0 4px 32px oklch(0.62 0.28 315 / 0.12)" : "0 4px 24px oklch(0.62 0.28 315 / 0.06)";
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-[3/4] relative overflow-hidden w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: photo.imageUrl,
              alt: photo.caption ?? `Model ${index + 1}`,
              className: "w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105",
              loading: "lazy",
              width: 600,
              height: 800,
              onError: (e) => {
                e.currentTarget.style.display = "none";
              }
            }
          ),
          photo.caption && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out px-5 py-4 flex items-end",
              style: {
                background: "linear-gradient(to top, oklch(0.10 0.02 280 / 0.92) 0%, transparent 100%)",
                transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "font-display font-black text-base text-foreground leading-tight tracking-tight",
                  style: { textShadow: "0 2px 8px rgba(0,0,0,0.6)" },
                  children: photo.caption
                }
              )
            }
          ),
          hasProduct && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full",
              style: {
                background: "oklch(0.62 0.28 315 / 0.92)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 2px 12px oklch(0.62 0.28 315 / 0.4)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 12, color: "white", strokeWidth: 2.5 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-white tracking-wide", children: "View Product" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InstagramShareButton, { photo, index }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-x-0 bottom-0 h-32 pointer-events-none",
              style: {
                background: "linear-gradient(to top, oklch(0.10 0.02 280 / 0.55) 0%, transparent 100%)"
              }
            }
          )
        ] }),
        photo.caption && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "px-4 py-3 sm:hidden",
            style: { borderTop: "1px solid oklch(0.32 0.015 280 / 0.4)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground/80 leading-tight text-center", children: photo.caption })
          }
        ),
        hasProduct && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-4 py-2.5 flex items-center justify-center gap-2 sm:hidden",
            style: {
              borderTop: "1px solid oklch(0.62 0.28 315 / 0.3)",
              background: "oklch(0.62 0.28 315 / 0.08)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 12, style: { color: "oklch(0.62 0.28 315)" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-xs font-black",
                  style: { color: "oklch(0.62 0.28 315)" },
                  children: "Tap to view this product"
                }
              )
            ]
          }
        )
      ]
    },
    photo.id
  );
  return inner;
}
function EmptyState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      "data-ocid": "models.empty_state",
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.45 },
      className: "flex flex-col items-center justify-center py-20 text-center px-6",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-20 h-20 rounded-3xl flex items-center justify-center mb-5",
            style: {
              background: "linear-gradient(135deg, oklch(0.62 0.28 315 / 0.15), oklch(0.62 0.28 315 / 0.06))",
              border: "1px solid oklch(0.62 0.28 315 / 0.3)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 32, className: "text-primary" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-xl text-foreground mb-2 leading-tight", children: "Coming Soon" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs leading-relaxed", children: "Our model showcase is being set up — stunning looks featuring our latest collection will appear here soon." })
      ]
    }
  );
}
const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c"];
function SkeletonList() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-6", children: SKELETON_KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[3/4] w-full rounded-3xl" }) }, k)) });
}
function ModelsPage() {
  const { data: photos = [], isLoading } = useListModelPhotos();
  const productLinks = getModelProductLinks();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "models.page", className: "min-h-screen pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "px-4 pt-8 pb-6 border-b border-border/30",
        style: {
          background: "linear-gradient(180deg, oklch(0.18 0.02 315 / 0.5) 0%, oklch(0.14 0.01 280) 100%)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-screen-sm mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-1", children: "Style Gallery" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-4xl text-foreground leading-tight tracking-tight", children: "Our Models" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2", children: "Real styles. Real looks. Exclusively TBah." })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-6 pb-4 max-w-screen-sm mx-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonList, {}) : photos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-6", children: photos.map((photo, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      ModelCard,
      {
        photo,
        index: i,
        linkedProductId: productLinks[photo.id]
      },
      photo.id
    )) }) })
  ] });
}
export {
  ModelsPage as default
};
