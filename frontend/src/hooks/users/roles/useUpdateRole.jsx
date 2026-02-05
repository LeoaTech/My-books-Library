import { useState } from "react";
import { BASE_URL } from "../../../utils/baseAPIURL";

export const useChangeUserRole = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [message, setMessage] = useState(null);

  // Update Role For Each User
  const changeRole = async (roleData) => {
    setIsLoading(true);
    setError(null);

    const { role_id, user_id } = roleData;

    const response = await fetch(`${BASE_URL}/users/${user_id}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ newRoleId: role_id }),
    });

    const result = await response.json(); //response?.data;
  };

  // Delete Any User

  const deleteUser = async (userData) => {
    setIsLoading(true);
    setError(null);


    const {user_id}  = userData;

    const response = await fetch(`${BASE_URL}/users/${user_id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const result = await response.json(); //response?.data;
  };

  return { isLoading, error, message, changeRole, deleteUser };
};
