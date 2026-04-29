import { u as useCart, b as useNavigate, g as useCustomer, r as reactExports, D as DeliveryOption, P as PaymentMethod, j as jsxRuntimeExports, L as Link, h as Package, X } from "./index-BDCmUi92.js";
import { B as Button } from "./button-CZHlOgul.js";
import { L as Label, I as Input } from "./label-B_0H94iZ.js";
import { b as useCreateOrder, c as useGetCoupon, u as useProducts, a as useProduct } from "./useProducts-Bh5lsULI.js";
import { T as Truck } from "./truck-Uf165eFb.js";
import { T as Tag } from "./tag-Ce5rJDM2.js";
import { C as CircleCheck } from "./circle-check-CH6FQYTB.js";
import { C as CircleAlert } from "./circle-alert-DQ5SAC2H.js";
import { C as ChevronRight } from "./chevron-right-DUtMeJ32.js";
import { Z as Zap } from "./zap-Dd4_jfuv.js";
import "./backend-DZh8k5AL.js";
import "./useMutation-CCDQEC_w.js";
const DELIVERY_OPTIONS = [
  {
    value: DeliveryOption.SameDay,
    label: "Same-Day Delivery",
    sub: "Today by 8 PM",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 16, className: "text-accent" }),
    badge: "FASTEST"
  },
  {
    value: DeliveryOption.NextDay,
    label: "Next Day Delivery",
    sub: "Tomorrow by 8 PM",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 16, className: "text-primary" })
  },
  {
    value: DeliveryOption.Standard,
    label: "Standard Delivery",
    sub: "3–5 Business Days",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 16, className: "text-muted-foreground" })
  }
];
function FieldError({ msg }) {
  if (!msg) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "p",
    {
      "data-ocid": "checkout.field_error",
      className: "flex items-center gap-1 text-destructive text-xs mt-1",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 11 }),
        msg
      ]
    }
  );
}
function validate(values) {
  const errors = {};
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
  selectedSize
}) {
  const { data: product } = useProduct(productId);
  if (!product) return null;
  const price = Number(product.price) / 100 * quantity;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg overflow-hidden bg-muted shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: product.imageUrl || "/assets/generated/placeholder-product.jpg",
        alt: product.name,
        className: "w-full h-full object-cover",
        loading: "lazy",
        onError: (e) => {
          e.currentTarget.style.display = "none";
        }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground truncate text-xs", children: product.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-[10px]", children: [
        "Size: ",
        selectedSize,
        " · Qty: ",
        quantity
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-primary text-sm shrink-0", children: [
      "₹",
      price.toFixed(0)
    ] })
  ] });
}
function PricingBreakdown({
  totalItems,
  subtotal,
  discountPercent,
  couponCode
}) {
  const discount = Math.ceil(subtotal * discountPercent / 100);
  const amountPayable = Math.max(0, subtotal - discount);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "checkout.pricing_breakdown",
      className: "border-t border-border pt-3 space-y-2",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black uppercase tracking-wide text-muted-foreground mb-2", children: "Price Breakdown" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            "Subtotal (",
            totalItems,
            " ",
            totalItems === 1 ? "item" : "items",
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground line-through", children: [
            "₹",
            subtotal.toFixed(0)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Delivery" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-semibold", children: "FREE" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "flex items-center gap-1.5 font-bold",
              style: { color: "oklch(0.65 0.18 150)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 12 }),
                "Coupon (",
                couponCode,
                ") — ",
                discountPercent,
                "% off"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-black", style: { color: "oklch(0.65 0.18 150)" }, children: [
            "− ₹",
            discount.toFixed(0)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/60 pt-2 mt-1 space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex justify-between items-center px-3 py-2.5 rounded-xl",
              style: {
                background: "linear-gradient(135deg, oklch(0.62 0.28 315 / 0.15), oklch(0.62 0.28 315 / 0.06))",
                border: "1px solid oklch(0.62 0.28 315 / 0.4)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black text-sm text-foreground uppercase tracking-wide", children: "Amount Payable" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "font-display font-black text-xl",
                    style: { color: "oklch(0.62 0.28 315)" },
                    "data-ocid": "checkout.amount_payable",
                    children: [
                      "₹",
                      amountPayable.toFixed(0)
                    ]
                  }
                )
              ]
            }
          ),
          discount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-[10px] text-center font-semibold",
              style: { color: "oklch(0.65 0.18 150)" },
              children: [
                "🎉 You save ₹",
                discount.toFixed(0),
                " with this coupon!"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function Checkout() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const createOrder = useCreateOrder();
  const getCoupon = useGetCoupon();
  const { login } = useCustomer();
  const { data: allProducts = [] } = useProducts();
  const [values, setValues] = reactExports.useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });
  const [errors, setErrors] = reactExports.useState({});
  const [touched, setTouched] = reactExports.useState({});
  const [delivery, setDelivery] = reactExports.useState(
    DeliveryOption.SameDay
  );
  const [couponInput, setCouponInput] = reactExports.useState("");
  const [appliedCoupon, setAppliedCoupon] = reactExports.useState(null);
  const [couponError, setCouponError] = reactExports.useState(null);
  const payment = PaymentMethod.CashOnDelivery;
  const productPriceMap = reactExports.useMemo(() => {
    const map = {};
    for (const p of allProducts) {
      map[p.id] = Number(p.price) / 100;
    }
    return map;
  }, [allProducts]);
  const subtotal = reactExports.useMemo(() => {
    return items.reduce((sum, item) => {
      const unitPrice = productPriceMap[item.productId] ?? 0;
      return sum + unitPrice * item.quantity;
    }, 0);
  }, [items, productPriceMap]);
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  function handleChange(field, val) {
    setValues((v) => ({ ...v, [field]: val }));
    if (touched[field]) {
      const errs = validate({ ...values, [field]: val });
      setErrors((e) => ({ ...e, [field]: errs[field] }));
    }
  }
  function handleBlur(field) {
    setTouched((t) => ({ ...t, [field]: true }));
    const errs = validate(values);
    setErrors((e) => ({ ...e, [field]: errs[field] }));
  }
  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setCouponError(null);
    try {
      const coupon = await getCoupon.mutateAsync(
        couponInput.trim().toUpperCase()
      );
      if (!coupon || !coupon.isActive) {
        setCouponError("Invalid or expired coupon");
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon({
          code: coupon.code,
          discountPercent: Number(coupon.discountPercent)
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
  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setTouched({
        name: true,
        phone: true,
        address: true,
        city: true,
        pincode: true
      });
      return;
    }
    const address = `${values.name}, ${values.phone}, ${values.address}, ${values.city} - ${values.pincode}`;
    const cartItems = items.map((i) => ({
      productId: i.productId,
      quantity: BigInt(i.quantity),
      selectedSize: i.selectedSize,
      deliveryOption: i.deliveryOption
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
        couponCode: (appliedCoupon == null ? void 0 : appliedCoupon.code) ?? null
      });
      login(values.phone.trim(), values.name.trim());
      clearCart();
      navigate({ to: "/order/$id", params: { id: order.id } });
    } catch (_err) {
    }
  }
  if (items.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-screen-sm mx-auto px-4 py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-black text-xl text-foreground mb-2", children: "Nothing to checkout" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "Add items to your bag first." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "SHOP NOW" }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-screen-sm mx-auto px-4 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-2xl text-foreground mb-6 uppercase tracking-tight", children: "Checkout" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, noValidate: true, className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "section",
        {
          "data-ocid": "checkout.shipping_section",
          className: "bg-card rounded-2xl border border-border p-4 space-y-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-black text-sm uppercase tracking-widest text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 14, className: "text-primary" }),
              "Delivery Address"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "name",
                    className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
                    children: "Full Name"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "name",
                    "data-ocid": "checkout.name_input",
                    placeholder: "Your full name",
                    value: values.name,
                    onChange: (e) => handleChange("name", e.target.value),
                    onBlur: () => handleBlur("name"),
                    className: "mt-1 bg-background border-border focus:border-primary"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { msg: errors.name })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "phone",
                    className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
                    children: "Phone Number"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "phone",
                    "data-ocid": "checkout.phone_input",
                    type: "tel",
                    placeholder: "10-digit mobile number",
                    value: values.phone,
                    onChange: (e) => handleChange("phone", e.target.value),
                    onBlur: () => handleBlur("phone"),
                    className: "mt-1 bg-background border-border focus:border-primary"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { msg: errors.phone })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "address",
                    className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
                    children: "Address Line"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "address",
                    "data-ocid": "checkout.address_input",
                    placeholder: "Flat/House no., Street, Area",
                    value: values.address,
                    onChange: (e) => handleChange("address", e.target.value),
                    onBlur: () => handleBlur("address"),
                    className: "mt-1 bg-background border-border focus:border-primary"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { msg: errors.address })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "city",
                    className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
                    children: "City"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "city",
                    "data-ocid": "checkout.city_input",
                    placeholder: "City",
                    value: values.city,
                    onChange: (e) => handleChange("city", e.target.value),
                    onBlur: () => handleBlur("city"),
                    className: "mt-1 bg-background border-border focus:border-primary"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { msg: errors.city })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "pincode",
                    className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
                    children: "Pincode"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "pincode",
                    "data-ocid": "checkout.pincode_input",
                    placeholder: "6-digit pincode",
                    value: values.pincode,
                    onChange: (e) => handleChange("pincode", e.target.value),
                    onBlur: () => handleBlur("pincode"),
                    className: "mt-1 bg-background border-border focus:border-primary"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { msg: errors.pincode })
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "section",
        {
          "data-ocid": "checkout.delivery_section",
          className: "bg-card rounded-2xl border border-border p-4 space-y-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-black text-sm uppercase tracking-widest text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 14, className: "text-primary" }),
              "Delivery Option"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: DELIVERY_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                "data-ocid": `checkout.delivery_option.${opt.value.toLowerCase()}`,
                className: `flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-smooth ${delivery === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-border/80 hover:bg-muted/30"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "radio",
                      name: "delivery",
                      value: opt.value,
                      checked: delivery === opt.value,
                      onChange: () => setDelivery(opt.value),
                      className: "sr-only"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${delivery === opt.value ? "border-primary" : "border-muted-foreground"}`,
                      children: delivery === opt.value && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-primary" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: opt.icon }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: opt.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: opt.sub })
                  ] }),
                  opt.badge && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-usp text-[9px]", children: opt.badge })
                ]
              },
              opt.value
            )) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "section",
        {
          "data-ocid": "checkout.payment_section",
          className: "bg-card rounded-2xl border border-border p-4 space-y-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-black text-sm uppercase tracking-widest text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base leading-none", children: "💵" }),
              "Payment Method"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-3 rounded-xl border border-primary bg-primary/5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl shrink-0 mt-0.5", children: "💵" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm text-foreground", children: "Cash on Delivery" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Pay when the delivery agent arrives — no payment needed now." })
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "section",
        {
          "data-ocid": "checkout.order_summary_section",
          className: "bg-card rounded-2xl border border-border p-4 space-y-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-sm uppercase tracking-widest text-foreground", children: "Order Summary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              OrderLine,
              {
                productId: item.productId,
                quantity: item.quantity,
                selectedSize: item.selectedSize
              },
              `${item.productId}-${item.selectedSize}`
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "checkout.coupon_section",
                className: "border-t border-border pt-3 space-y-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 11 }),
                    "Have a coupon code?"
                  ] }),
                  appliedCoupon ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3 rounded-xl bg-accent/10 border border-accent/30", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 16, className: "text-accent shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-black text-accent", children: appliedCoupon.code }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                        appliedCoupon.discountPercent,
                        "% discount applied 🎉"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "checkout.coupon_remove_button",
                        onClick: handleRemoveCoupon,
                        className: "p-1 rounded-lg text-muted-foreground hover:text-foreground transition-smooth",
                        "aria-label": "Remove coupon",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
                      }
                    )
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        "data-ocid": "checkout.coupon_input",
                        placeholder: "Enter coupon code",
                        value: couponInput,
                        onChange: (e) => setCouponInput(e.target.value.toUpperCase()),
                        className: "bg-background border-border focus:border-primary font-mono text-sm uppercase",
                        onKeyDown: (e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleApplyCoupon();
                          }
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        "data-ocid": "checkout.coupon_apply_button",
                        variant: "outline",
                        onClick: handleApplyCoupon,
                        disabled: getCoupon.isPending || !couponInput.trim(),
                        className: "shrink-0 font-black text-xs uppercase tracking-wide border-primary/40 text-primary hover:bg-primary/10",
                        children: getCoupon.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 border border-primary/30 border-t-primary rounded-full animate-spin" }) : "Apply"
                      }
                    )
                  ] }),
                  couponError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      "data-ocid": "checkout.coupon_error_state",
                      className: "flex items-center gap-1.5 text-destructive text-xs",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 11 }),
                        couponError
                      ]
                    }
                  )
                ]
              }
            ),
            appliedCoupon ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              PricingBreakdown,
              {
                totalItems,
                subtotal,
                discountPercent: appliedCoupon.discountPercent,
                couponCode: appliedCoupon.code
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-3 space-y-1.5 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  totalItems,
                  " ",
                  totalItems === 1 ? "item" : "items"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Prices shown above" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Delivery" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-semibold", children: "FREE" })
              ] })
            ] })
          ]
        }
      ),
      createOrder.isError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "checkout.error_state",
          className: "p-3 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center gap-2 text-destructive text-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 14 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Failed to place order. Please try again." })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          "data-ocid": "checkout.submit_button",
          size: "lg",
          disabled: createOrder.isPending,
          className: "w-full bg-primary text-primary-foreground font-black text-base py-6 rounded-xl uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-smooth shadow-lg disabled:opacity-60 disabled:scale-100",
          children: createOrder.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                "data-ocid": "checkout.loading_state",
                className: "w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"
              }
            ),
            "PLACING ORDER..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            "PLACE ORDER",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 18 })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-[10px] text-muted-foreground pb-4", children: "🔒 Safe & Secure · Cash on Delivery · Free Returns" })
    ] })
  ] });
}
export {
  Checkout as default
};
