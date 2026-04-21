import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  ImageIcon,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob, createActor } from "../../backend";
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
  hasSameDayDelivery: boolean;
  hasFitAndTry: boolean;
  fulfillmentBy: FulfillmentBy;
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
  hasSameDayDelivery: false,
  hasFitAndTry: false,
  fulfillmentBy: FulfillmentBy.SellerFulfilled,
};

function FieldError({ message, id }: { message?: string; id: string }) {
  if (!message) return null;
  return (
    <p data-ocid={id} className="text-xs text-destructive mt-1" role="alert">
      {message}
    </p>
  );
}

type UploadState = "idle" | "uploading" | "done" | "error";

const GENDERS = ["Men", "Women", "Unisex"] as const;

const FULFILLMENT_OPTIONS = [
  {
    value: FulfillmentBy.SellerFulfilled,
    label: "Fulfilled by Seller",
    description: "You handle packing and delivery",
  },
  {
    value: FulfillmentBy.AdminFulfilled,
    label: "Fulfilled by Admin",
    description: "TBah team handles delivery",
  },
] as const;

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
  const { actor } = useActor(createActor);

  const [form, setForm] = useState<FormState>(defaultForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewSrc, setPreviewSrc] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEdit && existingProduct) {
      setForm({
        name: existingProduct.name,
        description: existingProduct.description,
        price: String(Number(existingProduct.price)),
        imageUrl: existingProduct.imageUrl,
        category: existingProduct.category,
        sizes: existingProduct.sizes.join(", "),
        stock: String(Number(existingProduct.stock)),
        gender: existingProduct.gender || "Unisex",
        hasSameDayDelivery: existingProduct.hasSameDayDelivery,
        hasFitAndTry: existingProduct.hasFitAndTry,
        fulfillmentBy:
          existingProduct.fulfillmentBy ?? FulfillmentBy.SellerFulfilled,
      });
      if (existingProduct.imageUrl) setPreviewSrc(existingProduct.imageUrl);
    }
  }, [isEdit, existingProduct]);

  function set(
    field: keyof FormState,
    value: string | boolean | FulfillmentBy,
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Product name is required";
    const priceVal = Number.parseFloat(form.price);
    if (!form.price || Number.isNaN(priceVal) || priceVal <= 0)
      next.price = "Price must be greater than 0";
    if (!form.imageUrl.trim()) next.imageUrl = "Product image is required";
    const stockVal = Number.parseInt(form.stock, 10);
    if (!form.stock || Number.isNaN(stockVal) || stockVal < 0)
      next.stock = "Stock must be 0 or more";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreviewSrc(objectUrl);
    setUploadState("uploading");
    setUploadProgress(0);
    try {
      if (!actor)
        throw new Error("Actor not ready — please wait and try again");
      const buffer = (await file.arrayBuffer()) as ArrayBuffer;
      const bytes = new Uint8Array(buffer) as Uint8Array<ArrayBuffer>;
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
        setUploadProgress(pct);
      });
      type Uploader = {
        _uploadFile: (f: ExternalBlob) => Promise<Uint8Array<ArrayBuffer>>;
      };
      const uploader = actor as unknown as Uploader;
      const uploadedBytes = await uploader._uploadFile(blob);
      const uploaded = ExternalBlob.fromBytes(uploadedBytes);
      const url = uploaded.getDirectURL();
      set("imageUrl", url);
      setPreviewSrc(url);
      setUploadState("done");
      toast.success("Photo uploaded successfully!");
    } catch (err) {
      setUploadState("error");
      toast.error(err instanceof Error ? err.message : "Upload failed");
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleRemoveImage() {
    setPreviewSrc("");
    set("imageUrl", "");
    setUploadState("idle");
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const input: ProductInput = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: BigInt(Math.round(Number.parseFloat(form.price))),
      imageUrl: form.imageUrl.trim(),
      category: form.category.trim(),
      sizes: form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      stock: BigInt(Number.parseInt(form.stock, 10)),
      gender: form.gender,
      hasSameDayDelivery: form.hasSameDayDelivery,
      hasFitAndTry: form.hasFitAndTry,
      sellerId,
      sellerName,
      fulfillmentBy: form.fulfillmentBy,
    };
    try {
      if (isEdit) {
        await updateProduct.mutateAsync({ id: editId!, input });
        toast.success("Product updated!");
      } else {
        await createProduct.mutateAsync(input);
        toast.success("Product created!");
      }
      navigate({ to: "/seller/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const isPending = createProduct.isPending || updateProduct.isPending;

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

          {/* Category */}
          <div className="space-y-1.5">
            <Label htmlFor="pf-category">Category</Label>
            <Input
              id="pf-category"
              data-ocid="seller.product_form.category_input"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="e.g. T-Shirts, Hoodies, Trousers"
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
              placeholder="e.g. XS, S, M, L, XL, XXL"
            />
            <p className="text-xs text-muted-foreground">
              Separate each size with a comma
            </p>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label>Gender *</Label>
            <div className="flex gap-2 flex-wrap">
              {GENDERS.map((g) => (
                <button
                  key={g}
                  type="button"
                  data-ocid={`seller.product_form.gender_${g.toLowerCase()}`}
                  onClick={() => set("gender", g)}
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

          {/* Fulfillment by */}
          <div className="space-y-2">
            <Label>Delivery Fulfilled By *</Label>
            <div className="grid grid-cols-2 gap-3">
              {FULFILLMENT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  data-ocid={`seller.product_form.fulfillment_${opt.value.toLowerCase()}`}
                  onClick={() => set("fulfillmentBy", opt.value)}
                  className={`p-3 rounded-xl text-left border transition-smooth ${
                    form.fulfillmentBy === opt.value
                      ? "bg-primary/10 border-primary text-foreground"
                      : "bg-muted/30 border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  <p className="font-semibold text-sm">{opt.label}</p>
                  <p className="text-xs mt-0.5 opacity-70">{opt.description}</p>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Choose who handles delivery for this product.
            </p>
          </div>

          {/* Product Image */}
          <div className="space-y-3">
            <Label>Product Image *</Label>
            <div
              className={`relative border-2 border-dashed rounded-xl transition-smooth ${errors.imageUrl ? "border-destructive" : "border-border"}`}
            >
              {previewSrc ? (
                <div className="p-4 flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={previewSrc}
                      alt="Product preview"
                      className="w-24 h-24 rounded-xl object-cover bg-muted border border-border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    {uploadState === "uploading" && (
                      <div className="absolute inset-0 bg-background/70 rounded-xl flex items-center justify-center">
                        <Loader2
                          size={20}
                          className="text-primary animate-spin"
                        />
                      </div>
                    )}
                    {uploadState === "done" && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      {uploadState === "uploading"
                        ? `Uploading… ${uploadProgress}%`
                        : uploadState === "done"
                          ? "Photo uploaded ✓"
                          : uploadState === "error"
                            ? "Upload failed — using URL below"
                            : "Image set"}
                    </p>
                    {uploadState === "uploading" && (
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {previewSrc}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    data-ocid="seller.product_form.remove_image_button"
                    className="shrink-0 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-smooth"
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  data-ocid="seller.product_form.upload_button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-3 py-10 px-6 text-center hover:bg-muted/30 rounded-xl transition-smooth cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Upload size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      Upload Photo
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      JPG, PNG, WEBP up to 10MB
                    </p>
                  </div>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                className="sr-only"
                aria-label="Upload product photo"
                data-ocid="seller.product_form.file_input"
              />
            </div>

            {previewSrc && uploadState !== "uploading" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                data-ocid="seller.product_form.change_photo_button"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2 text-xs"
              >
                <ImageIcon size={13} />
                Change Photo
              </Button>
            )}

            <div className="space-y-1.5">
              <Label
                htmlFor="pf-image-url"
                className="text-xs text-muted-foreground font-normal"
              >
                Or paste an image URL
              </Label>
              <Input
                id="pf-image-url"
                data-ocid="seller.product_form.image_url_input"
                value={form.imageUrl}
                onChange={(e) => {
                  set("imageUrl", e.target.value);
                  if (e.target.value.trim()) {
                    setPreviewSrc(e.target.value.trim());
                    setUploadState("idle");
                  } else {
                    setPreviewSrc("");
                  }
                }}
                placeholder="https://example.com/image.jpg"
                className={`text-sm ${errors.imageUrl ? "border-destructive" : ""}`}
              />
            </div>
            <FieldError
              message={errors.imageUrl}
              id="seller.product_form.image_url_input.field_error"
            />
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
                🏠 Enable Fit & Try at Home
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

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              data-ocid="seller.product_form.submit_button"
              disabled={isPending || uploadState === "uploading"}
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
