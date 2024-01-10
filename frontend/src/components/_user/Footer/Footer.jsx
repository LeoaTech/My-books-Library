import React from "react";
import BottomPattern from "./BottomPattern";

const Footer = () => {
  return (
    <footer className="relative bg-purple-50">
      <div className="mx-auto grid max-w-screen-xl gap-y-8 gap-x-12 px-4 py-10 md:grid-cols-2 xl:grid-cols-4 xl:px-10 lg:mb-32 md:mb-16 mb-8">
        <div className="max-w-sm">
          <div className="mb-6 flex h-12 items-center space-x-2">
            <span className="text-2xl font-bold">
              Leoa<span className="text-purple-600">Tech</span>.
            </span>
          </div>
          <div className="text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis ad a
            officia ea expedita!
          </div>
        </div>
        <div className="">
          <div className="mt-4 mb-2 font-medium xl:mb-4">Address</div>
          <div className="text-gray-500">
            35 Remida Heights, <br />
            45 Street, <br />
            South Caroline, US
          </div>
        </div>
        <div className="">
          <div className="mt-4 mb-2 font-medium xl:mb-4">Links</div>
          <nav aria-label="Footer Navigation" className="text-gray-500">
            <ul className="space-y-3">
              <li>
                <a className="hover:text-blue-600 hover:underline" href="#">
                  Pricing
                </a>
              </li>
              <li>
                <a className="hover:text-blue-600 hover:underline" href="#">
                  Demo
                </a>
              </li>
              <li>
                <a className="hover:text-blue-600 hover:underline" href="#">
                  Press
                </a>
              </li>
              <li>
                <a className="hover:text-blue-600 hover:underline" href="#">
                  Support Hub
                </a>
              </li>
              <li>
                <a className="hover:text-blue-600 hover:underline" href="#">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="">
          <div className="mt-4 mb-2 font-medium xl:mb-4">
            Subscribe to our Newsletter
          </div>
          <div className="flex flex-col">
            <div className="mb-4">
              <input
                type="email"
                className="focus:outline mb-2 block h-14 w-full rounded-xl bg-gray-100 px-4 sm:w-64 focus:outline-none focus:ring-1 focus:ring-blue-600"
                placeholder="Enter your email"
              />
              <button className="block rounded-xl bg-purple-600 px-6 py-3 font-medium text-white">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
      <BottomPattern />
    </footer>
  );
};

export default Footer;
