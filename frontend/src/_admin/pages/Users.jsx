import { lazy, Suspense } from "react";
import { useFetchUserRoles } from "../../hooks/users/useFetchUserRoles";
import Loader from "../../components/_admin/Loader/Loader";
const UserTable = lazy(() => import("../../components/_admin/ui/Tables/UserTable"));

const Users = () => {
  const { isPending, error, data } = useFetchUserRoles();

  if (isPending) return "Loading..."; //Add Loading Component

  if (error) return "An error has occurred: " + error.message; // Add error Component

  return (
    <div>
      <h1 className="m-5 text-lg md:text-2xl text-[#8A99AF]">Users</h1>

      {data &&

        <Suspense fallback={<Loader />}
        >
          <UserTable users={data?.data} />
        </Suspense>
      }
    </div>
  );
};

export default Users;
