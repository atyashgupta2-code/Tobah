import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Info } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FulfillmentBy } from "../../backend.d";
import type { ProductInput } from "../../backend.d";
import { useProduct } from "../../hooks/useProducts";
import {
  useSellerCreateProduct,
  useSellerUpdateProduct,
} from "../../hooks/useSeller";

interface FormState {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
  sizes: string;
  stock: string;
  gender: string;
  subcategory: string;
  hasSameDayDelivery: boolean;
  hasFitAndTry: boolean;
}

const defaultForm: FormState = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  category: "",
  sizes: "",
  stock: "",
  gender: "Unisex",
  subcategory: "",
  hasSameDayDelivery: false,
  hasFitAndTry: false,
};

function FieldError({ message, id }: { message?: string; id: string }) {
  if (!message) return null;
  return (
    <p data-ocid={id} className="text-xs text-destructive mt-1" role="alert">
      {message}
    </p>
  );
}

// Categories / genders shown as pill buttons
const GENDERS = [
  "Men",
  "Women",
  "Unisex",
  "Handicrafts",
  "Shoes",
  "Other",
] as const;

// Step-by-step guidance for non-technical sellers — Chrome-specific
const IMAGE_UPLOAD_STEPS: { id: string; text: React.ReactNode }[] = [
  {
    id: "chrome",
    text: (
      <>
        Open{" "}
        <a
          href="https://imglink.cc/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          https://imglink.cc/
        </a>{" "}
        in <strong className="text-foreground">Chrome</strong> (recommended for
        best experience)
      </>
    ),
  },
  {
    id: "upload",
    text: (
      <>
        Upload your product photo(s) — you can{" "}
        <strong className="text-foreground">upload all photos at once</strong>
      </>
    ),
  },
  {
    id: "scroll",
    text: (
      <>
        After uploading,{" "}
        <strong className="text-foreground">scroll below each photo</strong> —
        you will see{" "}
        <strong className="text-amber-400">"Embedded Codes"</strong> written
        there
      </>
    ),
  },
  {
    id: "embedded",
    text: (
      <>
        Click on <strong className="text-amber-400">"Embedded Codes"</strong> —
        it will expand showing different URL types
      </>
    ),
  },
  {
    id: "direct",
    text: (
      <>
        Look for <strong className="text-green-400">"Direct URL"</strong> and
        click on it to copy it
      </>
    ),
  },
  {
    id: "paste",
    text: (
      <>
        Paste that <strong className="text-green-400">Direct URL</strong> in the
        link field below
      </>
    ),
  },
] as unknown as { id: string; text: React.ReactNode }[];
const SUBCATEGORIES: Record<string, string[]> = {
  Shoes: ["Men", "Women"],
  Other: ["Bedsheets", "Artificial Jewellery", "Other"],
};

/** Returns true if this gender value needs a subcategory picker */
function needsSubcategory(gender: string): boolean {
  return gender === "Shoes" || gender === "Other";
}

