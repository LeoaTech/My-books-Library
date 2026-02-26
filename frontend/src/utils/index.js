import { lazy } from "react";
import { HomeIcon ,BooksIcon, UserIcon} from "../components/_admin/SVGs";
// import BookIcon from "../assets/books2.svg";
// import UserIcon from "../assets/user.svg";
// import OrderIcon from "../assets/order2.svg";
// import ReturnsIcon from "../assets/returns.svg";
// import ShippedIcon from "../assets/ship1.svg";
// import QCIcon from "../assets/qc.svg";
// import ShippingIcon from "../assets/shipment.svg";
import { MdCalendarMonth, MdOutlineCheckCircleOutline  } from "react-icons/md";
import { GrSettingsOption } from "react-icons/gr";
import { IoSettings, IoSettingsSharp } from "react-icons/io5";

// use lazy for better code splitting, a.k.a. load faster

const NotificationsPage = lazy(() => import("../_admin/pages/Notifications"));
const Dashboard = lazy(() => import("../_admin/pages/Home"));
const Bookings = lazy(() => import("../_admin/pages/Bookings"));
const Listings = lazy(() => import("../_admin/pages/Listing"));
// const Orders = lazy(() => import("../_admin/pages/Orders"));
// const Shipping = lazy(() => import("../_admin/pages/Shipping"));
// const QC = lazy(() => import("../_admin/pages/QualtyControl"));
// const Returns = lazy(() => import("../_admin/pages/Returns"));
const Users = lazy(() => import("../_admin/pages/Users"));
const Permissions = lazy(() => import("../_admin/pages/Permissions"));
const Profile = lazy(() => import("../_admin/pages/Profile"));
const CustomerSettings = lazy(() =>
  import("../components/_admin/Settings/CustomerSettings")
);
const ManageSettings = lazy(() =>
  import("../components/_admin/Settings/ManageSettings")
);
const PricingSettings = lazy(() => import("../_admin/pages/PricingSettings"));
const MyLibrary = lazy(() => import("../_admin/pages/MyLibrary"));

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
    path: "",
    icon: HomeIcon,
    component: Dashboard,
  },
  {
    title: "Listings",
    icon: BooksIcon,
    path: "listings",
    component: Listings,
  },
  // {
  //   title: "Orders",
  //   image: OrderIcon,
  //   path: "orders",
  //   component: Orders,
  // },
  // {
  //   title: "Shipping and Returns",
  //   image: ShippedIcon,
  //   subRoutes: [
  //     {
  //       title: "Shippings",
  //       image: ShippingIcon,
  //       path: "shipping",
  //       component: Shipping,
  //     },
  //     {
  //       title: "Returns",
  //       image: ReturnsIcon,
  //       path: "returns",
  //       component: Returns,
  //     },
  //   ],
  // },
  // {
  //   title: "QC",
  //   image: QCIcon,
  //   path: "qc",
  //   component: QC,
  // },
  {
    title: "Bookings",
    path: "bookings",
    icon: MdCalendarMonth,
    component: Bookings,
  },
  {
    title: "Settings",
    icon: IoSettings,
    subRoutes: [
      {
        title: "Customer Settings",
        icon: GrSettingsOption,
        path: "customersettings",
        component: CustomerSettings,
      },
      {
        title: "Pricing Plan Settings",
        icon: IoSettingsSharp,
        path: "pricingsettings",
        component: PricingSettings,
      },
      {
        title: "Manage Data",
        icon: MdOutlineCheckCircleOutline,
        path: "managedata",
        component: ManageSettings,
      },
    ],
  },
];

export const roleRoutes = [
  {
    title: "User Roles",
    icon: UserIcon,
    subRoutes: [
      {
        title: "Users",
        path: "users",
        component: Users,
      },
      {
        title: "Roles and Permissions",
        path: "roles-permissions",
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
        path: "profile",
        component: Profile,
      },
      {
        title: "Notifications",
        path: "notifications",
        component: NotificationsPage,
      },
      {
        title: "My Library",
        path: "mylibrary",
        component: MyLibrary,
      },
    ],
  },
];

export default routes;
