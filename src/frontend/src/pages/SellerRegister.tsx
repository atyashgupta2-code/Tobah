import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { Store, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRegisterSeller } from "../hooks/useSeller";

interface FormState {
  businessName: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}
interface FormErrors {
  businessName?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-xs text-destructive mt-1" role="alert">
      {message}
    </p>
  );
}

export default function SellerRegister() {
  const navigate = useNavigate();
  const registerSeller = useRegisterSeller();
  const [form, setForm] = useState<FormState>({
    businessName: "",
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isReturning, setIsReturning] = useState(false);

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const next: FormErrors = {};
    if (!form.businessName.trim())
      next.businessName = "Business name is required";
    if (!form.name.trim()) next.name = "Your name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Valid email is required";
    if (!form.phone.trim() || form.phone.trim().length < 10)
      next.phone = "Valid phone number is required";
    if (!form.address.trim()) next.address = "Business address is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    try {
      const { seller, wasExisting } = await registerSeller.mutateAsync({
        businessName: form.businessName.trim(),
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      });

      localStorage.setItem("tbah_seller_id", seller.id);
      localStorage.setItem("tbah_seller_name", seller.name);
      localStorage.setItem("tbah_seller_business", seller.businessName);

      if (wasExisting) {
        setIsReturning(true);
        toast.success("Welcome back! Logging you into your existing account.");
      } else {
        toast.success("Welcome to TBah! Your seller account is ready.");
      }

      navigate({ to: "/seller/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent/8 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 mb-4">
            <Store size={28} className="text-primary" />
          </div>
          <h1 className="font-display font-black text-3xl text-foreground mb-2">
            Sell on{" "}
            <span className="text-gradient-primary">
              TB<span className="text-foreground">ah</span>
            </span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Join thousands of sellers reaching Gen Z fashion lovers
          </p>
        </div>

        {/* USP pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {["Free to join", "Cash on delivery", "Instant payouts"].map(
            (usp) => (
              <span
                key={usp}
                className="inline-flex items-center gap-1 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full"
              >
                <Zap size={10} />
                {usp}
              </span>
            ),
          )}
        </div>

        {/* Welcome back banner */}
        {isReturning && (
          <div
            data-ocid="seller.register.returning_state"
            className="mb-4 p-4 rounded-xl bg-primary/10 border border-primary/30 text-sm text-primary font-semibold text-center"
          >
            👋 Welcome back! Logging you into your existing account…
          </div>
        )}

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          data-ocid="seller.register_form"
          className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-elevated"
        >
          <div className="space-y-1.5">
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              data-ocid="seller.register.business_name_input"
              value={form.businessName}
              onChange={(e) => set("businessName", e.target.value)}
              placeholder="e.g. UrbanThreads PK"
              className={errors.businessName ? "border-destructive" : ""}
            />
            <FieldError message={errors.businessName} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sellerName">Your Name *</Label>
            <Input
              id="sellerName"
              data-ocid="seller.register.name_input"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Ahmed Khan"
              className={errors.name ? "border-destructive" : ""}
            />
            <FieldError message={errors.name} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              data-ocid="seller.register.email_input"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="e.g. ahmed@example.com"
              className={errors.email ? "border-destructive" : ""}
            />
            <FieldError message={errors.email} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              data-ocid="seller.register.phone_input"
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="e.g. 03001234567"
              className={errors.phone ? "border-destructive" : ""}
            />
            <FieldError message={errors.phone} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">Business Address *</Label>
            <Textarea
              id="address"
              data-ocid="seller.register.address_input"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="e.g. Shop 12, Main Market, Jammu, J&K"
              rows={2}
              className={errors.address ? "border-destructive" : ""}
            />
            <FieldError message={errors.address} />
          </div>

          {registerSeller.isError && (
            <div
              data-ocid="seller.register.error_state"
              className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-sm text-destructive"
            >
              {registerSeller.error?.message ?? "Registration failed"}
            </div>
          )}

          <Button
            type="submit"
            data-ocid="seller.register.submit_button"
            disabled={registerSeller.isPending}
            className="btn-primary w-full"
          >
            {registerSeller.isPending
              ? "Checking account…"
              : "Start Selling on TBah →"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Already a seller?{" "}
            <button
              type="button"
              data-ocid="seller.register.login_link"
              onClick={() => navigate({ to: "/seller/dashboard" })}
              className="text-primary hover:underline font-semibold"
            >
              Go to Dashboard
            </button>
          </p>
        </form>

        {registerSeller.isSuccess && !isReturning && (
          <div
            data-ocid="seller.register.success_state"
            className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/30 text-sm text-primary font-semibold text-center"
          >
            🎉 Account created! Redirecting to your dashboard…
          </div>
        )}
      </div>
    </div>
  );
}
