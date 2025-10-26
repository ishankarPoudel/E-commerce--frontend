import LandingPageLayout from "./ui/layouts/LandingPageLayout";
import HomePage from "./ui/pages/Customer/HomePage";

function App({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LandingPageLayout>
        <HomePage />
        {children}
      </LandingPageLayout>
    </>
  );
}

export default App;
