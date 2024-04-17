import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GoogleIcon from "../../assets/google.svg";
import { useSignin } from "../../hooks/useSignin";
import { BASE_URL } from "../../utiliz/baseAPIURL";
import { useAuthContext } from "../../hooks/useAuthContext";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password length must be at least 6 characters" }),
});
const Signin = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { persist, setPersist, googleAuth } = useAuthContext();

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  const { isLoading, error, signin, message } = useSignin();
  console.log(error, "google auth", googleAuth);
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

    await signin(email, password);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      if (error == false) {
        navigate("/");
      }
    }
  }, [isSubmitSuccessful, reset]);

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
            <Link
              className="google-oauth-button"
              to={`${BASE_URL}/auth/google`}
            >
              <img src={GoogleIcon} width={22} height={22} /> Continue with
              Google
            </Link>
            <input
              className="custom-input"
              placeholder="Email"
              {...register("email")}
            />
            {errors?.email?.message && (
              <p className="format-message error">{errors.email.message}</p>
            )}

            <input
              className="custom-input"
              placeholder="Password"
              type="password"
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
              <span
                className="text-[#3C50E0] cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
