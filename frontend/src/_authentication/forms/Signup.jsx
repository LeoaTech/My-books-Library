import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GoogleIcon from "../../assets/google.svg";
import { useSignup } from "../../hooks/useSignup";
import { useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BASE_URL } from "../../utiliz/baseAPIURL";

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password length must be at least 6 characters" }),
});
const Signup = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { isLoading, error, signup, message } = useSignup();
  const {
    register, //for tracking form state
    handleSubmit,
    reset,
    formState,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "all",
    resolver: zodResolver(schema),
  });

  const { errors, isValid, isDirty, isSubmitting, isSubmitSuccessful } =
    formState;

  const onSubmit = async (data) => {
    const { email, name, password } = data;

    await signup(email, password, name);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      setTimeout(() => {
        reset();
        navigate("/signin"), 2000;
      });
    }
  }, [reset, isSubmitSuccessful]);

  return (
    <div className="py-40 h-screen flex flex-1 justify-center items-center ">
      <div className="rounded-lg border border-stroke bg-white p-20 shadow-lg dark:border-strokedark dark:bg-boxdark">
        <form className="custom-form" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="form-title">Create account</h1>
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
              placeholder="Name"
              {...register("name", {
                required: { value: true, message: "Name is required" },
              })}
            />
            {errors?.name?.message && (
              <p className="format-message error">
                Name: {errors.name.message}
              </p>
            )}
            <input
              className="custom-input"
              placeholder="Email"
              {...register("email")}
            />
            {errors?.email?.message && (
              <p className="format-message error">
                Email: {errors.email.message}
              </p>
            )}
            <input
              className="custom-input"
              placeholder="Password"
              type="password"
              {...register("password")}
            />
            {errors?.password?.message && (
              <p className="format-message error">
                Password: {errors.password.message}
              </p>
            )}
            {errors?.root?.message && (
              <p className="format-message error">{errors.root.message}</p>
            )}

            <button
              disabled={!isDirty || !isValid || isSubmitting}
              type="submit"
              className={` cursor-pointer border border-blue-500 bg-graydark text-white rounded-lg py-2 w-1/2 hover:bg-body `}
            >
              {isSubmitting || isLoading ? "Signing up...." : "Signup"}
            </button>

            {/* Error from server side */}
            {message && error && (
              <span className="text-meta-1 text-sm">{error}</span>
            )}
            <p className="p-4 mt-2">
              Already have an Account?{" "}
              <span
                className="text-primary cursor-pointer"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
