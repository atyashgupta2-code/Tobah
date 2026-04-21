import { cn } from "@/lib/utils";
import { Banknote, Clock, Zap } from "lucide-react";

export type USPType = "sameday" | "cod" | "nextday";

interface USPBadgeProps {
  type: USPType;
  size?: "sm" | "md";
  animated?: boolean;
  className?: string;
}

const uspConfig: Record<
  USPType,
  {
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    variant: "accent" | "primary" | "muted";
  }
> = {
  sameday: {
    label: "SAME DAY",
    icon: Zap,
    variant: "accent",
  },
  cod: {
    label: "CASH ON DELIVERY",
    icon: Banknote,
    variant: "muted",
  },
  nextday: {
    label: "NEXT DAY",
    icon: Clock,
    variant: "muted",
  },
};

export function USPBadge({
  type,
  size = "sm",
  animated = false,
  className,
}: USPBadgeProps) {
  const config = uspConfig[type];
  const Icon = config.icon;

  const sizeClasses =
    size === "sm"
      ? "text-[10px] px-2 py-0.5 gap-1"
      : "text-xs px-3 py-1 gap-1.5";
  const iconSize = size === "sm" ? 10 : 12;

  const variantClasses: Record<string, string> = {
    accent: "bg-accent text-accent-foreground",
    primary: "bg-primary/20 text-primary border border-primary/30",
    muted: "bg-muted text-muted-foreground border border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-bold uppercase tracking-wider rounded-full",
        sizeClasses,
        variantClasses[config.variant],
        animated && config.variant === "accent" && "animate-pulse-glow",
        className,
      )}
    >
      <Icon size={iconSize} className="shrink-0" />
      {config.label}
    </span>
  );
}
