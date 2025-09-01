import { useState } from "react";
import { BASE_URL } from "../utiliz/baseAPIURL";

// Sign up Form Hook
export const useSignup = () => {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(null);

  const signup = async (email, password, name,subdomain) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name,subdomain }),
    });
    const result = await response.json();

    // console.log("Response: " ,response, "Result", result);
    
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

  const registerUser = async (data) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: data }),
    });
    const result = await response.json();

    // console.log(result, "Registered user as an Admin");
    
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


  return { signup, isLoading, error, message, registerUser };
};
