import { useState } from "react";
import Signup from "./Signup";
import Register from "./Register";

const SignUpPage = () => {
    const [activeTab, setActiveTab] = useState("user");

    return (
        <div className="h-screen flex justify-center items-center ">
            <div className="rounded-lg border border-[#E2E8F0] bg-white p-10 shadow-lg dark:border-[#2E3A47] dark:bg-[#24303F] ">
               
                <div className="flex mb-6 justify-center space-x-4">
                    <button
                        className={`px-4 py-2 font-semibold rounded ${activeTab === "user"
                                ? "bg-[#333A48] text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}
                        onClick={() => setActiveTab("user")}
                    >
                        Sign up as User
                    </button>
                    <button
                        className={`px-4 py-2 font-semibold rounded ${activeTab === "admin"
                                ? "bg-[#333A48] text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}
                        onClick={() => setActiveTab("admin")}
                    >
                        Sign up as Library Owner
                    </button>
                </div>

                <div className="mt-2">
                    {activeTab === "user" ? <Signup /> : <Register />}
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
