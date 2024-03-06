import React from "react";

const UnAuthorized = () => {
  return (
    <div className="text-center pt-20">
      <h1 className="text-xl font-medium mt-2">
        UnAuthorized :) You don&apos;t have Permissions to Access this Page info
      </h1>

      <p className="text-xl font-medium mt-2">
        {" "}
        Please Contact Admin to Access Resource Permissions
      </p>
    </div>
  );
};

export default UnAuthorized;
