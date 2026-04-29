import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, Phone, User } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useCustomer } from "../../contexts/CustomerContext";

export default function CustomerLogin() {
  const { login } = useCustomer();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; phone?: boolean }>(
    {},
  );
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e: { name?: string; phone?: string } = {};
    if (!name.trim()) e.name = "Please enter your name";
    if (!phone.trim()) e.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(phone.trim()))
      e.phone = "Enter a valid 10-digit mobile number";
    return e;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    setTouched({ name: true, phone: true });
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    // Simulate brief loading for UX feedback
    setTimeout(() => {
      login(phone.trim(), name.trim());
      navigate({ to: "/customer/orders" });
      setSubmitting(false);
    }, 400);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Brand header */}
        <div className="text-center mb-8">
          <h1 className="font-display font-black text-4xl text-gradient-primary tracking-tight mb-1">
            TB<span className="text-foreground">ah</span>
          </h1>
          <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Phone size={13} className="text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">
              Customer Login
            </span>
          </div>
          <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
            Enter your phone number to see your orders and track deliveries.
          </p>
        </div>

        {/* Login card */}
        <div
          data-ocid="customer_login.card"
          className="bg-card border border-border rounded-2xl p-6 shadow-elevated space-y-5"
        >
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Name field */}
            <div>
              <Label
                htmlFor="login-name"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5 mb-1.5"
              >
                <User size={11} />
                Your Name
              </Label>
              <Input
                id="login-name"
                data-ocid="customer_login.name_input"
                placeholder="Full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (touched.name) {
                    const errs = validate();
                    setErrors((prev) => ({ ...prev, name: errs.name }));
                  }
                }}
                onBlur={() => {
                  setTouched((t) => ({ ...t, name: true }));
                  const errs = validate();
                  setErrors((prev) => ({ ...prev, name: errs.name }));
                }}
                className="bg-background border-border focus:border-primary h-12 text-base"
              />
              {touched.name && errors.name && (
                <p
                  data-ocid="customer_login.name_field_error"
                  className="flex items-center gap-1 text-destructive text-xs mt-1"
                >
                  <AlertCircle size={11} />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Phone field */}
            <div>
              <Label
                htmlFor="login-phone"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5 mb-1.5"
              >
                <Phone size={11} />
                Mobile Number
              </Label>
              <Input
                id="login-phone"
                data-ocid="customer_login.phone_input"
                type="tel"
                inputMode="numeric"
                placeholder="10-digit mobile number"
                value={phone}
                maxLength={10}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setPhone(val);
                  if (touched.phone) {
                    const errs = validate();
                    setErrors((prev) => ({ ...prev, phone: errs.phone }));
                  }
                }}
                onBlur={() => {
                  setTouched((t) => ({ ...t, phone: true }));
                  const errs = validate();
                  setErrors((prev) => ({ ...prev, phone: errs.phone }));
                }}
                className="bg-background border-border focus:border-primary h-12 text-base tracking-widest font-mono"
              />
              {touched.phone && errors.phone && (
                <p
                  data-ocid="customer_login.phone_field_error"
                  className="flex items-center gap-1 text-destructive text-xs mt-1"
                >
                  <AlertCircle size={11} />
                  {errors.phone}
                </p>
              )}
            </div>

            <Button
              type="submit"
              data-ocid="customer_login.submit_button"
              disabled={submitting}
              className="w-full h-12 bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-smooth shadow-lg disabled:opacity-60 disabled:scale-100"
            >
              {submitting ? (
                <span
                  data-ocid="customer_login.loading_state"
                  className="flex items-center gap-2"
                >
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  LOGGING IN...
                </span>
              ) : (
                "VIEW MY ORDERS →"
              )}
            </Button>
          </form>

          <p className="text-center text-[11px] text-muted-foreground">
            New here? We'll create your account automatically 🚀
          </p>
        </div>

        {/* Decorative accent */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">
            No password needed
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
      </div>
    </div>
  );
}
