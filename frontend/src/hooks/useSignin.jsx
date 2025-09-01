import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { BASE_URL } from "../utiliz/baseAPIURL";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const LoginFailed = () => toast.error("Failed to Login Try again", {
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
})

const LoginSuccess = () => toast.success("Login Successfully!", {
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  theme: "dark",
})
export const useSignin = () => {
  const navigate = useNavigate()
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [message, setMessage] = useState(null);
  const { dispatch, setAuth } = useAuthContext();

  // Sign in (with no subdomain) from app domain using email and password
  const signin = async (email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`${BASE_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    // console.log(response, "Response");

    const result = await response.json(); //response?.data;
    console.log(result, "Sign in result");

    setIsLoading(false);

    if (!response.ok) {
      LoginFailed()
      setIsLoading(false);
      setError(true);
      setMessage(result?.error);
    }

    if (response.ok) {
      localStorage.setItem("auth-source", "email");
      LoginSuccess()
      setIsLoading(false);
      setError(null);

      if (result.accessToken && result.redirect) {
        const accessToken = result?.accessToken || "";
        const user = result?.user;
        setAuth({ ...user, accessToken: accessToken });
        dispatch({ type: "Login", payload: result });
        navigate(`/${user.subdomain}`)
      }

    }
  };

  // Sign in (when user login from a Library domain)using email and password

  const login = async (email, password, subdomain) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, subdomain }),
    });

    // console.log(response, "Response");

    const result = await response.json(); //response?.data;
    console.log(result, "Sign in result from library domain");

    setIsLoading(false);

    if (!response.ok) {
      LoginFailed()
      setIsLoading(false);
      setError(true);
      setMessage(result?.message);
    }

    if (response.ok) {
      localStorage.setItem("auth-source", "email");
      LoginSuccess()
      setIsLoading(false);
      setError(null);

      const accessToken = result?.accessToken || "";
      const user = result?.user;
      setAuth({ ...user, accessToken: accessToken });
      dispatch({ type: "Login", payload: result });
      navigate(`/${user.subdomain}`)
    }
  };

  return { signin, isLoading, error, message, login };
};
