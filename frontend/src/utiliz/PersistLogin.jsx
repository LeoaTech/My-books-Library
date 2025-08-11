import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Outlet, useNavigate } from "react-router-dom";
import useRefreshToken from "../hooks/useRefreshToken";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { auth, persist, setAuth } = useAuthContext();
  const navigate = useNavigate();
  const refresh = useRefreshToken();
  // console.log(persist, "Persist", auth, "Auth");

  //   This effect wil call refresh token only when access token expired
  useEffect(() => {
    let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        // Catch the refresh Token expired error 
        // console.log(error);
        if (error?.message == "Session expired, please log in again") {
          // Clear auth state and redirect to login
          setAuth(null);
          localStorage.removeItem('auth-source');
          localStorage.removeItem('user');
          navigate('/', { state: { message: 'Your session has expired. Please log in again.' } });
        }
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    persist && !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => {
      isMounted = false;
    };
  }, []);


  return (
    <>
      {!persist ? (
        <Outlet />
      ) : isLoading ? (
        <p className="py-40 flex justify-center items-center text-center">
          Loading....
        </p>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
