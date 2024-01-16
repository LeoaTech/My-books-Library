import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import GoogleIcon from "../../assets/google.svg";
import { useSignup } from "../../hooks/useSignup";
import { useEffect } from "react";
import { BASE_URL } from "../../utiliz/baseAPIURL";

const Signup = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { isLoading, error, signup } = useSignup();
  const {
    register, //for tracking form state
    handleSubmit,
    reset,
    watch,
    formState,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "all",
  });


  console.log(BASE_URL,"URL")

  const { errors, isValid, isDirty, isSubmitting, isSubmitSuccessful } =
    formState;

  const onSubmit = async (data) => {
    console.log(data);
    const { email, name, password } = data;

    await signup(email, password, name);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      navigate("/signin")
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <div className="py-40 h-screen flex flex-1 justify-center items-center ">
      <form className="custom-form" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="form-title">Create account</h1>
        <div className="custom-form">
          {/* <a
            className="google-oauth-button"
            href={`/auth/google/start${search}`}
          >
            <img src={GoogleIcon} width={22} height={22} /> Continue with Google
          </a> */}
          <input
            className="custom-input"
            placeholder="Name"
            {...register("name", {
              required: { value: true, message: "Name is required" },
            })}
          />
          {errors?.name?.message && (
            <p className="format-message error">Name: {errors.name.message}</p>
          )}
          <input
            className="custom-input"
            placeholder="Email"
            {...register("email", {
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: "Invalid email format",
              },
            })}
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
            {...register("password", {
              required: { value: true, message: "Password is required" },
            })}
          />
          {errors?.password?.message && (
            <p className="format-message error">
              Password: {errors.password.message}
            </p>
          )}
          {errors?.root?.message && (
            <p className="format-message error">{errors.root.message}</p>
          )}
          {isSubmitSuccessful && (
            <p className="format-message success">Please check your inbox</p>
          )}
          <button
            disabled={isSubmitting || !isDirty || !isValid}
            type="submit"
            className="border border-blue-500 bg-graydark text-white rounded-lg py-2 w-1/2 "
          >
            {isSubmitting || isLoading ? "Signing up...." : "Signup"}
          </button>
          {error && <span className="text-meta-1 text-sm">{error}</span>}
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
  );
};

export default Signup;
