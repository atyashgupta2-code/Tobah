import { b as useNavigate, r as reactExports, j as jsxRuntimeExports, g as Store } from "./index-CVuXwThj.js";
import { B as Button } from "./button-Ts1_c3Ah.js";
import { L as Label, I as Input } from "./label-CM8k4tBy.js";
import { u as ue } from "./index-0M-KuH2C.js";
import { u as useRegisterSeller } from "./useSeller-EwE8E-7B.js";
import { Z as Zap } from "./zap-BsATmOI3.js";
import "./backend-BoUXNShq.js";
function FieldError({ message }) {
  if (!message) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive mt-1", role: "alert", children: message });
}
function SellerRegister() {
  var _a;
  const navigate = useNavigate();
  const registerSeller = useRegisterSeller();
  const [form, setForm] = reactExports.useState({
    businessName: "",
    name: "",
    email: "",
    phone: ""
  });
  const [errors, setErrors] = reactExports.useState({});
  const [isReturning, setIsReturning] = reactExports.useState(false);
  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: void 0 }));
  }
  function validate() {
    const next = {};
    if (!form.businessName.trim())
      next.businessName = "Business name is required";
    if (!form.name.trim()) next.name = "Your name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Valid email is required";
    if (!form.phone.trim() || form.phone.trim().length < 10)
      next.phone = "Valid phone number is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    try {
      const { seller, wasExisting } = await registerSeller.mutateAsync({
        businessName: form.businessName.trim(),
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim()
      });
      localStorage.setItem("tbah_seller_id", seller.id);
      localStorage.setItem("tbah_seller_name", seller.name);
      localStorage.setItem("tbah_seller_business", seller.businessName);
      if (wasExisting) {
        setIsReturning(true);
        ue.success("Welcome back! Logging you into your existing account.");
      } else {
        ue.success("Welcome to TBah! Your seller account is ready.");
      }
      navigate({ to: "/seller/dashboard" });
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Registration failed");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex items-center justify-center px-4 py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-none fixed inset-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent/8 blur-[100px]" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 28, className: "text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-black text-3xl text-foreground mb-2", children: [
          "Sell on",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gradient-primary", children: [
            "TB",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "ah" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Join thousands of sellers reaching Gen Z fashion lovers" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 justify-center mb-8", children: ["Free to join", "Cash on delivery", "Instant payouts"].map(
        (usp) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "inline-flex items-center gap-1 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 10 }),
              usp
            ]
          },
          usp
        )
      ) }),
      isReturning && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "seller.register.returning_state",
          className: "mb-4 p-4 rounded-xl bg-primary/10 border border-primary/30 text-sm text-primary font-semibold text-center",
          children: "👋 Welcome back! Logging you into your existing account…"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "form",
        {
          onSubmit: handleSubmit,
          "data-ocid": "seller.register_form",
          className: "bg-card border border-border rounded-2xl p-6 space-y-5 shadow-elevated",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "businessName", children: "Business Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "businessName",
                  "data-ocid": "seller.register.business_name_input",
                  value: form.businessName,
                  onChange: (e) => set("businessName", e.target.value),
                  placeholder: "e.g. UrbanThreads PK",
                  className: errors.businessName ? "border-destructive" : ""
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { message: errors.businessName })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "sellerName", children: "Your Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "sellerName",
                  "data-ocid": "seller.register.name_input",
                  value: form.name,
                  onChange: (e) => set("name", e.target.value),
                  placeholder: "e.g. Ahmed Khan",
                  className: errors.name ? "border-destructive" : ""
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { message: errors.name })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "email",
                  "data-ocid": "seller.register.email_input",
                  type: "email",
                  value: form.email,
                  onChange: (e) => set("email", e.target.value),
                  placeholder: "e.g. ahmed@example.com",
                  className: errors.email ? "border-destructive" : ""
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { message: errors.email })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", children: "Phone Number *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "phone",
                  "data-ocid": "seller.register.phone_input",
                  type: "tel",
                  value: form.phone,
                  onChange: (e) => set("phone", e.target.value),
                  placeholder: "e.g. 03001234567",
                  className: errors.phone ? "border-destructive" : ""
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { message: errors.phone })
            ] }),
            registerSeller.isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                "data-ocid": "seller.register.error_state",
                className: "p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-sm text-destructive",
                children: ((_a = registerSeller.error) == null ? void 0 : _a.message) ?? "Registration failed"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                "data-ocid": "seller.register.submit_button",
                disabled: registerSeller.isPending,
                className: "btn-primary w-full",
                children: registerSeller.isPending ? "Checking account…" : "Start Selling on TBah →"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground", children: [
              "Already a seller?",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "seller.register.login_link",
                  onClick: () => navigate({ to: "/seller/dashboard" }),
                  className: "text-primary hover:underline font-semibold",
                  children: "Go to Dashboard"
                }
              )
            ] })
          ]
        }
      ),
      registerSeller.isSuccess && !isReturning && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "seller.register.success_state",
          className: "mt-4 p-4 rounded-xl bg-primary/10 border border-primary/30 text-sm text-primary font-semibold text-center",
          children: "🎉 Account created! Redirecting to your dashboard…"
        }
      )
    ] })
  ] });
}
export {
  SellerRegister as default
};
