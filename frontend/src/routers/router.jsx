import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../App";
import routes, {
  accountRoutes,
  roleRoutes,
  VendorOtherRoutes,
  vendorsRoutes,
} from "../utiliz";
import { Suspense } from "react";
import AdminLoader from "../components/_admin/Loader/Loader";
import AdminLayout from "../_admin/Layout";
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
import VendorsLayout from "../_vendors/Layout";

// guest/user pages
import Home from "../_root/pages/Home";
import Shop from "../_root/pages/Shop";
import Library from "../_root/pages/Library";
import BookOverview from "../_root/pages/BookOverview";
import MyProfile from "../_root/pages/UserProfile/index";
import AccountSettings from "../_root/pages/UserProfile/AccountSettings";
import MyOrdersHistory from "../_root/pages/UserProfile/MyOrdersHistory";
import Membership from "../_root/pages/UserProfile/Membership";
import Billing from "../_root/pages/UserProfile/Billing";

const renderRoutes = (routes) => {
  return routes?.map((route, i) => {
    const { component: Component, path, subRoutes } = route;
    if (subRoutes) {
      // Render parent route without a direct component
      return (
        <Route key={i} path={path}>
          {renderRoutes(subRoutes)}
        </Route>
      );
    }

    // Render route with a direct component
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
      <Route path="billing" element={<Billing />}></Route>
      {/* Authentication Routes */}

      <Route element={<AuthLayout />}>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotpassword/:id/:token" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
      </Route>
      <Route path="/expired-link" element={<InvalidToken />} />

      <Route element={<PersistLogin />}>
        <Route path="/" element={<App />}></Route>

        {/* Protect Admin Routes */}
        <Route element={<RequiredAuth allowedRoles={["admin"]} />}>
          <Route path="/dashboard" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />

            {renderRoutes(routes)}
            {accountRoutes?.map((route, i) => {
              const { component: Component, path, subRoutes } = route;
              if (subRoutes) {
                // Render parent route without a direct component
                return (
                  <Route key={i} path={path}>
                    {renderRoutes(subRoutes)}
                  </Route>
                );
              }
            })}
            {roleRoutes?.map((route, i) => {
              const { component: Component, path, subRoutes } = route;
              if (subRoutes) {
                // Render parent route without a direct component
                return (
                  <Route key={i} path={path}>
                    {renderRoutes(subRoutes)}
                  </Route>
                );
              }
            })}
            {/* {renderRoutes(accountRoutes)} */}
          </Route>
        </Route>

        {/* Librarian Routes */}
        <Route element={<RequiredAuth allowedRoles={["admin", "moderator"]} />}>
          <Route
            path="/librarian/dashboard"
            element={<>Librarian Route</>}
          ></Route>
        </Route>

        {/* Vendors Routes */}
        <Route element={<RequiredAuth allowedRoles={["admin", "vendor"]} />}>
          <Route
            path="/vendor"
            element={
              <Suspense fallback={<AdminLoader />}>
                <VendorsLayout />
              </Suspense>
            }
          >
            <Route index element={<DashboardPage />} />
            {/* {vendorsRoutes?.map((route, i) => {
              const { component: Component, path } = route;
              return (
                <Route
                  key={i}
                  exact={true}
                  path={`/vendor${path}`}
                  element={
                    <Suspense fallback={<AdminLoader />}>
                      <Component />
                    </Suspense>
                  }
                />
              );
            })} */}

            {renderRoutes(vendorsRoutes)}

            {VendorOtherRoutes?.map((route, i) => {
              const { component: Component, path, subRoutes } = route;
              if (subRoutes) {
                // Render parent route without a direct component
                return (
                  <Route key={i} path={path}>
                    {renderRoutes(subRoutes)}
                  </Route>
                );
              }
            })}
          </Route>
        </Route>
      </Route>
    </Route>
  )
);

export default router;
