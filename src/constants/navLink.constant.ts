import {
  Home,
  Package,
  Tags,
  Users,
  Settings,
  ShoppingCart,
  ShoppingBag,
  User,
  Luggage,
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
    url: "/admin-dashboard/category",
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
    title: "My Cart",
    url: "/cart",
    icon: ShoppingBag,
  },
  {
    title: "My Orders",
    url: "/orders",
    icon: Luggage,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
];
