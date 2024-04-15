import React from "react";
import DashboardSB from "../../../components/_user/Profile/DashboardSB";

const Membership = () => {
  return (
    <div className="bg-slate-200 flex h-screen">
      {/* <!-- Sidebar --> */}
      <DashboardSB />

      <div className="flex h-full w-full flex-col">
        {/* <!-- Navbar --> */}
        <header className="relative flex flex-col items-center bg-white px-4 py-4 shadow sm:flex-row md:h-20">
          <div className="flex w-full flex-col justify-between overflow-hidden transition-all sm:max-h-full sm:flex-row sm:items-center">
            <div className="relative ml-10 flex items-center justify-between rounded-md sm:ml-auto">
              <svg
                className="absolute left-2 block h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" className=""></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65" className=""></line>
              </svg>
              <input
                type="name"
                name="search"
                className="h-12 w-full rounded-md border border-gray-100 bg-gray-100 py-4 pr-4 pl-12 shadow-sm outline-none focus:border-blue-500"
                placeholder="Search for anything"
              />
            </div>

            <ul className="mx-auto mt-4 flex space-x-6 sm:mx-5 sm:mt-0">
              <li className="">
                <button className="flex h-8 w-8 items-center justify-center rounded-xl border text-gray-600 hover:text-black hover:shadow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </li>
              <li className="">
                <button className="flex h-8 w-8 items-center justify-center rounded-xl border text-gray-600 hover:text-black hover:shadow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </button>
              </li>
              <li className="">
                <button className="flex h-8 w-8 items-center justify-center rounded-xl border text-gray-600 hover:text-black hover:shadow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </li>
            </ul>
          </div>
        </header>
        {/* <!-- /Navbar --> */}

        {/* <!-- Main --> */}
        <div className="h-full overflow-hidden pl-10">
          <div className="h-full overflow-auto px-4 py-10">
            <div className="mb-14 flex items-center justify-center text-gray-900">
              <div className="inline-flex items-center justify-center rounded-full border font-semibold bg-slate-100 p-2">
                <button className="inline-flex cursor-pointer items-center justify-center py-1 px-5 text-center font-sans text-sm normal-case">
                  Monthly
                </button>
                <button
                  className="inline-flex cursor-pointer items-center justify-center rounded-full bg-sky-400 py-1 px-5 text-center font-sans text-sm normal-case text-white"
                  id="annually"
                >
                  Annually
                </button>
              </div>
            </div>
            <div className="mx-auto px-3 md:max-w-screen-lg ">
              <div className="mt-8">
                <ul className="mb-6 space-y-3 text-gray-900 sm:space-y-0 md:grid md:grid-cols-3 md:gap-4 lg:gap-8 xl:col-span-10 xl:col-start-3">
                  <li className="bg-white relative overflow-hidden rounded-lg border border-black shadow-md text-left">
                    <div className="mt-8 w-full">
                      <span className="absolute top-0 block h-8 w-full bg-slate-500"></span>
                      <div className="p-5 text-center md:w-full lg:px-5 lg:py-8">
                        <h3 className="font-serif text-xl font-bold lg:text-2xl lg:leading-7">
                          Standard
                        </h3>
                        <p className="mt-2 font-sans text-3xl font-bold leading-9 lg:text-5xl">
                          $24
                        </p>
                        <p className="mt-2 mb-4 font-sans text-base lg:text-base lg:leading-6">
                          per month, billed annually
                        </p>
                        <a
                          href="#"
                          className="mt-5 inline-flex cursor-pointer rounded-full bg-slate-500 px-8 py-2 font-sans text-sm text-white shadow-sm transition hover:translate-y-1 hover:shadow-md hover:shadow-slate-200"
                        >
                          Get Started
                        </a>
                      </div>
                      <span className="block w-full border-b"></span>
                      <label htmlFor="viewmore-1">
                        <input
                          className="peer hidden"
                          type="checkbox"
                          id="viewmore-1"
                        />
                        <span className="my-8 mx-auto flex cursor-pointer select-none flex-col items-center text-center normal-case sm:hidden">
                          View Features
                          <svg
                            width="16"
                            height="7"
                            viewBox="0 0 16 7"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="block align-middle text-gray-600"
                          >
                            <path
                              d="M15.7 5.67409L8.7 0.214485C8.6 0.13649 8.5 0.0584958 8.4 0.0584958C8.2 -0.0194986 7.9 -0.0194986 7.6 0.0584958C7.5 0.0584958 7.4 0.13649 7.3 0.214485L0.3 5.67409C-0.1 5.98607 -0.1 6.45404 0.3 6.76602C0.7 7.07799 1.3 7.07799 1.7 6.76602L8 1.85237L9 2.63231L14.3 6.76602C14.7 7.07799 15.3 7.07799 15.7 6.76602C16.1 6.45404 16.1 5.98607 15.7 5.67409Z"
                              fill="currentColor"
                              className="  "
                            ></path>
                          </svg>
                        </span>
                        <div className="my-5 hidden px-5 text-center peer-checked:block sm:text-left md:block lg:my-8 lg:px-10">
                          <ul className="">
                            <li className="mb-2">
                              <p className="font-sans text-base lg:text-base lg:leading-6">
                                ✓<b className="  "> Local Number</b>
                              </p>
                            </li>
                            <li className="mb-2">
                              <p className="font-sans text-base lg:text-base lg:leading-6">
                                ✓ Unlimited Outbound Calling.
                              </p>
                            </li>
                            <li className="mb-2">
                              <p className="font-sans text-base lg:text-base lg:leading-6">
                                ✓ Single Sign On (SSO)
                              </p>
                            </li>
                            <li className="mb-2">
                              <p className="font-sans text-base lg:text-base lg:leading-6">
                                ✓ Dedicated Manager
                              </p>
                            </li>
                            <li className="mb-2">
                              <p className="font-sans text-base lg:text-base lg:leading-6">
                                ✓ Unlimited Outbound Calling.
                              </p>
                            </li>
                          </ul>
                        </div>
                      </label>
                    </div>
                  </li>
                  <li className="bg-white relative overflow-hidden rounded-lg border border-black shadow-md text-left">
                    <div className="mt-8 w-full">
                      <span className="absolute top-0 block h-8 w-full bg-blue-700"></span>
                      <div className="p-5 text-center md:w-full lg:px-5 lg:py-8">
                        <h3 className="font-serif text-xl font-bold lg:text-2xl lg:leading-7">
                          Premium
                        </h3>
                        <p className="mt-2 font-sans text-3xl font-bold leading-9 lg:text-5xl">
                          $54
                        </p>
                        <p className="mt-2 mb-4 font-sans text-base lg:text-base lg:leading-6">
                          per month, billed annually
                        </p>
                        <a
                          href="#"
                          className="mt-5 inline-flex cursor-pointer rounded-full bg-blue-700 px-8 py-2 font-sans text-sm text-white shadow-sm transition hover:translate-y-1 hover:shadow-md hover:shadow-blue-200"
                        >
                          Get Started
                        </a>
                      </div>
                      <span className="block w-full border-b"></span>
                      <label htmlFor="viewmore-2">
                        <input
                          className="peer hidden"
                          type="checkbox"
                          id="viewmore-2"
                        />
                        <span className="my-8 mx-auto flex cursor-pointer select-none flex-col items-center text-center normal-case sm:hidden">
                          View Features
                          <svg
                            width="16"
                            height="7"
                            viewBox="0 0 16 7"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="block align-middle text-gray-600"
                          >
                            <path
                              d="M15.7 5.67409L8.7 0.214485C8.6 0.13649 8.5 0.0584958 8.4 0.0584958C8.2 -0.0194986 7.9 -0.0194986 7.6 0.0584958C7.5 0.0584958 7.4 0.13649 7.3 0.214485L0.3 5.67409C-0.1 5.98607 -0.1 6.45404 0.3 6.76602C0.7 7.07799 1.3 7.07799 1.7 6.76602L8 1.85237L9 2.63231L14.3 6.76602C14.7 7.07799 15.3 7.07799 15.7 6.76602C16.1 6.45404 16.1 5.98607 15.7 5.67409Z"
                              fill="currentColor"
                              className="  "
                            ></path>
                          </svg>
                        </span>
                        <div className="my-5 hidden px-5 text-center peer-checked:block sm:text-left md:block lg:my-8 lg:px-10">
                          <ul className="">
                            <li className="mb-2">
                              <p className="font-sans text-base lg:text-base lg:leading-6">
                                ✓<b className="  "> Everything in Standard</b>
                              </p>
                            </li>
                            <li className="mb-2">
                              <p className="font-sans text-base lg:text-base lg:leading-6">
                                ✓ Unlimited Outbound Calling.
                              </p>
                            </li>
                            <li className="mb-2">
                              <p className="font-sans text-base lg:text-base lg:leading-6">
                                ✓ Single Sign On (SSO)
                              </p>
                            </li>
                            <li className="mb-2">
                              <p className="font-sans text-base lg:text-base lg:leading-6">
                                ✓ Dedicated Manager
                              </p>
                            </li>
                            <li className="mb-2">
                              <p className="font-sans text-base lg:text-base lg:leading-6">
                                ✓ Unlimited Outbound Calling.
                              </p>
                            </li>
                          </ul>
                        </div>
                      </label>
                    </div>
                  </li>
                  <li className="bg-white relative overflow-hidden rounded-lg border border-black shadow-md text-left">
                    <div className="mt-8 w-full">
                      <span className="absolute top-0 block h-8 w-full bg-slate-900"></span>
                      <div className="p-5 text-center md:w-full lg:px-5 lg:py-8">
                        <h3 className="font-serif text-xl font-bold lg:text-2xl lg:leading-7">
                          Custom
                        </h3>
                        <p className="mt-2 font-sans text-3xl font-bold leading-9 lg:text-5xl">
                          Request a Quote
                        </p>
                        <p className="mt-2 mb-4 font-sans text-base lg:text-base lg:leading-6">
                          per month, billed annually
                        </p>
                        <a
                          href="#"
                          className="mt-5 inline-flex cursor-pointer rounded-full bg-black px-8 py-2 font-sans text-sm text-white shadow-sm transition hover:translate-y-1 hover:shadow-md hover:shadow-slate-300"
                        >
                          Get Started
                        </a>
                      </div>
                      <span className="block w-full border-b"></span>
                      <label htmlFor="viewmore-3">
                        <input
                          className="peer hidden"
                          type="checkbox"
                          id="viewmore-3"
                        />
                        <span className="my-8 mx-auto flex cursor-pointer select-none flex-col items-center text-center normal-case sm:hidden">
                          View Features
                          <svg
                            width="16"
                            height="7"
                            viewBox="0 0 16 7"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="block align-middle text-gray-600"
                          >
                            <path
                              d="M15.7 5.67409L8.7 0.214485C8.6 0.13649 8.5 0.0584958 8.4 0.0584958C8.2 -0.0194986 7.9 -0.0194986 7.6 0.0584958C7.5 0.0584958 7.4 0.13649 7.3 0.214485L0.3 5.67409C-0.1 5.98607 -0.1 6.45404 0.3 6.76602C0.7 7.07799 1.3 7.07799 1.7 6.76602L8 1.85237L9 2.63231L14.3 6.76602C14.7 7.07799 15.3 7.07799 15.7 6.76602C16.1 6.45404 16.1 5.98607 15.7 5.67409Z"
                              fill="currentColor"
                              className="  "
                            ></path>
                          </svg>
                        </span>
                        <div className="my-5 hidden px-5 text-center peer-checked:block sm:text-left md:block lg:my-8 lg:px-10">
                          <ul className="">
                            <li className="mb-2">
                              <p className="font-sans text-base lg:text-base lg:leading-6">
                                ✓ <b className="  ">Everything in Premium</b>
                              </p>
                            </li>
                            <li className="mb-2">
                              <p className="font-sans text-base lg:text-base lg:leading-6">
                                ✓ Unlimited Outbound Calling.
                              </p>
                            </li>
                            <li className="mb-2">
                              <p className="font-sans text-base lg:text-base lg:leading-6">
                                ✓ Single Sign On (SSO)
                              </p>
                            </li>
                            <li className="mb-2">
                              <p className="font-sans text-base lg:text-base lg:leading-6">
                                ✓ Dedicated Manager
                              </p>
                            </li>
                            <li className="mb-2">
                              <p className="font-sans text-base lg:text-base lg:leading-6">
                                ✓ Unlimited Outbound Calling.
                              </p>
                            </li>
                          </ul>
                        </div>
                      </label>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- /Main --> */}
      </div>
    </div>
  );
};

export default Membership;
