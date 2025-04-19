import LandingPageLayout from "../layouts/LandingPageLayout";
import { OnsaleBags } from "../organisms/products/OnSaleBags";

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
