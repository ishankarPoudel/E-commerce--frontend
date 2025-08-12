import { addToCartMutation } from "@/api/@tanstack/react-query.gen";
import { Button } from "@/ui/shadcn/button";
import { useMutation } from "@tanstack/react-query";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const AddToCart = ({ bagId }: { bagId: string }) => {
  const { mutate: addToCart, isPending } = useMutation({
    ...addToCartMutation(),
  });

  const [expanded, setExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddClick = () => {
    if (!expanded) {
      setExpanded(true);
    } else {
      setQuantity((q) => q + 1);
      addToCart({
        body: { bagId: bagId, quantity: quantity + 1 },
      });
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
      addToCart({
        body: { bagId: bagId, quantity: quantity - 1 },
      });
    } else {
      setExpanded(false);
      setQuantity(1);
    }
  };

  return (
    <div className='absolute top-2 right-2 z-10'>
      <div
        className={`flex items-center bg-green-600 rounded-full shadow-lg transition-all duration-300 ease-in-out overflow-hidden
        ${expanded ? "w-[120px]" : "w-[85px]"}`}>
        {expanded ? (
          <>
            <Button
              variant='ghost'
              size='sm'
              className='text-white hover:bg-green-700 rounded-none px-2'
              onClick={handleDecrease}>
              <Minus className='h-3 w-3' />
            </Button>

            <span className='flex-1 text-center text-white text-sm font-medium select-none'>
              {isPending ? "..." : quantity}
            </span>

            <Button
              variant='ghost'
              size='sm'
              className='text-white hover:bg-green-700 rounded-none px-2'
              onClick={handleAddClick}>
              <Plus className='h-3 w-3' />
            </Button>
          </>
        ) : (
          <Button
            onClick={handleAddClick}
            size='sm'
            className='h-8 px-3 text-xs font-medium bg-green-600 hover:bg-green-700 rounded-full shadow-lg w-full justify-center'>
            <Plus className='h-3 w-3 mr-1' />
            {isPending ? "..." : "Add"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddToCart;
