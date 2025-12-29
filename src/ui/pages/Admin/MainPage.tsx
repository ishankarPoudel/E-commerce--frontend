import { Card, CardHeader, CardTitle, CardContent } from "@/ui/shadcn/card";
import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardAnalyticsOptions } from "@/api/@tanstack/react-query.gen";
import { Skeleton } from "@/ui/shadcn/skeleton";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/ui/shadcn/badge";
import { Avatar, AvatarFallback } from "@/ui/shadcn/avatar";
import { Alert, AlertDescription } from "@/ui/shadcn/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/shadcn/select";
import { useState } from "react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

type Period = "week" | "month" | "quarter" | "year";

interface RevenueMetrics {
  total: number;
  currency: string;
  percentageChange: number;
  averageOrderValue: number;
  previousMonth: number;
}

interface UserMetrics {
  active: number;
  total: number;
  bannedUsers: number;
  percentageChange: number;
  newThisMonth: number;
}

interface OrderMetrics {
  total: number;
  percentageChange: number;
  conversionRate: number;
  pending: number;
  completed: number;
  cancelled: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: string;
  createdAt: string;
  itemCount: number;
}

interface TopProduct {
  id: string;
  name: string;
  soldCount: number;
  revenue: number;
}

interface SalesChartData {
  date: string;
  revenue: number;
  orders: number;
}

interface OrderStatusBreakdown {
  status: string;
  count: number;
  percentage: number;
  [key: string]: string | number;
}

interface AnalyticsData {
  revenue: RevenueMetrics;
  users: UserMetrics;
  orders: OrderMetrics;
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
  salesChart: SalesChartData[];
  orderStatusBreakdown: OrderStatusBreakdown[];
}

const MainPage = () => {
  const [period, setPeriod] = useState<Period>("month");

  const {
    data: analyticsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    ...getDashboardAnalyticsOptions({
      query: {
        period,
      },
    }),
  });

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load analytics data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const analytics = analyticsData?.data as AnalyticsData;

  if (!analytics) {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>No analytics data available.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const revenue: RevenueMetrics = analytics.revenue || {
    total: 0,
    currency: "NPR",
    percentageChange: 0,
    averageOrderValue: 0,
    previousMonth: 0,
  };

  const users: UserMetrics = analytics.users || {
    active: 0,
    total: 0,
    bannedUsers: 0,
    percentageChange: 0,
    newThisMonth: 0,
  };

  const orders: OrderMetrics = analytics.orders || {
    total: 0,
    percentageChange: 0,
    conversionRate: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
  };

  const recentOrders: RecentOrder[] = analytics.recentOrders || [];
  const topProducts: TopProduct[] = analytics.topProducts || [];
  const salesChart: SalesChartData[] = analytics.salesChart || [];
  const orderStatusBreakdown: OrderStatusBreakdown[] =
    analytics.orderStatusBreakdown || [];

  const getPeriodLabel = () => {
    switch (period) {
      case "week":
        return "Last 7 Days";
      case "month":
        return "This Month";
      case "quarter":
        return "This Quarter";
      case "year":
        return "This Year";
      default:
        return "This Month";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Period Selector */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            {getPeriodLabel()}
          </Badge>
          <Select
            value={period}
            onValueChange={(value: Period) => {
              setPeriod(value);
              refetch();
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards - 3 Cards Only */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Revenue Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {revenue.currency} {revenue.total.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              {revenue.percentageChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span
                className={
                  revenue.percentageChange >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {Math.abs(revenue.percentageChange).toFixed(1)}%
              </span>
              <span>vs previous period</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Avg Order: {revenue.currency}{" "}
              {revenue.averageOrderValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* Users Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.active.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              {users.percentageChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span
                className={
                  users.percentageChange >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {Math.abs(users.percentageChange).toFixed(1)}%
              </span>
              <span>vs previous period</span>
            </div>
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              <span>Total: {users.total.toLocaleString()}</span>
              {users.bannedUsers > 0 && (
                <Badge variant="destructive" className="h-5 text-[10px]">
                  {users.bannedUsers} Banned
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.total.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              {orders.percentageChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span
                className={
                  orders.percentageChange >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {Math.abs(orders.percentageChange).toFixed(1)}%
              </span>
              <span>vs previous period</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {orders.completed} Completed
              </Badge>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                {orders.pending} Pending
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Sales Chart */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {salesChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value: string) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    labelFormatter={(value: string) => {
                      return new Date(value).toLocaleDateString();
                    }}
                    formatter={(value: number | undefined) => [
                      value?.toLocaleString() ?? "0",
                      "",
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Revenue (NPR)"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    name="Orders"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No sales data available for this period
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Status Breakdown */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {orderStatusBreakdown.length > 0 ? (
              <div className="space-y-4">
                {/* Pie Chart with better sizing */}
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={orderStatusBreakdown}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      labelLine={false}
                      label={false}
                    >
                      {orderStatusBreakdown.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      // @ts-ignore
                      formatter={(value: number | undefined, name: string) => [
                        `${value ?? 0} orders`,
                        name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Custom Legend Below Chart */}
                <div className="grid grid-cols-2 gap-2">
                  {orderStatusBreakdown.map((item, index) => (
                    <div
                      key={item.status}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="text-xs capitalize">{item.status}</span>
                      <Badge variant="outline" className="ml-auto text-[10px]">
                        {item.count} ({item.percentage}%)
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No orders to display
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {order.customerName?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {order.customerName || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.itemCount} items •{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">
                        NPR {order.amount?.toLocaleString() || 0}
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-xs mt-1 ${
                          order.status === "completed"
                            ? "bg-green-50 text-green-700"
                            : order.status === "cancelled"
                            ? "bg-red-50 text-red-700"
                            : order.status === "processing"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                No recent orders
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {topProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-md font-bold text-white ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                            ? "bg-gray-400"
                            : index === 2
                            ? "bg-orange-600"
                            : "bg-primary"
                        }`}
                      >
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {product.name || "Unknown Product"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.soldCount || 0} units sold
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">
                        NPR {product.revenue?.toLocaleString() || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                No product sales data
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Loading Skeleton Component
function AnalyticsSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-[180px]" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[400px]" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[400px]" />
      </div>
    </div>
  );
}

export default MainPage;
