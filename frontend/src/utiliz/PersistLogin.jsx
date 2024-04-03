import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Outlet } from "react-router-dom";
import useRefreshToken from "../hooks/useRefreshToken";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { auth, persist } = useAuthContext();
  const refresh = useRefreshToken();

  //   This effect wil call refresh token only when access token expired
  useEffect(() => {
    let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.log(error);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

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
