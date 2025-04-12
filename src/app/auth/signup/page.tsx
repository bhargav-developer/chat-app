'use client';
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from 'react-hot-toast';


const Page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const [passwordError, setPasswordError] = useState("");

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters and include uppercase, lowercase, and a number."
      );
    } else {
      setPasswordError("");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.success("Passwords do not match!");
      return;
    }

    if (passwordError) {
      toast.success("Please fix the password issue first.");
      return;
    }

    try {
      setLoading(true)
      const res = await axios.post("/api/auth/signup",formData,{
        withCredentials: true
      })

      if (res.status === 201) {
        toast.success('Registration successful!');
        router.push('./profile');
      } else {
        toast.success('Registration failed!');
      }
    } catch (err: any) {
      const errMessage = await err.response.data.message
      toast.success(errMessage || "Something went Wrong");
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="flex max-w-5xl w-full backdrop-blur-md bg-white/30 border border-white/20 rounded-2xl overflow-hidden shadow-xl">
        {/* Left Image Section */}
        <div className="w-1/2 hidden md:block relative">
          <img
            src="https://images.unsplash.com/photo-1587614295999-6cbcb8cde229"
            alt="Signup Visual"
            className="object-cover w-full h-full"
          />
          <div className="absolute bottom-0 left-0 p-6 text-white bg-black/40 w-full">
            <h2 className="text-xl font-semibold">Join ChatSync</h2>
            <p className="text-sm">Connect with clarity and calm</p>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-10 text-black">
          <h2 className="text-2xl font-bold mb-2">Create your account</h2>
          <p className="text-gray-700 mb-6">Start your messaging journey today</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-1/2 border border-gray-300 bg-white/50 backdrop-blur-sm text-black rounded-lg px-3 py-2"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                required
                onChange={handleChange}
                className="w-1/2 border border-gray-300 bg-white/50 backdrop-blur-sm text-black rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-white/50 backdrop-blur-sm text-black rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-white/50 backdrop-blur-sm text-black rounded-lg px-3 py-2"
              />
          
              {passwordError && (
                <p className="text-xs text-red-600 mt-1">{passwordError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirm password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-white/50 backdrop-blur-sm text-black rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex items-center text-sm">
              <input type="checkbox" className="mr-2" />
              <span>
                I agree to the{" "}
                <a href="#" className="text-indigo-600">Terms of Service</a> and{" "}
                <a href="#" className="text-indigo-600">Privacy Policy</a>
              </span>
            </div>
            <button
  type="submit"
  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
  disabled={loading}
>
  {loading ? 'Creating...' : 'Create account'}
</button>


            <p
              className="text-sm text-center text-gray-600 mt-4 cursor-pointer"
              onClick={() => router.push("./login")}
            >
              Already have an account?{" "}
              <span className="text-indigo-600 hover:underline">login</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
