import { a as createLucideIcon, r as reactExports, j as jsxRuntimeExports, e as useParams, f as useRouter, b as useNavigate, u as useCart, D as DeliveryOption, S as Skeleton, c as cn, d as ShoppingBag } from "./index-CVuXwThj.js";
import { B as Badge } from "./badge-B48huT70.js";
import { B as Button } from "./button-Ts1_c3Ah.js";
import { u as ue } from "./index-0M-KuH2C.js";
import { U as USPBadge } from "./USPBadge-SPfBQePC.js";
import { a as useProduct } from "./useProducts-kP_jMEzd.js";
import { Z as Zap } from "./zap-BsATmOI3.js";
import { T as Truck } from "./truck-DMCpHHiL.js";
import { A as ArrowLeft } from "./arrow-left-CzFIKtPM.js";
import { C as ChevronRight } from "./chevron-right-CkjDMsCz.js";
import { M as MotionConfigContext, i as isHTMLElement, u as useConstant, P as PresenceContext, a as usePresence, b as useIsomorphicLayoutEffect, L as LayoutGroupContext, m as motion } from "./proxy-BgVQaqs9.js";
import { C as CircleCheck } from "./circle-check-DZyO2W5r.js";
import "./clock-DNJcM7Cg.js";
import "./backend-BoUXNShq.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode);
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
class PopChildMeasure extends reactExports.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (isHTMLElement(element) && prevProps.isPresent && !this.props.isPresent && this.props.pop !== false) {
      const parent = element.offsetParent;
      const parentWidth = isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
      const parentHeight = isHTMLElement(parent) ? parent.offsetHeight || 0 : 0;
      const computedStyle = getComputedStyle(element);
      const size = this.props.sizeRef.current;
      size.height = parseFloat(computedStyle.height);
      size.width = parseFloat(computedStyle.width);
      size.top = element.offsetTop;
      size.left = element.offsetLeft;
      size.right = parentWidth - size.width - size.left;
      size.bottom = parentHeight - size.height - size.top;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function PopChild({ children, isPresent, anchorX, anchorY, root, pop }) {
  var _a;
  const id = reactExports.useId();
  const ref = reactExports.useRef(null);
  const size = reactExports.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  });
  const { nonce } = reactExports.useContext(MotionConfigContext);
  const childRef = ((_a = children.props) == null ? void 0 : _a.ref) ?? (children == null ? void 0 : children.ref);
  const composedRef = useComposedRefs(ref, childRef);
  reactExports.useInsertionEffect(() => {
    const { width, height, top, left, right, bottom } = size.current;
    if (isPresent || pop === false || !ref.current || !width || !height)
      return;
    const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
    const y = anchorY === "bottom" ? `bottom: ${bottom}` : `top: ${top}`;
    ref.current.dataset.motionPopId = id;
    const style = document.createElement("style");
    if (nonce)
      style.nonce = nonce;
    const parent = root ?? document.head;
    parent.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            ${y}px !important;
          }
        `);
    }
    return () => {
      var _a2;
      (_a2 = ref.current) == null ? void 0 : _a2.removeAttribute("data-motion-pop-id");
      if (parent.contains(style)) {
        parent.removeChild(style);
      }
    };
  }, [isPresent]);
  return jsxRuntimeExports.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, pop, children: pop === false ? children : reactExports.cloneElement(children, { ref: composedRef }) });
}
const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, anchorY, root }) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id = reactExports.useId();
  let isReusedContext = true;
  let context = reactExports.useMemo(() => {
    isReusedContext = false;
    return {
      id,
      initial,
      isPresent,
      custom,
      onExitComplete: (childId) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
          if (!isComplete)
            return;
        }
        onExitComplete && onExitComplete();
      },
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    };
  }, [isPresent, presenceChildren, onExitComplete]);
  if (presenceAffectsLayout && isReusedContext) {
    context = { ...context };
  }
  reactExports.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  reactExports.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  children = jsxRuntimeExports.jsx(PopChild, { pop: mode === "popLayout", isPresent, anchorX, anchorY, root, children });
  return jsxRuntimeExports.jsx(PresenceContext.Provider, { value: context, children });
};
function newChildrenMap() {
  return /* @__PURE__ */ new Map();
}
const getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  reactExports.Children.forEach(children, (child) => {
    if (reactExports.isValidElement(child))
      filtered.push(child);
  });
  return filtered;
}
const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", anchorY = "top", root }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = reactExports.useMemo(() => onlyElements(children), [children]);
  const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = reactExports.useRef(true);
  const pendingPresentChildren = reactExports.useRef(presentChildren);
  const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
  const exitingComponents = reactExports.useRef(/* @__PURE__ */ new Set());
  const [diffedChildren, setDiffedChildren] = reactExports.useState(presentChildren);
  const [renderedChildren, setRenderedChildren] = reactExports.useState(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
        exitingComponents.current.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return null;
  }
  const { forceRender } = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
    const onExit = () => {
      if (exitingComponents.current.has(key)) {
        return;
      }
      if (exitComplete.has(key)) {
        exitingComponents.current.add(key);
        exitComplete.set(key, true);
      } else {
        return;
      }
      let isEveryExitComplete = true;
      exitComplete.forEach((isExitComplete) => {
        if (!isExitComplete)
          isEveryExitComplete = false;
      });
      if (isEveryExitComplete) {
        forceRender == null ? void 0 : forceRender();
        setRenderedChildren(pendingPresentChildren.current);
        propagate && (safeToRemove == null ? void 0 : safeToRemove());
        onExitComplete && onExitComplete();
      }
    };
    return jsxRuntimeExports.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, anchorY, children: child }, key);
  }) });
};
function formatINR(price) {
  return `₹${Number(price).toLocaleString("en-IN")}`;
}
function getDeliveryDate(option) {
  const now = /* @__PURE__ */ new Date();
  const days = option === DeliveryOption.SameDay ? 0 : option === DeliveryOption.NextDay ? 1 : 3;
  now.setDate(now.getDate() + days);
  if (days === 0) return "Today by 10 PM";
  return now.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}
function ProductDetail() {
  const { id } = useParams({ from: "/product/$id" });
  const router = useRouter();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id);
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = reactExports.useState("");
  const [selectedDelivery, setSelectedDelivery] = reactExports.useState(
    DeliveryOption.Standard
  );
  const [activeThumb, setActiveThumb] = reactExports.useState(0);
  const [addedToCart, setAddedToCart] = reactExports.useState(false);
  const thumbnails = reactExports.useMemo(() => {
    const img = (product == null ? void 0 : product.imageUrl) ?? "";
    return [img, img, img, img].slice(0, 4);
  }, [product == null ? void 0 : product.imageUrl]);
  reactExports.useEffect(() => {
    var _a;
    if (((_a = product == null ? void 0 : product.sizes) == null ? void 0 : _a.length) && !selectedSize) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product, selectedSize]);
  reactExports.useEffect(() => {
    if (product == null ? void 0 : product.hasSameDayDelivery) {
      setSelectedDelivery(DeliveryOption.SameDay);
    }
  }, [product]);
  function handleAddToCart() {
    if (!product || !selectedSize) return;
    addItem(product.id, selectedSize, selectedDelivery);
    setAddedToCart(true);
    ue.success(`${product.name} added to bag!`, {
      description: `Size ${selectedSize} · ${selectedDelivery}`
    });
    setTimeout(() => setAddedToCart(false), 2e3);
  }
  function handleBuyNow() {
    if (!product || !selectedSize) return;
    addItem(product.id, selectedSize, selectedDelivery);
    navigate({ to: "/checkout" });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "min-h-screen bg-background",
        "data-ocid": "product_detail.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full aspect-[4/5] bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full h-full" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-3/4 rounded-xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-1/3 rounded-xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-14 rounded-xl" }, i)) })
          ] })
        ]
      }
    );
  }
  if (!product) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "min-h-[60vh] flex flex-col items-center justify-center gap-4 p-8",
        "data-ocid": "product_detail.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl", children: "👀" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-black text-2xl text-center", children: "Product not found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => router.history.back(),
              "data-ocid": "product_detail.back_button",
              children: "Go back"
            }
          )
        ]
      }
    );
  }
  const stockCount = Number(product.stock);
  const isLowStock = stockCount > 0 && stockCount <= 5;
  const isOutOfStock = stockCount === 0;
  const orderCount = Number(product.orderCount ?? 0);
  const isTrending = orderCount >= 5;
  const deliveryOptions = [
    {
      option: DeliveryOption.SameDay,
      label: "Same Day",
      sublabel: getDeliveryDate(DeliveryOption.SameDay),
      available: product.hasSameDayDelivery,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 16, className: "text-accent shrink-0" })
    },
    {
      option: DeliveryOption.NextDay,
      label: "Next Day",
      sublabel: getDeliveryDate(DeliveryOption.NextDay),
      available: true,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 16, className: "text-muted-foreground shrink-0" })
    },
    {
      option: DeliveryOption.Standard,
      label: "Standard",
      sublabel: getDeliveryDate(DeliveryOption.Standard),
      available: true,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 16, className: "text-muted-foreground shrink-0" })
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background pb-40",
      "data-ocid": "product_detail.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-3 bg-card border-b border-border sticky top-0 z-20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => router.history.back(),
              className: "flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors",
              "aria-label": "Go back",
              "data-ocid": "product_detail.back_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 18 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14, className: "text-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground uppercase tracking-wider truncate max-w-[180px]", children: product.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14, className: "text-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground font-semibold truncate max-w-[120px]", children: product.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full aspect-[4/5] bg-card overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.img,
            {
              src: thumbnails[activeThumb] || "/assets/images/placeholder.svg",
              alt: product.name,
              className: "w-full h-full object-cover",
              initial: { opacity: 0, scale: 1.03 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: 0.35 }
            },
            activeThumb
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 pointer-events-none",
              style: {
                background: "linear-gradient(to top, oklch(0.14 0.01 280 / 0.85) 0%, transparent 55%)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 mb-2", children: [
              product.hasSameDayDelivery && /* @__PURE__ */ jsxRuntimeExports.jsx(USPBadge, { type: "sameday", animated: true, size: "sm" }),
              isTrending && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 bg-accent/20 text-accent text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 10 }),
                orderCount,
                " ordered"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-2xl text-foreground leading-tight uppercase", children: product.name })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 px-4 py-3 bg-card border-b border-border overflow-x-auto scrollbar-none", children: thumbnails.map((_thumb, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setActiveThumb(i),
            className: cn(
              "flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-smooth",
              activeThumb === i ? "border-primary" : "border-border opacity-60 hover:opacity-90"
            ),
            "data-ocid": `product_detail.thumbnail.${i + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: thumbnails[i] || "/assets/images/placeholder.svg",
                alt: `View ${i + 1}`,
                className: "w-full h-full object-cover",
                loading: "lazy"
              }
            )
          },
          `thumbnail-view-${i + 1}`
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-5 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-xl text-foreground uppercase leading-tight", children: product.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: "shrink-0 bg-secondary text-secondary-foreground uppercase text-[10px] tracking-wider font-bold",
                  children: product.category
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-display font-black text-3xl text-gradient-primary",
                  "data-ocid": "product_detail.price",
                  children: formatINR(product.price)
                }
              ),
              isOutOfStock ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-destructive text-xs font-bold uppercase tracking-wider",
                  "data-ocid": "product_detail.out_of_stock",
                  children: "Out of stock"
                }
              ) : isLowStock ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "text-accent text-xs font-bold uppercase tracking-wider",
                  "data-ocid": "product_detail.low_stock",
                  children: [
                    "Only ",
                    stockCount,
                    " left!"
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-muted-foreground text-xs uppercase tracking-wider",
                  "data-ocid": "product_detail.in_stock",
                  children: "In stock"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mt-2", children: [
              product.gender && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-secondary text-secondary-foreground uppercase tracking-wider", children: [
                "For: ",
                product.gender
              ] }),
              orderCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-primary/15 text-primary uppercase tracking-wider",
                  "data-ocid": "product_detail.order_count",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 11 }),
                    orderCount,
                    " ",
                    orderCount === 1 ? "order" : "orders"
                  ]
                }
              )
            ] })
          ] }),
          product.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: product.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", "data-ocid": "product_detail.quick_buy_row", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "flex-1 btn-accent font-display font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 h-12",
              disabled: isOutOfStock || !selectedSize,
              onClick: handleBuyNow,
              "data-ocid": "product_detail.quick_buy_now_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 16 }),
                isOutOfStock ? "Out of Stock" : !selectedSize ? "Pick a Size First" : `Buy Now · ${formatINR(product.price)}`
              ]
            }
          ) }),
          product.sizes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold uppercase tracking-widest text-foreground", children: "Select Size" }),
              selectedSize && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-primary font-semibold", children: [
                "Size ",
                selectedSize,
                " selected"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex flex-wrap gap-3",
                "data-ocid": "product_detail.size_selector",
                children: product.sizes.map((size) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setSelectedSize(size),
                    className: cn(
                      "min-w-[52px] h-12 px-3 rounded-xl border-2 font-bold text-base transition-smooth",
                      selectedSize === size ? "border-primary bg-primary/20 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    ),
                    "data-ocid": `product_detail.size_button.${size}`,
                    children: size
                  },
                  size
                ))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold uppercase tracking-widest text-foreground block mb-3", children: "Delivery Option" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "space-y-3",
                "data-ocid": "product_detail.delivery_selector",
                children: deliveryOptions.filter((d) => d.available).map(({ option, label, sublabel, icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "label",
                  {
                    className: cn(
                      "flex items-center gap-3 px-4 rounded-xl border-2 cursor-pointer transition-smooth min-h-[56px]",
                      selectedDelivery === option ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/40"
                    ),
                    "data-ocid": `product_detail.delivery_option.${option.toLowerCase()}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "radio",
                          name: "delivery",
                          value: option,
                          checked: selectedDelivery === option,
                          onChange: () => setSelectedDelivery(option),
                          className: "sr-only"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                            selectedDelivery === option ? "border-primary" : "border-muted-foreground"
                          ),
                          children: selectedDelivery === option && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-primary" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-1 min-w-0", children: [
                        icon,
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-base text-foreground", children: label }),
                        option === DeliveryOption.SameDay && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-accent/20 text-accent font-bold px-2 py-0.5 rounded-full uppercase", children: "Hot" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground shrink-0", children: sublabel })
                    ]
                  },
                  option
                ))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-muted/40 border border-border rounded-xl p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: "💵" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: "Cash on Delivery" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Pay when your order arrives — no prepayment needed" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-0 left-0 right-0 z-30 bg-card/95 border-t border-border px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 max-w-lg mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: cn(
                "flex-1 font-display font-black uppercase tracking-wider text-sm transition-smooth h-12",
                addedToCart ? "bg-green-600/80 text-foreground" : "btn-primary"
              ),
              disabled: isOutOfStock || !selectedSize,
              onClick: handleAddToCart,
              "data-ocid": "product_detail.add_to_cart_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: addedToCart ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.span,
                {
                  initial: { scale: 0.8, opacity: 0 },
                  animate: { scale: 1, opacity: 1 },
                  exit: { scale: 0.8, opacity: 0 },
                  className: "flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 16 }),
                    "Added!"
                  ]
                },
                "added"
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.span,
                {
                  initial: { scale: 0.8, opacity: 0 },
                  animate: { scale: 1, opacity: 1 },
                  exit: { scale: 0.8, opacity: 0 },
                  className: "flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 16 }),
                    isOutOfStock ? "Out of Stock" : !selectedSize ? "Pick a Size" : "Add to Bag"
                  ]
                },
                "add"
              ) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "flex-1 btn-accent font-display font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 h-12",
              disabled: isOutOfStock || !selectedSize,
              onClick: handleBuyNow,
              "data-ocid": "product_detail.buy_now_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 16 }),
                isOutOfStock ? "Out of Stock" : !selectedSize ? "Pick a Size" : "Buy Now"
              ]
            }
          )
        ] }) })
      ]
    }
  );
}
export {
  ProductDetail as default
};
