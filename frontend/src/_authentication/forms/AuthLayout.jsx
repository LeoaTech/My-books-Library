import { Navigate, Outlet } from "react-router-dom";
import "../../index.css";
import { ToastContainer } from "react-toastify";
import { useAuthContext } from "../../hooks/useAuthContext";
const AuthLayout = () => {
  const { auth } = useAuthContext()


  return (
    <>
      {auth?.accessToken ? (
        <Navigate to="/" />
      ) : (
        <div className="bg-img">
          <section className=" h-screen flex flex-1 justify-center items-center overflow-hidden">
            <Outlet />
          </section>

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
        </div>
      )}
    </>
  );
};

export default AuthLayout;
