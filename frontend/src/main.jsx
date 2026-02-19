import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routers/router.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContextProvider } from "./context/_admin/AuthContext.jsx";
import { ToastContainer } from "react-toastify";


const queryClient = new QueryClient();
// ... (existing imports)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense fallback={<> </>}>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <ThemeProvider>
            <RouterProvider router={router} />
          </ThemeProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </Suspense>
    <ToastContainer
      position="top-center"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      theme="dark"
    />
  </React.StrictMode>
);
