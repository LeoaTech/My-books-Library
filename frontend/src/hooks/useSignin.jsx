import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { BASE_URL } from "../utiliz/baseAPIURL";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export const useSignin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.path || "/";

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [message, setMessage] = useState(null);

  const { dispatch, setAuth } = useAuthContext();

  const signin = async (email, password) => {
    setIsLoading(true);
    setError(null);
    console.log("Form Reached");

    const response = await fetch(`${BASE_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    // const response = await axios.post(
    //   `${BASE_URL}/auth/signin`,
    //   {
    //     email,
    //     password,
    //   },
    //   { headers: { "Content-Type": "application/json" }, withCredentials: true }
    // );
    console.log(response, "Form Response");
    const result = await response.json(); //response?.data;
    console.log(result, "Result");

    setIsLoading(false);

    if (!response.ok) {
      setIsLoading(false);
      setError(true);
      setMessage(result?.message);
    }

    if (response.ok) {
      setIsLoading(false);
      setError(null);

      const accessToken = result?.AccessToken;
      const user = result?.user;
      // axios.defaults.headers.common[
      //   "Authorization"
      // ] = `Bearer ${result?.AccessToken}`;

      //   save the json token to local memory;
      setAuth({ ...user, accessToken: accessToken });
      dispatch({ type: "Login", payload: result });
      if (result?.user === "admin") {
        navigate("/dashboard");
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  return { signin, isLoading, error, message };
};
