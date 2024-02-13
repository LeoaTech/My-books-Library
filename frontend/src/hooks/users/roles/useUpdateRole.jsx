import { useState } from "react";
import { BASE_URL } from "../../../utiliz/baseAPIURL";

export const useChangeUserRole = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [message, setMessage] = useState(null);

  const changeRole = async (roleData) => {
    setIsLoading(true);
    setError(null);
    console.log("Form Reached", roleData);

    const { role_id, user_id } = roleData;

    const response = await fetch(`${BASE_URL}/users/${user_id}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ newRoleId: role_id }),
    });

    const result = await response.json(); //response?.data;
    console.log(result, "Role Updated");
  };

  return { isLoading, error, message, changeRole };
};
