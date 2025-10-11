import { InstantSearch } from "./InstantSearch";

const Header = () => {
  return (
    <div className='sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='mx-auto w-full max-w-[1400px]'>
        <div className='grid h-16 grid-cols-[1fr_minmax(320px,1fr)_1fr] items-center gap-4 px-4 md:px-6'>
          {/* Left area (logo or nav) */}
          <span className='text-lg font-semibold'>Avisekh Bags</span>
          <div className='hidden lg:flex items-center gap-3'>
            <div className='flex'>
              <InstantSearch />
            </div>
          </div>
          {/* Right actions */}
        </div>
      </div>
    </div>
  );
};

export default Header;
