import { BagEntity } from "@/api";
import {
  getCategoriesOptions,
  updateBagMutation,
  uploadMediaMutation,
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
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/shadcn/popover";
import { Textarea } from "@/ui/shadcn/textarea";
import { getImageUrl } from "@/utils/urlHelpers";
import { UpdateBagValidator } from "@/validators/updateBag.validators";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { Checkbox } from "@radix-ui/react-checkbox";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Upload, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

type UpdateBagProps = {
  bag: BagEntity;
};

const UpdateBag = ({ bag }: UpdateBagProps) => {
  const [images, setImages] = useState<File[]>([]);
  const [open, setOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [existingImageIds, setExistingImageIds] = useState<string[]>(
    bag.bagImages.map((img) => img.id)
  );
  console.log("UpdateBag is as follow", bag);

  const form = useForm<UpdateBagValidator>({
    resolver: classValidatorResolver(UpdateBagValidator),
    defaultValues: {
      name: bag.name,
      price: bag.price,
      description: bag.description,
      categories: bag.categories.map((cat) => {
        return cat.id;
      }),
    },
  });

  useEffect(() => {
    if (bag.bagImages && bag.bagImages.length > 0) {
      setPreviewImages(bag.bagImages.map((img) => img.image));
    }
  }, [bag.bagImages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (!files?.length) return;

    const fileArray = Array.from(files);
    const newPreviewUrls = fileArray.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviewUrls]);
    setImages((prev) => [...prev, ...fileArray]);
  };

  const removeImage = (index: number) => {
    if (index < bag.bagImages.length) {
      setExistingImageIds((prev) => prev.filter((id, i) => i !== index));
    } else {
      // It's a new upload, remove from images state
      setImages((prev) =>
        prev.filter((_, i) => i !== index - bag.bagImages.length)
      );
    }
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const { data: categoriesData } = useQuery(getCategoriesOptions());

  const categoryLabelMap = useMemo(() => {
    const map: Record<string, string> = {};
    categoriesData?.data?.forEach((cat) => {
      if (cat.id && cat.categoryName) {
        map[cat.id] = cat.categoryName;
      }
    });
    return map;
  }, [categoriesData]);

  const { mutate: updateBag, isPending: isBagUpdating } = useMutation({
    ...updateBagMutation(),
  });

  const { mutateAsync: uploadMedia, isPending: isImageUploading } = useMutation(
    uploadMediaMutation()
  );

  const onSubmit = async (data: UpdateBagValidator) => {
    const { images: validatedFormImages, ...bagData } = data;

    await updateBag(
      {
        path: { id: bag.id },
        body: {
          ...bagData,
          bagImages: existingImageIds,
        },
      },
      {
        onSuccess: async (resp) => {
          const bagId = resp.data.id;
          toast.success(resp.message || "Bag updated successfully");

          // uploading images one by one
          if (images.length > 0) {
            toast.info(`Uploading ${images.length} image(s)...`);
            let allUploadsSuccessful = true;
            for (const singleFile of images) {
              try {
                await uploadMedia({
                  body: {
                    bagId: bagId,
                    file: singleFile,
                  },
                });
              } catch (uploadError: any) {
                allUploadsSuccessful = false;
                console.error("Failed to upload an image:", uploadError);
                toast.error(
                  `Failed to upload image ${singleFile.name}: ${
                    uploadError.message || "Unknown error"
                  }`
                );
              }
            }
            if (allUploadsSuccessful) {
              toast.success("All images uploaded successfully!");
            } else {
              toast.warning("Some images failed to upload. Please check logs.");
            }
          }
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to update bag");
        },
      }
    );
  };
  return (
    <div className='max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm'>
      <h1 className='text-3xl font-bold mb-4'>Update Bag</h1>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {/* Name & Price */}
          <div className='grid md:grid-cols-2 gap-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bag Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Elegant Leather Tote' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='number'
                      step='0.01'
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Categories */}
          <FormField
            control={form.control}
            name='categories'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categories</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className='w-full justify-start text-left font-normal'>
                      <span className='truncate flex-1'>
                        {field.value && field.value.length > 0
                          ? field.value.map((id) => (
                              <Badge
                                key={id}
                                variant='secondary'
                                className='mr-1 mb-1 align-middle'>
                                {categoryLabelMap[id] || id}
                              </Badge>
                            ))
                          : "Select categories"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
                    <div className='p-1 flex flex-col gap-1 max-h-60 overflow-y-auto'>
                      {categoriesData?.data?.map((opt) => (
                        <label
                          key={opt.id}
                          className='flex items-center gap-2 p-2 hover:bg-accent rounded-md cursor-pointer text-sm'>
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
                                  (v) => v !== opt.id
                                );
                              }
                              field.onChange(newValue);
                            }}
                          />
                          <span className='flex-1'>{opt.categoryName}</span>
                        </label>
                      ))}
                      {(!categoriesData?.data ||
                        categoriesData.data.length === 0) && (
                        <span className='p-2 text-sm text-muted-foreground'>
                          No categories available.
                        </span>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
                    placeholder='Describe the bag...'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload Section */}
          <div className='space-y-2'>
            <FormLabel>Bag Images</FormLabel>
            <div className='border-2 border-dashed rounded-lg p-6 bg-slate-50'>
              {!previewImages.length ? (
                <div className='flex flex-col items-center justify-center space-y-2 text-slate-400'>
                  <Upload className='w-12 h-12 animate-pulse' />
                  <p className='text-sm'>Click below to upload bag images</p>
                </div>
              ) : (
                <div className='flex flex-wrap gap-4'>
                  {previewImages.map((src, idx) => (
                    <div
                      key={idx}
                      className='relative w-48 h-48 rounded-lg overflow-hidden border'>
                      <img
                        src={getImageUrl(src)}
                        alt={`Preview ${idx}`}
                        className='object-cover w-full h-full'
                      />
                      <Button
                        type='button'
                        variant='destructive'
                        size='icon'
                        className='absolute top-2 right-2'
                        onClick={() => removeImage(idx)}>
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => fileInputRef.current?.click()}
                className='mt-4 justify-center w-full'>
                {previewImages.length ? "Add More Images" : "Upload Images"}
              </Button>
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                multiple
                onChange={handleImageChange}
                className='hidden'
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            className='w-full'
            disabled={isBagUpdating || isImageUploading}>
            {isBagUpdating || isImageUploading ? "Submitting..." : "Add Bag"}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default UpdateBag;