export default function SellerProductForm() {
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { id?: string };
  const editId = params?.id;
  const isEdit = !!editId && editId !== "new";

  const sellerId = localStorage.getItem("tbah_seller_id") ?? "";
  const sellerName = localStorage.getItem("tbah_seller_name") ?? "";

  useEffect(() => {
    if (!sellerId) navigate({ to: "/seller/register" });
  }, [sellerId, navigate]);

  const { data: existingProduct, isLoading: loadingProduct } = useProduct(
    isEdit ? editId! : "",
  );
  const createProduct = useSellerCreateProduct();
  const updateProduct = useSellerUpdateProduct();

  const [form, setForm] = useState<FormState>(defaultForm);
  const [previewSrc, setPreviewSrc] = useState<string>("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  useEffect(() => {
    if (isEdit && existingProduct) {
      setForm({
        name: existingProduct.name,
        description: existingProduct.description,
        price: String(Number(existingProduct.price) / 100),
        imageUrl: existingProduct.imageUrl,
        category: existingProduct.category,
        sizes: existingProduct.sizes.join(", "),
        stock: String(Number(existingProduct.stock)),
        gender: existingProduct.gender || "Unisex",
        subcategory: existingProduct.subcategory ?? "",
        hasSameDayDelivery: existingProduct.hasSameDayDelivery,
        hasFitAndTry: existingProduct.hasFitAndTry,
      });
      if (existingProduct.imageUrl) setPreviewSrc(existingProduct.imageUrl);
    }
  }, [isEdit, existingProduct]);

  function set(field: keyof FormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleGenderChange(g: string) {
    // When gender changes, reset subcategory
    setForm((prev) => ({ ...prev, gender: g, subcategory: "" }));
    if (errors.gender) setErrors((prev) => ({ ...prev, gender: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Product name is required";
    const priceVal = Number.parseFloat(form.price);
    if (!form.price || Number.isNaN(priceVal) || priceVal <= 0)
      next.price = "Price must be greater than 0";
    if (!form.imageUrl.trim()) next.imageUrl = "Product image URL is required";
    const stockVal = Number.parseInt(form.stock, 10);
    if (!form.stock || Number.isNaN(stockVal) || stockVal < 0)
      next.stock = "Stock must be 0 or more";
    if (needsSubcategory(form.gender) && !form.subcategory)
      next.subcategory = "Please select a subcategory";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const input: ProductInput = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: BigInt(Math.round(Number.parseFloat(form.price) * 100)),
      imageUrl: form.imageUrl.trim(),
      category: form.category.trim(),
      sizes: form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      stock: BigInt(Number.parseInt(form.stock, 10)),
      gender: form.gender,
      subcategory: needsSubcategory(form.gender) ? form.subcategory : undefined,
      hasSameDayDelivery: form.hasSameDayDelivery,
      hasFitAndTry: form.hasFitAndTry,
      sellerId,
      sellerName,
      fulfillmentBy: FulfillmentBy.AdminFulfilled,
      isTrending: false,
    };

    try {
      if (isEdit) {
        await updateProduct.mutateAsync({ id: editId!, input });
        toast.success("Product updated!");
      } else {
        await createProduct.mutateAsync(input);
        toast.success("Product listed on TBah!");
      }
      navigate({ to: "/seller/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const isPending = createProduct.isPending || updateProduct.isPending;
  const subcategoryOptions = SUBCATEGORIES[form.gender] ?? [];

  if (isEdit && loadingProduct) {
    return (
      <div
        className="p-6 max-w-2xl mx-auto space-y-4"
        data-ocid="seller.product_form.loading_state"
      >
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div
        data-ocid="seller.product_form.page"
        className="max-w-2xl mx-auto px-4 py-8 space-y-6 pb-24"
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            data-ocid="seller.product_form.back_button"
            onClick={() => navigate({ to: "/seller/dashboard" })}
            className="shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="font-display font-black text-2xl text-foreground">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {isEdit
                ? "Update product details"
                : "Fill in details to list on TBah"}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          data-ocid="seller.product_form"
          className="bg-card border border-border rounded-2xl p-6 space-y-5"
        >
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="pf-name">Product Name *</Label>
            <Input
              id="pf-name"
              data-ocid="seller.product_form.name_input"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Oversized Drop Shoulder Tee"
              className={errors.name ? "border-destructive" : ""}
            />
            <FieldError
              message={errors.name}
              id="seller.product_form.name_input.field_error"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="pf-desc">Description</Label>
            <Textarea
              id="pf-desc"
              data-ocid="seller.product_form.description_textarea"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe your product…"
              rows={3}
            />
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pf-price">Price (₹) *</Label>
              <Input
                id="pf-price"
                data-ocid="seller.product_form.price_input"
                type="number"
                min="1"
                step="1"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="e.g. 2499"
                className={errors.price ? "border-destructive" : ""}
              />
              <FieldError
                message={errors.price}
                id="seller.product_form.price_input.field_error"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-stock">Stock Quantity *</Label>
              <Input
                id="pf-stock"
                data-ocid="seller.product_form.stock_input"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                placeholder="e.g. 50"
                className={errors.stock ? "border-destructive" : ""}
              />
              <FieldError
                message={errors.stock}
                id="seller.product_form.stock_input.field_error"
              />
            </div>
          </div>

          {/* Category (text) */}
          <div className="space-y-1.5">
            <Label htmlFor="pf-category">Category / Type</Label>
            <Input
              id="pf-category"
              data-ocid="seller.product_form.category_input"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="e.g. T-Shirts, Hoodies, Handmade Pottery"
            />
          </div>

          {/* Sizes */}
          <div className="space-y-1.5">
            <Label htmlFor="pf-sizes">Sizes (comma-separated)</Label>
            <Input
              id="pf-sizes"
              data-ocid="seller.product_form.sizes_input"
              value={form.sizes}
              onChange={(e) => set("sizes", e.target.value)}
              placeholder="e.g. XS, S, M, L, XL, XXL or One Size"
            />
            <p className="text-xs text-muted-foreground">
              Separate each size with a comma
            </p>
          </div>

          {/* Gender / Main Category pill buttons */}
          <div className="space-y-2">
            <Label>Section *</Label>
            <div className="flex gap-2 flex-wrap">
              {GENDERS.map((g) => (
                <button
                  key={g}
                  type="button"
                  data-ocid={`seller.product_form.gender_${g.toLowerCase()}`}
                  onClick={() => handleGenderChange(g)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-smooth ${
                    form.gender === g
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/40 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory dropdown — only for Shoes and Other */}
          {needsSubcategory(form.gender) && (
            <div className="space-y-1.5">
              <Label htmlFor="pf-subcategory">
                {form.gender === "Shoes" ? "Shoes For *" : "Other Type *"}
              </Label>
              <select
                id="pf-subcategory"
                data-ocid="seller.product_form.subcategory_select"
                value={form.subcategory}
                onChange={(e) => set("subcategory", e.target.value)}
                className={`w-full h-10 rounded-md border bg-background px-3 py-2 text-sm text-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                  errors.subcategory ? "border-destructive" : "border-input"
                }`}
              >
                <option value="">— Select —</option>
                {subcategoryOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <FieldError
                message={errors.subcategory}
                id="seller.product_form.subcategory_select.field_error"
              />
            </div>
          )}

          {/* Delivery note */}
          <div className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3 flex items-start gap-3">
            <span className="text-lg shrink-0 mt-0.5">🚚</span>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Delivery method chosen at order time
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                When a customer places an order, you'll choose whether you or
                TBah Admin handles the delivery.
              </p>
            </div>
          </div>

          {/* ── Product Image — URL only ── */}
          <div className="space-y-3">
            {/* Section label with imglink.cc link */}
            <div className="flex items-center gap-2 flex-wrap">
              <Label htmlFor="pf-imageUrl" className="text-sm font-semibold">
                Product Photo URL *
              </Label>
              <a
                href="https://imglink.cc/"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="seller.product_form.imglink_link"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
              >
                <span className="text-muted-foreground">(</span>
                <ExternalLink size={11} className="text-primary" />
                https://imglink.cc/
                <span className="text-muted-foreground">)</span>
              </a>
            </div>

            {/* Step-by-step guidance box */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Info size={15} className="text-primary shrink-0" />
                <p className="text-xs font-bold text-primary uppercase tracking-wide">
                  How to get your photo URL — Step by step
                </p>
              </div>

              <ol className="space-y-2 pl-1">
                {IMAGE_UPLOAD_STEPS.map((step, stepIdx) => (
                  <li
                    key={step.id}
                    className="flex items-start gap-2.5 text-xs text-foreground/80"
                  >
                    <span className="shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-bold text-[10px] flex items-center justify-center mt-0.5">
                      {stepIdx + 1}
                    </span>
                    <span className="leading-relaxed">{step.text}</span>
                  </li>
                ))}
              </ol>
              <p className="text-xs text-destructive font-semibold mt-1.5">
                ⚠️ Do not paste the page URL — only paste the{" "}
                <strong>Direct URL</strong> or your photo won't show.
              </p>
            </div>

            {/* URL input */}
            <div className="space-y-1.5">
              <Input
                id="pf-imageUrl"
                data-ocid="seller.product_form.image_url_input"
                value={form.imageUrl}
                onChange={(e) => {
                  set("imageUrl", e.target.value);
                  const url = e.target.value.trim();
                  setPreviewSrc(url || "");
                }}
                placeholder="https://iili.io/xxxxxxx.jpg  (Direct URL from imglink.cc)"
                className={errors.imageUrl ? "border-destructive" : ""}
              />
              <FieldError
                message={errors.imageUrl}
                id="seller.product_form.image_url_input.field_error"
              />
            </div>

            {/* Live preview once URL is entered */}
            {previewSrc && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border">
                <img
                  src={previewSrc}
                  alt="Product preview"
                  className="w-20 h-20 rounded-lg object-cover bg-muted border border-border shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/assets/images/placeholder.svg";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">
                    Preview
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[220px]">
                    {previewSrc}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewSrc("");
                      set("imageUrl", "");
                    }}
                    className="text-xs text-destructive hover:underline mt-1"
                    data-ocid="seller.product_form.remove_image_button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Feature flags */}
          <div className="space-y-3 pt-1">
            <Label className="text-sm font-semibold text-foreground">
              Features
            </Label>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border">
              <Checkbox
                id="pf-sameDay"
                data-ocid="seller.product_form.same_day_checkbox"
                checked={form.hasSameDayDelivery}
                onCheckedChange={(checked) =>
                  set("hasSameDayDelivery", !!checked)
                }
              />
              <Label htmlFor="pf-sameDay" className="cursor-pointer text-sm">
                ⚡ Enable Same-Day Delivery
              </Label>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border">
              <Checkbox
                id="pf-fitAndTry"
                data-ocid="seller.product_form.fit_and_try_checkbox"
                checked={form.hasFitAndTry}
                onCheckedChange={(checked) => set("hasFitAndTry", !!checked)}
              />
              <Label htmlFor="pf-fitAndTry" className="cursor-pointer text-sm">
                🏠 Enable Fit &amp; Try at Home
              </Label>
            </div>
          </div>

          {/* Error state */}
          {(createProduct.isError || updateProduct.isError) && (
            <div
              data-ocid="seller.product_form.error_state"
              className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-sm text-destructive"
            >
              {(createProduct.error ?? updateProduct.error)?.message ??
                "An error occurred"}
            </div>
          )}

          {/* Help box */}
          <div
            data-ocid="seller.product_form.help_box"
            className="rounded-xl border border-amber-500/30 bg-amber-500/8 p-4 space-y-2"
            style={{ background: "oklch(0.82 0.18 85 / 0.08)" }}
          >
            <p className="text-xs font-bold text-amber-400 flex items-center gap-2">
              <span>🤝</span> Need help adding your product?
            </p>
            <p className="text-xs text-foreground/80 leading-relaxed">
              Share your product photo along with your login details and we'll
              add it for you:
            </p>
            <div className="space-y-1">
              <p className="text-xs text-foreground/90 font-semibold">
                📞 Phone:{" "}
                <a
                  href="tel:9541784248"
                  className="text-primary hover:underline"
                >
                  9541784248
                </a>
              </p>
              <p className="text-xs text-foreground/90 font-semibold">
                📧 Email:{" "}
                <a
                  href="mailto:atyash9541784248@gmail.com"
                  className="text-primary hover:underline"
                >
                  atyash9541784248@gmail.com
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              data-ocid="seller.product_form.submit_button"
              disabled={isPending}
              className="btn-primary flex-1"
            >
              {isPending
                ? isEdit
                  ? "Saving…"
                  : "Creating…"
                : isEdit
                  ? "Save Changes"
                  : "List Product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              data-ocid="seller.product_form.cancel_button"
              onClick={() => navigate({ to: "/seller/dashboard" })}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>

          {(createProduct.isSuccess || updateProduct.isSuccess) && (
            <div
              data-ocid="seller.product_form.success_state"
              className="p-3 rounded-xl bg-primary/10 border border-primary/30 text-sm text-primary font-semibold text-center"
            >
              {isEdit ? "Product updated!" : "Product listed on TBah!"}{" "}
              Redirecting…
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
