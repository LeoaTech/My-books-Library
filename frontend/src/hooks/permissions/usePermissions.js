

import { useState } from "react";
import { BASE_URL } from "../../utiliz/baseAPIURL";

export const usePermissions = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [message, setMessage] = useState(null);
  const [deletePermissionText, setDeletePermissionText] = useState(null);

  const newPermission = async (name) => {
    setIsLoading(true);
    setError(null);
    console.log("Form Reached");

    const response = await fetch(`${BASE_URL}/permissions/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(name),
    });

    console.log(response, "Permissions Form Response");
    const result = await response.json(); //response?.data;
    console.log(result, "Result");
  };

  /* Delete Permission */
  const deletePermission = async (permissionId) => {
    setIsLoading(true);
    setError(null);
    const response = await fetch(`${BASE_URL}/permissions/remove/${permissionId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    console.log(response, "Permissions Form Response");

    const result = await response.json(); //response?.data;
    console.log(result, "Result");

    if (response.status === 204) {
      setIsLoading(false);
      setDeletePermissionText(result?.message);
    } else {
      setIsLoading(false);
    }
  };

  /* Update Permission */

  const updatePermission = async (PermissionData) => {
    setIsLoading(true);
    setError(null);
    console.log("Form Reached");

    const { name, permission_id } = PermissionData;

    const Id = Number(permission_id);

    const response = await fetch(`${BASE_URL}/permissions/update/${Id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name }),
    });

    console.log(response, "Permissions Form Response");
    const result = await response.json(); //response?.data;
    console.log(result, "Result");
  };

  return { isLoading, error, message, newPermission, updatePermission, deletePermission, deletePermissionText };
};
