import { useContext } from "react";
import { AuthContext } from "../context/_admin/AuthContext";

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error("Invalid AuthContext");
  }
  return context;
};
