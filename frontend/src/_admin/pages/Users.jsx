import { UserTable } from "../../components/_admin";
import { useFetchUserRoles } from "../../hooks/users/useFetchUserRoles";

const Users = () => {
  const { isPending, error, data } = useFetchUserRoles();

  if (isPending) return "Loading..."; //Add Loading Component

  if (error) return "An error has occurred: " + error.message; // Add error Component

  return (
    <div>
      <h1 className="m-5 text-lg md:text-2xl text-[#8A99AF]">Users</h1>

      {data && <UserTable users={data?.data} />}
    </div>
  );
};

export default Users;
