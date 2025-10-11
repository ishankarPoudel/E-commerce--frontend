import Header from "@/ui/organisms/header/header";
import CategoryBasedBags from "@/ui/organisms/products/CategoryBasedBags";
import { OnsaleBags } from "@/ui/organisms/products/OnSaleBags";

const HomePage = () => {
  return (
    <div>
      <OnsaleBags />
      <CategoryBasedBags />
    </div>
  );
};

export default HomePage;
