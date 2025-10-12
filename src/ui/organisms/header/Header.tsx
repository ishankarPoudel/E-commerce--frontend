import { InstantSearch } from "./InstantSearch";

const Header = () => {
  return (
    <div className='sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/20'>
      <div className='mx-auto w-full max-w-[1400px]'>
        <div className='grid h-14 grid-cols-[1fr_minmax(320px,1fr)_1fr] items-center gap-4 px-4 md:px-6'>
          {/* Left area (logo or nav) */}
          <span className='text-lg font-semibold'>Avisekh Bags</span>
          <div className='hidden lg:flex items-center gap-3'>
            <div className='flex pb-1 w-full'>
              <InstantSearch />
            </div>
          </div>
          <div className='flex items-center gap-3'>
            {/* Right area (user profile, cart, etc.) */}
            <button className='relative'>
              <svg className='h-6 w-6'>
                <use xlinkHref='/icons.svg#icon-user' />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
