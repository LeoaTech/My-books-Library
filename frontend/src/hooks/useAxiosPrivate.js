import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useAuthContext } from "./useAuthContext";
import { axiosPrivate } from "../api/axios";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuthContext();

  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.AccessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (
          (error && !prevRequest?.sent) ||
          (error?.response?.status == 403 && !prevRequest?.sent)
        ) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    // cleanup function

    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);

      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [auth, refresh]);

  return axiosPrivate();
};

export default useAxiosPrivate;
