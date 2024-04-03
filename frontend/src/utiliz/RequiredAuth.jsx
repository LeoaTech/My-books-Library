import { useAuthContext } from "../hooks/useAuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequiredAuth = ({ allowedRoles }) => {
  const { auth } = useAuthContext();
  const location = useLocation();

  let rolesList = [...allowedRoles];
  // Check if user is authenticated
  if (!auth) {
    // Redirect to the sign-in page if not authenticated
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }


  // Check if the user's role is allowed
  if (rolesList?.includes(auth.role_name)) {
    // User has the required role, allow access
    return <Outlet />;
  } else {
    // User does not have the required role, redirect to Home page
    return <Navigate to="/" state={{ from: location }} replace />;
  }
};

export default RequiredAuth;
