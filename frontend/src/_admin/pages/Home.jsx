import React from "react";
import CardBooks from "../../components/_admin/ui/cards/CardBooks";
import CardOrders from "../../components/_admin/ui/cards/CardOrders";
import CardSales from "../../components/_admin/ui/cards/CardSales";
import CardProfit from "../../components/_admin/ui/cards/CardProfilt";

const DashboardPage = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <CardBooks />
      <CardOrders />
      <CardSales />
      <CardProfit />
    </div>
  );
};

export default DashboardPage;
