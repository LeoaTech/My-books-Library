import { lazy } from "react";
// use lazy for better code splitting, a.k.a. load faster

import Notifications from "../_admin/pages/Notifications";
const Dashboard = lazy(() => import("../_admin/pages/Home"));
const Bookings = lazy(() => import("../_admin/pages/Bookings"));
const Listings = lazy(() => import("../_admin/pages/Listing"));
const Orders = lazy(() => import("../_admin/pages/Orders"));
const Shipping = lazy(() => import("../_admin/pages/Shipping"));
const QC = lazy(() => import("../_admin/pages/QualtyControl"));
const Returns = lazy(() => import("../_admin/pages/Returns"));
const Users = lazy(() => import("../_admin/pages/Users"));
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
    path: "/", // the url
    component: Dashboard, // view rendered
  },
  {
    title: "Bookings",
    path: "/bookings",
    component: Bookings,
  },
  {
    title: "Listings",

    path: "/listings",
    component: Listings,
  },
  {
    title: "Orders",

    path: "/orders",
    component: Orders,
  },
  {
    title: "Shippings",

    path: "/shipping",
    component: Shipping,
  },
  {
    title: "Returns",

    path: "/returns",
    component: Returns,
  },
  {
    title: "QC",

    path: "/qc",
    component: QC,
  },
  {
    title: "Users",

    path: "/users",
    component: Users,
  },
  {
    title: "Profile",
    path: "/profile",
    component: Profile,
  },
  { title: "Notifications", path: "/notifications", component: Notifications },
];

export default routes;

export const admin_links = [{ title: "Logout", path: "/logout" }];
