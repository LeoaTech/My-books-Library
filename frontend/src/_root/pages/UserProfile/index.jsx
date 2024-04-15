import React from "react";
import DashboardSB from "../../../components/_user/Profile/DashboardSB";
import Home from "./Home";

const MyProfile = () => {
  return (
    <div className="bg-slate-200 flex h-screen">
      {/* <!-- Sidebar --> */}
      <DashboardSB />

      <div className="flex h-full w-full flex-col">
        {/* <!-- Main --> */}
        <div className="h-full overflow-hidden pl-6">
          <Home />
        </div>
        {/* <!-- /Main --> */}
      </div>
    </div>
  );
};

export default MyProfile;
