import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Package,
  Tag,
  Truck,
  X,
  Zap,
} from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { useCustomer } from "../contexts/CustomerContext";
import { useCart } from "../hooks/useCart";
import {
  useCreateOrder,
  useGetCoupon,
  useProduct,
  useProducts,
} from "../hooks/useProducts";
import { DeliveryOption, PaymentMethod } from "../types";
import type { CartItem } from "../types";

const DELIVERY_OPTIONS: {
  value: DeliveryOption;
  label: string;
  sub: string;
  icon: React.ReactNode;
  badge?: string;
}[] = [
  {
    value: DeliveryOption.SameDay,
    label: "Same-Day Delivery",
    sub: "Today by 8 PM",
    icon: <Zap size={16} className="text-accent" />,
    badge: "FASTEST",
  },
  {
    value: DeliveryOption.NextDay,
    label: "Next Day Delivery",
    sub: "Tomorrow by 8 PM",
    icon: <Truck size={16} className="text-primary" />,
  },
  {
    value: DeliveryOption.Standard,
    label: "Standard Delivery",
    sub: "3–5 Business Days",
    icon: <Package size={16} className="text-muted-foreground" />,
  },
];

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p
      data-ocid="checkout.field_error"
      className="flex items-center gap-1 text-destructive text-xs mt-1"
    >
      <AlertCircle size={11} />
      {msg}
    </p>
  );
}

interface FormValues {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Full name is required";
  if (!values.phone.trim()) errors.phone = "Phone number is required";
  else if (!/^\d{10}$/.test(values.phone.trim()))
    errors.phone = "Enter a valid 10-digit phone number";
  if (!values.address.trim()) errors.address = "Address is required";
  if (!values.city.trim()) errors.city = "City is required";
  if (!values.pincode.trim()) errors.pincode = "Pincode is required";
  else if (!/^\d{6}$/.test(values.pincode.trim()))
    errors.pincode = "Enter a valid 6-digit pincode";
  return errors;
}

function OrderLine({
  productId,
  quantity,
  selectedSize,
}: {
  productId: string;
  quantity: number;
  selectedSize: string;
}) {
  const { data: product } = useProduct(productId);
  if (!product) return null;
  const price = (Number(product.price) / 100) * quantity;
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="w-9 h-9 rounded-lg overflow-hidden bg-muted shrink-0">
        <img
          src={product.imageUrl || "/assets/generated/placeholder-product.jpg"}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground truncate text-xs">
          {product.name}
        </p>
        <p className="text-muted-foreground text-[10px]">
          Size: {selectedSize} · Qty: {quantity}
        </p>
      </div>
      <span className="font-bold text-primary text-sm shrink-0">
        ₹{price.toFixed(0)}
      </span>
    </div>
  );
}

// ─── Pricing Breakdown — receives computed values, no hooks ────────────────────
function PricingBreakdown({
  totalItems,
  subtotal,
  discountPercent,
  couponCode,
}: {
  totalItems: number;
  subtotal: number;
  discountPercent: number;
  couponCode: string;
}) {
  const discount = Math.ceil((subtotal * discountPercent) / 100);
  const amountPayable = Math.max(0, subtotal - discount);

  return (
    <div
      data-ocid="checkout.pricing_breakdown"
      className="border-t border-border pt-3 space-y-2"
    >
      <p className="text-[10px] font-black uppercase tracking-wide text-muted-foreground mb-2">
        Price Breakdown
      </p>

      {/* Original price */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">
          Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
        </span>
        <span className="text-muted-foreground line-through">
          ₹{subtotal.toFixed(0)}
        </span>
      </div>

      {/* Delivery */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">Delivery</span>
        <span className="text-accent font-semibold">FREE</span>
      </div>

      {/* Discount row */}
      <div className="flex justify-between items-center text-sm">
        <span
          className="flex items-center gap-1.5 font-bold"
          style={{ color: "oklch(0.65 0.18 150)" }}
        >
          <Tag size={12} />
          Coupon ({couponCode}) — {discountPercent}% off
        </span>
        <span className="font-black" style={{ color: "oklch(0.65 0.18 150)" }}>
          − ₹{discount.toFixed(0)}
        </span>
      </div>

      {/* Amount payable — highlighted */}
      <div className="border-t border-border/60 pt-2 mt-1 space-y-1.5">
        <div
          className="flex justify-between items-center px-3 py-2.5 rounded-xl"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.62 0.28 315 / 0.15), oklch(0.62 0.28 315 / 0.06))",
            border: "1px solid oklch(0.62 0.28 315 / 0.4)",
          }}
        >
          <span className="font-black text-sm text-foreground uppercase tracking-wide">
            Amount Payable
          </span>
          <span
            className="font-display font-black text-xl"
            style={{ color: "oklch(0.62 0.28 315)" }}
            data-ocid="checkout.amount_payable"
          >
            ₹{amountPayable.toFixed(0)}
          </span>
        </div>
        {discount > 0 && (
          <p
            className="text-[10px] text-center font-semibold"
            style={{ color: "oklch(0.65 0.18 150)" }}
          >
            🎉 You save ₹{discount.toFixed(0)} with this coupon!
          </p>
        )}
      </div>
    </div>
  );
}

