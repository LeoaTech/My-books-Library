import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../App";
import routes, { accountRoutes, roleRoutes } from "../utils";
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

import PersistLogin from "../utils/PersistLogin";
import RequiredAuth from "../utils/RequiredAuth";
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
import Transactions from "../_root/pages/UserProfile/Transactions";
import PaymentSuccess from "../_admin/pages/PaymentSuccess";
import Pricing from "../pages/pricing";
import Bookings from "../_root/pages/UserProfile/Bookings";


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


      <Route element={<PersistLogin />}>

        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />}></Route>
        <Route path="/:subdomain" element={<Home />} />
        <Route path="/:subdomain/membership" element={<Membership />}></Route>
        <Route path="/:subdomain/success" element={<PaymentSuccess />} />
        <Route path="/:subdomain/pricing" element={<Pricing />}></Route>
        <Route path="/:subdomain/profile" element={<MyProfile />}></Route>
        <Route path="/:subdomain/account" element={<AccountSettings />}></Route>
        <Route path="/:subdomain/orders" element={<MyOrdersHistory />}></Route>
        <Route path="/:subdomain/membership" element={<Membership />}></Route>
        <Route path="/:subdomain/transactions" element={<Transactions />}></Route>

        <Route path="/:subdomain/billing" element={<Membership />}></Route>
        <Route path="/:subdomain/bookings" element={<Bookings />}></Route>


        {/* Protected Dashboard Routes */}
        <Route element={<RequiredAuth allowedRoles={["owner", "vendor", "admin"]} />}>
          <Route path="/:subdomain/dashboard" element={<DashboardLayout />}>
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