import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";
import { BASE_URL } from "../utiliz/baseAPIURL";
import axios from "axios";
import { toast } from "react-toastify";
const LogoutFailed = () => toast.error("Failed to Logout Try again", {
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
})

const LogoutSuccess = () => toast.success("Logout Successfully", {
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
})
const serverUrl = import.meta.env.VITE_SERVER_ENDPOINT;

export const useLogout = () => {
  const { dispatch, setAuth } = useAuthContext();
  const navigate = useNavigate();

  // Email and Password Logout Method
  const logout = async () => {
    let res = await axios.get(`${BASE_URL}/auth/user/logout`, {
      withCredentials: true,
    });

    setAuth(null);
    LogoutSuccess();
    localStorage.removeItem('user');
    localStorage.setItem('persist', false)
    // localStorage.setItem("auth-source", false);
    localStorage.setItem("color-theme", "light")
    localStorage.removeItem("auth-source");
    delete axios.defaults.headers.common['Authorization'];

    dispatch({ type: "Logout" });
    navigate("/");
  };

  // Google Auth Signout Method
  const signout = async () => {
    let res = await axios.get(`${serverUrl}/auth/logout`, {
      withCredentials: true,
    });

    
    if (res.status === 200) {
      LogoutSuccess();
      dispatch({ type: "Logout" });

      // localStorage.removeItem("google-auth");
      localStorage.removeItem("auth-source");
      localStorage.removeItem('user');
      localStorage.setItem('persist', false)
      setAuth(null);
      navigate("/");
      delete axios.defaults.headers.common['Authorization'];
    } else {
      LogoutFailed()
      console.log("logout failed");
    }
  };
  return { logout, signout };
};
