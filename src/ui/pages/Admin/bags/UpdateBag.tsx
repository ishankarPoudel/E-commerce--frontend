import { BagEntity, BagType } from "@/api";
import {
  getCategoriesOptions,
  getUploadSignatureOptions,
  saveMultipleImagesToDbMutation,
  updateBagMutation,
} from "@/api/@tanstack/react-query.gen";
import { Badge } from "@/ui/shadcn/badge";
import { Button } from "@/ui/shadcn/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/shadcn/form";
import { Input } from "@/ui/shadcn/input";
import { Label } from "@/ui/shadcn/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/shadcn/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/shadcn/select";
import { Textarea } from "@/ui/shadcn/textarea";
import { Switch } from "@/ui/shadcn/switch";
import { UpdateBagValidator } from "@/validators/updateBag.validators";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { Checkbox } from "@radix-ui/react-checkbox";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Upload,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Package,
  Tag,
  Ruler,
  Layers,
  Star,
  Plus,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

type UpdateBagProps = {
  bag: BagEntity;
};

// Type for Cloudinary upload response
interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

// Type for image upload state
interface ImageUploadState {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "success" | "error";
  cloudinaryData?: CloudinaryUploadResult;
  error?: string;
}

// Type for existing images
interface ExistingImage {
  id: string;
  url: string;
  publicId: string;
  altText?: string;
  format?: string;
}

const FEATURE_OPTIONS = [
  { key: "hasWheels", label: "Has Wheels" },
  { key: "chestStrap", label: "Chest Strap" },
  { key: "expandable", label: "Expandable" },
  { key: "waterproof", label: "Waterproof" },
  { key: "waterResistant", label: "Water Resistant" },
  { key: "innerPockets", label: "Inner Pockets" },
  { key: "paddedStraps", label: "Padded Straps" },
  { key: "zipperClosure", label: "Zipper Closure" },
  { key: "telescopicHandle", label: "Telescopic Handle" },
  { key: "laptopCompartment", label: "Laptop Compartment" },
  { key: "hasLaptopCompartment", label: "Has Laptop Compartment" },
  { key: "hasReflectiveStraps", label: "Reflective Straps" },
  { key: "hydrationPackCompatible", label: "Hydration Pack Compatible" },
];

// Define bag types enum values
const BAG_TYPES: BagType[] = [
  "handbag",
  "backpack",
  "duffel",
  "tote",
  "crossbody",
  "laptop_bag",
  "luggage",
  "suitcase",
  "travel_set",
  "school_bag",
];

