import { j as jsxRuntimeExports, S as Skeleton, i as Sparkles, b as useNavigate, d as ShoppingBag } from "./index-D052jQ_k.js";
import { g as useListModelPhotos } from "./useProducts-DyZ_1eTC.js";
import { m as motion } from "./proxy-C33ykiGb.js";
import "./backend-DMNgBj4M.js";
import "./useMutation-DMQa2kFb.js";
function getModelProductLinks() {
  try {
    const raw = localStorage.getItem("tbah_model_product_links");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
