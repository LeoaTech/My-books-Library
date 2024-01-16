import React, { useState } from "react";
import {
  ReturnsTable,
  ShippingsTable,
} from "../../components/_admin";
import { Link } from "react-router-dom";
import Tables from "../../components/_admin/ui/Tables/Tables";

const types = ["Shipped", "Ready-To-Ship", "Recently Shipped"];
function TabGroup() {
  const [active, setActive] = useState(types[0]);
  return (
    <>
      <ul className="flex flex-wrap text-md font-medium text-center text-body border-gray-200">
        {types.map((type) => (
          <li className="mr-2 border-b mx-2 border-secondary mb-2" key={type}>
            <Link
              className={`inline-block p-2 mx-3  text-body bg-transparent rounded-t-lg ${
                active === type ? "text-primary " : "text-bodydark2"
              }`}
              key={type}
              active={active === type}
              onClick={() => setActive(type)}
            >
              {type}
            </Link>
          </li>
        ))}
      </ul>
      <RenderTable active={active} />
    </>
  );
}

const RenderTable = ({ active }) => {
  if (active === "Shipped") {
    return <ShippingsTable />;
  } else if (active === "Ready-To-Ship") {
    return <Tables />;
  } else if (active === "Recently Shipped") {
    return <ReturnsTable />;
  } else {
    <p> No table</p>;
  }
};
const Shipping = () => {
  return (
    <div>
      <h2 className="m-5 text-lg md:text-2xl text-bodydark2">
        Shipping Details{" "}
      </h2>
      <TabGroup />
    </div>
  );
};

export default Shipping;
