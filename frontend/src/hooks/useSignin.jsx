import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { BASE_URL } from "../utiliz/baseAPIURL";
import { useNavigate } from "react-router-dom";

export const useSignin = () => {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const { dispatch } = useAuthContext();

  const signin = async (email, password) => {
    setIsLoading(true);
    setError(null);
    console.log("Form Reached");

    const response = await fetch(`${BASE_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    console.log(response, "Form Response");
    const result = await response.json();
    console.log(result, "Result");

    if (!response.ok) {
      setIsLoading(false);
      setError(result.error);
    }

    if (response.ok) {
      setIsLoading(false);
      setError(null);

      //   save the json token to local storage;

      localStorage.setItem("user", JSON.stringify(result));

      dispatch({ type: "Login", payload: result });

      setIsLoading(false);
      if (result?.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    }
  };

  return { signin, isLoading, error };
};
