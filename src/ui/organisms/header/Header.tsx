import { InstantSearch } from "./InstantSearch";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <InstantSearch />
      </div>
    </header>
  );
};

export default Header;
