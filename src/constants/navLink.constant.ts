import {
  Home,
  Package,
  Tags,
  Users,
  Settings,
  ShoppingCart,
  ShoppingBag,
  Heart,
  User,
} from "lucide-react";

export const adminNavLinks = [
  {
    title: "Dashboard",
    url: "/admin-dashboard",
    icon: Home,
  },
  {
    title: "Products",
    url: "/admin-dashboard/bags",
    icon: Package,
  },
  {
    title: "Categories",
    url: "/admin-dashboard/categories",
    icon: Tags,
  },
  {
    title: "Orders",
    url: "/admin-dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Users",
    url: "/admin-dashboard/users",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/admin-dashboard/settings",
    icon: Settings,
  },
];

export const customerNavLinks = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "My Orders",
    url: "/orders",
    icon: ShoppingBag,
  },
  {
    title: "Wishlist",
    url: "/wishlist",
    icon: Heart,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];
