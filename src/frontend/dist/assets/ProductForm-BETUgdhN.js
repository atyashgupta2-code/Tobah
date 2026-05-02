import { a as createLucideIcon, b as useNavigate, e as useParams, r as reactExports, j as jsxRuntimeExports, S as Skeleton, X, F as FulfillmentBy } from "./index-D052jQ_k.js";
import { B as Button } from "./button-DGA_N2XK.js";
import { C as Checkbox } from "./checkbox-MoVLWUxA.js";
import { L as Label, I as Input } from "./label-BW0IYpxi.js";
import { T as Textarea } from "./textarea-zXPJ5sKD.js";
import { u as useActor, E as ExternalBlob, c as createActor } from "./backend-DMNgBj4M.js";
import { u as ue } from "./index-ks9U_z6o.js";
import { m as useCreateProduct, n as useUpdateProduct } from "./useAdminProducts-B3JmIQ1f.js";
import { a as useProduct } from "./useProducts-DyZ_1eTC.js";
import { A as AdminLayout, L as LoaderCircle } from "./AdminLayout-C8H71WMN.js";
import { A as ArrowLeft } from "./arrow-left-B9PDxwSs.js";
import { C as CircleCheck } from "./circle-check-CiIya3CL.js";
import "./index-D_ftJ5gj.js";
import "./index-OohpRcx3.js";
import "./index-D2SNgRlF.js";
import "./useMutation-DMQa2kFb.js";
import "./layout-dashboard-Cor2TsiR.js";
import "./log-out-BYm4t2DN.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
];
const Image = createLucideIcon("image", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode);
const SUBCATEGORY_OPTIONS = {
  Shoes: ["Men", "Women"],
  Other: ["Bedsheets", "Artificial Jewellery", "Other"]
};
const defaultForm = {
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
  sellerName: "Admin"
};
function FieldError({ message, id }) {
  if (!message) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { "data-ocid": id, className: "text-xs text-destructive mt-1", role: "alert", children: message });
}
const GENDER_OPTIONS = ["Men", "Women", "Unisex"];
const CATEGORY_OPTIONS = [
  "Men",
  "Women",
  "Handicrafts",
  "Shoes",
  "Other"
];
function hasSubcategories(cat) {
  return cat === "Shoes" || cat === "Other";
}
function ProductForm() {
  var _a;
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const editId = params == null ? void 0 : params.id;
  const isEdit = !!editId && editId !== "new";
  const { data: existingProduct, isLoading: loadingProduct } = useProduct(
    isEdit ? editId : ""
  );
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
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
        price: String(Number(existingProduct.price) / 100),
        imageUrl: existingProduct.imageUrl,
        category: existingProduct.category,
        subcategory: existingProduct.subcategory ?? "",
        sizes: existingProduct.sizes.join(", "),
        stock: String(Number(existingProduct.stock)),
        hasSameDayDelivery: existingProduct.hasSameDayDelivery,
        isNewArrival: existingProduct.isNewArrival,
        gender: existingProduct.gender || "Unisex",
        sellerId: existingProduct.sellerId || "admin",
        sellerName: existingProduct.sellerName || "Admin"
      });
      if (existingProduct.imageUrl) {
        setPreviewSrc(existingProduct.imageUrl);
      }
    }
  }, [isEdit, existingProduct]);
  function set(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "category") {
        next.subcategory = "";
      }
      return next;
    });
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
    const subcategoryValue = hasSubcategories(form.category) && form.subcategory.trim() ? form.subcategory.trim() : void 0;
    const input = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: BigInt(Math.round(Number.parseFloat(form.price) * 100)),
      imageUrl: form.imageUrl.trim(),
      category: form.category.trim(),
      subcategory: subcategoryValue,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      stock: BigInt(Number.parseInt(form.stock, 10)),
      hasSameDayDelivery: form.hasSameDayDelivery,
      hasFitAndTry: false,
      gender: form.gender,
      sellerId: form.sellerId.trim() || "admin",
      sellerName: form.sellerName.trim() || "Admin",
      fulfillmentBy: FulfillmentBy.AdminFulfilled,
      isTrending: false
    };
    try {
      if (isEdit) {
        await updateProduct.mutateAsync({ id: editId, input });
        ue.success("Product updated successfully!");
      } else {
        await createProduct.mutateAsync(input);
        ue.success("Product created successfully!");
      }
      navigate({ to: "/admin" });
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }
  const isPending = createProduct.isPending || updateProduct.isPending;
  const subcategoryList = hasSubcategories(form.category) ? SUBCATEGORY_OPTIONS[form.category] : null;
  if (isEdit && loadingProduct) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "p-6 max-w-2xl mx-auto space-y-4",
        "data-ocid": "admin.product_form.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full rounded-xl" })
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "admin.product_form.page",
      className: "p-6 max-w-2xl mx-auto space-y-6",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              "data-ocid": "admin.product_form.back_button",
              onClick: () => navigate({ to: "/admin" }),
              className: "shrink-0",
              "aria-label": "Go back",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 18 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-2xl text-foreground", children: isEdit ? "Edit Product" : "Add New Product" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: isEdit ? "Update product details" : "Fill in details to add to your store" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "form",
          {
            onSubmit: handleSubmit,
            "data-ocid": "admin.product_form",
            className: "bg-card border border-border rounded-2xl p-6 space-y-5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Product Name *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "name",
                    "data-ocid": "admin.product_form.name_input",
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
                    id: "admin.product_form.name_input.field_error"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "description", children: "Description" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "description",
                    "data-ocid": "admin.product_form.description_textarea",
                    value: form.description,
                    onChange: (e) => set("description", e.target.value),
                    placeholder: "Describe your product…",
                    rows: 3
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "price", children: "Price (₹) *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "price",
                      "data-ocid": "admin.product_form.price_input",
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
                      id: "admin.product_form.price_input.field_error"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "stock", children: "Stock Quantity *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "stock",
                      "data-ocid": "admin.product_form.stock_input",
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
                      id: "admin.product_form.stock_input.field_error"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "category", children: "Category" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      id: "category",
                      "data-ocid": "admin.product_form.category_select",
                      value: form.category,
                      onChange: (e) => set("category", e.target.value),
                      className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-foreground",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select category…" }),
                        CATEGORY_OPTIONS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "gender", children: "Gender *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "select",
                    {
                      id: "gender",
                      "data-ocid": "admin.product_form.gender_select",
                      value: form.gender,
                      onChange: (e) => set("gender", e.target.value),
                      className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-foreground",
                      children: GENDER_OPTIONS.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: g, children: g }, g))
                    }
                  )
                ] })
              ] }),
              subcategoryList && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "subcategory", children: [
                  "Subcategory",
                  form.category === "Shoes" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal ml-1", children: "— Men or Women shoes" }),
                  form.category === "Other" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal ml-1", children: "— type of item" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    id: "subcategory",
                    "data-ocid": "admin.product_form.subcategory_select",
                    value: form.subcategory,
                    onChange: (e) => set("subcategory", e.target.value),
                    className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-foreground",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select subcategory…" }),
                      subcategoryList.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s))
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: form.category === "Shoes" ? "Choose whether these shoes are for Men or Women" : "Select the type that best describes this item" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "sizes", children: "Sizes (comma-separated)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "sizes",
                    "data-ocid": "admin.product_form.sizes_input",
                    value: form.sizes,
                    onChange: (e) => set("sizes", e.target.value),
                    placeholder: "e.g. XS, S, M, L, XL, XXL"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Separate each size with a comma" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold text-foreground", children: "Seller Info" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Label,
                      {
                        htmlFor: "sellerId",
                        className: "text-xs text-muted-foreground font-normal",
                        children: "Seller ID"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "sellerId",
                        "data-ocid": "admin.product_form.seller_id_input",
                        value: form.sellerId,
                        onChange: (e) => set("sellerId", e.target.value),
                        placeholder: "e.g. seller123"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Label,
                      {
                        htmlFor: "sellerName",
                        className: "text-xs text-muted-foreground font-normal",
                        children: "Seller Name"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "sellerName",
                        "data-ocid": "admin.product_form.seller_name_input",
                        value: form.sellerName,
                        onChange: (e) => set("sellerName", e.target.value),
                        placeholder: "e.g. Fashion House"
                      }
                    )
                  ] })
                ] })
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
                            "data-ocid": "admin.product_form.remove_image_button",
                            className: "shrink-0 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-smooth",
                            "aria-label": "Remove image",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
                          }
                        )
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          "data-ocid": "admin.product_form.upload_button",
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
                          "data-ocid": "admin.product_form.file_input"
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
                    "data-ocid": "admin.product_form.change_photo_button",
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
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Label,
                      {
                        htmlFor: "imageUrl",
                        className: "text-xs text-muted-foreground font-normal",
                        children: "Or paste a direct image URL"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "a",
                      {
                        href: "https://imglink.cc/",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "text-xs text-primary underline underline-offset-2 hover:text-primary/80 transition-colors",
                        children: "Get URL (imglink.cc) ↗"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "imageUrl",
                      "data-ocid": "admin.product_form.image_url_input",
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
                      placeholder: "https://imglink.cc/images/your-image.jpg",
                      className: `text-sm ${errors.imageUrl ? "border-destructive" : ""}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 border border-border rounded-lg p-3 text-xs text-muted-foreground space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "📸 How to get a direct image URL:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "list-decimal list-inside space-y-0.5 pl-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                        "Go to",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "a",
                          {
                            href: "https://imglink.cc/",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "text-primary underline",
                            children: "imglink.cc"
                          }
                        ),
                        " ",
                        "and upload your product photo"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "After upload, you'll see multiple URL options" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: 'Choose "Direct URL" only' }),
                        " ",
                        "— it ends in .jpg/.png/.webp"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Copy and paste that URL in the field above" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FieldError,
                  {
                    message: errors.imageUrl,
                    id: "admin.product_form.image_url_input.field_error"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold text-foreground", children: "Features" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Checkbox,
                      {
                        id: "sameDay",
                        "data-ocid": "admin.product_form.same_day_checkbox",
                        checked: form.hasSameDayDelivery,
                        onCheckedChange: (checked) => set("hasSameDayDelivery", !!checked)
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "sameDay", className: "cursor-pointer text-sm", children: "⚡ Enable Same-Day Delivery" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Checkbox,
                      {
                        id: "newArrival",
                        "data-ocid": "admin.product_form.new_arrival_checkbox",
                        checked: form.isNewArrival,
                        onCheckedChange: (checked) => set("isNewArrival", !!checked)
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Label,
                        {
                          htmlFor: "newArrival",
                          className: "cursor-pointer text-sm font-semibold text-foreground",
                          children: "✨ Mark as New Arrival"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Shows this product in the New Arrivals section on the homepage. Only admin can mark products as New Arrival." })
                    ] })
                  ] })
                ] })
              ] }),
              (createProduct.isError || updateProduct.isError) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  "data-ocid": "admin.product_form.error_state",
                  className: "p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-sm text-destructive",
                  children: ((_a = createProduct.error ?? updateProduct.error) == null ? void 0 : _a.message) ?? "An error occurred"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    "data-ocid": "admin.product_form.submit_button",
                    disabled: isPending || uploadState === "uploading",
                    className: "btn-primary flex-1",
                    children: isPending ? isEdit ? "Saving…" : "Creating…" : isEdit ? "Save Changes" : "Create Product"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    "data-ocid": "admin.product_form.cancel_button",
                    onClick: () => navigate({ to: "/admin" }),
                    disabled: isPending,
                    children: "Cancel"
                  }
                )
              ] }),
              (createProduct.isSuccess || updateProduct.isSuccess) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "admin.product_form.success_state",
                  className: "p-3 rounded-xl bg-primary/10 border border-primary/30 text-sm text-primary font-semibold text-center",
                  children: [
                    isEdit ? "Product updated!" : "Product created!",
                    " Redirecting…"
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
  ProductForm as default
};
