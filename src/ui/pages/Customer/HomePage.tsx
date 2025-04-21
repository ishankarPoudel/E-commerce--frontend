import LandingPageLayout from "@/ui/layouts/LandingPageLayout";
import { OnsaleBags } from "@/ui/organisms/products/OnSaleBags";

const HomePage = () => {
  return (
    <div>
      <LandingPageLayout>
        <OnsaleBags />
      </LandingPageLayout>
    </div>
  );
};

export default HomePage;