const UpdateBag = ({ bag }: UpdateBagProps) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for existing images (from database)
  const [existingImages, setExistingImages] = useState<ExistingImage[]>(
    bag.images?.map((img: any) => ({
      id: img.id,
      url: img.url,
      publicId: img.publicId,
      altText: img.altText,
      format: img.format,
    })) || [],
  );

  // State for new images to upload
  const [newImageUploads, setNewImageUploads] = useState<ImageUploadState[]>(
    [],
  );

  // State for dynamic fields - Initialize from bag data
  const [selectedColors, setSelectedColors] = useState<string[]>(
    bag.colors || [],
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(bag.sizes || []);
  const [features, setFeatures] = useState<Record<string, boolean>>(
    bag.features || {},
  );

  // State for custom color/size input
  const [newColor, setNewColor] = useState("");
  const [newSize, setNewSize] = useState("");

  console.log("UpdateBag bag data:", bag);
  console.log("Bag colors from API:", bag.colors);
  console.log("Bag sizes from API:", bag.sizes);
  console.log("Selected colors state:", selectedColors);
  console.log("Selected sizes state:", selectedSizes);

  const form = useForm<UpdateBagValidator>({
    resolver: classValidatorResolver(UpdateBagValidator),
    defaultValues: {
      name: bag.name,
      type: bag.type as BagType,
      price: bag.price,
      description: bag.description,
      brand: bag.brand || "",
      material: bag.material || "",
      weightKg: bag.weightKg || 0,
      capacityLiters: bag.capacityLiters || 0,
      isFeatured: bag.isFeatured || false,
      categories: bag.categories?.map((cat) => cat.id) || [],
    },
  });

  const { data: categoriesData } = useQuery(getCategoriesOptions());

  // Fetch Cloudinary signature
  const {
    data: signatureData,
    isLoading: isSignatureLoading,
    refetch: refetchSignature,
  } = useQuery({
    ...getUploadSignatureOptions(),
    staleTime: 5 * 60 * 1000,
  });

  const categoryLabelMap = useMemo(() => {
    const map: Record<string, string> = {};
    categoriesData?.data?.forEach((cat) => {
      if (cat.id && cat.categoryName) {
        map[cat.id] = cat.categoryName;
      }
    });
    return map;
  }, [categoriesData]);

  const { mutate: updateBag } = useMutation({
    ...updateBagMutation(),
  });

  const { mutate: saveMultipleImages } = useMutation({
    ...saveMultipleImagesToDbMutation(),
  });

  // Add custom color
  const handleAddColor = () => {
    const trimmedColor = newColor.trim().toLowerCase();
    if (trimmedColor && !selectedColors.includes(trimmedColor)) {
      setSelectedColors((prev) => [...prev, trimmedColor]);
      setNewColor("");
      toast.success(`Color "${trimmedColor}" added`);
    } else if (selectedColors.includes(trimmedColor)) {
      toast.error("Color already added");
    }
  };

  // Add custom size
  const handleAddSize = () => {
    const trimmedSize = newSize.trim().toLowerCase();
    if (trimmedSize && !selectedSizes.includes(trimmedSize)) {
      setSelectedSizes((prev) => [...prev, trimmedSize]);
      setNewSize("");
      toast.success(`Size "${trimmedSize}" added`);
    } else if (selectedSizes.includes(trimmedSize)) {
      toast.error("Size already added");
    }
  };

  // Remove color
  const handleRemoveColor = (color: string) => {
    setSelectedColors((prev) => prev.filter((c) => c !== color));
  };

  // Remove size
  const handleRemoveSize = (size: string) => {
    setSelectedSizes((prev) => prev.filter((s) => s !== size));
  };

  // Handle new image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newUploads: ImageUploadState[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      status: "pending",
    }));

    setNewImageUploads((prev) => [...prev, ...newUploads]);
    e.target.value = "";
  };

  // Remove existing image
  const removeExistingImage = (imageId: string) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    toast.info("Image marked for removal");
  };

  // Remove new upload
  const removeNewImage = (index: number) => {
    setNewImageUploads((prev) => {
      const newUploads = [...prev];
      URL.revokeObjectURL(newUploads[index].preview);
      newUploads.splice(index, 1);
      return newUploads;
    });
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      newImageUploads.forEach((upload) => URL.revokeObjectURL(upload.preview));
    };
  }, []);

  // Upload single image to Cloudinary
  const uploadToCloudinary = async (
    file: File,
    signature: {
      timestamp: number;
      signature: string;
      cloudName: string;
      apiKey: string;
    },
  ): Promise<CloudinaryUploadResult> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signature.apiKey);
    formData.append("timestamp", signature.timestamp.toString());
    formData.append("signature", signature.signature);
    formData.append("folder", "bags");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Cloudinary error:", errorData);
      throw new Error(
        errorData.error?.message || "Failed to upload to Cloudinary",
      );
    }

    return response.json();
  };

  // Save images to database
  const saveImagesToDatabase = (
    bagId: string,
    images: CloudinaryUploadResult[],
  ): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      saveMultipleImages(
        {
          body: {
            bagId,
            images: images.map((img, index) => ({
              url: img.secure_url,
              publicId: img.public_id,
              format: img.format,
              width: img.width,
              height: img.height,
              bytes: img.bytes,
              sortOrder: existingImages.length + index,
            })),
          },
        },
        {
          onSuccess: (data) => resolve(data),
          onError: (error) => reject(error),
        },
      );
    });
  };

  const onSubmit = async (data: UpdateBagValidator) => {
    if (existingImages.length === 0 && newImageUploads.length === 0) {
      toast.error("Please keep or upload at least one image");
      return;
    }

    if (newImageUploads.length > 0) {
      if (
        !signatureData?.apiKey ||
        !signatureData?.signature ||
        !signatureData?.cloudName ||
        !signatureData?.timestamp
      ) {
        toast.error(
          "Unable to get upload credentials. Please refresh and try again.",
        );
        await refetchSignature();
        return;
      }
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting with colors:", selectedColors);
      console.log("Submitting with sizes:", selectedSizes);

      const bagResponse = await new Promise<{ data: { id: string } }>(
        (resolve, reject) => {
          updateBag(
            {
              path: { id: bag.id },
              body: {
                name: data.name,
                //@ts-expect-error
                type: data.type as BagType,
                price: Number(data.price),
                description: data.description,
                brand: data.brand,
                material: data.material,
                colors: selectedColors,
                sizes: selectedSizes,
                weightKg: Number(data.weightKg),
                capacityLiters: Number(data.capacityLiters),
                isFeatured: data.isFeatured,
                features: features,
                categories: data.categories || [],
                bagImages: existingImages.map((img) => img.id),
              },
            },
            {
              onSuccess: (response) =>
                resolve(response as { data: { id: string } }),
              onError: (error) => {
                console.error("Update bag error:", error);
                reject(
                  new Error(
                    error instanceof Error
                      ? error.message
                      : "Failed to update bag",
                  ),
                );
              },
            },
          );
        },
      );

      const bagId = bagResponse.data?.id || bag.id;
      toast.success("Bag updated successfully!");

      if (newImageUploads.length > 0) {
        toast.info(`Uploading ${newImageUploads.length} new image(s)...`);

        const uploadedImages: CloudinaryUploadResult[] = [];

        for (let i = 0; i < newImageUploads.length; i++) {
          const upload = newImageUploads[i];

          setNewImageUploads((prev) => {
            const newUploads = [...prev];
            newUploads[i] = { ...newUploads[i], status: "uploading" };
            return newUploads;
          });

          try {
            const result = await uploadToCloudinary(upload.file, {
              timestamp: signatureData!.timestamp,
              signature: signatureData!.signature,
              cloudName: signatureData!.cloudName,
              apiKey: signatureData!.apiKey,
            });

            uploadedImages.push(result);

            setNewImageUploads((prev) => {
              const newUploads = [...prev];
              newUploads[i] = {
                ...newUploads[i],
                status: "success",
                cloudinaryData: result,
              };
              return newUploads;
            });
          } catch (error) {
            setNewImageUploads((prev) => {
              const newUploads = [...prev];
              newUploads[i] = {
                ...newUploads[i],
                status: "error",
                error: error instanceof Error ? error.message : "Upload failed",
              };
              return newUploads;
            });
          }
        }

        if (uploadedImages.length > 0) {
          await saveImagesToDatabase(bagId, uploadedImages);
          toast.success(
            `Bag updated with ${uploadedImages.length} new image(s)!`,
          );
        }
      }

      queryClient.invalidateQueries({ queryKey: ["getAllBags"] });
      queryClient.invalidateQueries({ queryKey: ["getBagById", bag.id] });

      setNewImageUploads([]);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update bag",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSignatureLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <ImageIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Update Bag
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Edit all bag details and manage images
              </p>
            </div>
          </div>
        </div>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 flex items-center gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
                <Package className="h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Basic Information
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-2">
                      <FormLabel>Bag Name *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Elegant Leather Tote"
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bag Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BAG_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (NPR) *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Nike, Adidas..."
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="material"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Leather, Nylon..."
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-3">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={4}
                          placeholder="Describe the bag features, usage..."
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Specifications */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 flex items-center gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
                <Ruler className="h-5 w-5 text-purple-500" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Specifications
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="weightKg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capacityLiters"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity (liters)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Colors - Dynamic */}
                <div className="space-y-3 md:col-span-2">
                  <Label>Available Colors</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      placeholder="Enter color (e.g., red, blue)"
                      className="h-10"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddColor();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={handleAddColor}
                      size="sm"
                      className="h-10"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                    {selectedColors.length === 0 ? (
                      <span className="text-sm text-muted-foreground">
                        No colors added yet
                      </span>
                    ) : (
                      selectedColors.map((color) => (
                        <Badge
                          key={color}
                          variant="secondary"
                          className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          onClick={() => handleRemoveColor(color)}
                        >
                          {color}
                          <X className="h-3 w-3 ml-1" />
                        </Badge>
                      ))
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedColors.length} color(s) • Click badge to remove
                  </p>
                </div>

                {/* Sizes - Dynamic */}
                <div className="space-y-3 md:col-span-2">
                  <Label>Available Sizes</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      placeholder="Enter size (e.g., sm, md, lg)"
                      className="h-10"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSize();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={handleAddSize}
                      size="sm"
                      className="h-10"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                    {selectedSizes.length === 0 ? (
                      <span className="text-sm text-muted-foreground">
                        No sizes added yet
                      </span>
                    ) : (
                      selectedSizes.map((size) => (
                        <Badge
                          key={size}
                          variant="secondary"
                          className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          onClick={() => handleRemoveSize(size)}
                        >
                          {size.toUpperCase()}
                          <X className="h-3 w-3 ml-1" />
                        </Badge>
                      ))
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedSizes.length} size(s) • Click badge to remove
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 flex items-center gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
                <Layers className="h-5 w-5 text-green-500" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Features
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {FEATURE_OPTIONS.map((feature) => (
                  <div
                    key={feature.key}
                    className="flex items-center space-x-2"
                  >
                    <Switch
                      id={feature.key}
                      checked={features[feature.key] || false}
                      onCheckedChange={(checked) => {
                        setFeatures((prev) => ({
                          ...prev,
                          [feature.key]: checked,
                        }));
                      }}
                    />
                    <Label
                      htmlFor={feature.key}
                      className="cursor-pointer text-sm"
                    >
                      {feature.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 flex items-center gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
                <Tag className="h-5 w-5 text-orange-500" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Categories & Status
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Categories</FormLabel>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal h-11"
                          >
                            <span className="truncate flex-1">
                              {field.value && field.value.length > 0
                                ? field.value.map((id) => (
                                    <Badge
                                      key={id}
                                      variant="secondary"
                                      className="mr-1 mb-1 align-middle"
                                    >
                                      {categoryLabelMap[id] || id}
                                    </Badge>
                                  ))
                                : "Select categories"}
                            </span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <div className="p-1 flex flex-col gap-1 max-h-60 overflow-y-auto">
                            {categoriesData?.data?.map((opt) => (
                              <label
                                key={opt.id}
                                className="flex items-center gap-2 p-2 hover:bg-accent rounded-md cursor-pointer text-sm"
                              >
                                <Checkbox
                                  id={`cat-${opt.id}`}
                                  checked={field.value?.includes(opt.id)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || [];
                                    let newValue: string[];
                                    if (checked) {
                                      newValue = [...currentValue, opt.id];
                                    } else {
                                      newValue = currentValue.filter(
                                        (v) => v !== opt.id,
                                      );
                                    }
                                    field.onChange(newValue);
                                  }}
                                />
                                <span className="flex-1">
                                  {opt.categoryName}
                                </span>
                              </label>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          Featured Product
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Show this bag in featured sections
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Images Section - Keep existing code */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-rose-500" />
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Product Images
                  </h2>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {existingImages.length + newImageUploads.length} total
                </span>
              </div>

              <div className="space-y-6">
                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Current Images ({existingImages.length})
                    </Label>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {existingImages.map((image) => (
                        <div
                          key={image.id}
                          className="group relative aspect-square overflow-hidden rounded-lg border-2 border-blue-200 bg-slate-100 dark:border-blue-800 dark:bg-slate-950"
                        >
                          <img
                            src={image.url}
                            alt={image.altText || "Bag image"}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute top-1 right-1">
                            <Badge className="bg-blue-500/90 text-white text-[10px] px-1.5 py-0.5">
                              {image.format?.toUpperCase() || "IMG"}
                            </Badge>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExistingImage(image.id)}
                            className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images */}
                {newImageUploads.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      New Images ({newImageUploads.length})
                    </Label>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {newImageUploads.map((upload, index) => (
                        <div
                          key={index}
                          className="group relative aspect-square overflow-hidden rounded-lg border-2 border-green-200 bg-slate-100 dark:border-green-800 dark:bg-slate-950"
                        >
                          <img
                            src={upload.preview}
                            alt={`New upload ${index + 1}`}
                            className={`h-full w-full object-cover transition-opacity ${
                              upload.status === "uploading"
                                ? "opacity-50"
                                : "opacity-100"
                            }`}
                          />

                          <div className="absolute inset-0 flex items-center justify-center">
                            {upload.status === "uploading" && (
                              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            )}
                            {upload.status === "success" && (
                              <div className="rounded-full bg-green-500/20 p-2">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                              </div>
                            )}
                            {upload.status === "error" && (
                              <div className="rounded-full bg-red-500/20 p-2">
                                <AlertCircle className="h-6 w-6 text-red-500" />
                              </div>
                            )}
                          </div>

                          {upload.status !== "uploading" && (
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}

                          <div className="absolute top-1 right-1">
                            <Badge className="bg-green-500/90 text-white text-[10px] px-1.5 py-0.5">
                              NEW
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 transition-colors hover:border-blue-400 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-600 dark:hover:bg-blue-950/30">
                  <label
                    htmlFor="new-images"
                    className="flex cursor-pointer flex-col items-center gap-3"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                      <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        Add More Images
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        PNG, JPG, WEBP up to 10MB
                      </p>
                    </div>
                    <input
                      id="new-images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      disabled={isSubmitting}
                      ref={fileInputRef}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 p-6 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  (existingImages.length === 0 && newImageUploads.length === 0)
                }
                className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 hover:from-blue-700 hover:to-indigo-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Bag...
                  </>
                ) : (
                  "Update Bag"
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default UpdateBag;
