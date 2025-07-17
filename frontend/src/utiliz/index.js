import { lazy } from "react";
import { HomeIcon } from "../components/_admin/SVGs";
import BookIcon from "../assets/books2.svg";
import UserIcon from "../assets/user.svg";
import OrderIcon from "../assets/order2.svg";
import ReturnsIcon from "../assets/returns.svg";
import ShippedIcon from "../assets/ship1.svg";
import QCIcon from "../assets/qc.svg";
import ShippingIcon from "../assets/shipment.svg";
import { MdCalendarMonth } from "react-icons/md";
// use lazy for better code splitting, a.k.a. load faster

const NotificationsPage = lazy(() => import("../_admin/pages/Notifications"));
const Dashboard = lazy(() => import("../_admin/pages/Home"));
const Bookings = lazy(() => import("../_admin/pages/Bookings"));
const Listings = lazy(() => import("../_admin/pages/Listing"));
const Orders = lazy(() => import("../_admin/pages/Orders"));
const Shipping = lazy(() => import("../_admin/pages/Shipping"));
const QC = lazy(() => import("../_admin/pages/QualtyControl"));
const Returns = lazy(() => import("../_admin/pages/Returns"));
const Users = lazy(() => import("../_admin/pages/Users"));
const Permissions = lazy(() => import("../_admin/pages/Permissions"));
const Profile = lazy(() => import("../_admin/pages/Profile"));

/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 *
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */
const routes = [
  {
    title: "Home",
    path: "/dashboard/",
    icon: HomeIcon,
    component: Dashboard,
  },
  {
    title: "Listings",
    image: BookIcon,
    path: "/dashboard/listings",
    component: Listings,
  },
  {
    title: "Orders",
    image: OrderIcon,
    path: "/dashboard/orders",
    component: Orders,
  },
  {
    title: "Shipping and Returns",
    image: ShippedIcon,
    subRoutes: [
      {
        title: "Shippings",
        image: ShippingIcon,
        path: "/dashboard/shipping",
        component: Shipping,
      },
      {
        title: "Returns",
        image: ReturnsIcon,
        path: "/dashboard/returns",
        component: Returns,
      },
    ],
  },
  {
    title: "QC",
    image: QCIcon,
    path: "/dashboard/qc",
    component: QC,
  },
  {
    title: "Bookings",
    path: "/dashboard/bookings",
    icon: MdCalendarMonth,
    component: Bookings,
  },
];

export const roleRoutes = [
  {
    title: "User Roles",
    image: UserIcon,
    subRoutes: [
      {
        title: "Users",
        path: "/dashboard/users",
        component: Users,
      },
      {
        title: "Roles and Permissions",
        path: "/dashboard/roles-permissions",
        component: Permissions,
      },
    ],
  },
];

export const accountRoutes = [
  {
    title: "Account",
    subRoutes: [
      {
        title: "Profile",
        path: "/dashboard/profile",
        component: Profile,
      },
      {
        title: "Notifications",
        path: "/dashboard/notifications",
        component: NotificationsPage,
      },
    ],
  },
];

export default routes;
