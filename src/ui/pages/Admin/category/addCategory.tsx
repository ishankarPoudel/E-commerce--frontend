import { FormProvider, useForm } from "react-hook-form";
import { Plus, Loader2 } from "lucide-react";
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
    mutate(
      { body: { ...data } },
      {
        onSuccess: (response) => {
          toast.success(response.message || "Category added successfully!");
          form.reset();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to add category.");
        },
      }
    );
  };

  return (
    <div className='max-w-3xl mx-auto md:p-6 bg-white rounded-xl shadow-sm'>
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
