import React from "react";
import { ListingTable, UserTable } from "../../components/_admin";

const Users = () => {
  return (
    <div>
      <h1 className="text-3xl mb-5">Users</h1>

      {/* <ListingTable /> */}

      <UserTable />
    </div>
  );
};

export default Users;
