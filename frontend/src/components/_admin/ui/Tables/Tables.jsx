import React, { useState } from "react";
import BookOne from "../../../../assets/book1.jpg";
const Tables = ({ setBookDetailModal }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default max-w-full overflow-x-auto overflow-y-auto  dark:border-strokedark dark:bg-boxdark">
      <div className="w-full overflow-x-auto">
        <div className="grid grid-cols-11 border-t border-stroke py-4.5 px-2 dark:border-strokedark sm:grid-cols-11 md:px-6 2xl:px-7.5">
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Book Name</p>
          </div>
          {/* hidden */}
          <div className="col-span-2  items-center sm:flex">
            <p className="font-medium">Genre</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Price</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Author</p>
          </div>{" "}
          {/* <div className="col-span-2 flex items-center">
            <p className="font-medium">Cover</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Condition</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Sold</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Profit</p>
          </div> */}
          <div className="col-span-2 flex items-center">
            <p className="font-medium">ISBN</p>
          </div>{" "}
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Actions</p>
          </div>{" "}
        </div>

        {[1, 2, 3, 4, 5, 6, 7].map((index) => {
          return (
            <>
              <div
                key={index}
                className="grid grid-cols-11 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-11 md:px-6 2xl:px-7.5"
              >
                <div className="col-span-2 flex items-center">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="h-12.5 w-15 rounded-md">
                      <img
                        className="h-12 w-12 rounded-lg"
                        src={BookOne}
                        alt="Book"
                      />
                    </div>
                    <p className="text-sm text-black dark:text-white">
                      Think and Grow Rich
                    </p>
                  </div>
                </div>
                <div className="col-span-2 hidden items-center sm:flex">
                  {/* <p className="text-sm text-black dark:text-white"> */}
                  <p className="inline-flex rounded-full bg-meta-4 bg-opacity-10 py-1 px-3 text-sm font-medium text-primary">
                    Psychology
                  </p>
                </div>
                <div className="col-span-1 flex items-center">
                  <p className="text-sm text-black dark:text-white">$12</p>
                </div>
                <div className="col-span-2 flex items-center">
                  {/* <p className="text-sm text-black dark:text-white"> */}
                  <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-2 text-sm font-medium text-success">
                    Napolean Hill
                  </p>
                </div>

                {/* <div className="col-span-2 flex items-center">
                  <p className="text-sm text-black dark:text-white">Hardback</p>
                </div>
                <div className="col-span-2 flex items-center">
                  <p className="text-sm text-black dark:text-white">Used</p>
                </div>
                <div className="col-span-2 flex items-center">
                  <p className="text-sm text-black dark:text-white">2</p>
                </div>
                <div className="col-span-2 flex items-center">
                  <p className="text-sm text-black dark:text-white">$25.4</p>
                </div> */}
                <div className="col-span-2 flex items-center">
                  <p className="text-sm text-black dark:text-white">
                    793DR3992DDEe
                  </p>
                </div>
                <div className="col-span-2 flex items-center">
                  <p
                    className="cursor-pointer text-sm text-primary underline dark:text-white"
                    onClick={() => setBookDetailModal(true)}
                  >
                    view details
                  </p>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default Tables;
