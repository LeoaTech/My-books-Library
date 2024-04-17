import { BASE_URL } from "../utiliz/baseAPIURL";
import axios from "axios";
import { useAuthContext } from "./useAuthContext";

const useRefreshToken = () => {
  const { setAuth } = useAuthContext();
  const refresh = async () => {
    const response = await axios.get(`${BASE_URL}/auth/refresh`, {
      withCredentials: true,
    });

    setAuth((prev) => {
      // console.log(prev,"Previous state");
      // console.log(response?.data?.accessToken);
      return {
        ...prev,
        accessToken: response?.data?.accessToken,
        role: response?.data?.user?.role,
        name: response?.data?.user?.name,
        role_name: response?.data?.user?.role_name
      };
    });

    return response?.data?.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
