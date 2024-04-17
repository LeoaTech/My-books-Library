import React from "react";
import { OrderComponent } from "../../components/_admin";

const Orders = () => {
  return (
    <div className="my-4 overflow-hidden">
      <h2 className="m-5 text-2xl md:text-3xl text-[#8A99AF] font-medium">
        Orders
      </h2>
      <OrderComponent />
    </div>
  );
};

export default Orders;
