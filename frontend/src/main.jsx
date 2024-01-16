import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routers/router.jsx";
import { AuthContextProvider } from "./context/_admin/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense fallback={<> </>}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </Suspense>
  </React.StrictMode>
);
