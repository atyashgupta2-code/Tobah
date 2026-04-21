import { a as createLucideIcon, j as jsxRuntimeExports, c as cn } from "./index-CVuXwThj.js";
import { C as Clock } from "./clock-DNJcM7Cg.js";
import { Z as Zap } from "./zap-BsATmOI3.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "20", height: "12", x: "2", y: "6", rx: "2", key: "9lu3g6" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
  ["path", { d: "M6 12h.01M18 12h.01", key: "113zkx" }]
];
const Banknote = createLucideIcon("banknote", __iconNode);
const uspConfig = {
  sameday: {
    label: "SAME DAY",
    icon: Zap,
    variant: "accent"
  },
  cod: {
    label: "CASH ON DELIVERY",
    icon: Banknote,
    variant: "muted"
  },
  nextday: {
    label: "NEXT DAY",
    icon: Clock,
    variant: "muted"
  }
};
function USPBadge({
  type,
  size = "sm",
  animated = false,
  className
}) {
  const config = uspConfig[type];
  const Icon = config.icon;
  const sizeClasses = size === "sm" ? "text-[10px] px-2 py-0.5 gap-1" : "text-xs px-3 py-1 gap-1.5";
  const iconSize = size === "sm" ? 10 : 12;
  const variantClasses = {
    accent: "bg-accent text-accent-foreground",
    primary: "bg-primary/20 text-primary border border-primary/30",
    muted: "bg-muted text-muted-foreground border border-border"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: cn(
        "inline-flex items-center font-bold uppercase tracking-wider rounded-full",
        sizeClasses,
        variantClasses[config.variant],
        animated && config.variant === "accent" && "animate-pulse-glow",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: iconSize, className: "shrink-0" }),
        config.label
      ]
    }
  );
}
export {
  Banknote as B,
  USPBadge as U
};
