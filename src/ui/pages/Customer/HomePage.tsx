import LandingPageLayout from "@/ui/layouts/LandingPageLayout";
import CategoryBasedBags from "@/ui/organisms/products/CategoryBasedBags";
import { OnsaleBags } from "@/ui/organisms/products/OnSaleBags";

const HomePage = () => {
  return (
    <div>
      <LandingPageLayout>
        <OnsaleBags />
        <CategoryBasedBags />
      </LandingPageLayout>
    </div>
  );
};

export default HomePage;
