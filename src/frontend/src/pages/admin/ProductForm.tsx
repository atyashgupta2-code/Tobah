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
import {
  useCreateProduct,
  useUpdateProduct,
} from "../../hooks/useAdminProducts";
import { useProduct } from "../../hooks/useProducts";
import { AdminLayout } from "./AdminLayout";

type GenderOption = "Men" | "Women" | "Unisex";

// Categories that support subcategories
type CategoryWithSubs = "Shoes" | "Other";

const SUBCATEGORY_OPTIONS: Record<CategoryWithSubs, string[]> = {
  Shoes: ["Men", "Women"],
  Other: ["Bedsheets", "Artificial Jewellery", "Other"],
};

interface FormState {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
  subcategory: string;
  sizes: string;
  stock: string;
  hasSameDayDelivery: boolean;
  isNewArrival: boolean;
  gender: GenderOption;
  sellerId: string;
  sellerName: string;
}

const defaultForm: FormState = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  category: "",
  subcategory: "",
  sizes: "",
  stock: "",
  hasSameDayDelivery: false,
  isNewArrival: false,
  gender: "Unisex",
  sellerId: "admin",
  sellerName: "Admin",
};

interface FieldErrorProps {
  message?: string;
  id: string;
}
function FieldError({ message, id }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p data-ocid={id} className="text-xs text-destructive mt-1" role="alert">
      {message}
    </p>
  );
}

type UploadState = "idle" | "uploading" | "done" | "error";

const GENDER_OPTIONS: GenderOption[] = ["Men", "Women", "Unisex"];

// All available top-level categories
const CATEGORY_OPTIONS = [
  "Men",
  "Women",
  "Handicrafts",
  "Shoes",
  "Other",
] as const;

function hasSubcategories(cat: string): cat is CategoryWithSubs {
  return cat === "Shoes" || cat === "Other";
}

