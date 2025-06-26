"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { EyeIcon, EyeClosedIcon } from "lucide-react";
import { login } from "../apiEndPoints/auth";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const { email, password } = loginData;

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const result = await login(loginData)
      if ("isAxiosError" in result) {
        console.error("Login failed", result.message);
      }
        toast.success("Successfully logged in.");
        router.push("/dashboard");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);

      if (err?.response?.status === 403) {
        router.push("/profile");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <div className="min-h-screen flex items-center justify-center bg-[#f0f4ff] px-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
          {/* Header */}
          <div className="relative h-48">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
              alt="Login Header"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-white/80 flex flex-col justify-end p-4">
              <h1 className="text-xl font-bold text-indigo-700">ChatSync</h1>
              <p className="text-sm text-indigo-500">Connect with clarity</p>
            </div>
          </div>

          {/* Form */}
          <div className="px-6 py-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Welcome back</h2>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={loginData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginData.password}
                  onChange={handleChange}
                  placeholder={showPassword ? "password" : "••••••••"}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-9 cursor-pointer text-gray-600"
                >
                  {showPassword ? <EyeIcon size={20} /> : <EyeClosedIcon size={20} />}
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-600">
                  <input type="checkbox" className="mr-2 cursor-pointer" />
                  Remember me
                </label>
                <a href="#" className="text-sm text-indigo-500 hover:underline">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition duration-200 disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/signup")}
                className="text-indigo-600 hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
