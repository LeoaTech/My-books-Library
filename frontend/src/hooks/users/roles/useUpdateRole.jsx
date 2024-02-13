import { useState } from "react";
import { BASE_URL } from "../../../utiliz/baseAPIURL";

export const useChangeUserRole = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [message, setMessage] = useState(null);

  // Update Role For Each User
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

  // Delete Any User

  const deleteUser = async (userData) => {
    setIsLoading(true);
    setError(null);
    console.log("Form Reached", userData);


    const {user_id}  = userData;

    const response = await fetch(`${BASE_URL}/users/${user_id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const result = await response.json(); //response?.data;
    console.log(result, "User Deleted");
  };

  return { isLoading, error, message, changeRole, deleteUser };
};
