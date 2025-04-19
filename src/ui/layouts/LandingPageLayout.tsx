import Footer from "../organisms/Footer";
import Navbar from "../organisms/Navbar";

const LandingPageLayout = ({ children }: { children: any }) => {
  return (
    <div className='pl-3'>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default LandingPageLayout;
