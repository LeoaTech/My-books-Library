import axios from "axios";
import { createContext, useEffect, useReducer, useState } from "react";
import { BASE_URL } from "../../utiliz/baseAPIURL";

export const AuthContext = createContext();

console.log(AuthContext);
export const authReducer = (state, action) => {
  switch (action.type) {
    case "Login":
      return { user: action.payload };
    case "Logout":
      return { user: null };
    default:
      return state;
  }
};
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  const [auth, setAuth] = useState({});
  const [googleAuth, setGoogleAuth] = useState(false);

  const [persist, setPersist] = useState(
    JSON.parse(localStorage?.getItem("persist")) || false
  );

  // To get Google Signin User credentials
  const getUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/auth/login/success`, {
        withCredentials: true,
      });

      console.log(response, "resp");
      const data = response?.data?.user;

      console.log(data, "on auth context");
      //   save the json token to local storage;
      if (response.status === 200) {
        localStorage.setItem("google-auth", data?.auth);

        dispatch({ type: "Login", payload: data });
        if (data != null) {
          setAuth({ ...data });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (googleAuth !== undefined) {
      getUser();
    }
  }, [googleAuth]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        dispatch,
        persist,
        setPersist,
        auth,
        setGoogleAuth,
        setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
