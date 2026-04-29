import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ImagePlus, Link2, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { ModelPhoto } from "../../backend.d";
import {
  useAddModelPhoto,
  useDeleteModelPhoto,
} from "../../hooks/useAdminProducts";
import { useListModelPhotos, useProducts } from "../../hooks/useProducts";

// ─── localStorage helpers for product links ───────────────────────────────────
const LINK_KEY = "tbah_model_product_links";

function saveModelProductLink(photoId: string, productId: string) {
  try {
    const raw = localStorage.getItem(LINK_KEY);
    const map: Record<string, string> = raw ? JSON.parse(raw) : {};
    map[photoId] = productId;
    localStorage.setItem(LINK_KEY, JSON.stringify(map));
  } catch {
    /* noop */
  }
}

function removeModelProductLink(photoId: string) {
  try {
    const raw = localStorage.getItem(LINK_KEY);
    if (!raw) return;
    const map: Record<string, string> = JSON.parse(raw);
    delete map[photoId];
    localStorage.setItem(LINK_KEY, JSON.stringify(map));
  } catch {
    /* noop */
  }
}

export function getModelProductLinks(): Record<string, string> {
  try {
    const raw = localStorage.getItem(LINK_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// ─── Admin Models Photo Card — single column ──────────────────────────────────
function AdminModelCard({
  photo,
  index,
  onDelete,
  isDeleting,
  linkedProductName,
}: {
  photo: ModelPhoto;
  index: number;
  onDelete: () => void;
  isDeleting: boolean;
  linkedProductName?: string;
}) {
  return (
    <motion.div
      key={photo.id}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.25) }}
      data-ocid={`admin.models.photo_card.${index + 1}`}
      className="relative rounded-2xl overflow-hidden group w-full"
      style={{
        background: "oklch(0.18 0.015 280)",
        border: "1px solid oklch(0.32 0.015 280 / 0.5)",
      }}
    >
      <div className="aspect-[3/4] relative overflow-hidden w-full">
        <img
          src={photo.imageUrl}
          alt={photo.caption ?? `Model ${index + 1}`}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          width={600}
          height={800}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://placehold.co/600x800/1a1a2e/666?text=Image+Error";
          }}
        />
        {/* Dark overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "rgba(0,0,0,0.45)" }}
        />
        {/* Delete button */}
        <button
          type="button"
          data-ocid={`admin.models.delete_button.${index + 1}`}
          onClick={onDelete}
          disabled={isDeleting}
          aria-label="Delete photo"
          className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 disabled:opacity-50"
          style={{
            background: "oklch(0.55 0.22 25)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
          }}
        >
          <Trash2 size={16} color="white" />
        </button>

        {/* Index number badge */}
        <div
          className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
          style={{
            background: "oklch(0.62 0.28 315 / 0.85)",
            color: "oklch(0.98 0.005 315)",
          }}
        >
          {index + 1}
        </div>

        {/* Linked product badge */}
        {linkedProductName && (
          <div
            className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl z-10"
            style={{
              background: "oklch(0.18 0.015 280 / 0.92)",
              border: "1px solid oklch(0.62 0.28 315 / 0.5)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Link2 size={11} style={{ color: "oklch(0.62 0.28 315)" }} />
            <p
              className="text-[10px] font-black truncate"
              style={{ color: "oklch(0.62 0.28 315)" }}
            >
              {linkedProductName}
            </p>
          </div>
        )}
      </div>

      {photo.caption && (
        <div
          className="px-4 py-3"
          style={{ borderTop: "1px solid oklch(0.32 0.015 280 / 0.4)" }}
        >
          <p className="text-sm text-foreground/80 text-center font-semibold">
            {photo.caption}
          </p>
        </div>
      )}
    </motion.div>
  );
}

const SKEL_KEYS = ["sk-a", "sk-b", "sk-c"] as const;

