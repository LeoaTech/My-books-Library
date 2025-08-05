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
  SignupPage
} from "../_authentication/forms";
import Shop from "../_root/pages/Shop";
import Library from "../_root/pages/Library";
import BookOverview from "../_root/pages/BookOverview";
import PersistLogin from "../utiliz/PersistLogin";
import RequiredAuth from "../utiliz/RequiredAuth";
import InvalidToken from "../_authentication/forms/InvalidToken";
import Register from "../_authentication/forms/Register";

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
      <Route path="library" element={<Library />} />
      <Route path="shop" element={<Shop />} />
      <Route path="book" element={<BookOverview />} />

      {/* Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgotpassword/:id/:token" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
      </Route>
      <Route path="/expired-link" element={<InvalidToken />} />

      <Route element={<PersistLogin />}>
        <Route path="/" element={<App />} />

        {/* Protected Dashboard Routes */}
        <Route element={<RequiredAuth allowedRoles={["admin", "vendor", "librarian"]} />}>
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