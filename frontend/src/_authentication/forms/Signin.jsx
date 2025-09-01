import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSignin } from "../../hooks/useSignin";
import { useAuthContext } from "../../hooks/useAuthContext";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import GoogleAuthLink from "./GoogleAuthLink";
const schema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password length must be at least 6 characters" }),
});
const Signin = () => {

  const navigate = useNavigate();
  const { persist, setPersist, googleAuth } = useAuthContext();
  const params = useParams()
  const togglePersist = () => {
    setPersist((prev) => !prev);
  };
  // console.log(params, "params");

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);


  const LoginSuccess = () => toast.success("Login Successfully!", {
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  })
  const { isLoading, error, signin, message, login } = useSignin();
  // console.log(error, "sign in error state",  message, "Sign in message");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    const { email, password } = data;

    // Login from Library domain
    if (params?.subdomain) {
      await login(email, password, params?.subdomain)
    } else {
      // Sign in from app domai
      await signin(email, password);
    }

  };

  // console.log(error, "Error");


  useEffect(() => {
    if (isSubmitSuccessful) {

      reset();
      if (error == null) {
        localStorage.setItem("auth-source", "email");
        LoginSuccess()
        // setTimeout(() => {
        // navigate("/");
        // navigate("/select-library");

        // }, 3000);
      }
    }
  }, [isSubmitSuccessful, navigate]);


  return (
    <div className="py-20 h-screen flex flex-1 justify-center items-center lg:py-40">
      <div className="rounded-lg border border-[#E2E8F0] bg-white p-10  shadow-lg dark:border-[#2E3A47] dark:bg-[#24303F] lg:p-20">
        {" "}
        <form
          className="custom-form flex justify-center items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="form-title">Sign in</h1>
          <div className="custom-form">
            <div className="mt-4">

              {params?.subdomain ? <GoogleAuthLink action={"login"} subdomain={params?.subdomain} /> : <GoogleAuthLink action={'login'} />}

            </div>
            <input
              className="custom-input"
              placeholder="Email"
              autoComplete="email"
              {...register("email")}
            />
            {errors?.email?.message && (
              <p className="format-message error">{errors.email.message}</p>
            )}

            <input
              className="custom-input"
              placeholder="Password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
            />
            {errors?.password?.message && (
              <p className="format-message error">{errors.password.message}</p>
            )}

            <div className="flex justify-between">
              <div className="flex justify-center items-center gap-2">
                <input
                  type="checkbox"
                  name="remember-me"
                  id="remember-me"
                  onChange={togglePersist}
                  checked={persist}
                />
                <label htmlFor="remember-me">Remember me</label>
              </div>
              <p className="p-4 text-sm">
                <Link to="/forgot-password" className="text-[#259AE6]">
                  Forgot Password ?{" "}
                </Link>
              </p>
            </div>
            <button
              disabled={isSubmitting}
              type="submit"
              className="border border-slate-500 bg-[#333A48] text-white rounded-md py-2 w-1/2 hover:bg-[#64748B] "
            >
              {isSubmitting || isLoading ? "Signing in.." : "Sign in"}
            </button>
            {errors && (
              <span className="text-[#DC3545] text-sm">
                {error?.root?.message || message}
              </span>
            )}

            {error && <span className="text-[#DC3545] text-sm">{error}</span>}

            <p className="p-4 mt-2">
              Don&apos;t have an Account?{" "}
              {params && params?.subdomain ? <span
                className="text-[#3C50E0] cursor-pointer"
                onClick={() => navigate(`/${params?.subdomain}/signup`)}
              >
                Sign Up
              </span> : (
                <>
                  <span
                    className="text-[#3C50E0] cursor-pointer"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </span></>
              )}

            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
