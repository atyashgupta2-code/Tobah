import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, Zap } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useProduct } from "../hooks/useProducts";
import { DeliveryOption } from "../types";

function DeliveryBadge({ option }: { option: DeliveryOption }) {
  if (option === DeliveryOption.SameDay) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30 uppercase tracking-wide">
        <Zap size={9} className="fill-accent" />
        Same Day
      </span>
    );
  }
  if (option === DeliveryOption.NextDay) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 uppercase tracking-wide">
        Next Day
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border uppercase tracking-wide">
      Standard
    </span>
  );
}

interface CartRowProps {
  productId: string;
  quantity: number;
  selectedSize: string;
  deliveryOption: DeliveryOption;
  index: number;
  onRemove: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}

function CartRow({
  productId,
  quantity,
  selectedSize,
  deliveryOption,
  index,
  onRemove,
  onIncrease,
  onDecrease,
}: CartRowProps) {
  const { data: product, isLoading } = useProduct(productId);

  if (isLoading) {
    return (
      <div className="flex gap-3 p-3 bg-card rounded-2xl border border-border">
        <Skeleton className="w-24 h-24 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2 py-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>
    );
  }

  if (!product) return null;

  const price = Number(product.price) / 100;
  const itemTotal = price * quantity;

  return (
    <div
      data-ocid={`cart.item.${index + 1}`}
      className="flex gap-3 p-3 bg-card rounded-2xl border border-border hover:border-primary/30 transition-smooth"
    >
      {/* Image */}
      <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-muted">
        <img
          src={product.imageUrl || "/assets/generated/placeholder-product.jpg"}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-1">
        <div>
          <p className="font-display font-bold text-sm text-foreground line-clamp-2 leading-tight">
            {product.name}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 font-semibold"
            >
              SIZE: {selectedSize}
            </Badge>
            <DeliveryBadge option={deliveryOption} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          {/* Qty controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onDecrease}
              data-ocid={`cart.decrease_button.${index + 1}`}
              className="w-7 h-7 rounded-lg bg-muted hover:bg-secondary border border-border flex items-center justify-center transition-smooth active:scale-95"
              aria-label="Decrease quantity"
            >
              <Minus size={12} />
            </button>
            <span className="w-8 text-center text-sm font-bold text-foreground tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={onIncrease}
              data-ocid={`cart.increase_button.${index + 1}`}
              className="w-7 h-7 rounded-lg bg-muted hover:bg-secondary border border-border flex items-center justify-center transition-smooth active:scale-95"
              aria-label="Increase quantity"
            >
              <Plus size={12} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-display font-black text-primary text-base">
              ₹{itemTotal.toFixed(0)}
            </span>
            <button
              type="button"
              onClick={onRemove}
              data-ocid={`cart.delete_button.${index + 1}`}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
              aria-label="Remove item"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartSummary({
  items,
}: {
  items: Array<{
    productId: string;
    quantity: number;
    selectedSize: string;
    deliveryOption: DeliveryOption;
  }>;
}) {
  return (
    <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
      <h2 className="font-display font-black text-base text-foreground uppercase tracking-wide">
        Order Summary
      </h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>
            {items.reduce((s, i) => s + i.quantity, 0)} item
            {items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}
          </span>
          <span className="italic text-xs">Prices shown per item above</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Delivery</span>
          <span className="text-accent font-semibold">FREE</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Payment</span>
          <span className="font-semibold text-foreground">
            Cash on Delivery
          </span>
        </div>
      </div>

      <div className="border-t border-border pt-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Pay on delivery
          </p>
          <p className="text-[10px] text-muted-foreground">
            No payment needed now
          </p>
        </div>
        <span className="badge-usp">COD</span>
      </div>

      <Link to="/checkout" data-ocid="cart.checkout_button" className="block">
        <Button
          size="lg"
          className="w-full bg-primary text-primary-foreground font-black text-base py-6 rounded-xl uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-smooth shadow-lg"
        >
          PROCEED TO CHECKOUT →
        </Button>
      </Link>

      <p className="text-center text-[10px] text-muted-foreground">
        🔒 Secure checkout · Pay when agent arrives
      </p>
    </div>
  );
}

export default function Cart() {
  const { items, removeItem, updateQuantity } = useCart();

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display font-black text-2xl text-foreground">
          MY BAG
          {items.length > 0 && (
            <span className="ml-2 text-primary text-xl">({items.length})</span>
          )}
        </h1>
        <Link
          to="/shop"
          data-ocid="cart.continue_shopping_link"
          className="text-xs font-semibold text-muted-foreground hover:text-primary transition-smooth"
        >
          Continue Shopping →
        </Link>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div
          data-ocid="cart.empty_state"
          className="flex flex-col items-center justify-center py-20 text-center gap-4"
        >
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag size={36} className="text-muted-foreground" />
          </div>
          <div>
            <p className="font-display font-black text-xl text-foreground">
              Your bag is empty
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              Add some fire fits to get started
            </p>
          </div>
          <Link to="/shop" data-ocid="cart.shop_link">
            <Button className="mt-2" size="lg">
              SHOP NOW
            </Button>
          </Link>
        </div>
      )}

      {/* Items + Summary */}
      {items.length > 0 && (
        <>
          <div className="space-y-3">
            {items.map((item, i) => (
              <CartRow
                key={`${item.productId}-${item.selectedSize}`}
                productId={item.productId}
                quantity={item.quantity}
                selectedSize={item.selectedSize}
                deliveryOption={item.deliveryOption}
                index={i}
                onRemove={() => removeItem(item.productId, item.selectedSize)}
                onIncrease={() =>
                  updateQuantity(
                    item.productId,
                    item.selectedSize,
                    item.quantity + 1,
                  )
                }
                onDecrease={() =>
                  updateQuantity(
                    item.productId,
                    item.selectedSize,
                    item.quantity - 1,
                  )
                }
              />
            ))}
          </div>

          <CartSummary items={items} />
        </>
      )}
    </div>
  );
}
