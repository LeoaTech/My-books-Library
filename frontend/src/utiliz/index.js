import { lazy } from "react";
import { BooksIcon, HomeIcon } from "../components/_admin/SVGs";
import BookIcon from "../assets/books2.svg";
import UserIcon from "../assets/user.svg";
import OrderIcon from "../assets/order2.svg";
import ReturnsIcon from "../assets/returns.svg";
import ShippedIcon from "../assets/ship1.svg";
import QCIcon from "../assets/qc.svg";
import ShippingIcon from "../assets/shipment.svg";
import { MdCalendarMonth, MdDoorbell } from "react-icons/md";
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
    path: "/dashboard/", // the url
    icon: HomeIcon,
    component: Dashboard, // view rendered
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
    // path: "/shipping",
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

export default routes;

export const admin_links = [{ title: "Logout", path: "/logout" }];

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

/* Vendors Routes */
export const vendorsRoutes = [
  {
    title: "Home",
    path: "/vendor/", // the url
    icon: HomeIcon,
    component: Dashboard, // view rendered
  },

  {
    title: "Listings",
    path: "/vendor/listings",
    image: BookIcon,
    component: Listings,
  },
  {
    title: "Orders",
    path: "/vendor/orders",
    image: OrderIcon,
    component: Orders,
  },

  {
    title: "Bookings",
    path: "/vendor/bookings",
    icon: MdCalendarMonth,
    component: Bookings,
  },
  {
    title: "Shipping and Returns",
    image: ShippedIcon, // Import or provide the appropriate icon component
    subRoutes: [
      // Add sub-routes if needed
      {
        title: "Shippings",
        path: "/vendor/shipping",
        image: ShippingIcon,
        component: Shipping,
      },
      {
        title: "Returns",
        image: ReturnsIcon,
        path: "/vendor/returns",
        component: Returns,
      },
    ],
  },
  {
    title: "QC",
    image: QCIcon,
    path: "/vendor/qc",
    component: QC,
  },
];

/* Vendors Common routes */
export const VendorOtherRoutes = [
  {
    title: "Account",
    image: "",
    subRoutes: [
      {
        title: "Profile",
        path: "/vendor/profile",
        image: UserIcon,
        component: Profile,
      },
      {
        title: "Notifications",
        path: "/vendor/notifications",
        icon: MdDoorbell,
        component: NotificationsPage,
      },
    ],
  },
];
