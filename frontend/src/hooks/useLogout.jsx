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
    console.log(res, "logged out");

    setAuth({});
    dispatch({ type: "Logout" });
    navigate("/");
  };

  // Google Auth Signout Method
  const signout = async () => {
    let res = await fetch(`${BASE_URL}/auth/logout`, {
      credentials: "include",
    });
    console.log(res, "logged out");


    dispatch({ type: "Logout" });
    navigate("/");
  };
  return { logout,signout };
};
