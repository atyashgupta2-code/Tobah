import { a as createLucideIcon, b as useNavigate, r as reactExports, j as jsxRuntimeExports, S as Skeleton } from "./index-D052jQ_k.js";
import { B as Badge } from "./badge-J-EtU_X6.js";
import { B as Button } from "./button-DGA_N2XK.js";
import { L as Label, I as Input } from "./label-BW0IYpxi.js";
import { u as ue } from "./index-ks9U_z6o.js";
import { o as useAddModelPhoto, p as useDeleteModelPhoto } from "./useAdminProducts-B3JmIQ1f.js";
import { g as useListModelPhotos, u as useProducts } from "./useProducts-DyZ_1eTC.js";
import { A as ArrowLeft } from "./arrow-left-B9PDxwSs.js";
import { m as motion } from "./proxy-C33ykiGb.js";
import { T as Trash2 } from "./trash-2-BWb4v5XJ.js";
import "./backend-DMNgBj4M.js";
import "./useMutation-DMQa2kFb.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M16 5h6", key: "1vod17" }],
  ["path", { d: "M19 2v6", key: "4bpg5p" }],
  ["path", { d: "M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5", key: "1ue2ih" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }]
];
const ImagePlus = createLucideIcon("image-plus", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M9 17H7A5 5 0 0 1 7 7h2", key: "8i5ue5" }],
  ["path", { d: "M15 7h2a5 5 0 1 1 0 10h-2", key: "1b9ql8" }],
  ["line", { x1: "8", x2: "16", y1: "12", y2: "12", key: "1jonct" }]
];
const Link2 = createLucideIcon("link-2", __iconNode);
const LINK_KEY = "tbah_model_product_links";
function saveModelProductLink(photoId, productId) {
  try {
    const raw = localStorage.getItem(LINK_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[photoId] = productId;
    localStorage.setItem(LINK_KEY, JSON.stringify(map));
  } catch {
  }
}
function removeModelProductLink(photoId) {
  try {
    const raw = localStorage.getItem(LINK_KEY);
    if (!raw) return;
    const map = JSON.parse(raw);
    delete map[photoId];
    localStorage.setItem(LINK_KEY, JSON.stringify(map));
  } catch {
  }
}
function getModelProductLinks() {
  try {
    const raw = localStorage.getItem(LINK_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function AdminModelCard({
  photo,
  index,
  onDelete,
  isDeleting,
  linkedProductName
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.97 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.3, delay: Math.min(index * 0.05, 0.25) },
      "data-ocid": `admin.models.photo_card.${index + 1}`,
      className: "relative rounded-2xl overflow-hidden group w-full",
      style: {
        background: "oklch(0.18 0.015 280)",
        border: "1px solid oklch(0.32 0.015 280 / 0.5)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-[3/4] relative overflow-hidden w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: photo.imageUrl,
              alt: photo.caption ?? `Model ${index + 1}`,
              className: "w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105",
              loading: "lazy",
              width: 600,
              height: 800,
              onError: (e) => {
                e.currentTarget.src = "https://placehold.co/600x800/1a1a2e/666?text=Image+Error";
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              style: { background: "rgba(0,0,0,0.45)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": `admin.models.delete_button.${index + 1}`,
              onClick: onDelete,
              disabled: isDeleting,
              "aria-label": "Delete photo",
              className: "absolute top-3 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 disabled:opacity-50",
              style: {
                background: "oklch(0.55 0.22 25)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.4)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16, color: "white" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black",
              style: {
                background: "oklch(0.62 0.28 315 / 0.85)",
                color: "oklch(0.98 0.005 315)"
              },
              children: index + 1
            }
          ),
          linkedProductName && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "absolute bottom-3 left-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl z-10",
              style: {
                background: "oklch(0.18 0.015 280 / 0.92)",
                border: "1px solid oklch(0.62 0.28 315 / 0.5)",
                backdropFilter: "blur(8px)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { size: 11, style: { color: "oklch(0.62 0.28 315)" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-[10px] font-black truncate",
                    style: { color: "oklch(0.62 0.28 315)" },
                    children: linkedProductName
                  }
                )
              ]
            }
          )
        ] }),
        photo.caption && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "px-4 py-3",
            style: { borderTop: "1px solid oklch(0.32 0.015 280 / 0.4)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/80 text-center font-semibold", children: photo.caption })
          }
        )
      ]
    },
    photo.id
  );
}
const SKEL_KEYS = ["sk-a", "sk-b", "sk-c"];
function AdminModels() {
  const navigate = useNavigate();
  const { data: photos = [], isLoading } = useListModelPhotos();
  const { data: products = [] } = useProducts();
  const addPhoto = useAddModelPhoto();
  const deletePhoto = useDeleteModelPhoto();
  const [imageUrl, setImageUrl] = reactExports.useState("");
  const [caption, setCaption] = reactExports.useState("");
  const [selectedProductId, setSelectedProductId] = reactExports.useState("");
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const productLinks = getModelProductLinks();
  const productMap = new Map(products.map((p) => [p.id, p]));
  async function handleAdd(e) {
    e.preventDefault();
    const url = imageUrl.trim();
    if (!url) return;
    const result = await addPhoto.mutateAsync({
      imageUrl: url,
      caption: caption.trim() || null
    });
    if (result.__kind__ === "ok") {
      if (selectedProductId.trim()) {
        saveModelProductLink(result.ok.id, selectedProductId.trim());
      }
      ue.success("Model photo added!");
      setImageUrl("");
      setCaption("");
      setSelectedProductId("");
    } else {
      ue.error(result.err ?? "Failed to add photo");
    }
  }
  async function handleDelete(id) {
    setDeletingId(id);
    const result = await deletePhoto.mutateAsync(id);
    setDeletingId(null);
    if (result.__kind__ === "ok") {
      removeModelProductLink(id);
      ue.success("Photo removed.");
    } else {
      ue.error(result.err ?? "Failed to delete photo");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "admin.models.page", className: "min-h-screen pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "px-4 pt-6 pb-5 border-b border-border/30",
        style: { background: "oklch(0.18 0.02 280)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-screen-sm mx-auto flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              "data-ocid": "admin.models.back_button",
              onClick: () => navigate({ to: "/admin" }),
              className: "shrink-0 text-muted-foreground hover:text-foreground",
              "aria-label": "Back to dashboard",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 18 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-2xl text-foreground leading-tight", children: "Model Gallery" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Add or remove model photos shown in the public gallery" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "secondary",
              className: "ml-auto shrink-0 font-bold text-xs",
              children: [
                photos.length,
                " photos"
              ]
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-6 max-w-screen-sm mx-auto space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "section",
        {
          "data-ocid": "admin.models.add_photo_form",
          className: "rounded-2xl p-5",
          style: {
            background: "linear-gradient(135deg, oklch(0.62 0.28 315 / 0.08), oklch(0.18 0.015 280))",
            border: "1px solid oklch(0.62 0.28 315 / 0.25)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-8 h-8 rounded-xl flex items-center justify-center",
                  style: { background: "oklch(0.62 0.28 315 / 0.2)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { size: 16, className: "text-primary" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-base text-foreground", children: "Add New Photo" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAdd, className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Label,
                  {
                    htmlFor: "imageUrl",
                    className: "text-xs font-bold text-foreground/80",
                    children: [
                      "Image URL ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "imageUrl",
                    "data-ocid": "admin.models.image_url_input",
                    type: "url",
                    placeholder: "https://example.com/model-photo.jpg",
                    value: imageUrl,
                    onChange: (e) => setImageUrl(e.target.value),
                    required: true,
                    className: "bg-background/50 border-border/60 focus:border-primary text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Label,
                  {
                    htmlFor: "caption",
                    className: "text-xs font-bold text-foreground/80",
                    children: [
                      "Caption",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "(optional)" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "caption",
                    "data-ocid": "admin.models.caption_input",
                    type: "text",
                    placeholder: "e.g. Summer Collection 2026",
                    value: caption,
                    onChange: (e) => setCaption(e.target.value),
                    maxLength: 80,
                    className: "bg-background/50 border-border/60 focus:border-primary text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Label,
                  {
                    htmlFor: "productLink",
                    className: "text-xs font-bold text-foreground/80 flex items-center gap-1.5",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { size: 12, className: "text-primary" }),
                      "Link to product",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "(optional)" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    id: "productLink",
                    "data-ocid": "admin.models.product_select",
                    value: selectedProductId,
                    onChange: (e) => setSelectedProductId(e.target.value),
                    className: "w-full h-9 rounded-md border border-border/60 bg-background/50 px-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Link to product (optional)" }),
                      products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: p.id, children: [
                        p.name,
                        " — ₹",
                        Number(p.price)
                      ] }, p.id))
                    ]
                  }
                ),
                selectedProductId && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-primary font-semibold flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { size: 10 }),
                  "Customers will tap this photo to view the linked product"
                ] })
              ] }),
              imageUrl.trim() && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "rounded-xl overflow-hidden",
                  style: { maxHeight: 200 },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: imageUrl,
                      alt: "Preview",
                      className: "w-full object-cover object-center",
                      style: { maxHeight: 200 },
                      onError: (e) => {
                        e.currentTarget.style.display = "none";
                      }
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  "data-ocid": "admin.models.submit_button",
                  disabled: addPhoto.isPending || !imageUrl.trim(),
                  className: "w-full font-black",
                  children: addPhoto.isPending ? "Adding…" : "Add Photo"
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-black text-base text-foreground mb-3", children: [
          "All Photos (",
          photos.length,
          ")"
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-6", children: SKEL_KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[3/4] w-full rounded-2xl" }, k)) }) : photos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "admin.models.empty_state",
            className: "flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-dashed border-border/40",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { size: 28, className: "text-muted-foreground mb-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground mb-1", children: "No photos yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Paste an image URL above to add your first model photo." })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-6", children: photos.map((photo, i) => {
          const linkedPid = productLinks[photo.id];
          const linkedProduct = linkedPid ? productMap.get(linkedPid) : void 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            AdminModelCard,
            {
              photo,
              index: i,
              onDelete: () => handleDelete(photo.id),
              isDeleting: deletingId === photo.id,
              linkedProductName: linkedProduct == null ? void 0 : linkedProduct.name
            },
            photo.id
          );
        }) })
      ] })
    ] })
  ] });
}
export {
  AdminModels as default,
  getModelProductLinks
};
