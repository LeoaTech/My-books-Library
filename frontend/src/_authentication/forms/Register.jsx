
import { useEffect } from "react"
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingSpinner from "../../components/_admin/Loader/LoadingSpinner";
import { useSignup } from "../../hooks/useSignup";
import { useNavigate } from "react-router-dom";

const schema = z.object({
    fullName: z.string(),
    email: z.string().email(),
    password: z
        .string()
        .min(6, { message: "Password length must be at least 6 characters" }),
    businessName: z.string(),
    city: z.string(),
    country: z.string(),
    address: z.string(),
    phone: z.string(),
    description: z.string()?.optional(),
    typeOfBooks: z.string(),
    hasMultipleBranches: z.boolean(),
    deliverIntercity: z.boolean(),


});
const Register = () => {
    const navigate = useNavigate();

    const { register, handleSubmit, reset, formState } = useForm({
        mode: "all",
        resolver: zodResolver(schema),
    });

    const { registerUser, isLoading, error } = useSignup()
    const { errors, isValid, isDirty, isSubmitting, isSubmitSuccessful } =
        formState;

    /* Submit the form */
    const onSubmit = async (data) => {
        console.log(data);
        await registerUser(data);

    };

    /* Reset the Form Fields */
    useEffect(() => {
        if (isSubmitSuccessful && !error) {
            setTimeout(() => {
                reset();
                navigate("/signin"), 2000;
            });
        }
    }, [reset, error, isSubmitSuccessful, navigate]);
    return (
        <div className=" h-screen flex justify-center items-center ">

            <div className="w-full max-w-2xl border border-[#E2E8F0] rounded-lg shadow-lg bg-white dark:border-[#2E3A47] dark:bg-[#24303F] flex flex-col">


                <h1 className="mt-2 text-2xl font-bold mb-6 text-gray-800 text-center">
                    Create Account
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="overflow-y-auto p-6 sm:p-10 max-h-[calc(100vh-300px)]">

                        {/* User Account Details */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">
                                User Account Details
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-1 text-gray-700">Full Name
                                        <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        {...register("fullName", { required: true })}
                                        placeholder="Full Name"
                                        className="custom-input"
                                    />
                                    {errors?.fullName?.message && (
                                        <p className="format-message error">
                                            {errors.fullName.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block mb-1 text-gray-700">
                                        Email<span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        {...register("email", {
                                            required: true,
                                            pattern: /^\S+@\S+\.\S+$/,
                                        })}
                                        placeholder="Email"
                                        className="custom-input"
                                    />
                                    {errors?.email?.message && (
                                        <p className="format-message error">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block mb-1 text-gray-700">Password<span className="text-red-600">*</span></label>
                                    <input
                                        {...register("password", { required: true, minLength: 6 })}
                                        placeholder="Password"
                                        type="password"
                                        className="custom-input"
                                    />
                                    {errors?.password?.message && (
                                        <p className="format-message error">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Business Details */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-700 mt-8 mb-4">
                                Business Details
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-1 text-gray-700">Business Name<span className="text-red-600">*</span></label>
                                    <input
                                        {...register("businessName", { required: true })}
                                        placeholder="Business Name"
                                        className="custom-input"
                                    />
                                    {errors?.businessName?.message && (
                                        <p className="format-message error">
                                            {errors.businessName.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block mb-1 text-gray-700">Contact Number<span className="text-red-600">*</span></label>
                                    <input
                                        {...register("phone", { required: true })}
                                        placeholder="Contact Number"
                                        className="custom-input"
                                    />
                                    {errors?.phone?.message && (
                                        <p className="format-message error">
                                            {errors.phone.message}
                                        </p>
                                    )}
                                </div>

                                {/* Address + Description */}
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="flex-1">
                                        <label className="block mb-1 text-gray-700">Address<span className="text-red-600">*</span></label>
                                        <textarea
                                            {...register("address", { required: true })}
                                            placeholder="Address"
                                            rows={3}
                                            className="custom-input resize-none"
                                        />
                                        {errors?.address?.message && (
                                            <p className="format-message error">
                                                {errors.address.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="block mb-1 text-gray-700">Description</label>
                                        <textarea
                                            {...register("description")}
                                            placeholder="Description"
                                            rows={3}
                                            className="custom-input resize-none"
                                        />
                                    </div>
                                </div>

                                {/* City + Country */}
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="flex-1">
                                        <label className="block mb-1 text-gray-700">City<span className="text-red-600">*</span></label>
                                        <input
                                            {...register("city", { required: true })}
                                            placeholder="City"
                                            className="custom-input"
                                        />
                                        {errors?.city?.message && (
                                            <p className="format-message error">
                                                {errors.city.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="block mb-1 text-gray-700">Country<span className="text-red-600">*</span></label>
                                        <input
                                            {...register("country", { required: true })}
                                            placeholder="Country"
                                            className="custom-input"
                                        />
                                    </div>
                                </div>

                                {/* Type of Books */}
                                <div>
                                    <label className="block mb-1 text-gray-700">Type of Books<span className="text-red-600">*</span></label>
                                    <select
                                        {...register("typeOfBooks", { required: true })}
                                        className="custom-input bg-white"
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            Select Book Type
                                        </option>
                                        <option value="Hardcover">Hard Cover</option>
                                        <option value="Softcover">Soft Cover</option>
                                        <option value="Both">Both</option>
                                    </select>
                                </div>

                                {/* Checkboxes in Row */}
                                <div className="flex flex-col  gap-6 mt-4">
                                    <label className="flex items-center">
                                        <input
                                            {...register("deliverIntercity")}
                                            type="checkbox"
                                            className="mr-2"
                                        />
                                        <span className="text-gray-700">Enable Inter-city Delivery</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            {...register("hasMultipleBranches")}
                                            type="checkbox"
                                            className="mr-2"
                                        />
                                        <span className="text-gray-700">Has Multiple Branches</span>
                                    </label>
                                </div>

                            </div>
                        </div>

                        <div className="p-6 border-t">
                            <button
                                type="submit"
                                disabled={isSubmitting || isLoading || !isDirty || !isValid}
                                className="bg-[#333A48] hover:bg-[#64748B] text-white py-2 px-4 rounded-md w-full"
                            >
                                {isLoading ? <LoadingSpinner /> : "Create Account"}
                            </button>
                        </div>
                    </div>
                </form>

                <p className="p-4 mt-2 text-center">
                    Already have an Account?{" "}
                    <span
                        className="text-[#3C50E0] cursor-pointer"
                        onClick={() => navigate("/signin")}
                    >
                        Sign In
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;
