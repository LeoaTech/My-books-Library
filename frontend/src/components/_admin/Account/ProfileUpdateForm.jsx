import { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { BASE_URL } from "../../../utils/baseAPIURL";
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiKey } from "react-icons/fi";
import { countryList } from "../../../utils/currencyUtils";
import Select from "react-select";
import { countryCustomSelectStyles } from "../shared/CreatableSelectCustomStyles";

const profileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .optional()
        .or(z.literal("")),
});

const ProfileUpdateForm = () => {
    const { auth, dispatch } = useAuthContext();
    const [loading, setLoading] = useState(false);


    const [theme, setTheme] = useState(document.body.classList.contains("dark") ? "dark" : "light");

    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "class") {
                    const isDark = document.body.classList.contains("dark");
                    setTheme(isDark ? "dark" : "light");
                }
            });
        });
        observer.observe(document.body, { attributes: true });
        return () => observer.disconnect();
    }, []);

    const selectStyles = useMemo(() => countryCustomSelectStyles(theme), [theme]);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
        control,
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: auth?.user?.name || "",
            email: auth?.user?.email || "",
            phone: auth?.user?.phone || "",
            address: auth?.user?.address || "",
            city: auth?.user?.city || "",
            country: auth?.user?.country || "",
            password: "",
        },
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (!auth?.accessToken) return;
            try {
                const response = await fetch(`${BASE_URL}/users/${auth?.id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });
                const json = await response.json();

                if (response.ok && json.data) {
                    const userData = json.data;
                    reset({
                        name: userData.name || "",
                        email: userData.email || "",
                        phone: userData.phone || "",
                        address: userData.address || "",
                        city: userData.city || "",
                        country: userData.country || "",
                        password: "",
                    })
                }
            } catch (error) {
                console.error("Failed to fetch user data", error);
            }
        };
        fetchUserData();
    }, [auth?.accessToken, auth?.id, reset]);


    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const payload = { ...data };
            if (!payload.password) delete payload.password;

            const response = await fetch(`${BASE_URL}/users/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.message || "Failed to update profile");
            }

            toast.success("Profile updated successfully");

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-surface shadow-md rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-6 text-text flex items-center gap-2">
                <FiUser /> Update Profile
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-text mb-1">Name</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="text-text" />
                        </div>
                        <input
                            type="text"
                            {...register("name")}
                            className="w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                            placeholder="Full Name"
                        />
                    </div>
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-text mb-1">Email</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMail className="text-text" />
                        </div>
                        <input
                            type="email"
                            {...register("email")}
                            className="w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                            placeholder="Email Address"
                        />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-text mb-1">Phone</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiPhone className="text-text" />
                        </div>
                        <input
                            type="text"
                            {...register("phone")}
                            className="w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                            placeholder="Phone Number"
                        />
                    </div>
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>

                {/* Address */}
                <div>
                    <label className="block text-sm font-medium text-text mb-1">Address</label>
                    <div className="relative">
                        <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMapPin className="text-text" />
                        </div>
                        <textarea
                            {...register("address")}
                            rows="3"
                            className="w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                            placeholder="Full Address"
                        />
                    </div>
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* City */}
                    <div>
                        <label className="block text-sm font-medium text-text mb-1">City</label>
                        <input
                            type="text"
                            {...register("city")}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                            placeholder="City"
                        />
                    </div>
                    {/* Country */}
                    <div>
                        <label className="block text-sm font-medium text-text mb-1">Country</label>
                        <Controller
                            name="country"
                            control={control}
                            render={({ field: { onChange, value, ref } }) => (
                                <Select
                                    inputRef={ref}
                                    styles={selectStyles}
                                    options={countryList?.map(c => ({ value: c, label: c }))}
                                    value={countryList?.map(c => ({ value: c, label: c }))?.find(c => c.value === value)}
                                    onChange={val => onChange(val?.value)}
                                    placeholder="Select Country"
                                    classNamePrefix="react-select"
                                />
                            )}
                        />
                    </div>
                </div>

                <div className="border-t border-border my-4 pt-4">
                    <h3 className="text-lg font-medium mb-3 text-text">Change Password</h3>
                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-text mb-1">New Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiKey className="text-text" />
                            </div>
                            <input
                                type="password"
                                {...register("password")}
                                className="w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                                placeholder="Add New Password"
                                autoComplete="new-password"
                            />
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>
                </div>


                <div className="flex justify-end items-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`rounded-md w-full border-border bg-background text-text px-4 py-2 text-sm font-semibold shadow-sm disabled:opacity-50  hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Updating..." : "Update Profile"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileUpdateForm;
