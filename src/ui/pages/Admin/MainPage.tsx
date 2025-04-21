import { Card, CardHeader, CardTitle, CardContent } from "@/ui/shadcn/card";
import { DollarSign, Users, Package, ShoppingCart } from "lucide-react";

const MainPage = () => {
  return (
    <div>
      <div className='p-6'>
        <h1 className='text-3xl font-bold mb-6'>Dashboard</h1>

        {/* KPI Cards */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Revenue
              </CardTitle>
              <DollarSign className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>$45,231.89</div>
              <p className='text-xs text-muted-foreground'>
                +20.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>
                Active Users
              </CardTitle>
              <Users className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>+2,350</div>
              <p className='text-xs text-muted-foreground'>
                +180.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>Products</CardTitle>
              <Package className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>1,234</div>
              <p className='text-xs text-muted-foreground'>
                +19 added this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>Orders</CardTitle>
              <ShoppingCart className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>573</div>
              <p className='text-xs text-muted-foreground'>
                +201 since last week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Tables */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-7'>
          <Card className='md:col-span-4'>
            <CardHeader>
              <CardTitle>Monthly Sales</CardTitle>
            </CardHeader>
            <CardContent className='pl-2'></CardContent>
          </Card>

          <Card className='md:col-span-3'>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
