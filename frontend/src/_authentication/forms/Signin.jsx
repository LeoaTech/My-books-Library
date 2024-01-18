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
  const { persist, setPersist, setGoogleAuth, googleAuth } = useAuthContext();

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };
  const onGoogleAuthLogin = () => {
    setGoogleAuth((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("google-auth", googleAuth);
  }, [googleAuth]);

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
    console.log(data);
    const { email, password } = data;

    await signin(email, password);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      console.log(error, message);

      reset();
      if (error == false) {
        navigate("/");
      }
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <div className="py-40 h-screen flex flex-1 justify-center items-center ">
      <div className="rounded-lg border border-stroke bg-white p-20 shadow-lg dark:border-strokedark dark:bg-boxdark">
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
              onClick={onGoogleAuthLogin}
              // start${search}
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

            <div className="flex gap-2">
              <input
                type="checkbox"
                name=""
                id="remember-me"
                onChange={togglePersist}
                checked={persist}
              />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            <p className="p-4 text-sm">
              Forgot Password ?{" "}
              <Link to="/forgot-password" className="text-meta-5">
                Reset Password
              </Link>
            </p>
            <button
              disabled={isSubmitting}
              type="submit"
              className="border border-blue-500 bg-graydark text-white rounded-lg py-2 w-1/2 "
            >
              {isSubmitting || isLoading ? "Signing in.." : "Sign in"}
            </button>
            {errors && (
              <span className="text-meta-1 text-sm">
                {error?.root?.message || message}
              </span>
            )}

            {error && <span className="text-meta-1 text-sm">{error}</span>}

            <p className="p-4 mt-2">
              Don&apos;t have an Account?{" "}
              <span
                className="text-primary cursor-pointer"
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
