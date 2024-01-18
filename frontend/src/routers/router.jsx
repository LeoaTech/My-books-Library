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
  EmailVerification,
  ForgetPassword,
  ResetPassword,
  SignIn,
  SignUp,
} from "../_authentication/forms";
import PersistLogin from "../utiliz/PersistLogin";
import RequiredAuth from "../utiliz/RequiredAuth";
import InvalidToken from "../_authentication/forms/InvalidToken";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotpassword/:id/:token" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route
          path="/email-verification/:token"
          element={<EmailVerification />}
        />
      </Route>

      <Route path="/expired-link" element={<InvalidToken />} />

      <Route element={<PersistLogin />}>
        <Route path="/" element={<App />}></Route>

        {/* Protect Admin Routes */}
        <Route element={<RequiredAuth allowedRoles={["admin"]} />}>
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

        {/* Librarian Routes */}
        <Route element={<RequiredAuth allowedRoles={["admin", "librarian"]} />}>
          <Route
            path="/librarian/dashboard"
            element={<>Librarian Route</>}
          ></Route>
        </Route>

        {/* Moderator Routes */}
        <Route
          element={
            <RequiredAuth allowedRoles={["admin", "moderator", "librarian"]} />
          }
        >
          <Route
            path="/moderator/dashboard"
            element={<>Moderator Route</>}
          ></Route>
        </Route>
      </Route>
    </Route>
  )
);

export default router;
