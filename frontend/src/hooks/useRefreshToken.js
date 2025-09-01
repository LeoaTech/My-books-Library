import { BASE_URL } from "../utiliz/baseAPIURL";
import axios from "axios";
import { useAuthContext } from "./useAuthContext";

const useRefreshToken = () => {
  const { setAuth } = useAuthContext();
  const refresh = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/auth/refresh`, {
        withCredentials: true,
      });


      // console.log(response?.data, "Refresh Token called");

      setAuth((prev) => {
        // console.log(prev, "Previous state");
        return {
          ...prev,
          accessToken: response?.data?.accessToken,
          roleId: response?.data?.user?.roleId,
          name: response?.data?.user?.name,
          role_name: response?.data?.user?.role_name,
          id: response?.data?.user?.id,
          email: response?.data?.user?.email,
          branchId: response?.data?.user?.branchId,
          branchName: response?.data?.user?.branchName,
          entityId: response?.data?.user?.entityId,
          entityName: response?.data?.user?.entityName,
          subdomain: response?.data?.user?.subdomain,
          authSource: localStorage.getItem("auth-source") || false,
          auth: true,
        };
      });

      return response?.data?.accessToken;
    } catch (error) {
      // console.log(error, "Refresh token errors");
      if (error.response?.status === 403 || error.response?.status === 401) {
        // Refresh token expired or invalid error
        throw new Error("Session expired, please log in again");
      }
      throw error; // any other error
    }
  };
  return refresh;
};

export default useRefreshToken;
