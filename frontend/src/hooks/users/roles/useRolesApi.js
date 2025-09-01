import { useState } from "react";
import { BASE_URL } from "../../../utiliz/baseAPIURL";

export const useRoles = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [message, setMessage] = useState(null);
  const [deleteRoleText, setDeleteRoleText] = useState(null);

  const newRole = async (newRole) => {
    setIsLoading(true);
    setError(null);
    console.log("Form Reached");

    const response = await fetch(`${BASE_URL}/roles/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ roleForm: newRole }),
    });

    console.log(response, "Roles Form Response");
    const result = await response.json(); //response?.data;
    console.log(result, "Result");
  };

  /* Delete Role */
  const deleteRole = async (roleData) => {
    setIsLoading(true);
    setError(null);
    const { role_id, entityId } = roleData;
    const response = await fetch(`${BASE_URL}/roles/remove/${role_id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ entityId }),
    });

    console.log(response, "Roles Form Response");

    const result = await response.json(); //response?.data;
    console.log(result, "Result");

    if (response.status === 204) {
      setIsLoading(false);
      setDeleteRoleText(result?.message);
    } else {
      setIsLoading(false);
    }
  };

  /* Update Role */

  const updateRole = async (roleData) => {
    setIsLoading(true);
    setError(null);
    // console.log("Form Reached");

    const { name, role_id, entityId } = roleData;

    const Id = Number(role_id);

    const response = await fetch(`${BASE_URL}/roles/update/${Id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, entityId }),
    });

    console.log(response, "Roles Form Response");
    const result = await response.json(); //response?.data;
    console.log(result, "Result");
  };

  return {
    isLoading,
    error,
    message,
    newRole,
    updateRole,
    deleteRole,
    deleteRoleText,
  };
};
