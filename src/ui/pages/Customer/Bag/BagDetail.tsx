import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/ui/shadcn/badge";
import { Button } from "@/ui/shadcn/button";
import { Card } from "@/ui/shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/shadcn/tabs";
import { ScrollArea } from "@/ui/shadcn/scroll-area";
import { Separator } from "@/ui/shadcn/separator";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  Maximize2,
  Package,
  Ruler,
  Tag,
  Weight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/ui/pages/Customer/Search/ProductCard";
import { getImageUrl } from "@/utils/urlHelpers";
import { Image } from "@/ui/shadcn/image";
import AddToCartButton from "@/ui/molecules/Buttons/AddToCart";
import { getColorHex } from "@/ui/organisms/products/DetailProduct";

interface BagDetailProps {
  product: Product | null;
  onBack?: () => void;
}

export function BagDetail({ product, onBack }: BagDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>();
  const [selectedSize, setSelectedSize] = useState<string>();

  useEffect(() => {
    if (!product) return;
    setSelectedImage(0);
    setIsFullscreen(false);

    const firstColor = product.colors?.[0];
    setSelectedColor(
      typeof firstColor === "string"
        ? firstColor
        : firstColor?.name ?? undefined
    );
    setSelectedSize(product.sizes?.[0]);
  }, [product]);

  const gallery = product?.images ?? [];
  const hasGallery = gallery.length > 0;

  const featureList = useMemo(() => {
    if (!product?.features) return [];
    return Object.entries(product.features)
      .filter(([, value]) => Boolean(value))
      .map(([key]) =>
        key
          .replace(/([A-Z])/g, " $1")
          .replace(/-/g, " ")
          .replace(/^./, (c) => c.toUpperCase())
      );
  }, [product]);

  if (!product) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-background text-muted-foreground">
        <div className="rounded-2xl border border-border px-10 py-14 text-center shadow-sm">
          Loading bag details…
        </div>
      </section>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-16 pt-12 md:px-6 lg:flex-row">
        <section className="flex-1 space-y-6">
          <header className="flex flex-col justify-between gap-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {product.isFeatured && (
                  <Badge className="rounded-full px-3 py-1 text-xs font-medium">
                    Featured
                  </Badge>
                )}
                {product.categories?.[0]?.categoryName && (
                  <Badge
                    variant="outline"
                    className="rounded-full px-3 py-1 text-xs font-medium"
                  >
                    {product.categories[0].categoryName}
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
                {product.name}
              </h1>
              <p className="max-w-xl text-sm text-muted-foreground">
                {product.description ?? "Discover your next carry companion."}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Award className="h-3.5 w-3.5" />
                  {product.brand ?? "Premium labels"}
                </span>
                <Separator
                  orientation="vertical"
                  className="hidden h-4 md:block"
                />
                {onBack && (
                  <button
                    onClick={onBack}
                    className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to search
                  </button>
                )}
              </div>
            </div>

            <div className="w-full rounded-2xl border border-border bg-muted/40 px-5 py-4 text-right sm:w-auto">
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Price
              </span>
              <p className="mt-2 text-3xl font-semibold text-primary">
                रु {Number(product.price ?? 0).toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Tax-inclusive • Free returns in 30 days
              </p>
            </div>
          </header>

          <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="relative mx-auto h-[320px] w-full max-w-[420px] sm:h-[420px]">
              {hasGallery ? (
                <Image
                  key={selectedImage}
                  src={getProductImage(gallery[selectedImage])}
                  alt={`${product.name} ${selectedImage + 1}`}
                  fill
                  priority
                  sizes="(max-width: 768px) 90vw, 50vw"
                  className="object-cover transition duration-500"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No preview available
                </div>
              )}

              {gallery.length > 1 && (
                <>
                  <MediaControl
                    side="left"
                    icon={ChevronLeft}
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === 0 ? gallery.length - 1 : prev - 1
                      )
                    }
                  />
                  <MediaControl
                    side="right"
                    icon={ChevronRight}
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === gallery.length - 1 ? 0 : prev + 1
                      )
                    }
                  />
                </>
              )}

              <div className="absolute bottom-3 right-3 flex items-center gap-2 sm:bottom-4 sm:right-4">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                  onClick={() => setIsFullscreen(true)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {gallery.length > 1 && (
              <div className="border-t border-border bg-muted/40">
                <ScrollArea className="w-full py-3 sm:py-4">
                  <div className="flex gap-3 px-4">
                    {gallery.map((image, index) => (
                      <button
                        key={
                          typeof image === "string"
                            ? image
                            : (image as string) ?? index
                        }
                        onClick={() => setSelectedImage(index)}
                        className={cn(
                          "relative h-14 w-14 overflow-hidden rounded-xl border border-border transition hover:-translate-y-1 hover:border-primary/60 sm:h-16 sm:w-16",
                          selectedImage === index &&
                            "border-primary ring-2 ring-primary/30"
                        )}
                        aria-label={`Preview ${index + 1}`}
                      >
                        <Image
                          src={getProductImage(image)}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </Card>
        </section>

        <aside className="w-full space-y-6 lg:max-w-[360px]">
          <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="space-y-5">
              {product.colors?.length ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <span>Color</span>
                    {selectedColor && (
                      <span className="font-medium text-foreground">
                        {selectedColor}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => {
                      const label =
                        typeof color === "string"
                          ? color
                          : color?.name ?? "Color";
                      const hex = resolveColorHex(color);

                      return (
                        <button
                          key={label}
                          onClick={() => setSelectedColor(label)}
                          className={cn(
                            "group relative h-10 w-10 rounded-full border border-border transition hover:-translate-y-1 hover:border-primary/60",
                            selectedColor === label && "ring-2 ring-primary/30"
                          )}
                          aria-label={label}
                        >
                          <span
                            className="absolute inset-1 rounded-full border border-white/20"
                            style={{ background: hex }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {product.sizes?.length ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <span>Size</span>
                    {selectedSize && (
                      <span className="font-medium text-foreground">
                        {selectedSize}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "rounded-lg border border-border px-3 py-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground transition hover:-translate-y-0.5 hover:border-primary hover:text-primary",
                          selectedSize === size &&
                            "border-primary bg-primary/10 text-primary"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <AddToCartButton
                product={product}
                defaultColor={selectedColor}
                defaultSize={selectedSize}
                fullWidth
                showQuantity
                className="h-12 w-full rounded-xl text-sm font-semibold shadow-sm sm:w-auto"
              />

              <div className="space-y-2 rounded-xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Free express shipping worldwide
                </p>
                <p className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Lifetime craftsmanship warranty
                </p>
                <p className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  30-day hassle-free returns
                </p>
              </div>
            </div>
          </Card>

          <Tabs
            defaultValue="overview"
            className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
          >
            <TabsList className="flex w-full flex-wrap gap-2 rounded-full bg-muted p-1 sm:grid sm:grid-cols-3 sm:gap-0">
              <TabsTrigger
                value="overview"
                className="flex-1 rounded-full text-[11px] uppercase tracking-[0.2em] data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="specs"
                className="flex-1 rounded-full text-[11px] uppercase tracking-[0.2em] data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                Specs
              </TabsTrigger>
              <TabsTrigger
                value="features"
                className="flex-1 rounded-full text-[11px] uppercase tracking-[0.2em] data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                Features
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="overview"
              className="mt-5 text-sm text-muted-foreground"
            >
              <p>
                Built for daily hustle and spontaneous adventures alike,
                <strong> {product.name}</strong> blends premium materials with
                modular storage to keep essentials organised without
                compromising style.
              </p>
              {product.description ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  {product.description}
                </p>
              ) : null}
            </TabsContent>

            <TabsContent value="specs" className="mt-5 space-y-4">
              <SpecRow
                icon={Package}
                label="Type"
                value={product.type ?? "—"}
              />
              <SpecRow
                icon={Tag}
                label="Material"
                value={product.material ?? "—"}
              />
              <SpecRow
                icon={Ruler}
                label="Capacity"
                value={`${product.capacityLiters ?? 0} L`}
              />
              <SpecRow
                icon={Weight}
                label="Weight"
                value={`${product.weightKg ?? 0} kg`}
              />
              <SpecRow
                icon={Award}
                label="Brands"
                value={product.brand ?? "—"}
              />
            </TabsContent>

            <TabsContent value="features" className="mt-5">
              {featureList.length ? (
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {featureList.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3 transition hover:-translate-y-0.5"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Feature highlights coming soon.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </aside>
      </div>

      {isFullscreen && hasGallery && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 px-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6 sm:top-6"
            onClick={() => setIsFullscreen(false)}
          >
            <ChevronRight className="h-5 w-5 rotate-90" />
          </Button>

          <div className="relative h-[75vh] w-full max-w-[900px] overflow-hidden rounded-xl border border-border bg-background sm:h-[80vh]">
            <Image
              src={getProductImage(gallery[selectedImage])}
              alt={`${product.name} fullscreen ${selectedImage + 1}`}
              fill
              priority
              sizes="90vw"
              className="object-contain"
            />
          </div>

          {gallery.length > 1 && (
            <>
              <MediaControl
                side="left"
                icon={ArrowLeft}
                onClick={() =>
                  setSelectedImage((prev) =>
                    prev === 0 ? gallery.length - 1 : prev - 1
                  )
                }
              />
              <MediaControl
                side="right"
                icon={ArrowRight}
                onClick={() =>
                  setSelectedImage((prev) =>
                    prev === gallery.length - 1 ? 0 : prev + 1
                  )
                }
              />
            </>
          )}
        </div>
      )}
    </main>
  );
}

function SpecRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Package;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground/70">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
          {label}
        </p>
        <p className="mt-0.5 text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}

function MediaControl({
  side,
  icon: Icon,
  onClick,
}: {
  side: "left" | "right";
  icon: typeof ArrowLeft;
  onClick: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn(
        "absolute top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-white/10 text-white transition hover:bg-white/20",
        side === "left" ? "left-3 sm:left-4" : "right-3 sm:right-4"
      )}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}

function getProductImage(image: any) {
  if (!image) return "https://via.placeholder.com/900x1200?text=No+Image";
  if (typeof image === "string") return getImageUrl(image);
  return getImageUrl(image.image);
}

function resolveColorHex(color: unknown) {
  if (!color) return "#9ca3af";
  if (typeof color === "string") return getColorHex(color);
  if (typeof color === "object" && "hex" in color && color.hex) {
    return String(color.hex);
  }
  if (typeof color === "object" && "name" in color && color.name) {
    return getColorHex(String(color.name));
  }
  return "#9ca3af";
}
