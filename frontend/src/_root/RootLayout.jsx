import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../App";

const RootLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default RootLayout;