export default function Checkout() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const createOrder = useCreateOrder();
  const getCoupon = useGetCoupon();
  const { login } = useCustomer();

  // Load all products to compute subtotal for pricing breakdown
  const { data: allProducts = [] } = useProducts();

  const [values, setValues] = useState<FormValues>({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormValues, boolean>>
  >({});
  const [delivery, setDelivery] = useState<DeliveryOption>(
    DeliveryOption.SameDay,
  );

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercent: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const payment = PaymentMethod.CashOnDelivery;

  // Build product price map from cached products
  const productPriceMap = useMemo<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    for (const p of allProducts) {
      map[p.id] = Number(p.price) / 100;
    }
    return map;
  }, [allProducts]);

  // Compute subtotal for pricing breakdown
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const unitPrice = productPriceMap[item.productId] ?? 0;
      return sum + unitPrice * item.quantity;
    }, 0);
  }, [items, productPriceMap]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  function handleChange(field: keyof FormValues, val: string) {
    setValues((v) => ({ ...v, [field]: val }));
    if (touched[field]) {
      const errs = validate({ ...values, [field]: val });
      setErrors((e) => ({ ...e, [field]: errs[field] }));
    }
  }

  function handleBlur(field: keyof FormValues) {
    setTouched((t) => ({ ...t, [field]: true }));
    const errs = validate(values);
    setErrors((e) => ({ ...e, [field]: errs[field] }));
  }

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setCouponError(null);
    try {
      const coupon = await getCoupon.mutateAsync(
        couponInput.trim().toUpperCase(),
      );
      if (!coupon || !coupon.isActive) {
        setCouponError("Invalid or expired coupon");
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon({
          code: coupon.code,
          discountPercent: Number(coupon.discountPercent),
        });
        setCouponError(null);
      }
    } catch {
      setCouponError("Invalid or expired coupon");
      setAppliedCoupon(null);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setTouched({
        name: true,
        phone: true,
        address: true,
        city: true,
        pincode: true,
      });
      return;
    }

    const address = `${values.name}, ${values.phone}, ${values.address}, ${values.city} - ${values.pincode}`;
    const cartItems: CartItem[] = items.map((i) => ({
      productId: i.productId,
      quantity: BigInt(i.quantity),
      selectedSize: i.selectedSize,
      deliveryOption: i.deliveryOption,
    }));

    try {
      const order = await createOrder.mutateAsync({
        items: cartItems,
        address,
        deliveryOption: delivery,
        paymentMethod: payment,
        customerName: values.name.trim(),
        customerPhone: values.phone.trim(),
        customerId: values.phone.trim(),
        couponCode: appliedCoupon?.code ?? null,
      });
      login(values.phone.trim(), values.name.trim());
      clearCart();
      navigate({ to: "/order/$id", params: { id: order.id } });
    } catch (_err) {
      // handled via createOrder.isError
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-screen-sm mx-auto px-4 py-16 text-center">
        <p className="font-display font-black text-xl text-foreground mb-2">
          Nothing to checkout
        </p>
        <p className="text-muted-foreground text-sm mb-6">
          Add items to your bag first.
        </p>
        <Link to="/shop">
          <Button>SHOP NOW</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-6">
      <h1 className="font-display font-black text-2xl text-foreground mb-6 uppercase tracking-tight">
        Checkout
      </h1>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Shipping Address */}
        <section
          data-ocid="checkout.shipping_section"
          className="bg-card rounded-2xl border border-border p-4 space-y-4"
        >
          <h2 className="font-display font-black text-sm uppercase tracking-widest text-foreground flex items-center gap-2">
            <Truck size={14} className="text-primary" />
            Delivery Address
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label
                htmlFor="name"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
              >
                Full Name
              </Label>
              <Input
                id="name"
                data-ocid="checkout.name_input"
                placeholder="Your full name"
                value={values.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                className="mt-1 bg-background border-border focus:border-primary"
              />
              <FieldError msg={errors.name} />
            </div>

            <div className="col-span-2">
              <Label
                htmlFor="phone"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
              >
                Phone Number
              </Label>
              <Input
                id="phone"
                data-ocid="checkout.phone_input"
                type="tel"
                placeholder="10-digit mobile number"
                value={values.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                className="mt-1 bg-background border-border focus:border-primary"
              />
              <FieldError msg={errors.phone} />
            </div>

            <div className="col-span-2">
              <Label
                htmlFor="address"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
              >
                Address Line
              </Label>
              <Input
                id="address"
                data-ocid="checkout.address_input"
                placeholder="Flat/House no., Street, Area"
                value={values.address}
                onChange={(e) => handleChange("address", e.target.value)}
                onBlur={() => handleBlur("address")}
                className="mt-1 bg-background border-border focus:border-primary"
              />
              <FieldError msg={errors.address} />
            </div>

            <div>
              <Label
                htmlFor="city"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
              >
                City
              </Label>
              <Input
                id="city"
                data-ocid="checkout.city_input"
                placeholder="City"
                value={values.city}
                onChange={(e) => handleChange("city", e.target.value)}
                onBlur={() => handleBlur("city")}
                className="mt-1 bg-background border-border focus:border-primary"
              />
              <FieldError msg={errors.city} />
            </div>

            <div>
              <Label
                htmlFor="pincode"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
              >
                Pincode
              </Label>
              <Input
                id="pincode"
                data-ocid="checkout.pincode_input"
                placeholder="6-digit pincode"
                value={values.pincode}
                onChange={(e) => handleChange("pincode", e.target.value)}
                onBlur={() => handleBlur("pincode")}
                className="mt-1 bg-background border-border focus:border-primary"
              />
              <FieldError msg={errors.pincode} />
            </div>
          </div>
        </section>

        {/* Delivery Option */}
        <section
          data-ocid="checkout.delivery_section"
          className="bg-card rounded-2xl border border-border p-4 space-y-3"
        >
          <h2 className="font-display font-black text-sm uppercase tracking-widest text-foreground flex items-center gap-2">
            <Package size={14} className="text-primary" />
            Delivery Option
          </h2>

          <div className="space-y-2">
            {DELIVERY_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                data-ocid={`checkout.delivery_option.${opt.value.toLowerCase()}`}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-smooth ${
                  delivery === opt.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-border/80 hover:bg-muted/30"
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  value={opt.value}
                  checked={delivery === opt.value}
                  onChange={() => setDelivery(opt.value)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    delivery === opt.value
                      ? "border-primary"
                      : "border-muted-foreground"
                  }`}
                >
                  {delivery === opt.value && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <span>{opt.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground">
                    {opt.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{opt.sub}</p>
                </div>
                {opt.badge && (
                  <span className="badge-usp text-[9px]">{opt.badge}</span>
                )}
              </label>
            ))}
          </div>
        </section>

        {/* Payment Method — COD only */}
        <section
          data-ocid="checkout.payment_section"
          className="bg-card rounded-2xl border border-border p-4 space-y-3"
        >
          <h2 className="font-display font-black text-sm uppercase tracking-widest text-foreground flex items-center gap-2">
            <span className="text-base leading-none">💵</span>
            Payment Method
          </h2>

          <div className="flex items-start gap-3 p-3 rounded-xl border border-primary bg-primary/5">
            <span className="text-xl shrink-0 mt-0.5">💵</span>
            <div>
              <p className="font-bold text-sm text-foreground">
                Cash on Delivery
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pay when the delivery agent arrives — no payment needed now.
              </p>
            </div>
          </div>
        </section>

        {/* Order Summary */}
        <section
          data-ocid="checkout.order_summary_section"
          className="bg-card rounded-2xl border border-border p-4 space-y-3"
        >
          <h2 className="font-display font-black text-sm uppercase tracking-widest text-foreground">
            Order Summary
          </h2>

          <div className="space-y-2">
            {items.map((item) => (
              <OrderLine
                key={`${item.productId}-${item.selectedSize}`}
                productId={item.productId}
                quantity={item.quantity}
                selectedSize={item.selectedSize}
              />
            ))}
          </div>

          {/* Coupon Code Input */}
          <div
            data-ocid="checkout.coupon_section"
            className="border-t border-border pt-3 space-y-2"
          >
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <Tag size={11} />
              Have a coupon code?
            </p>

            {appliedCoupon ? (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-accent/10 border border-accent/30">
                <CheckCircle2 size={16} className="text-accent shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-accent">
                    {appliedCoupon.code}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {appliedCoupon.discountPercent}% discount applied 🎉
                  </p>
                </div>
                <button
                  type="button"
                  data-ocid="checkout.coupon_remove_button"
                  onClick={handleRemoveCoupon}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-smooth"
                  aria-label="Remove coupon"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  data-ocid="checkout.coupon_input"
                  placeholder="Enter coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="bg-background border-border focus:border-primary font-mono text-sm uppercase"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleApplyCoupon();
                    }
                  }}
                />
                <Button
                  type="button"
                  data-ocid="checkout.coupon_apply_button"
                  variant="outline"
                  onClick={handleApplyCoupon}
                  disabled={getCoupon.isPending || !couponInput.trim()}
                  className="shrink-0 font-black text-xs uppercase tracking-wide border-primary/40 text-primary hover:bg-primary/10"
                >
                  {getCoupon.isPending ? (
                    <span className="w-3 h-3 border border-primary/30 border-t-primary rounded-full animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>
            )}

            {couponError && (
              <p
                data-ocid="checkout.coupon_error_state"
                className="flex items-center gap-1.5 text-destructive text-xs"
              >
                <AlertCircle size={11} />
                {couponError}
              </p>
            )}
          </div>

          {/* Pricing breakdown when coupon applied */}
          {appliedCoupon ? (
            <PricingBreakdown
              totalItems={totalItems}
              subtotal={subtotal}
              discountPercent={appliedCoupon.discountPercent}
              couponCode={appliedCoupon.code}
            />
          ) : (
            <div className="border-t border-border pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
                <span>Prices shown above</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span className="text-accent font-semibold">FREE</span>
              </div>
            </div>
          )}
        </section>

        {/* Error state */}
        {createOrder.isError && (
          <div
            data-ocid="checkout.error_state"
            className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center gap-2 text-destructive text-sm"
          >
            <AlertCircle size={14} />
            <span>Failed to place order. Please try again.</span>
          </div>
        )}

        {/* Place Order CTA */}
        <Button
          type="submit"
          data-ocid="checkout.submit_button"
          size="lg"
          disabled={createOrder.isPending}
          className="w-full bg-primary text-primary-foreground font-black text-base py-6 rounded-xl uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-smooth shadow-lg disabled:opacity-60 disabled:scale-100"
        >
          {createOrder.isPending ? (
            <span className="flex items-center gap-2">
              <span
                data-ocid="checkout.loading_state"
                className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"
              />
              PLACING ORDER...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              PLACE ORDER
              <ChevronRight size={18} />
            </span>
          )}
        </Button>

        <p className="text-center text-[10px] text-muted-foreground pb-4">
          🔒 Safe &amp; Secure · Cash on Delivery · Free Returns
        </p>
      </form>
    </div>
  );
}
