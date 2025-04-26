import type React from "react";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Trash2, Upload, ImagePlus, Check } from "lucide-react";
import { Button } from "@/ui/shadcn/button";
import { Card, CardContent } from "@/ui/shadcn/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/ui/shadcn/form";
import { Input } from "@/ui/shadcn/input";
import { AddBagValidator } from "@/validators/addbag.validators";

import { Textarea } from "@/ui/shadcn/textarea";
import { Progress } from "@/ui/shadcn/progress";
import { Badge } from "@/ui/shadcn/badge";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addBagMutation,
  getCategoriesOptions,
} from "@/api/@tanstack/react-query.gen";
import { Checkbox } from "@/ui/shadcn/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/shadcn/popover";

// Mock function for image upload
const uploadImage = async (
  file: File,
  onProgress: (progress: number) => void
) => {
  return new Promise<string>((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      onProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        // Return a fake URL for the uploaded image
        resolve(URL.createObjectURL(file));
      }
    }, 300);
  });
};

export function AddBagForm() {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<
    { file: File; preview: string; progress: number }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddBagValidator>({
    resolver: classValidatorResolver(AddBagValidator),
    defaultValues: {
      name: "",
      price: 0,
      categories: [],
      description: "",
      // images: [],
    },
  });

  //api to add the bags
  const { mutate, isPending: isBagAdding } = useMutation({
    ...addBagMutation(),
  });

  //api to fetch the bag categories from the server
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    ...getCategoriesOptions(),
  });

  const categoryLabelMap = useMemo(() => {
    if (!categories?.data) return {};
    return Object.fromEntries(
      categories.data.map((c) => [c.id, c.categoryName])
    );
  }, [categories]);
  console.log(categories?.data[0].categoryName, "categories");
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
      }));
      setImages([...images, ...newImages]);
      form.setValue(
        "bagImages",
        [...images, ...newImages].map((img) => img.file),
        { shouldValidate: true }
      );
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...images];
    URL.revokeObjectURL(updatedImages[index].preview);
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    form.setValue(
      "bagImages",
      updatedImages.map((img) => img.file),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (data: AddBagValidator) => {
    setIsSubmitting(true);

    try {
      // Upload images with progress tracking
      const uploadPromises = images.map((img, index) => {
        return uploadImage(img.file, (progress) => {
          setImages((prevImages) => {
            const newImages = [...prevImages];
            newImages[index] = { ...newImages[index], progress };
            return newImages;
          });
        });
      });

      const uploadedImageUrls = await Promise.all(uploadPromises);

      // Combine form data with uploaded image URLs
      const productData = {
        ...data,
        // imageUrls: uploadedImageUrls,
      };
      mutate(
        { body: { ...productData } },
        {
          onSuccess: (response) => {
            toast.success(response?.message || "Bag  added successfully!!!!!!");
            form.reset();
            setImages([]);
          },
          onError: (error) => {
            toast.error(error.message || "Failed to add bag");
          },
        }
      );

      // Reset form after successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className='max-w-3xl mx-auto p-4 md:p-6 bg-white rounded-xl shadow-sm'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
          Add New Bag
        </h1>
        <p className='text-muted-foreground mt-2'>
          Fill in the details below to add a new bag to your inventory.
        </p>
      </div>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <div className='grid gap-6 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-medium'>
                    Bag Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Elegant Leather Tote'
                      {...field}
                      className='focus-visible:ring-2 focus-visible:ring-offset-1 transition-all'
                    />
                  </FormControl>
                  <FormDescription className='text-xs'>
                    Enter the full product name as it will appear to customers.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-medium'>
                    Price ($)
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>
                        $
                      </span>
                      <Input
                        type='number'
                        step='0.01'
                        placeholder='99.99'
                        className='pl-7 focus-visible:ring-2 focus-visible:ring-offset-1 transition-all'
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription className='text-xs'>
                    Enter the retail price in USD.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='categories'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-medium'>
                  Categories
                </FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type='button'
                      variant='outline'
                      className='w-full justify-start'
                      onClick={() => setOpen((prev) => !prev)}>
                      <div className='flex flex-wrap gap-1'>
                        {Array.isArray(field.value) &&
                        field.value.length > 0 ? (
                          field.value.map((cat) => (
                            <Badge
                              key={cat}
                              variant='secondary'
                              className='text-xs px-2 py-1 rounded bg-primary/10 text-primary'>
                              {categoryLabelMap[cat] || cat}
                            </Badge>
                          ))
                        ) : (
                          <span className='text-muted-foreground'>
                            Select categories
                          </span>
                        )}
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-72 p-2'>
                    <div className='flex flex-col gap-2'>
                      {categories?.data.map((option) => (
                        <label
                          key={option.id}
                          className='flex items-center gap-2 cursor-pointer'>
                          <Checkbox
                            checked={
                              Array.isArray(field.value) &&
                              field.value.includes(option.id)
                            }
                            onCheckedChange={(checked) => {
                              let newValue = Array.isArray(field.value)
                                ? [...field.value]
                                : [];
                              if (checked) {
                                newValue.push(option.id); // ✅ push id
                              } else {
                                newValue = newValue.filter(
                                  (v) => v !== option.id
                                );
                              }
                              field.onChange(newValue);
                            }}
                          />
                          <span>{option.categoryName}</span>{" "}
                          {/* ✅ Show name, store id */}
                        </label>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <FormDescription className='text-xs'>
                  Select one or more categories for this bag.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-medium'>
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the bag's features, materials, dimensions, and other important details..."
                    className='min-h-32 focus-visible:ring-2 focus-visible:ring-offset-1 transition-all resize-none'
                    {...field}
                  />
                </FormControl>
                <FormDescription className='text-xs'>
                  Provide a detailed description of the bag. Include materials,
                  dimensions, and key features.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='images'
            render={({ field: { value, ...fieldProps } }) => (
              <FormItem>
                <FormLabel className='text-sm font-medium'>
                  Product Images
                </FormLabel>
                <FormControl>
                  <div className='border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50 transition-all hover:bg-gray-100/50 hover:border-primary/30'>
                    <div className='h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                      <ImagePlus className='h-8 w-8 text-primary' />
                    </div>
                    <p className='text-sm font-medium text-gray-700 mb-1'>
                      Drag and drop product images
                    </p>
                    <p className='text-xs text-muted-foreground mb-4'>
                      or click to browse from your device
                    </p>
                    <Input
                      type='file'
                      accept='image/*'
                      multiple
                      className='hidden'
                      id='image-upload'
                      // onChange={handleImageChange}
                      {...fieldProps}
                    />
                    <Button
                      type='button'
                      variant='outline'
                      className='transition-all hover:bg-primary hover:text-white'
                      onClick={() =>
                        document.getElementById("image-upload")?.click()
                      }>
                      <Upload className='h-4 w-4 mr-2' />
                      Select Images
                    </Button>
                  </div>
                </FormControl>
                <FormDescription className='text-xs flex items-center mt-2'>
                  <Badge
                    variant='outline'
                    className='mr-2 bg-primary/5 text-primary text-[10px] font-normal'>
                    TIP
                  </Badge>
                  Upload high-quality images from different angles. Recommended
                  size: 1200×1200px.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {images.length > 0 && (
            <div className='space-y-4'>
              <h3 className='text-sm font-medium'>
                Selected Images ({images.length})
              </h3>
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {images.map((image, index) => (
                  <Card
                    key={index}
                    className='overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all'>
                    <CardContent className='p-0'>
                      <div className='relative aspect-square overflow-hidden'>
                        <img
                          src={image.preview || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className='object-cover w-full h-full'
                        />
                        <Button
                          type='button'
                          variant='destructive'
                          size='icon'
                          className='absolute top-2 right-2 h-7 w-7 rounded-full shadow-md opacity-90 hover:opacity-100'
                          onClick={() => removeImage(index)}>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                        {image.progress === 100 && (
                          <div className='absolute bottom-0 right-0 m-2 bg-green-500 text-white p-1 rounded-full h-6 w-6 flex items-center justify-center'>
                            <Check className='h-3 w-3' />
                          </div>
                        )}
                      </div>
                      {image.progress > 0 && image.progress < 100 && (
                        <div className='p-2 bg-white'>
                          <Progress
                            value={image.progress}
                            className='h-1.5 rounded-full'
                          />
                          <p className='text-[10px] text-center mt-1 font-medium text-gray-500'>
                            Uploading: {image.progress}%
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className='flex justify-end gap-4 pt-4 border-t'>
            <Button
              type='button'
              variant='outline'
              onClick={() => form.reset()}>
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isBagAdding}
              className='px-6 transition-all'>
              {isBagAdding ? "Adding Product..." : "Add Product"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
