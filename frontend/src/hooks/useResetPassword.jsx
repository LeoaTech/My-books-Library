import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utiliz/baseAPIURL";
import axios from "axios";
import { useState } from "react";

export const useResetPassword = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(false);

  const resetPassword = async (password, confirm_password, id, token) => {
    const res = await axios.post(
      `${BASE_URL}/auth/reset-password/${id}/${token}`,
      {
        password: password,
        confirm_password: confirm_password, // or just { email } if you're using ES6 shorthand
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (res.status === 201) {
      setMessage(true);
    } else {
      console.log("Failed to reset password");
    }
  };

  const validateUser = async (id, token) => {
    const res = await fetch(`${BASE_URL}/auth/forgotpassword/${id}/${token}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const result = await res.json();
    } else {
      navigate("/expired-link");
    }
  };
  return { resetPassword, validateUser, message };
};
