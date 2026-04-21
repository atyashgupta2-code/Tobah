import { a as createLucideIcon, u as useCart, b as useNavigate, r as reactExports, D as DeliveryOption, P as PaymentMethod, j as jsxRuntimeExports, L as Link } from "./index-CVuXwThj.js";
import { B as Button } from "./button-Ts1_c3Ah.js";
import { L as Label, I as Input } from "./label-CM8k4tBy.js";
import { b as useCreateOrder, a as useProduct } from "./useProducts-kP_jMEzd.js";
import { T as Truck } from "./truck-DMCpHHiL.js";
import { P as Package } from "./package-BRnKlhsg.js";
import { C as ChevronRight } from "./chevron-right-CkjDMsCz.js";
import { Z as Zap } from "./zap-BsATmOI3.js";
import "./backend-BoUXNShq.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode);
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
        loading: "lazy"
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
function Checkout() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const createOrder = useCreateOrder();
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
  const payment = PaymentMethod.CashOnDelivery;
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
        customerPhone: values.phone.trim()
      });
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
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-3 space-y-1.5 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  items.reduce((s, i) => s + i.quantity, 0),
                  " items"
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
