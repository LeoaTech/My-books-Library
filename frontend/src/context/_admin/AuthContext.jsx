import axios from "axios";
import { createContext, useEffect, useReducer, useState } from "react";
import { Navigate } from "react-router-dom"
import { BASE_URL } from "../../utiliz/baseAPIURL";

const serverUrl = import.meta.env.VITE_SERVER_ENDPOINT;

export const AuthContext = createContext();


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
    localStorage.getItem("auth-source") == "google" || false
  );
  const [persist, setPersist] = useState(
    JSON.parse(localStorage?.getItem("persist")) || false
  ); //Persist Auth State to refresh access token 


  console.log(localStorage.getItem('auth-source'), " is Auth Source")


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

        if (data != null) {
          localStorage.setItem("auth-source", "google");
          localStorage.setItem("user", JSON.stringify(data?.user));

          dispatch({ type: "Login", payload: data });
          setAuth({ ...data, accessToken: data?.accessToken });
          // <Navigate to={`/${data.subdomain}`} replace />
          const redirectURL = `/${data?.subdomain}`
          return redirectURL;

        }
      }
    } catch (error) {
      console.log(error, "Error getting data");
      <Navigate to="/signin" replace />

    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        dispatch,
        persist,
        setPersist,
        auth,
        googleAuth,
        setGoogleAuth,
        setAuth,getUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
