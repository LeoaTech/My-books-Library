import axios from "axios";
import { createContext, useEffect, useReducer, useState } from "react";
export const AuthContext = createContext();
import {Navigate} from "react-router-dom"
//Server URL
const serverUrl = import.meta.env.VITE_SERVER_ENDPOINT;

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

  const [auth, setAuth] = useState(null);
  // Identify the type of auth source
  const [googleAuth, setGoogleAuth] = useState(
    localStorage.getItem("auth-source") =="google"|| false
  );

  // Persist Auth , It means the refresh token API will call automatically
  const [persist, setPersist] = useState(
    JSON.parse(localStorage?.getItem("persist")) || false
  );


  console.log(googleAuth, " is the Signed in Source");

  // To get Google Signin User credentials
  const getUser = async () => {
    try {
      const response = await axios.get(`${serverUrl}/auth/login/success`, {
        withCredentials: true,
      });

      const data = response?.data?.user;
      console.log(response, "login success", data);
      //   save the json token to local storage;
      if (response.status === 200) {
        localStorage.setItem("auth-source", "google");
        localStorage.setItem("user", data?.user);

        dispatch({ type: "Login", payload: data });
        if (data != null) {
          setAuth({ ...data, accessToken: data?.accessToken });
        }
      }
    } catch (error) {
      console.log(error, "Error getting data");
      <Navigate to="/signin" />
      
    }
  };

  useEffect(() => {
    if (googleAuth !="email") {
      getUser();
    } else {
      console.log("No need to fetch users data")
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
