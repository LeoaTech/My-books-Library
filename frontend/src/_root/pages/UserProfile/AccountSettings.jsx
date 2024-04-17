import React from "react";
import DashboardSB from "../../../components/_user/Profile/DashboardSB";

const AccountSettings = () => {
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
        <div className="h-full overflow-hidden pl-6">
          <div className="h-[calc(100vh-10rem)] overflow-auto px-4 py-10">
            <div className="border-b pt-4 pb-8">
              <h1 className="py-2 text-2xl font-semibold">Account Settings</h1>
              <p className="font- text-slate-600">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              </p>
            </div>

            {/* Account Settings */}
            <div className="bg-white p-4 rounded-md mb-4">
              <p className="py-2 text-xl font-semibold">Email Address</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <p className="text-gray-600">
                  Your email address is <strong>qurat@leoatech.com</strong>
                </p>
                <button className="inline-flex text-sm font-semibold text-blue-600 underline decoration-2">
                  Change
                </button>
              </div>
              <hr className="mt-4 mb-8" />
              <p className="py-2 text-xl font-semibold">Password</p>
              <div className="flex items-center">
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                  <label htmlFor="login-password">
                    <span className="text-sm text-gray-500">
                      Current Password
                    </span>
                    <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                      <input
                        type="password"
                        id="login-password"
                        className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                        placeholder="***********"
                      />
                    </div>
                  </label>
                  <label htmlFor="login-password">
                    <span className="text-sm text-gray-500">New Password</span>
                    <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                      <input
                        type="password"
                        id="login-password"
                        className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                        placeholder="***********"
                      />
                    </div>
                  </label>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mt-5 ml-2 h-6 w-6 cursor-pointer text-sm font-semibold text-gray-600 underline decoration-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              </div>
              <p className="mt-2">
                Cannot remember your current password?{" "}
                <a
                  className="text-sm font-semibold text-blue-600 underline decoration-2"
                  href="#"
                >
                  Recover Account
                </a>
              </p>
              <button className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white">
                Save Password
              </button>
            </div>

            <div className="border-b pt-4 pb-8">
              <h1 className="py-2 text-2xl font-semibold">
                Notification Settings
              </h1>
              <p className="font- text-slate-600">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              </p>
            </div>

            {/* Notification Settings */}
            <div className="bg-white p-4 rounded-md mb-4">
              <div className="grid border-b py-6 sm:grid-cols-2">
                <div className="">
                  <h2 className="text-lg font-semibold leading-4 text-slate-700">
                    Comments
                  </h2>
                  <p className="font- text-slate-600">
                    Lorem ipsum dolor, Alias eligendi laboriosam magni
                    reiciendis neque.
                  </p>
                </div>
                <div className="mt-4 flex items-center sm:justify-end">
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="push"
                      className="relative inline-flex cursor-pointer items-center"
                    >
                      <input
                        type="checkbox"
                        value=""
                        id="push"
                        className="peer sr-only"
                        checked
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Push
                      </span>
                    </label>
                    <label
                      htmlFor="email"
                      className="relative inline-flex cursor-pointer items-center"
                    >
                      <input
                        type="checkbox"
                        value=""
                        id="email"
                        className="peer sr-only"
                        checked
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Email
                      </span>
                    </label>
                    <label
                      htmlFor="sms"
                      className="relative inline-flex cursor-pointer items-center"
                    >
                      <input
                        type="checkbox"
                        value=""
                        id="sms"
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        SMS
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid border-b py-6 sm:grid-cols-2">
                <div className="">
                  <h2 className="text-lg font-semibold leading-4 text-slate-700">
                    Reminders
                  </h2>
                  <p className="font- text-slate-600">
                    Lorem ipsum dolor, Alias eligendi laboriosam magni
                    reiciendis neque.
                  </p>
                </div>
                <div className="mt-4 flex items-center sm:justify-end">
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="push"
                      className="relative inline-flex cursor-pointer items-center"
                    >
                      <input
                        type="checkbox"
                        value=""
                        id="push"
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Push
                      </span>
                    </label>
                    <label
                      htmlFor="email"
                      className="relative inline-flex cursor-pointer items-center"
                    >
                      <input
                        type="checkbox"
                        value=""
                        id="email"
                        className="peer sr-only"
                        checked
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Email
                      </span>
                    </label>
                    <label
                      htmlFor="sms"
                      className="relative inline-flex cursor-pointer items-center"
                    >
                      <input
                        type="checkbox"
                        value=""
                        id="sms"
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        SMS
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="grid py-6 sm:grid-cols-2">
                <div className="">
                  <h2 className="text-lg font-semibold leading-4 text-slate-700">
                    Updates
                  </h2>
                  <p className="font- text-slate-600">
                    Lorem ipsum dolor, Alias eligendi laboriosam magni
                    reiciendis neque.
                  </p>
                </div>
                <div className="mt-4 flex items-center sm:justify-end">
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="push"
                      className="relative inline-flex cursor-pointer items-center"
                    >
                      <input
                        type="checkbox"
                        value=""
                        id="push"
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Push
                      </span>
                    </label>
                    <label
                      htmlFor="email"
                      className="relative inline-flex cursor-pointer items-center"
                    >
                      <input
                        type="checkbox"
                        value=""
                        id="email"
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Email
                      </span>
                    </label>
                    <label
                      htmlFor="sms"
                      className="relative inline-flex cursor-pointer items-center"
                    >
                      <input
                        type="checkbox"
                        value=""
                        id="sms"
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        SMS
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b pt-4 pb-8">
              <h1 className="py-2 text-2xl font-semibold">Delete Account</h1>
              <p className="font- text-slate-600">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              </p>
            </div>

            {/* Delete Account */}
            <div className="mb-10 bg-white p-4 rounded-md">
              <p className="inline-flex items-center rounded-full bg-rose-100 px-4 py-1 text-rose-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Proceed with caution
              </p>
              <p className="mt-2">
                Make sure you have taken backup of your account in case you ever
                need to get access to your data. We will completely wipe your
                data. There is no way to access your account after this action.
              </p>
              <button className="ml-auto text-sm font-semibold text-rose-600 underline decoration-2">
                Continue with deletion
              </button>
            </div>
          </div>
        </div>
        {/* <!-- /Main --> */}
      </div>
    </div>
  );
};

export default AccountSettings;
