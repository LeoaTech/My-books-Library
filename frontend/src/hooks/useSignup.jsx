import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { BASE_URL } from "../utiliz/baseAPIURL";

console.log(BASE_URL)
export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const { dispatch } = useAuthContext();

  const signup = async (email, password, name) => {
    setIsLoading(true);
    setError(null);
    console.log("Form Reached");

    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
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
    }
  };

  return { signup, isLoading, error };
};
