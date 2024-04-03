import { Outlet, Navigate } from "react-router-dom";
import signin from "../../assets/signin.jpg";
import "../../index.css";
const AuthLayout = () => {
  const isSignedin = false;
  return (
    <>
      {isSignedin ? (
        <Navigate to="/" />
      ) : (
        <div className="bg-img">
          <section className="flex flex-1 justify-center items-center">
            <Outlet />
          </section>
        </div>
      )}
    </>
  );
};

export default AuthLayout;
