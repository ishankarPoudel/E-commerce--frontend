import {
  deleteBagByIdMutation,
  getAllBagsOptions,
  getAllBagsQueryKey,
} from "@/api/@tanstack/react-query.gen";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import DeleteDialog from "@/ui/molecules/dialogs/DeleteDialog";
import { Badge } from "@/ui/shadcn/badge";
import { Button } from "@/ui/shadcn/button";
import { Card, CardContent, CardFooter } from "@/ui/shadcn/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/ui/shadcn/dialog";
import { Input } from "@/ui/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/shadcn/select";
import { getImageUrl } from "@/utils/urlHelpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Edit, Trash2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

import { toast } from "sonner";

interface BagImage {
  id: string;
  image: string;
}

interface Category {
  id: string;
  categoryName: string;
}

interface Bag {
  id: string;
  name: string;
  price: number;
  description: string;
  bagImages: BagImage[];
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

const BagList = () => {
  const queryClient = useQueryClient();

  const [bags, setBags] = useState<Bag[]>([]);

  const [selectedBag, setSelectedBag] = useState<Bag | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [_, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bagIdToDelete, setBagIdToDelete] = useState<string | null>(null);

  //states for filtering process
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const navigate = useNavigate();

  const debouncedSearch = useDebouncedValue(searchQuery, 500);
  const debouncedMinPriceSearch = useDebouncedValue(minPrice, 500);
  const debouncedMaxPriceSearch = useDebouncedValue(maxPrice, 500);

  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: bagListResponse,
    isPending,
    refetch,
  } = useQuery({
    ...getAllBagsOptions({
      query: {
        page: currentPage || 1,
        limit: 10,
        search: debouncedSearch || "",
        category: selectedCategory || "",
        minPrice: debouncedMinPriceSearch
          ? parseFloat(debouncedMinPriceSearch)
          : undefined,
        maxPrice: debouncedMaxPriceSearch
          ? parseFloat(debouncedMaxPriceSearch)
          : undefined,
      },
    }),
  });

  useEffect(() => {
    refetch();
  }, [
    currentPage,
    debouncedSearch,
    selectedCategory,
    debouncedMinPriceSearch,
    debouncedMaxPriceSearch,
  ]);

  //for pagination
  const { page, totalPages } = bagListResponse?.data || {};

