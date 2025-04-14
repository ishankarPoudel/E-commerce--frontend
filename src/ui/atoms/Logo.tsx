import { ShoppingBag } from "lucide-react";

const Logo = () => {
  return (
    <>
      <ShoppingBag className='h-6 w-6 text-primary' />
      <span className='text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
        Avisekh Bags
      </span>
    </>
  );
};

export default Logo;
