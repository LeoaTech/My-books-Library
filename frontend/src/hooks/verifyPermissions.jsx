import { useQuery } from "@tanstack/react-query";
import { fetchPermissionsByRoleID } from "./roles_permissions/useFetchRolesPermissions";
import { useMemo } from "react";
import { useCallback } from "react";
import { useAuthContext } from "./useAuthContext";

// Custom hook for permissions
const useVerifyPermissions = (role, resource) => {

    // console.log(role, resource, "verify permissions");
    
    const {auth} = useAuthContext();

    const selectedRole = auth?.roleId || role
    const { data: permissionsList, isPending, error } = useQuery({
        queryKey: ["role-permissions", { selectedRole }],
        queryFn: () => fetchPermissionsByRoleID(selectedRole),
        enabled: !!selectedRole || !!resource ,
        staleTime: 1000 * 60 * 5,
    });

    // console.log(permissionsList,"All permissions");
    

    const permissions = useMemo(() => {
        if (!permissionsList?.permissions) return new Set();
        return new Set(
            permissionsList.permissions
                .filter((p) => p?.permission_name.toUpperCase().includes(resource.toUpperCase()))
                .map((p) => p.permission_name.toUpperCase())
        );
    }, [permissionsList, resource]);

    const hasPermission = useCallback(
        (action) => {
            if (!resource || !action) return false;
            const permUpper = action.toUpperCase();
            return Array.from(permissions).some((p) => p.includes(permUpper));
            // const permUpper = `${resource.toUpperCase()} ${action.toUpperCase()}`;
            // return permissions.has(permUpper);
        },
        [permissions, resource]
    );

    const hasPageAccess = useCallback(() => {
        return hasPermission('READ');
    }, [hasPermission]);

    return { permissions, hasPermission, hasPageAccess, isPending, error };
};


export default useVerifyPermissions;