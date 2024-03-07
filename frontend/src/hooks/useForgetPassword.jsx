import { useState } from "react";
import { BASE_URL } from "../utiliz/baseAPIURL";
import axios from "axios";

export const useForgetPassword = () => {
  // const [email, setEmail] = useState("");
  const [error,setError] = useState(false)
  const [message, setMessage] = useState(false);

  const forgetPassword = async (email) => {
    const res = await fetch(
      `${BASE_URL}/auth/forgot-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({email})
      }
    );


    if (res.ok) {
      setMessage(true);
      setError(false)
    } else {
      setError(true)
      console.log("Invalid email");
    }
  };
  return { forgetPassword, message ,error};
};