// ─── Admin Models Page ─────────────────────────────────────────────────────────
export default function AdminModels() {
  const { data: photos = [], isLoading } = useListModelPhotos();
  const { data: products = [] } = useProducts();
  const addPhoto = useAddModelPhoto();
  const deletePhoto = useDeleteModelPhoto();

  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const productLinks = getModelProductLinks();
  const productMap = new Map(products.map((p) => [p.id, p]));

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const url = imageUrl.trim();
    if (!url) return;

    const result = await addPhoto.mutateAsync({
      imageUrl: url,
      caption: caption.trim() || null,
    });

    if (result.__kind__ === "ok") {
      if (selectedProductId.trim()) {
        saveModelProductLink(result.ok.id, selectedProductId.trim());
      }
      toast.success("Model photo added!");
      setImageUrl("");
      setCaption("");
      setSelectedProductId("");
    } else {
      toast.error(result.err ?? "Failed to add photo");
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const result = await deletePhoto.mutateAsync(id);
    setDeletingId(null);
    if (result.__kind__ === "ok") {
      removeModelProductLink(id);
      toast.success("Photo removed.");
    } else {
      toast.error(result.err ?? "Failed to delete photo");
    }
  }

  return (
    <div data-ocid="admin.models.page" className="min-h-screen pb-24">
      {/* Header */}
      <div
        className="px-4 pt-6 pb-5 border-b border-border/30"
        style={{ background: "oklch(0.18 0.02 280)" }}
      >
        <div className="max-w-screen-sm mx-auto flex items-center gap-3">
          <div>
            <h1 className="font-display font-black text-2xl text-foreground leading-tight">
              Model Gallery
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add or remove model photos shown in the public gallery
            </p>
          </div>
          <Badge
            variant="secondary"
            className="ml-auto shrink-0 font-bold text-xs"
          >
            {photos.length} photos
          </Badge>
        </div>
      </div>

      <div className="px-4 pt-6 max-w-screen-sm mx-auto space-y-8">
        {/* ─── Add Photo Form ─────────────────────────────────────────────── */}
        <section
          data-ocid="admin.models.add_photo_form"
          className="rounded-2xl p-5"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.62 0.28 315 / 0.08), oklch(0.18 0.015 280))",
            border: "1px solid oklch(0.62 0.28 315 / 0.25)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(0.62 0.28 315 / 0.2)" }}
            >
              <ImagePlus size={16} className="text-primary" />
            </div>
            <h2 className="font-display font-black text-base text-foreground">
              Add New Photo
            </h2>
          </div>

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="imageUrl"
                className="text-xs font-bold text-foreground/80"
              >
                Image URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="imageUrl"
                data-ocid="admin.models.image_url_input"
                type="url"
                placeholder="https://example.com/model-photo.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
                className="bg-background/50 border-border/60 focus:border-primary text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="caption"
                className="text-xs font-bold text-foreground/80"
              >
                Caption{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="caption"
                data-ocid="admin.models.caption_input"
                type="text"
                placeholder="e.g. Summer Collection 2026"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={80}
                className="bg-background/50 border-border/60 focus:border-primary text-sm"
              />
            </div>

            {/* Product Link — optional */}
            <div className="space-y-1.5">
              <Label
                htmlFor="productLink"
                className="text-xs font-bold text-foreground/80 flex items-center gap-1.5"
              >
                <Link2 size={12} className="text-primary" />
                Link to product{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <select
                id="productLink"
                data-ocid="admin.models.product_select"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full h-9 rounded-md border border-border/60 bg-background/50 px-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
              >
                <option value="">Link to product (optional)</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ₹{Number(p.price)}
                  </option>
                ))}
              </select>
              {selectedProductId && (
                <p className="text-[10px] text-primary font-semibold flex items-center gap-1">
                  <Link2 size={10} />
                  Customers will tap this photo to view the linked product
                </p>
              )}
            </div>

            {/* Preview */}
            {imageUrl.trim() && (
              <div
                className="rounded-xl overflow-hidden"
                style={{ maxHeight: 200 }}
              >
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full object-cover object-center"
                  style={{ maxHeight: 200 }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              </div>
            )}

            <Button
              type="submit"
              data-ocid="admin.models.submit_button"
              disabled={addPhoto.isPending || !imageUrl.trim()}
              className="w-full font-black"
            >
              {addPhoto.isPending ? "Adding…" : "Add Photo"}
            </Button>
          </form>
        </section>

        {/* ─── Photo List — single column ──────────────────────────────────── */}
        <section>
          <h2 className="font-display font-black text-base text-foreground mb-3">
            All Photos ({photos.length})
          </h2>

          {isLoading ? (
            <div className="flex flex-col gap-6">
              {SKEL_KEYS.map((k) => (
                <Skeleton key={k} className="aspect-[3/4] w-full rounded-2xl" />
              ))}
            </div>
          ) : photos.length === 0 ? (
            <div
              data-ocid="admin.models.empty_state"
              className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-dashed border-border/40"
            >
              <ImagePlus size={28} className="text-muted-foreground mb-3" />
              <p className="text-sm font-bold text-foreground mb-1">
                No photos yet
              </p>
              <p className="text-xs text-muted-foreground">
                Paste an image URL above to add your first model photo.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {photos.map((photo, i) => {
                const linkedPid = productLinks[photo.id];
                const linkedProduct = linkedPid
                  ? productMap.get(linkedPid)
                  : undefined;
                return (
                  <AdminModelCard
                    key={photo.id}
                    photo={photo}
                    index={i}
                    onDelete={() => handleDelete(photo.id)}
                    isDeleting={deletingId === photo.id}
                    linkedProductName={linkedProduct?.name}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
