import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utiliz/baseAPIURL";

// API CALL to FETCH  Roles

const fetchRolesPermissions = async ({ signal }) =>
  await fetch(`${BASE_URL}/roles-permissions`, {
    signal,
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Couldn't fetch role permissions");
      } else {
        return res.json();
      }
    })
    .catch((err) => console.log(err));

export const useFetchRolesPermissions = () => {
  return useQuery({
    queryKey: ["role-permissions"],
    queryFn: fetchRolesPermissions,
  });
};

// export const fetchPermissionsByRole = async (roleId, { signal }) => {
//   // const response = await fetch(`${BASE_URL}/roles-permissions/permission?roleId=${roleId}`,{ signal, credentials: "include" }); // Replace with your API endpoint
//   // const data = await response.json();
//   // return data;

//   await fetch(`${BASE_URL}/roles-permissions/permission?roleId=${roleId}`, {
//     signal,
//     credentials: "include",
//   })
//     .then((res) => {
//       console.log(res)
//       if (!res.ok) {
//         throw new Error("Couldn't fetch role permissions");
//       } else {

//         console.log(res.json())
//         return res.json();
//       }
//     })
//     .catch((err) => console.log(err));
// };


// Fetch Permission which does not exist with Role_id
export const fetchPermissionsByRole = async (roleId) => {
  try {
    console.log(roleId, "idhr aya");
    const response = await fetch(
      `${BASE_URL}/roles-permissions/permission?roleId=${roleId}`,
      {
        credentials: "include",
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching role permissions", error);
    throw error; // Rethrow the error to let React Query handle it
  }
};

// Fetch Permission associated with Role_id


export const fetchPermissionsByRoleID = async (roleId) => {
  try {
    console.log(roleId, "idhr aya");
    const response = await fetch(
      `${BASE_URL}/roles-permissions/permissions?roleId=${roleId}`,
      {
        credentials: "include",
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching role permissions", error);
    throw error; // Rethrow the error to let React Query handle it
  }
};