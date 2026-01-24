import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  X,
  Upload,
  Package,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";
import { Textarea } from "@/ui/shadcn/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addBagMutation,
  getCategoriesOptions,
  getUploadSignatureOptions,
  saveMultipleImagesToDbMutation,
} from "@/api/@tanstack/react-query.gen";
import {
  BagType,
  ProductFormData,
  validateProductForm,
} from "@/validators/addbag.validators";
import { Label } from "@/ui/shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/shadcn/select";
import { Switch } from "@/ui/shadcn/switch";
import { useState, useEffect } from "react";

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

export function AddBagForm() {
  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [imageUploads, setImageUploads] = useState<ImageUploadState[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      type: BagType.BACKPACK,
      price: 0,
      description: "",
      brand: "",
      material: "",
      colors: [],
      sizes: [],
      weightKg: undefined,
      capacityLiters: undefined,
      isFeatured: false,
      categories: [],
      images: [],
      features: {
        hasWheels: false,
        telescopicHandle: false,
        expandable: false,
        hasReflectiveStraps: false,
        laptopCompartment: false,
        hasLaptopCompartment: false,
        paddedStraps: false,
        waterproof: false,
        chestStrap: false,
        waterResistant: false,
        hydrationPackCompatible: false,
        innerPockets: false,
        zipperClosure: false,
      },
    },
  });

  const colors = watch("colors") || [];
  const sizes = watch("sizes") || [];
  const watchedBagType = watch("type");

  // Fetch categories
  const { data: categoriesData } = useQuery(getCategoriesOptions());
  const categories = categoriesData?.data || [];

  // Fetch Cloudinary signature (fetches on component mount)
  const {
    data: signatureData,
    isLoading: isSignatureLoading,
    refetch: refetchSignature,
  } = useQuery({
    ...getUploadSignatureOptions(),
    staleTime: 5 * 60 * 1000, // 5 minutes - signature is valid for a while
  });

  // Add bag mutation
  const { mutate: addBag } = useMutation(addBagMutation());

  // Save images mutation
  const { mutate: saveMultipleImages } = useMutation({
    ...saveMultipleImagesToDbMutation(),
  });

  // --- Helper Functions ---

  const addColor = () => {
    if (colorInput.trim() && !colors.includes(colorInput.trim())) {
      setValue("colors", [...colors, colorInput.trim()]);
      setColorInput("");
    }
  };

  const removeColor = (color: string) => {
    setValue(
      "colors",
      colors.filter((c) => c !== color),
    );
  };

  const addSize = () => {
    if (sizeInput.trim() && !sizes.includes(sizeInput.trim())) {
      setValue("sizes", [...sizes, sizeInput.trim()]);
      setSizeInput("");
    }
  };

  const removeSize = (size: string) => {
    setValue(
      "sizes",
      sizes.filter((s) => s !== size),
    );
  };

  const toggleCategory = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(newCategories);
    setValue("categories", newCategories);
  };

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
              sortOrder: index,
            })),
          },
        },
        {
          onSuccess: (data) => {
            resolve(data);
          },
          onError: (error) => {
            reject(error);
          },
        },
      );
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newUploads: ImageUploadState[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      status: "pending",
    }));

    setImageUploads((prev) => [...prev, ...newUploads]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImageUploads((prev) => {
      const newUploads = [...prev];
      URL.revokeObjectURL(newUploads[index].preview);
      newUploads.splice(index, 1);
      return newUploads;
    });
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      imageUploads.forEach((upload) => URL.revokeObjectURL(upload.preview));
    };
  }, []);

  // --- Form Submission ---

  const onSubmit = async (data: ProductFormData) => {
    // Validation
    if (imageUploads.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    const validationErrors = validateProductForm(data);
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        setError(error.field as keyof ProductFormData, {
          type: "manual",
          message: error.message,
        });
      });
      return;
    }

    // Check if signature is available
    if (
      !signatureData?.apiKey ||
      !signatureData?.signature ||
      !signatureData?.cloudName ||
      !signatureData?.timestamp
    ) {
      toast.error(
        "Unable to get upload credentials. Please refresh and try again.",
      );
      // Try to refetch signature
      await refetchSignature();
      return;
    }

    setIsSubmitting(true);

    try {
      //  Create bag first (without images)
      const bagResponse = await new Promise<{ data: { id: string } }>(
        (resolve, reject) => {
          addBag(
            {
              body: {
                name: data.name,
                type: data.type,
                price: Number(data.price),
                description: data.description || "",
                brand: data.brand || "",
                material: data.material || "",
                colors: data.colors || [],
                sizes: data.sizes || [],
                weightKg: data.weightKg ? Number(data.weightKg) : 0,
                capacityLiters: data.capacityLiters
                  ? Number(data.capacityLiters)
                  : 0,
                categories: selectedCategories,
                isFeatured: Boolean(data.isFeatured),
                features: {
                  hasWheels: Boolean(data.features?.hasWheels),
                  telescopicHandle: Boolean(data.features?.telescopicHandle),
                  expandable: Boolean(data.features?.expandable),
                  hasReflectiveStraps: Boolean(
                    data.features?.hasReflectiveStraps,
                  ),
                  laptopCompartment: Boolean(data.features?.laptopCompartment),
                  hasLaptopCompartment: Boolean(
                    data.features?.hasLaptopCompartment,
                  ),
                  paddedStraps: Boolean(data.features?.paddedStraps),
                  waterproof: Boolean(data.features?.waterproof),
                  chestStrap: Boolean(data.features?.chestStrap),
                  waterResistant: Boolean(data.features?.waterResistant),
                  hydrationPackCompatible: Boolean(
                    data.features?.hydrationPackCompatible,
                  ),
                  innerPockets: Boolean(data.features?.innerPockets),
                  zipperClosure: Boolean(data.features?.zipperClosure),
                },
              },
            },
            {
              onSuccess: (response) =>
                resolve(response as { data: { id: string } }),
              onError: (error) => {
                console.error("Add bag error:", error);
                reject(
                  new Error(
                    error instanceof Error
                      ? error.message
                      : "Failed to create bag",
                  ),
                );
              },
            },
          );
        },
      );

      const bagId = bagResponse.data?.id;
      if (!bagId) {
        throw new Error("Failed to get bag ID from response");
      }

      toast.success("Product created! Uploading images...");

      const uploadedImages: CloudinaryUploadResult[] = [];

      for (let i = 0; i < imageUploads.length; i++) {
        const upload = imageUploads[i];

        // Update status to uploading
        setImageUploads((prev) => {
          const newUploads = [...prev];
          newUploads[i] = { ...newUploads[i], status: "uploading" };
          return newUploads;
        });

        try {
          const result = await uploadToCloudinary(upload.file, {
            timestamp: signatureData.timestamp,
            signature: signatureData.signature,
            cloudName: signatureData.cloudName,
            apiKey: signatureData.apiKey,
          });

          uploadedImages.push(result);

          // Update status to success
          setImageUploads((prev) => {
            const newUploads = [...prev];
            newUploads[i] = {
              ...newUploads[i],
              status: "success",
              cloudinaryData: result,
            };
            return newUploads;
          });

          console.log(`Image ${i + 1} uploaded:`, result.secure_url);
        } catch (error) {
          // Update status to error
          setImageUploads((prev) => {
            const newUploads = [...prev];
            newUploads[i] = {
              ...newUploads[i],
              status: "error",
              error: error instanceof Error ? error.message : "Upload failed",
            };
            return newUploads;
          });
          console.error(`Failed to upload image ${i + 1}:`, error);
        }
      }

      if (uploadedImages.length === 0) {
        throw new Error("All image uploads failed");
      }

      // Step 4: Save images to database with bag relation
      await saveImagesToDatabase(bagId, uploadedImages);

      toast.success(`Product created with ${uploadedImages.length} image(s)!`);

      // Reset everything
      reset();
      setImageUploads([]);
      setSelectedCategories([]);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["getAllBags"] });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create product",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Logic for Conditional Fields ---
  const isLuggageType =
    watchedBagType === BagType.LUGGAGE || watchedBagType === BagType.SUITCASE;
  const isSchoolBag = watchedBagType === BagType.SCHOOL_BAG;
  const isLaptopBag = watchedBagType === BagType.LAPTOP_BAG;
  const isBackpack = watchedBagType === BagType.BACKPACK;
  const isDuffelToteHandbagCrossbody =
    watchedBagType === BagType.DUFFEL ||
    watchedBagType === BagType.TOTE ||
    watchedBagType === BagType.HANDBAG ||
    watchedBagType === BagType.CROSSBODY;

  // Show loading state if signature is still loading
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
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Add New Product
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Create a new bag or luggage item for your catalog
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Basic Information
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Product Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g., Classic Leather Backpack"
                  className="h-11"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">
                  Product Type <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(BagType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type
                              .split("_")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1),
                              )
                              .join(" ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium">
                  Price (NPR) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="50"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="0.00"
                  className="h-11"
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Describe the product features, materials, and benefits..."
                  className="min-h-[120px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Optional Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
              <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Detailed Specifications
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="brand" className="text-sm font-medium">
                  Brand
                </Label>
                <Input
                  id="brand"
                  {...register("brand")}
                  placeholder="e.g., Nike, Samsonite"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="material" className="text-sm font-medium">
                  Material
                </Label>
                <Input
                  id="material"
                  {...register("material")}
                  placeholder="e.g., Leather, Nylon, Canvas"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weightKg" className="text-sm font-medium">
                  Weight (kg)
                </Label>
                <Input
                  id="weightKg"
                  type="number"
                  step="0.01"
                  {...register("weightKg", { valueAsNumber: true })}
                  placeholder="0.00"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacityLiters" className="text-sm font-medium">
                  Capacity (liters)
                </Label>
                <Input
                  id="capacityLiters"
                  type="number"
                  step="0.1"
                  {...register("capacityLiters", { valueAsNumber: true })}
                  placeholder="0.0"
                  className="h-11"
                />
              </div>

              {/* Conditional Features Switches */}
              {isLuggageType && (
                <>
                  <div className="flex items-center justify-between space-y-0 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="hasWheels"
                        className="text-sm font-medium"
                      >
                        Has Wheels
                      </Label>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Rolling wheels for easy transport
                      </p>
                    </div>
                    <Controller
                      name="features.hasWheels"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="features.hasWheels"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  <div className="flex items-center justify-between space-y-0 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="telescopicHandle"
                        className="text-sm font-medium"
                      >
                        Telescopic Handle
                      </Label>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Adjustable height handle
                      </p>
                    </div>
                    <Controller
                      name="features.telescopicHandle"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="features.telescopicHandle"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  <div className="flex items-center justify-between space-y-0 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="expandable"
                        className="text-sm font-medium"
                      >
                        Expandable
                      </Label>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Extra capacity when needed
                      </p>
                    </div>
                    <Controller
                      name="features.expandable"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="features.expandable"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </>
              )}

              {isSchoolBag && (
                <>
                  <div className="flex items-center justify-between space-y-0 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="hasReflectiveStraps"
                        className="text-sm font-medium"
                      >
                        Reflective Straps
                      </Label>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Enhanced visibility for safety
                      </p>
                    </div>
                    <Controller
                      name="features.hasReflectiveStraps"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="features.hasReflectiveStraps"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  <div className="flex items-center justify-between space-y-0 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="laptopCompartment"
                        className="text-sm font-medium"
                      >
                        Laptop Compartment
                      </Label>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Dedicated laptop storage
                      </p>
                    </div>
                    <Controller
                      name="features.laptopCompartment"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="features.laptopCompartment"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </>
              )}

              {isLaptopBag && (
                <>
                  <div className="flex items-center justify-between space-y-0 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="hasLaptopCompartment"
                        className="text-sm font-medium"
                      >
                        Laptop Compartment
                      </Label>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Padded laptop storage
                      </p>
                    </div>
                    <Controller
                      name="features.hasLaptopCompartment"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="features.hasLaptopCompartment"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  <div className="flex items-center justify-between space-y-0 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="paddedStraps"
                        className="text-sm font-medium"
                      >
                        Padded Straps
                      </Label>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Comfortable shoulder straps
                      </p>
                    </div>
                    <Controller
                      name="features.paddedStraps"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="features.paddedStraps"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  <div className="flex items-center justify-between space-y-0 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="waterproof"
                        className="text-sm font-medium"
                      >
                        Waterproof
                      </Label>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Full water protection
                      </p>
                    </div>
                    <Controller
                      name="features.waterproof"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="waterproof"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </>
              )}

              {isBackpack && (
                <>
                  <div className="flex items-center justify-between space-y-0 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="chestStrap"
                        className="text-sm font-medium"
                      >
                        Chest Strap
                      </Label>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Sternum strap for stability
                      </p>
                    </div>
                    <Controller
                      name="features.chestStrap"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="features.chestStrap"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  <div className="flex items-center justify-between space-y-0 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="waterResistant"
                        className="text-sm font-medium"
                      >
                        Water Resistant
                      </Label>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Resists water and moisture
                      </p>
                    </div>
                    <Controller
                      name="features.waterResistant"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="features.waterResistant"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  <div className="flex items-center justify-between space-y-0 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="hydrationPackCompatible"
                        className="text-sm font-medium"
                      >
                        Hydration Pack Compatible
                      </Label>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Water bladder sleeve included
                      </p>
                    </div>
                    <Controller
                      name="features.hydrationPackCompatible"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="features.hydrationPackCompatible"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </>
              )}

              {isDuffelToteHandbagCrossbody && (
                <>
                  <div className="flex items-center justify-between space-y-0 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="innerPockets"
                        className="text-sm font-medium"
                      >
                        Inner Pockets
                      </Label>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Internal organization pockets
                      </p>
                    </div>
                    <Controller
                      name="features.innerPockets"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="features.innerPockets"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  <div className="flex items-center justify-between space-y-0 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="zipperClosure"
                        className="text-sm font-medium"
                      >
                        Zipper Closure
                      </Label>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Secure zip closure system
                      </p>
                    </div>
                    <Controller
                      name="features.zipperClosure"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="features.zipperClosure"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Colors & Sizes */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Colors & Sizes
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Colors */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Available Colors</Label>
                <div className="flex gap-2">
                  <Input
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addColor();
                      }
                    }}
                    placeholder="Enter color"
                    className="h-10"
                  />
                  <Button
                    type="button"
                    onClick={addColor}
                    variant="outline"
                    className="shrink-0 bg-transparent"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <div
                      key={color}
                      className="flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-1.5 text-sm text-blue-900 dark:bg-blue-950 dark:text-blue-100"
                    >
                      <span>{color}</span>
                      <button
                        type="button"
                        onClick={() => removeColor(color)}
                        className="ml-1 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Available Sizes</Label>
                <div className="flex gap-2">
                  <Input
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSize();
                      }
                    }}
                    placeholder="Enter size"
                    className="h-10"
                  />
                  <Button
                    type="button"
                    onClick={addSize}
                    variant="outline"
                    className="shrink-0 bg-transparent"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <div
                      key={size}
                      className="flex items-center gap-1 rounded-lg bg-indigo-100 px-3 py-1.5 text-sm text-indigo-900 dark:bg-indigo-950 dark:text-indigo-100"
                    >
                      <span>{size}</span>
                      <button
                        type="button"
                        onClick={() => removeSize(size)}
                        className="ml-1 hover:text-indigo-700 dark:hover:text-indigo-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Categories & Featured */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Categories & Settings
                </h2>
              </div>
              {selectedCategories.length > 0 && (
                <div className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <span>{selectedCategories.length} selected</span>
                </div>
              )}
            </div>
            <div className="space-y-6">
              {/* Categories */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Product Categories
                </Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      className={`rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all ${
                        selectedCategories.includes(category.id)
                          ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950 dark:text-blue-300"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      {category.categoryName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="space-y-0.5">
                  <Label htmlFor="isFeatured" className="text-base font-medium">
                    Featured Product
                  </Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Highlight this product on the homepage
                  </p>
                </div>
                <Controller
                  name="isFeatured"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="isFeatured"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Product Images <span className="text-red-500">*</span>
                </h2>
              </div>
              {imageUploads.length > 0 && (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {imageUploads.length} image(s) selected
                </span>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 transition-colors hover:border-blue-400 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-600 dark:hover:bg-blue-950/30">
                <label
                  htmlFor="images"
                  className="flex cursor-pointer flex-col items-center gap-3"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                    <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Click to upload images
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      PNG, JPG, WEBP up to 10MB
                    </p>
                  </div>
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                </label>
              </div>

              {imageUploads.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {imageUploads.map((upload, index) => (
                    <div
                      key={index}
                      className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950"
                    >
                      <img
                        src={upload.preview}
                        alt={`Preview ${index + 1}`}
                        className={`h-full w-full object-cover transition-opacity ${
                          upload.status === "uploading"
                            ? "opacity-50"
                            : "opacity-100"
                        }`}
                      />

                      {/* Status Overlay */}
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

                      {/* Remove Button */}
                      {upload.status !== "uploading" && (
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 p-6 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => {
                reset();
                setImageUploads([]);
                setSelectedCategories([]);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || imageUploads.length === 0}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 hover:from-blue-700 hover:to-indigo-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Product...
                </>
              ) : (
                "Create Product"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
