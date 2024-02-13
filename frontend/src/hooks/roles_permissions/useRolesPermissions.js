import { useState } from "react";
import { BASE_URL } from "../../utiliz/baseAPIURL";

export const useRolesPermissions = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [message, setMessage] = useState(null);
  const [deletePermissionText, setDeletePermissionText] = useState(null);

  const addRolePermission = async (rolesPermissions) => {
    setIsLoading(true);
    setError(null);
    console.log("Form Reached");

    const response = await fetch(
      `${BASE_URL}/roles-permissions/permission/add`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(rolesPermissions),
      }
    );

    console.log(response, "Permissions Form Response");
    const result = await response.json(); //response?.data;
    console.log(result, "Result");
  };

  
 
  return {
    isLoading,
    error,
    message,
    deletePermissionText,
    addRolePermission,
  };
};
