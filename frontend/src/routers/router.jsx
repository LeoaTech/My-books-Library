import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../App";
import routes, { accountRoutes, roleRoutes } from "../utiliz";
import { Suspense } from "react";
import AdminLoader from "../components/_admin/Loader/Loader";
import DashboardLayout from "../_admin/Layout";
import DashboardPage from "../_admin/pages/Home";
import AuthLayout from "../_authentication/forms/AuthLayout";
import {
  ForgetPassword,
  ResetPassword,
  SignIn,
  SignUp,
} from "../_authentication/forms";

import PersistLogin from "../utiliz/PersistLogin";
import RequiredAuth from "../utiliz/RequiredAuth";
import InvalidToken from "../_authentication/forms/InvalidToken";
import Register from "../_authentication/forms/Register";
import Home from "../_root/pages/Home";
import AuthFailurePage from "../_authentication/forms/AuthFailure";


// guest/user pages
import Shop from "../_root/pages/Shop";
import Library from "../_root/pages/Library";
import BookOverview from "../_root/pages/BookOverview";
import MyProfile from "../_root/pages/UserProfile/index";
import AccountSettings from "../_root/pages/UserProfile/AccountSettings";
import MyOrdersHistory from "../_root/pages/UserProfile/MyOrdersHistory";
import Membership from "../_root/pages/UserProfile/Membership";
// import Billing from "../_root/pages/UserProfile/Billing";
const renderRoutes = (routes) => {
  return routes?.map((route, i) => {
    const { component: Component, path, subRoutes } = route;
    if (subRoutes) {
      return (
        <Route key={i} path={path}>
          {renderRoutes(subRoutes)}
        </Route>
      );
    }
    return (
      <Route
        key={i}
        exact={true}
        path={path}
        element={
          <Suspense fallback={<AdminLoader />}>
            <Component />
          </Suspense>
        }
      />
    );
  });
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Home />}></Route>
      <Route path="library" element={<Library />}></Route>
      <Route path="shop" element={<Shop />}></Route>
      <Route path="book" element={<BookOverview />}></Route>
      <Route path="profile" element={<MyProfile />}></Route>
      <Route path="account" element={<AccountSettings />}></Route>
      <Route path="orders" element={<MyOrdersHistory />}></Route>
      <Route path="membership" element={<Membership />}></Route>
      {/* <Route path="billing" element={<Billing />}></Route> */}
      {/* Authentication Routes */}
      <Route element={<AuthLayout />}>

        {/* App auth routes to register new library or sign in to their library */}
        <Route path="/register" element={<Register />} />


        {/* Library's routes to add new users, roles or customers */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgotpassword/:id/:token" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
      </Route>
      <Route path="/expired-link" element={<InvalidToken />} />

      {/* Google Auth Failure Route */}
      <Route path="/auth/failure" element={<AuthFailurePage />} />
      {/* Subdomain Library Routes */}
      <Route element={<AuthLayout />}>

        <Route path="/:subdomain/signin" element={<SignIn />} />
        <Route path="/:subdomain/signup" element={<SignUp />} />
        <Route path="/:subdomain/forgotpassword/:id/:token" element={<ResetPassword />} />
        <Route path="/:subdomain/forgot-password" element={<ForgetPassword />} />
      </Route>

      {/* <Route path="/:subdomain" element={<Home />} /> */}

      <Route element={<PersistLogin />}>

        <Route path="/" element={<App />} />
        <Route path="/:subdomain" element={<Home />} />


        {/* Protected Dashboard Routes */}
        <Route element={<RequiredAuth allowedRoles={["owner","vendor","admin"]} />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            {renderRoutes(routes)}
            {renderRoutes(accountRoutes)}
            {renderRoutes(roleRoutes)}
          </Route>
        </Route>
      </Route>
    </Route>
  )
);

export default router;