import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { BASE_URL } from "../utiliz/baseAPIURL";

// Sign up Form Hook
export const useSignup = () => {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(null);

  const { dispatch } = useAuthContext();

  const signup = async (email, password, name) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const result = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(result.message || result.error);
      setMessage(true);
    }

    if (response.ok) {
      setIsLoading(false);
      setMessage(true);
    }
  };

  return { signup, isLoading, error, message };
};
