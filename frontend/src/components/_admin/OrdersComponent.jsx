import { useEffect, useState } from "react";
import { useFetchOrders } from "../../hooks/orders/useFetchOrders";
import OrderTable from "./ui/Tables/OrderTable"
const OrdersComponent = () => {
  const {
    data: orderData,
    isPending: orderPending,
    isError: orderError,
  } = useFetchOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState(orderData?.orders || []);

  // Filter function to filter data based on search term
  const filterOrders = () => {
    if (!searchTerm) {
      setFilteredOrders(orderData?.orders || []);
      return;
    }
    const filtered = orderData.orders.filter(
      (order) =>
        order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.name.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Call filterOrders whenever search term changes
  useEffect(() => {
    if (searchTerm !== "") {
      filterOrders();
    }
  }, [searchTerm]);

  if (orderPending) {
    return <h2>Loading....</h2>;
  }

  if (orderError) {
    return <h1> Error Fetching Orders</h1>;
  } else
    return (
      <div>
        <div className="relative mb-5">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Type to search..."
            className="border-b w-full md:w-1/3 bg-transparent ml-3 pr-2 pl-6 lg:pr-4 lg:pl-9 p-3 focus:outline-none"
          />

          <button className="absolute top-1/2 left-0 -translate-y-1/2">
            <svg
              className="fill-[#64748B] hover:fill-[#3C50E0] dark:fill-[#AEB7C0] dark:hover:fill-[#3C50E0]"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                fill=""
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                fill=""
              />
            </svg>
          </button>
        </div>
        {/* Order Table */}
        <OrderTable filteredOrders={filteredOrders} />

      </div>
    );
};

export default OrdersComponent;
