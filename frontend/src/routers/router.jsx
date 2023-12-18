import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../App";
import routes from "../utiliz";
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<App />}></Route>
      <Route element={<AuthLayout />}>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
      </Route>
      <Route path="/dashboard" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        {routes.map((route, i) => {
          const { component: Component, path } = route;
          return (
            <Route
              key={i}
              exact={true}
              path={`/dashboard${path}`}
              element={
                <Suspense fallback={<AdminLoader />}>
                  <Component />
                </Suspense>
              }
            />
          );
        })}
      </Route>
    </Route>
  )
);

export default router;
