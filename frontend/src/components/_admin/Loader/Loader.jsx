import React from "react";

const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-neutral-50 dark:bg-gray-900">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  );
};

export default Loader;
