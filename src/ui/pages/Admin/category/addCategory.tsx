import type React from "react";
import { useState } from "react";
import { Form, FormProvider, useForm } from "react-hook-form";
import { Upload, Plus, Loader2 } from "lucide-react";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { AddCategoryValidator } from "@/validators/addCategory.validators";
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
import { useMutation } from "@tanstack/react-query";
import { addCategoryMutation } from "@/api/@tanstack/react-query.gen";
import { toast } from "sonner";

export function BagCategoryForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddCategoryValidator>({
    resolver: classValidatorResolver(AddCategoryValidator),
    defaultValues: {
      categoryName: "",
    },
  });

  const { mutate, isPending: isCategoryAdding } = useMutation({
    ...addCategoryMutation(),
  });

  const onSubmit = async (data: AddCategoryValidator) => {
    setIsSubmitting(true);
    mutate(
      { body: { ...data } },
      {
        onSuccess: (response) => {
          toast.success(response.message || "Category added successfully!");
          form.reset();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to add category.");
          setImagePreview(null);
        },
      }
    );

    // Simulate API call
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   const file = e.target.files?.[0];
    //   if (file) {
    //     form.setValue("categoryImages", file);
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //       setImagePreview(reader.result as string);
    //     };
    //     reader.readAsDataURL(file);
    //   }
  };

  return (
    <div className='max-w-3xl mx-auto p-4 md:p-6 bg-white rounded-xl shadow-sm'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
          Add New Category
        </h1>
        <p className='text-muted-foreground mt-2'>
          Fill in the details below to add a new category to your inventory.
        </p>
      </div>
      <Card>
        <CardContent className='pt-6'>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='categoryName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g., Tote Bags' {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a descriptive name for this bag category.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='categoryImages'
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Category Image</FormLabel>
                    <FormControl>
                      <div className='space-y-4'>
                        <div className='flex items-center gap-4'>
                          <Button
                            type='button'
                            variant='outline'
                            onClick={() =>
                              document.getElementById("image-upload")?.click()
                            }
                            className='h-auto py-3'>
                            <Upload className='mr-2 h-4 w-4' />
                            Upload Image
                          </Button>
                          <Input
                            id='image-upload'
                            type='file'
                            accept='image/jpeg,image/png,image/webp'
                            className='hidden'
                            onChange={handleImageChange}
                            {...fieldProps}
                          />
                          <p className='text-sm text-muted-foreground'>
                            JPG, PNG or WebP (max. 5MB)
                          </p>
                        </div>

                        {imagePreview && (
                          <div className='relative mt-2 rounded-md overflow-hidden border w-40 h-40'>
                            <img
                              src={imagePreview || "/placeholder.svg"}
                              alt='Category preview'
                              className='w-full h-full object-cover'
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex gap-4'>
                <Button type='submit' disabled={isCategoryAdding}>
                  {isCategoryAdding ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className='mr-2 h-4 w-4' />
                      Add Category
                    </>
                  )}
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    form.reset();
                    setImagePreview(null);
                  }}
                  disabled={isCategoryAdding}>
                  Cancel
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
