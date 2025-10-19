import { InstantSearch } from "./InstantSearch";

const Header = () => {
  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-md '>
      <div className='flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20'>
        <div className='flex-1 max-w-3xl mx-6'>
          <InstantSearch />
        </div>
      </div>
    </header>
  );
};

export default Header;
