import { a as createLucideIcon, b as useNavigate, e as useParams, r as reactExports, j as jsxRuntimeExports, S as Skeleton, F as FulfillmentBy } from "./index-D052jQ_k.js";
import { B as Button } from "./button-DGA_N2XK.js";
import { C as Checkbox } from "./checkbox-MoVLWUxA.js";
import { L as Label, I as Input } from "./label-BW0IYpxi.js";
import { T as Textarea } from "./textarea-zXPJ5sKD.js";
import { u as ue } from "./index-ks9U_z6o.js";
import { a as useProduct } from "./useProducts-DyZ_1eTC.js";
import { f as useSellerCreateProduct, g as useSellerUpdateProduct } from "./useSeller-D_J5zCwb.js";
import { A as ArrowLeft } from "./arrow-left-B9PDxwSs.js";
import "./index-D_ftJ5gj.js";
import "./index-OohpRcx3.js";
import "./index-D2SNgRlF.js";
import "./backend-DMNgBj4M.js";
import "./useMutation-DMQa2kFb.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode);
const defaultForm = {
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
  hasFitAndTry: false
};
function FieldError({ message, id }) {
  if (!message) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { "data-ocid": id, className: "text-xs text-destructive mt-1", role: "alert", children: message });
}
const GENDERS = [
  "Men",
  "Women",
  "Unisex",
  "Handicrafts",
  "Shoes",
  "Other"
];
const IMAGE_UPLOAD_STEPS = [
  {
    id: "chrome",
    text: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      "Open",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "https://imglink.cc/",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-primary underline",
          children: "https://imglink.cc/"
        }
      ),
      " ",
      "in ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Chrome" }),
      " (recommended for best experience)"
    ] })
  },
  {
    id: "upload",
    text: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      "Upload your product photo(s) — you can",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "upload all photos at once" })
    ] })
  },
  {
    id: "scroll",
    text: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      "After uploading,",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "scroll below each photo" }),
      " — you will see",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-amber-400", children: '"Embedded Codes"' }),
      " written there"
    ] })
  },
  {
    id: "embedded",
    text: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      "Click on ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-amber-400", children: '"Embedded Codes"' }),
      " — it will expand showing different URL types"
    ] })
  },
  {
    id: "direct",
    text: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      "Look for ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-green-400", children: '"Direct URL"' }),
      " and click on it to copy it"
    ] })
  },
  {
    id: "paste",
    text: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      "Paste that ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-green-400", children: "Direct URL" }),
      " in the link field below"
    ] })
  }
];
const SUBCATEGORIES = {
  Shoes: ["Men", "Women"],
  Other: ["Bedsheets", "Artificial Jewellery", "Other"]
};
function needsSubcategory(gender) {
  return gender === "Shoes" || gender === "Other";
}
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
  const [form, setForm] = reactExports.useState(defaultForm);
  const [previewSrc, setPreviewSrc] = reactExports.useState("");
  const [errors, setErrors] = reactExports.useState({});
  reactExports.useEffect(() => {
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
        hasFitAndTry: existingProduct.hasFitAndTry
      });
      if (existingProduct.imageUrl) setPreviewSrc(existingProduct.imageUrl);
    }
  }, [isEdit, existingProduct]);
  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: void 0 }));
  }
  function handleGenderChange(g) {
    setForm((prev) => ({ ...prev, gender: g, subcategory: "" }));
    if (errors.gender) setErrors((prev) => ({ ...prev, gender: void 0 }));
  }
  function validate() {
    const next = {};
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
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const input = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: BigInt(Math.round(Number.parseFloat(form.price) * 100)),
      imageUrl: form.imageUrl.trim(),
      category: form.category.trim(),
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      stock: BigInt(Number.parseInt(form.stock, 10)),
      gender: form.gender,
      subcategory: needsSubcategory(form.gender) ? form.subcategory : void 0,
      hasSameDayDelivery: form.hasSameDayDelivery,
      hasFitAndTry: form.hasFitAndTry,
      sellerId,
      sellerName,
      fulfillmentBy: FulfillmentBy.AdminFulfilled,
      isTrending: false
    };
    try {
      if (isEdit) {
        await updateProduct.mutateAsync({ id: editId, input });
        ue.success("Product updated!");
      } else {
        await createProduct.mutateAsync(input);
        ue.success("Product listed on TBah!");
      }
      navigate({ to: "/seller/dashboard" });
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }
  const isPending = createProduct.isPending || updateProduct.isPending;
  const subcategoryOptions = SUBCATEGORIES[form.gender] ?? [];
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
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pf-category", children: "Category / Type" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "pf-category",
                    "data-ocid": "seller.product_form.category_input",
                    value: form.category,
                    onChange: (e) => set("category", e.target.value),
                    placeholder: "e.g. T-Shirts, Hoodies, Handmade Pottery"
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
                    placeholder: "e.g. XS, S, M, L, XL, XXL or One Size"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Separate each size with a comma" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Section *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: GENDERS.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `seller.product_form.gender_${g.toLowerCase()}`,
                    onClick: () => handleGenderChange(g),
                    className: `px-4 py-2 rounded-lg text-sm font-semibold border transition-smooth ${form.gender === g ? "bg-primary text-primary-foreground border-primary" : "bg-muted/40 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"}`,
                    children: g
                  },
                  g
                )) })
              ] }),
              needsSubcategory(form.gender) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pf-subcategory", children: form.gender === "Shoes" ? "Shoes For *" : "Other Type *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    id: "pf-subcategory",
                    "data-ocid": "seller.product_form.subcategory_select",
                    value: form.subcategory,
                    onChange: (e) => set("subcategory", e.target.value),
                    className: `w-full h-10 rounded-md border bg-background px-3 py-2 text-sm text-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-primary/40 ${errors.subcategory ? "border-destructive" : "border-input"}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select —" }),
                      subcategoryOptions.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt, children: opt }, opt))
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FieldError,
                  {
                    message: errors.subcategory,
                    id: "seller.product_form.subcategory_select.field_error"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-muted/30 px-4 py-3 flex items-start gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg shrink-0 mt-0.5", children: "🚚" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Delivery method chosen at order time" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "When a customer places an order, you'll choose whether you or TBah Admin handles the delivery." })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pf-imageUrl", className: "text-sm font-semibold", children: "Product Photo URL *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "a",
                    {
                      href: "https://imglink.cc/",
                      target: "_blank",
                      rel: "noopener noreferrer",
                      "data-ocid": "seller.product_form.imglink_link",
                      className: "inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "(" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 11, className: "text-primary" }),
                        "https://imglink.cc/",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: ")" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 15, className: "text-primary shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-primary uppercase tracking-wide", children: "How to get your photo URL — Step by step" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-2 pl-1", children: IMAGE_UPLOAD_STEPS.map((step, stepIdx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "li",
                    {
                      className: "flex items-start gap-2.5 text-xs text-foreground/80",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-bold text-[10px] flex items-center justify-center mt-0.5", children: stepIdx + 1 }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "leading-relaxed", children: step.text })
                      ]
                    },
                    step.id
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive font-semibold mt-1.5", children: [
                    "⚠️ Do not paste the page URL — only paste the",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Direct URL" }),
                    " or your photo won't show."
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "pf-imageUrl",
                      "data-ocid": "seller.product_form.image_url_input",
                      value: form.imageUrl,
                      onChange: (e) => {
                        set("imageUrl", e.target.value);
                        const url = e.target.value.trim();
                        setPreviewSrc(url || "");
                      },
                      placeholder: "https://iili.io/xxxxxxx.jpg  (Direct URL from imglink.cc)",
                      className: errors.imageUrl ? "border-destructive" : ""
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    FieldError,
                    {
                      message: errors.imageUrl,
                      id: "seller.product_form.image_url_input.field_error"
                    }
                  )
                ] }),
                previewSrc && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: previewSrc,
                      alt: "Product preview",
                      className: "w-20 h-20 rounded-lg object-cover bg-muted border border-border shrink-0",
                      onError: (e) => {
                        e.target.src = "/assets/images/placeholder.svg";
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: "Preview" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 truncate max-w-[220px]", children: previewSrc }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          setPreviewSrc("");
                          set("imageUrl", "");
                        },
                        className: "text-xs text-destructive hover:underline mt-1",
                        "data-ocid": "seller.product_form.remove_image_button",
                        children: "Remove"
                      }
                    )
                  ] })
                ] })
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
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "seller.product_form.help_box",
                  className: "rounded-xl border border-amber-500/30 bg-amber-500/8 p-4 space-y-2",
                  style: { background: "oklch(0.82 0.18 85 / 0.08)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-amber-400 flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🤝" }),
                      " Need help adding your product?"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground/80 leading-relaxed", children: "Share your product photo along with your login details and we'll add it for you:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-foreground/90 font-semibold", children: [
                        "📞 Phone:",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "a",
                          {
                            href: "tel:9541784248",
                            className: "text-primary hover:underline",
                            children: "9541784248"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-foreground/90 font-semibold", children: [
                        "📧 Email:",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "a",
                          {
                            href: "mailto:atyash9541784248@gmail.com",
                            className: "text-primary hover:underline",
                            children: "atyash9541784248@gmail.com"
                          }
                        )
                      ] })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    "data-ocid": "seller.product_form.submit_button",
                    disabled: isPending,
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
