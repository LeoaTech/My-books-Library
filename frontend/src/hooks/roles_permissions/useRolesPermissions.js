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

    const response = await fetch(
      `${BASE_URL}/roles-permissions/permission/add`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(rolesPermissions),
      }
    );

    const result = await response.json(); //response?.data;
    // console.log(result, "Result");
  };

  /* Delete Permission */
  const deleteRolesPermission = async (permissionsData) => {
    setIsLoading(true);
    setError(null);

    // ... Destructure role_id and Permissions_ids from form
    const { role_id, permission_id } = permissionsData;

    const response = await fetch(
      `${BASE_URL}/roles-permissions/permission/${role_id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ permission_id: permission_id }),
      }
    );


    const result = await response.json(); //response?.data;
    // console.log(result, "Result");

    if (response.status === 204) {
      setIsLoading(false);
      setDeletePermissionText(result?.message);
    } else {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    message,
    deleteRolesPermission,
    deletePermissionText,
    addRolePermission,
  };
};
