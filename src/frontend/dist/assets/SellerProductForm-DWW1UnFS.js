import { b as useNavigate, e as useParams, r as reactExports, F as FulfillmentBy, j as jsxRuntimeExports, S as Skeleton, X } from "./index-CVuXwThj.js";
import { B as Button } from "./button-Ts1_c3Ah.js";
import { T as Textarea, U as Upload, I as Image, C as Checkbox } from "./textarea-gkbXGmlp.js";
import { L as Label, I as Input } from "./label-CM8k4tBy.js";
import { u as useActor, E as ExternalBlob, c as createActor } from "./backend-BoUXNShq.js";
import { u as ue } from "./index-0M-KuH2C.js";
import { a as useProduct } from "./useProducts-kP_jMEzd.js";
import { e as useSellerCreateProduct, f as useSellerUpdateProduct } from "./useSeller-EwE8E-7B.js";
import { A as ArrowLeft } from "./arrow-left-CzFIKtPM.js";
import { L as LoaderCircle } from "./index-BqnVee3x.js";
import { C as CircleCheck } from "./circle-check-DZyO2W5r.js";
import "./index-bZgWVV6K.js";
import "./index-DoIafuUX.js";
const defaultForm = {
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
  fulfillmentBy: FulfillmentBy.SellerFulfilled
};
function FieldError({ message, id }) {
  if (!message) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { "data-ocid": id, className: "text-xs text-destructive mt-1", role: "alert", children: message });
}
const GENDERS = ["Men", "Women", "Unisex"];
const FULFILLMENT_OPTIONS = [
  {
    value: FulfillmentBy.SellerFulfilled,
    label: "Fulfilled by Seller",
    description: "You handle packing and delivery"
  },
  {
    value: FulfillmentBy.AdminFulfilled,
    label: "Fulfilled by Admin",
    description: "TBah team handles delivery"
  }
];
function SellerProductForm() {
  var _a;
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const editId = params == null ? void 0 : params.id;
  const isEdit = !!editId && editId !== "new";
  const sellerId = localStorage.getItem("tbah_seller_id") ?? "";
  const sellerName = localStorage.getItem("tbah_seller_name") ?? "";
  reactExports.useEffect(() => {
    if (!sellerId) navigate({ to: "/seller/register" });
  }, [sellerId, navigate]);
  const { data: existingProduct, isLoading: loadingProduct } = useProduct(
    isEdit ? editId : ""
  );
  const createProduct = useSellerCreateProduct();
  const updateProduct = useSellerUpdateProduct();
  const { actor } = useActor(createActor);
  const [form, setForm] = reactExports.useState(defaultForm);
  const [errors, setErrors] = reactExports.useState({});
  const [uploadState, setUploadState] = reactExports.useState("idle");
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const [previewSrc, setPreviewSrc] = reactExports.useState("");
  const fileInputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
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
        fulfillmentBy: existingProduct.fulfillmentBy ?? FulfillmentBy.SellerFulfilled
      });
      if (existingProduct.imageUrl) setPreviewSrc(existingProduct.imageUrl);
    }
  }, [isEdit, existingProduct]);
  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: void 0 }));
  }
  function validate() {
    const next = {};
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
  async function handleFileSelect(e) {
    var _a2;
    const file = (_a2 = e.target.files) == null ? void 0 : _a2[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreviewSrc(objectUrl);
    setUploadState("uploading");
    setUploadProgress(0);
    try {
      if (!actor)
        throw new Error("Actor not ready — please wait and try again");
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
        setUploadProgress(pct);
      });
      const uploader = actor;
      const uploadedBytes = await uploader._uploadFile(blob);
      const uploaded = ExternalBlob.fromBytes(uploadedBytes);
      const url = uploaded.getDirectURL();
      set("imageUrl", url);
      setPreviewSrc(url);
      setUploadState("done");
      ue.success("Photo uploaded successfully!");
    } catch (err) {
      setUploadState("error");
      ue.error(err instanceof Error ? err.message : "Upload failed");
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
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const input = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: BigInt(Math.round(Number.parseFloat(form.price))),
      imageUrl: form.imageUrl.trim(),
      category: form.category.trim(),
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      stock: BigInt(Number.parseInt(form.stock, 10)),
      gender: form.gender,
      hasSameDayDelivery: form.hasSameDayDelivery,
      hasFitAndTry: form.hasFitAndTry,
      sellerId,
      sellerName,
      fulfillmentBy: form.fulfillmentBy
    };
    try {
      if (isEdit) {
        await updateProduct.mutateAsync({ id: editId, input });
        ue.success("Product updated!");
      } else {
        await createProduct.mutateAsync(input);
        ue.success("Product created!");
      }
      navigate({ to: "/seller/dashboard" });
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }
  const isPending = createProduct.isPending || updateProduct.isPending;
  if (isEdit && loadingProduct) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "p-6 max-w-2xl mx-auto space-y-4",
        "data-ocid": "seller.product_form.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full rounded-xl" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "seller.product_form.page",
      className: "max-w-2xl mx-auto px-4 py-8 space-y-6 pb-24",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              "data-ocid": "seller.product_form.back_button",
              onClick: () => navigate({ to: "/seller/dashboard" }),
              className: "shrink-0",
              "aria-label": "Go back",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 18 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-2xl text-foreground", children: isEdit ? "Edit Product" : "Add New Product" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: isEdit ? "Update product details" : "Fill in details to list on TBah" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "form",
          {
            onSubmit: handleSubmit,
            "data-ocid": "seller.product_form",
            className: "bg-card border border-border rounded-2xl p-6 space-y-5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pf-name", children: "Product Name *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "pf-name",
                    "data-ocid": "seller.product_form.name_input",
                    value: form.name,
                    onChange: (e) => set("name", e.target.value),
                    placeholder: "e.g. Oversized Drop Shoulder Tee",
                    className: errors.name ? "border-destructive" : ""
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FieldError,
                  {
                    message: errors.name,
                    id: "seller.product_form.name_input.field_error"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pf-desc", children: "Description" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "pf-desc",
                    "data-ocid": "seller.product_form.description_textarea",
                    value: form.description,
                    onChange: (e) => set("description", e.target.value),
                    placeholder: "Describe your product…",
                    rows: 3
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pf-price", children: "Price (₹) *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "pf-price",
                      "data-ocid": "seller.product_form.price_input",
                      type: "number",
                      min: "1",
                      step: "1",
                      value: form.price,
                      onChange: (e) => set("price", e.target.value),
                      placeholder: "e.g. 2499",
                      className: errors.price ? "border-destructive" : ""
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    FieldError,
                    {
                      message: errors.price,
                      id: "seller.product_form.price_input.field_error"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pf-stock", children: "Stock Quantity *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "pf-stock",
                      "data-ocid": "seller.product_form.stock_input",
                      type: "number",
                      min: "0",
                      step: "1",
                      value: form.stock,
                      onChange: (e) => set("stock", e.target.value),
                      placeholder: "e.g. 50",
                      className: errors.stock ? "border-destructive" : ""
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    FieldError,
                    {
                      message: errors.stock,
                      id: "seller.product_form.stock_input.field_error"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pf-category", children: "Category" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "pf-category",
                    "data-ocid": "seller.product_form.category_input",
                    value: form.category,
                    onChange: (e) => set("category", e.target.value),
                    placeholder: "e.g. T-Shirts, Hoodies, Trousers"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pf-sizes", children: "Sizes (comma-separated)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "pf-sizes",
                    "data-ocid": "seller.product_form.sizes_input",
                    value: form.sizes,
                    onChange: (e) => set("sizes", e.target.value),
                    placeholder: "e.g. XS, S, M, L, XL, XXL"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Separate each size with a comma" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Gender *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: GENDERS.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `seller.product_form.gender_${g.toLowerCase()}`,
                    onClick: () => set("gender", g),
                    className: `px-4 py-2 rounded-lg text-sm font-semibold border transition-smooth ${form.gender === g ? "bg-primary text-primary-foreground border-primary" : "bg-muted/40 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"}`,
                    children: g
                  },
                  g
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Delivery Fulfilled By *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: FULFILLMENT_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `seller.product_form.fulfillment_${opt.value.toLowerCase()}`,
                    onClick: () => set("fulfillmentBy", opt.value),
                    className: `p-3 rounded-xl text-left border transition-smooth ${form.fulfillmentBy === opt.value ? "bg-primary/10 border-primary text-foreground" : "bg-muted/30 border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", children: opt.label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-0.5 opacity-70", children: opt.description })
                    ]
                  },
                  opt.value
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Choose who handles delivery for this product." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Product Image *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: `relative border-2 border-dashed rounded-xl transition-smooth ${errors.imageUrl ? "border-destructive" : "border-border"}`,
                    children: [
                      previewSrc ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex items-start gap-4", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "img",
                            {
                              src: previewSrc,
                              alt: "Product preview",
                              className: "w-24 h-24 rounded-xl object-cover bg-muted border border-border",
                              onError: (e) => {
                                e.target.style.display = "none";
                              }
                            }
                          ),
                          uploadState === "uploading" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background/70 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            LoaderCircle,
                            {
                              size: 20,
                              className: "text-primary animate-spin"
                            }
                          ) }),
                          uploadState === "done" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 12, className: "text-white" }) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: uploadState === "uploading" ? `Uploading… ${uploadProgress}%` : uploadState === "done" ? "Photo uploaded ✓" : uploadState === "error" ? "Upload failed — using URL below" : "Image set" }),
                          uploadState === "uploading" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-muted rounded-full h-1.5 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "bg-primary h-full rounded-full transition-all duration-300",
                              style: { width: `${uploadProgress}%` }
                            }
                          ) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate max-w-[200px]", children: previewSrc })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: handleRemoveImage,
                            "data-ocid": "seller.product_form.remove_image_button",
                            className: "shrink-0 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-smooth",
                            "aria-label": "Remove image",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
                          }
                        )
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          "data-ocid": "seller.product_form.upload_button",
                          onClick: () => {
                            var _a2;
                            return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
                          },
                          className: "w-full flex flex-col items-center justify-center gap-3 py-10 px-6 text-center hover:bg-muted/30 rounded-xl transition-smooth cursor-pointer",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 24, className: "text-primary" }) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: "Upload Photo" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "JPG, PNG, WEBP up to 10MB" })
                            ] })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          ref: fileInputRef,
                          type: "file",
                          accept: "image/jpeg,image/png,image/webp,image/gif",
                          onChange: handleFileSelect,
                          className: "sr-only",
                          "aria-label": "Upload product photo",
                          "data-ocid": "seller.product_form.file_input"
                        }
                      )
                    ]
                  }
                ),
                previewSrc && uploadState !== "uploading" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    "data-ocid": "seller.product_form.change_photo_button",
                    onClick: () => {
                      var _a2;
                      return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
                    },
                    className: "gap-2 text-xs",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 13 }),
                      "Change Photo"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "pf-image-url",
                      className: "text-xs text-muted-foreground font-normal",
                      children: "Or paste an image URL"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "pf-image-url",
                      "data-ocid": "seller.product_form.image_url_input",
                      value: form.imageUrl,
                      onChange: (e) => {
                        set("imageUrl", e.target.value);
                        if (e.target.value.trim()) {
                          setPreviewSrc(e.target.value.trim());
                          setUploadState("idle");
                        } else {
                          setPreviewSrc("");
                        }
                      },
                      placeholder: "https://example.com/image.jpg",
                      className: `text-sm ${errors.imageUrl ? "border-destructive" : ""}`
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FieldError,
                  {
                    message: errors.imageUrl,
                    id: "seller.product_form.image_url_input.field_error"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold text-foreground", children: "Features" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Checkbox,
                    {
                      id: "pf-sameDay",
                      "data-ocid": "seller.product_form.same_day_checkbox",
                      checked: form.hasSameDayDelivery,
                      onCheckedChange: (checked) => set("hasSameDayDelivery", !!checked)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pf-sameDay", className: "cursor-pointer text-sm", children: "⚡ Enable Same-Day Delivery" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Checkbox,
                    {
                      id: "pf-fitAndTry",
                      "data-ocid": "seller.product_form.fit_and_try_checkbox",
                      checked: form.hasFitAndTry,
                      onCheckedChange: (checked) => set("hasFitAndTry", !!checked)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pf-fitAndTry", className: "cursor-pointer text-sm", children: "🏠 Enable Fit & Try at Home" })
                ] })
              ] }),
              (createProduct.isError || updateProduct.isError) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  "data-ocid": "seller.product_form.error_state",
                  className: "p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-sm text-destructive",
                  children: ((_a = createProduct.error ?? updateProduct.error) == null ? void 0 : _a.message) ?? "An error occurred"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    "data-ocid": "seller.product_form.submit_button",
                    disabled: isPending || uploadState === "uploading",
                    className: "btn-primary flex-1",
                    children: isPending ? isEdit ? "Saving…" : "Creating…" : isEdit ? "Save Changes" : "List Product"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    "data-ocid": "seller.product_form.cancel_button",
                    onClick: () => navigate({ to: "/seller/dashboard" }),
                    disabled: isPending,
                    children: "Cancel"
                  }
                )
              ] }),
              (createProduct.isSuccess || updateProduct.isSuccess) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "seller.product_form.success_state",
                  className: "p-3 rounded-xl bg-primary/10 border border-primary/30 text-sm text-primary font-semibold text-center",
                  children: [
                    isEdit ? "Product updated!" : "Product listed on TBah!",
                    " ",
                    "Redirecting…"
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  ) });
}
export {
  SellerProductForm as default
};
