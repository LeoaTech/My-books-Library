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
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    //Response Interceptor for token refresh and retry
    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (!prevRequest) return Promise.reject(error);
        if (
          (error?.response?.status == 403 &&
            !prevRequest?.sent &&
            auth?.refreshToken) ||
          (error && !prevRequest?.sent)
        ) {
          prevRequest.sent = true;
          try {
            const newAccessToken = await refresh();
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            return Promise.reject(refreshError); // Propagate refresh failure
          }
        }
        return Promise.reject(error);
      }
    );

    // cleanup function

    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);

      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [auth?.accessToken, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