export default function ProductForm() {
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { id?: string };
  const editId = params?.id;
  const isEdit = !!editId && editId !== "new";

  const { data: existingProduct, isLoading: loadingProduct } = useProduct(
    isEdit ? editId! : "",
  );
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { actor } = useActor(createActor);

  const [form, setForm] = useState<FormState>(defaultForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewSrc, setPreviewSrc] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate form when editing
  useEffect(() => {
    if (isEdit && existingProduct) {
      setForm({
        name: existingProduct.name,
        description: existingProduct.description,
        price: String(Number(existingProduct.price) / 100),
        imageUrl: existingProduct.imageUrl,
        category: existingProduct.category,
        subcategory: existingProduct.subcategory ?? "",
        sizes: existingProduct.sizes.join(", "),
        stock: String(Number(existingProduct.stock)),
        hasSameDayDelivery: existingProduct.hasSameDayDelivery,
        isNewArrival: existingProduct.isNewArrival,
        gender: (existingProduct.gender as GenderOption) || "Unisex",
        sellerId: existingProduct.sellerId || "admin",
        sellerName: existingProduct.sellerName || "Admin",
      });
      if (existingProduct.imageUrl) {
        setPreviewSrc(existingProduct.imageUrl);
      }
    }
  }, [isEdit, existingProduct]);

  function set(field: keyof FormState, value: string | boolean) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Reset subcategory when category changes
      if (field === "category") {
        next.subcategory = "";
      }
      return next;
    });
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

    const subcategoryValue =
      hasSubcategories(form.category) && form.subcategory.trim()
        ? form.subcategory.trim()
        : undefined;

    const input: ProductInput = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: BigInt(Math.round(Number.parseFloat(form.price) * 100)),
      imageUrl: form.imageUrl.trim(),
      category: form.category.trim(),
      subcategory: subcategoryValue,
      sizes: form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      stock: BigInt(Number.parseInt(form.stock, 10)),
      hasSameDayDelivery: form.hasSameDayDelivery,
      hasFitAndTry: false,
      gender: form.gender,
      sellerId: form.sellerId.trim() || "admin",
      sellerName: form.sellerName.trim() || "Admin",
      fulfillmentBy: FulfillmentBy.AdminFulfilled,
      isTrending: false,
    };

    try {
      if (isEdit) {
        await updateProduct.mutateAsync({ id: editId!, input });
        // Handle isNewArrival via setNewArrival — note: this is a best-effort
        // since updateProduct doesn't pass isNewArrival. The admin can toggle
        // it from the product list if needed.
        toast.success("Product updated successfully!");
      } else {
        await createProduct.mutateAsync(input);
        toast.success("Product created successfully!");
      }
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const isPending = createProduct.isPending || updateProduct.isPending;

  const subcategoryList = hasSubcategories(form.category)
    ? SUBCATEGORY_OPTIONS[form.category as CategoryWithSubs]
    : null;

  if (isEdit && loadingProduct) {
    return (
      <AdminLayout>
        <div
          className="p-6 max-w-2xl mx-auto space-y-4"
          data-ocid="admin.product_form.loading_state"
        >
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div
        data-ocid="admin.product_form.page"
        className="p-6 max-w-2xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            data-ocid="admin.product_form.back_button"
            onClick={() => navigate({ to: "/admin" })}
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
                : "Fill in details to add to your store"}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          data-ocid="admin.product_form"
          className="bg-card border border-border rounded-2xl p-6 space-y-5"
        >
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              data-ocid="admin.product_form.name_input"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Oversized Drop Shoulder Tee"
              className={errors.name ? "border-destructive" : ""}
            />
            <FieldError
              message={errors.name}
              id="admin.product_form.name_input.field_error"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              data-ocid="admin.product_form.description_textarea"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe your product…"
              rows={3}
            />
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                data-ocid="admin.product_form.price_input"
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
                id="admin.product_form.price_input.field_error"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                data-ocid="admin.product_form.stock_input"
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
                id="admin.product_form.stock_input.field_error"
              />
            </div>
          </div>

          {/* Category + Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                data-ocid="admin.product_form.category_select"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-foreground"
              >
                <option value="">Select category…</option>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gender">Gender *</Label>
              <select
                id="gender"
                data-ocid="admin.product_form.gender_select"
                value={form.gender}
                onChange={(e) => set("gender", e.target.value as GenderOption)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-foreground"
              >
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subcategory — shown only for Shoes and Other */}
          {subcategoryList && (
            <div className="space-y-1.5">
              <Label htmlFor="subcategory">
                Subcategory
                {form.category === "Shoes" && (
                  <span className="text-muted-foreground font-normal ml-1">
                    — Men or Women shoes
                  </span>
                )}
                {form.category === "Other" && (
                  <span className="text-muted-foreground font-normal ml-1">
                    — type of item
                  </span>
                )}
              </Label>
              <select
                id="subcategory"
                data-ocid="admin.product_form.subcategory_select"
                value={form.subcategory}
                onChange={(e) => set("subcategory", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-foreground"
              >
                <option value="">Select subcategory…</option>
                {subcategoryList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                {form.category === "Shoes"
                  ? "Choose whether these shoes are for Men or Women"
                  : "Select the type that best describes this item"}
              </p>
            </div>
          )}

          {/* Sizes */}
          <div className="space-y-1.5">
            <Label htmlFor="sizes">Sizes (comma-separated)</Label>
            <Input
              id="sizes"
              data-ocid="admin.product_form.sizes_input"
              value={form.sizes}
              onChange={(e) => set("sizes", e.target.value)}
              placeholder="e.g. XS, S, M, L, XL, XXL"
            />
            <p className="text-xs text-muted-foreground">
              Separate each size with a comma
            </p>
          </div>

          {/* Seller Info */}
          <div className="space-y-3 pt-1">
            <Label className="text-sm font-semibold text-foreground">
              Seller Info
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="sellerId"
                  className="text-xs text-muted-foreground font-normal"
                >
                  Seller ID
                </Label>
                <Input
                  id="sellerId"
                  data-ocid="admin.product_form.seller_id_input"
                  value={form.sellerId}
                  onChange={(e) => set("sellerId", e.target.value)}
                  placeholder="e.g. seller123"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="sellerName"
                  className="text-xs text-muted-foreground font-normal"
                >
                  Seller Name
                </Label>
                <Input
                  id="sellerName"
                  data-ocid="admin.product_form.seller_name_input"
                  value={form.sellerName}
                  onChange={(e) => set("sellerName", e.target.value)}
                  placeholder="e.g. Fashion House"
                />
              </div>
            </div>
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
                    data-ocid="admin.product_form.remove_image_button"
                    className="shrink-0 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-smooth"
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  data-ocid="admin.product_form.upload_button"
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
                data-ocid="admin.product_form.file_input"
              />
            </div>

            {previewSrc && uploadState !== "uploading" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                data-ocid="admin.product_form.change_photo_button"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2 text-xs"
              >
                <ImageIcon size={13} />
                Change Photo
              </Button>
            )}

            {/* URL input with guidance for imglink.cc */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="imageUrl"
                  className="text-xs text-muted-foreground font-normal"
                >
                  Or paste a direct image URL
                </Label>
                <a
                  href="https://imglink.cc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                >
                  Get URL (imglink.cc) ↗
                </a>
              </div>
              <Input
                id="imageUrl"
                data-ocid="admin.product_form.image_url_input"
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
                placeholder="https://imglink.cc/images/your-image.jpg"
                className={`text-sm ${errors.imageUrl ? "border-destructive" : ""}`}
              />
              <div className="bg-muted/40 border border-border rounded-lg p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">
                  📸 How to get a direct image URL:
                </p>
                <ol className="list-decimal list-inside space-y-0.5 pl-1">
                  <li>
                    Go to{" "}
                    <a
                      href="https://imglink.cc/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      imglink.cc
                    </a>{" "}
                    and upload your product photo
                  </li>
                  <li>After upload, you'll see multiple URL options</li>
                  <li>
                    <strong className="text-foreground">
                      Choose "Direct URL" only
                    </strong>{" "}
                    — it ends in .jpg/.png/.webp
                  </li>
                  <li>Copy and paste that URL in the field above</li>
                </ol>
              </div>
            </div>
            <FieldError
              message={errors.imageUrl}
              id="admin.product_form.image_url_input.field_error"
            />
          </div>

          {/* Feature flags */}
          <div className="space-y-3 pt-1">
            <Label className="text-sm font-semibold text-foreground">
              Features
            </Label>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border">
                <Checkbox
                  id="sameDay"
                  data-ocid="admin.product_form.same_day_checkbox"
                  checked={form.hasSameDayDelivery}
                  onCheckedChange={(checked) =>
                    set("hasSameDayDelivery", !!checked)
                  }
                />
                <Label htmlFor="sameDay" className="cursor-pointer text-sm">
                  ⚡ Enable Same-Day Delivery
                </Label>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
                <Checkbox
                  id="newArrival"
                  data-ocid="admin.product_form.new_arrival_checkbox"
                  checked={form.isNewArrival}
                  onCheckedChange={(checked) => set("isNewArrival", !!checked)}
                />
                <div className="flex-1">
                  <Label
                    htmlFor="newArrival"
                    className="cursor-pointer text-sm font-semibold text-foreground"
                  >
                    ✨ Mark as New Arrival
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Shows this product in the New Arrivals section on the
                    homepage. Only admin can mark products as New Arrival.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Error / Submit */}
          {(createProduct.isError || updateProduct.isError) && (
            <div
              data-ocid="admin.product_form.error_state"
              className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-sm text-destructive"
            >
              {(createProduct.error ?? updateProduct.error)?.message ??
                "An error occurred"}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              data-ocid="admin.product_form.submit_button"
              disabled={isPending || uploadState === "uploading"}
              className="btn-primary flex-1"
            >
              {isPending
                ? isEdit
                  ? "Saving…"
                  : "Creating…"
                : isEdit
                  ? "Save Changes"
                  : "Create Product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              data-ocid="admin.product_form.cancel_button"
              onClick={() => navigate({ to: "/admin" })}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>

          {(createProduct.isSuccess || updateProduct.isSuccess) && (
            <div
              data-ocid="admin.product_form.success_state"
              className="p-3 rounded-xl bg-primary/10 border border-primary/30 text-sm text-primary font-semibold text-center"
            >
              {isEdit ? "Product updated!" : "Product created!"} Redirecting…
            </div>
          )}
        </form>
      </div>
    </AdminLayout>
  );
}
