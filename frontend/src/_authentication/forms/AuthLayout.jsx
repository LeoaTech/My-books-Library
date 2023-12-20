import { Outlet, Navigate } from "react-router-dom";
import signin from "../../assets/signin.jpg";

const AuthLayout = () => {
  const isSignedin = false;
  return (
    <>
      {isSignedin ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-1 justify-center items-center  ">
            <Outlet />
            <img
              src={signin}
              alt="image"
              className="hidden lg:block h-screen w-1/2 cover bg-no-repeat"
            />
          </section>
        </>
      )}
    </>
  );
};

export default AuthLayout;