  const { mutate, isPending: isDeleting } = useMutation({
    ...deleteBagByIdMutation(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: getAllBagsQueryKey() });
      setIsDetailOpen(false);
      setIsDialogOpen(false);
      setDeleteDialogOpen(false);
      toast.success(response?.message || "Bag deleted successfully");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to delete bag");
      setIsDetailOpen(false);
      setIsDialogOpen(false);
    },
  });

  const handleDeleteBag = (id: string) => {
    mutate({
      path: {
        id: id,
      },
    });
  };

  useEffect(() => {
    if (bagListResponse?.data) {
      setBags(bagListResponse.data.data);
    }
  }, [bagListResponse?.data]);

  // Filter bags based on search query using useMemo for performance
  const filteredBags = useMemo(() => {
    if (!bags) return [];
    return bags.filter(
      (bag) =>
        bag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bag.description &&
          bag.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [bags, searchQuery]);

  const handleDelete = (id: string) => {
    setBagIdToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (bag: Bag) => {
    console.log("Edit bag:", bag);
    navigate({
      to: `/admin-dashboard/bags/${bag?.id}`,
    });
  };

  const openBagDetail = (bag: Bag) => {
    setSelectedBag(bag);
    setIsDetailOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(e.target.value);
  };
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(e.target.value);
  };

  const uniqueCategories = Array.from(
    new Map(
      bags?.flatMap((bag) => bag.categories || []).map((cat) => [cat.id, cat])
    ).values()
  );

  if (isPending) {
    return (
      <div className='container mx-auto py-8 px-4 text-center'>
        Loading bags...
      </div>
    );
  }

  return (
    <div>
      <div className='container mx-auto py-8 px-4'>
        <div className='space-y-6'>
          {/* Header Section */}
          <div className='flex flex-col md:flex-row justify-between md:items-center gap-4'>
            <div>
              <h1 className='text-3xl font-bold tracking-tight text-primary'>
                Bags Collection
              </h1>
              <p className='text-muted-foreground mt-1'>
                Manage your premium bag inventory ({filteredBags.length} bags)
              </p>
            </div>
            <Link to='/admin-dashboard/bags/addBag'>
              <Button className='rounded-xl px-6 shadow-md hover:shadow-lg transition'>
                + Add New Bag
              </Button>
            </Link>
          </div>

          {/* Filter Section */}
          <Card className='border border-muted shadow-sm'>
            <CardContent className='p-6'>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4'>
                {/* Search */}
                <Input
                  placeholder='Search bags...'
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className='md:col-span-2'
                />

                {/* Category */}
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    {(!uniqueCategories || uniqueCategories.length === 0) && (
                      <SelectItem value='__loading' disabled>
                        Loading...
                      </SelectItem>
                    )}
                    {uniqueCategories &&
                      uniqueCategories.length > 0 &&
                      uniqueCategories
                        .filter((cat) => !!cat.id)
                        .map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.categoryName}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>

                {/* Min Price */}
                <Input
                  type='number'
                  placeholder='Min Price'
                  value={minPrice}
                  onChange={handleMinPriceChange}
                  className='w-full'
                  min={0}
                />

                {/* Max Price */}
                <Input
                  type='number'
                  placeholder='Max Price'
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  className='w-full'
                  min={0}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {filteredBags.length === 0 && !isPending ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>
              {searchQuery
                ? "No bags found matching your search criteria."
                : "No bags available."}
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {filteredBags.map((bag) => (
              <Card
                key={bag.id}
                className='overflow-hidden group hover:shadow-lg transition-shadow duration-300 flex flex-col'>
                <div className='relative aspect-square overflow-hidden bg-muted'>
                  <img
                    // Use getImageUrl and access the 'image' property from bagImages
                    src={
                      getImageUrl(bag.bagImages?.[0]?.image) ||
                      "/placeholder.svg?height=400&width=300" // Fallback placeholder
                    }
                    alt={bag.name} // Use bag.name for alt text
                    className='object-cover w-full h-full transition-transform duration-300 group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                  <div className='absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <Button
                      size='icon'
                      variant='secondary'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(bag);
                      }}>
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button
                      size='icon'
                      variant='destructive'
                      onClick={(e) => {
                        setIsDialogOpen(true);
                        e.stopPropagation();
                        handleDelete(bag.id);
                      }}>
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
                <CardContent className='p-4 flex-grow'>
                  <div className='flex justify-between items-start mb-2'>
                    <h3 className='font-semibold text-lg line-clamp-1'>
                      {bag.name}
                    </h3>
                    <p className='font-bold text-lg whitespace-nowrap'>
                      ${bag.price.toFixed(2)}
                    </p>
                  </div>
                  <p className='text-muted-foreground text-sm line-clamp-2 mb-3'>
                    {bag.description || "No description available."}{" "}
                  </p>
                  <div className='flex flex-wrap gap-1'>
                    {/* Map through bag.categories */}
                    {bag.categories?.map((category) => (
                      <Badge
                        key={category.id}
                        variant='outline'
                        className='text-xs'>
                        {category.categoryName}{" "}
                        {/* Use category.categoryName */}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className='p-4 pt-0 border-t mt-auto'>
                  <Button
                    variant='ghost'
                    className='w-full justify-between text-primary hover:text-primary'
                    onClick={() => openBagDetail(bag)}>
                    View Details
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Bag Detail Dialog */}
        {selectedBag && (
          <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
            <DialogContent className='max-w-full sm:max-w-4xl'>
              <DialogHeader>
                <DialogTitle className='text-2xl'>
                  {selectedBag.name}
                </DialogTitle>
              </DialogHeader>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 max-h-[70vh] overflow-y-auto p-1'>
                <div className='aspect-square relative bg-muted rounded-md overflow-hidden'>
                  <img
                    src={
                      getImageUrl(selectedBag.bagImages?.[0]?.image) ||
                      "/placeholder.svg?height=400&width=300"
                    }
                    alt={selectedBag.name}
                    className='object-cover w-full h-full'
                  />
                </div>
                <div>
                  <div className='flex justify-between items-center mb-4'>
                    <p className='text-2xl font-bold'>
                      ${selectedBag.price.toFixed(2)}
                    </p>
                    <div className='flex gap-2'>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleEdit(selectedBag)}>
                        <Edit className='h-4 w-4 mr-2' />
                        Edit
                      </Button>
                      <Button
                        size='sm'
                        variant='destructive'
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDialogOpen(true);
                          handleDelete(selectedBag.id);
                        }}>
                        <Trash2 className='h-4 w-4 mr-2' />
                        Delete
                      </Button>
                    </div>
                  </div>
                  <h3 className='text-lg font-medium mb-1'>Description</h3>
                  <p className='text-muted-foreground mb-4 text-sm'>
                    {selectedBag.description || "No description provided."}
                  </p>
                  <h3 className='text-lg font-medium mb-1'>Categories</h3>
                  <div className='flex flex-wrap gap-2 mb-4'>
                    {selectedBag.categories?.map((category) => (
                      <Badge key={category.id} variant='secondary'>
                        {category.categoryName}
                      </Badge>
                    ))}
                  </div>
                  <h3 className='text-lg font-medium mb-1'>Gallery</h3>
                  {selectedBag.bagImages && selectedBag.bagImages.length > 0 ? (
                    <div className='grid grid-cols-3 sm:grid-cols-4 gap-2'>
                      {selectedBag.bagImages.map((image) => (
                        <div
                          key={image.id}
                          className='aspect-square relative bg-muted rounded-md overflow-hidden border'>
                          <img
                            src={getImageUrl(image.image) || "/placeholder.svg"}
                            alt={`${selectedBag.name} - gallery image`}
                            className='object-cover w-full h-full'
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text-muted-foreground text-sm'>
                      No additional images.
                    </p>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        <DeleteDialog
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          deleteTitle='Delete Bag'
          deleteDescription='Are you sure you want to delete this bag? This action cannot be undone.'
          handleDeleteClick={() => {
            if (bagIdToDelete) {
              handleDeleteBag(bagIdToDelete);
            }
          }}
          isDeleting={isDeleting}
        />
      </div>

      <div className='flex justify-center items-center gap-6 mt-6 mb-6'>
        <Button
          variant='ghost'
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className='flex items-center gap-2 text-sm font-medium px-4 py-2 border border-input rounded-full shadow-sm hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed'>
          ← Prev
        </Button>

        <div className='text-sm text-muted-foreground select-none'>
          <span className='px-4 py-2 border border-border rounded-full bg-muted'>
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </span>
        </div>

        <Button
          variant='ghost'
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
            refetch();
          }}
          disabled={page === totalPages}
          className='flex items-center gap-2 text-sm font-medium px-4 py-2 border border-input rounded-full shadow-sm hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed'>
          Next →
        </Button>
      </div>
    </div>
  );
};

export default BagList;
