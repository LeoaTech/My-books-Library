import React from "react";

const Home = () => {
  return (
    <main
      id="dashboard-main"
      className="h-[calc(100vh-2rem)] overflow-auto px-4 py-10"
    >
      {/* <!-- Put your content inside of the <main/> tag --> */}
      <h1 className="text-2xl font-black text-gray-800">Good Morning User!</h1>
      <p className="mb-6 text-gray-600">
        Here's what requires your immediate attention.
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-8">
        <div className="h-56 w-72 rounded-xl bg-white p-10 shadow-md"></div>
        <div className="h-56 w-72 rounded-xl bg-white p-10 shadow-md"></div>
        <div className="h-56 w-full rounded-xl bg-white p-10 shadow-md"></div>
        <div className="h-56 w-full rounded-xl bg-white p-10 shadow-md"></div>
        <div className="h-56 w-full rounded-xl bg-white p-10 shadow-md"></div>
      </div>
    </main>
  );
};

export default Home;
