import { g as useCustomer, b as useNavigate, r as reactExports, j as jsxRuntimeExports } from "./index-D052jQ_k.js";
import { B as Button } from "./button-DGA_N2XK.js";
import { L as Label, I as Input } from "./label-BW0IYpxi.js";
import { P as Phone, U as User } from "./user-f2obrnNr.js";
import { C as CircleAlert } from "./circle-alert-C6NytVlT.js";
function CustomerLogin() {
  const { login } = useCustomer();
  const navigate = useNavigate();
  const [name, setName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [errors, setErrors] = reactExports.useState({});
  const [touched, setTouched] = reactExports.useState(
    {}
  );
  const [submitting, setSubmitting] = reactExports.useState(false);
  function validate() {
    const e = {};
    if (!name.trim()) e.name = "Please enter your name";
    if (!phone.trim()) e.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(phone.trim()))
      e.phone = "Enter a valid 10-digit mobile number";
    return e;
  }
  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setTouched({ name: true, phone: true });
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    setTimeout(() => {
      login(phone.trim(), name.trim());
      navigate({ to: "/customer/orders" });
      setSubmitting(false);
    }, 400);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[80vh] flex items-center justify-center px-4 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-black text-4xl text-gradient-primary tracking-tight mb-1", children: [
        "TB",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "ah" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 13, className: "text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-primary uppercase tracking-widest", children: "Customer Login" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground text-sm leading-relaxed", children: "Enter your phone number to see your orders and track deliveries." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "customer_login.card",
        className: "bg-card border border-border rounded-2xl p-6 shadow-elevated space-y-5",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, noValidate: true, className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "login-name",
                  className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5 mb-1.5",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 11 }),
                    "Your Name"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "login-name",
                  "data-ocid": "customer_login.name_input",
                  placeholder: "Full name",
                  value: name,
                  onChange: (e) => {
                    setName(e.target.value);
                    if (touched.name) {
                      const errs = validate();
                      setErrors((prev) => ({ ...prev, name: errs.name }));
                    }
                  },
                  onBlur: () => {
                    setTouched((t) => ({ ...t, name: true }));
                    const errs = validate();
                    setErrors((prev) => ({ ...prev, name: errs.name }));
                  },
                  className: "bg-background border-border focus:border-primary h-12 text-base"
                }
              ),
              touched.name && errors.name && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  "data-ocid": "customer_login.name_field_error",
                  className: "flex items-center gap-1 text-destructive text-xs mt-1",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 11 }),
                    errors.name
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "login-phone",
                  className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5 mb-1.5",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 11 }),
                    "Mobile Number"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "login-phone",
                  "data-ocid": "customer_login.phone_input",
                  type: "tel",
                  inputMode: "numeric",
                  placeholder: "10-digit mobile number",
                  value: phone,
                  maxLength: 10,
                  onChange: (e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setPhone(val);
                    if (touched.phone) {
                      const errs = validate();
                      setErrors((prev) => ({ ...prev, phone: errs.phone }));
                    }
                  },
                  onBlur: () => {
                    setTouched((t) => ({ ...t, phone: true }));
                    const errs = validate();
                    setErrors((prev) => ({ ...prev, phone: errs.phone }));
                  },
                  className: "bg-background border-border focus:border-primary h-12 text-base tracking-widest font-mono"
                }
              ),
              touched.phone && errors.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  "data-ocid": "customer_login.phone_field_error",
                  className: "flex items-center gap-1 text-destructive text-xs mt-1",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 11 }),
                    errors.phone
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                "data-ocid": "customer_login.submit_button",
                disabled: submitting,
                className: "w-full h-12 bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-smooth shadow-lg disabled:opacity-60 disabled:scale-100",
                children: submitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    "data-ocid": "customer_login.loading_state",
                    className: "flex items-center gap-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }),
                      "LOGGING IN..."
                    ]
                  }
                ) : "VIEW MY ORDERS →"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-[11px] text-muted-foreground", children: "New here? We'll create your account automatically 🚀" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-semibold uppercase tracking-widest", children: "No password needed" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" })
    ] })
  ] }) });
}
export {
  CustomerLogin as default
};
