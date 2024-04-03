import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";
import { BASE_URL } from "../utiliz/baseAPIURL";
import axios from "axios";

export const useLogout = () => {
  const { dispatch, setAuth } = useAuthContext();
  const navigate = useNavigate();

  // Email and Password Logout Method
  const logout = async () => {
    let res = await axios.get(`${BASE_URL}/auth/user/logout`, {
      withCredentials: true,
    });

    setAuth({});
    dispatch({ type: "Logout" });
    navigate("/");
  };

  // Google Auth Signout Method
  const signout = async () => {
    let res = await axios.get(`${BASE_URL}/auth/logout`, {
      withCredentials: true,
    });
    if (res.status === 200) {
      dispatch({ type: "Logout" });
      localStorage.removeItem("google-auth");

      setAuth({});
      navigate("/");
    } else {
      console.log("logout failed");
    }
  };
  return { logout, signout };
};
