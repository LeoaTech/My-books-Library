import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const logout = () => {
    // Remove the User from local storage
    localStorage.removeItem("user");

    dispatch({ type: "Logout" });
    navigate("/signin");
  };
  return { logout };
};
