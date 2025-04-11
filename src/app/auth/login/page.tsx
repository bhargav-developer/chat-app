"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

return (

    <>
       <div className="min-h-screen flex items-center justify-center bg-[#f0f4ff] px-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full overflow-hidden">
        {/* Header with image */}
        <div className="relative h-48">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
            alt="header"
            className="object-cover w-full h-full"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/0 to-white/80 flex flex-col justify-end p-4">
            <h1 className="text-xl font-bold text-indigo-700">ChatSync</h1>
            <p className="text-sm text-indigo-500 -mt-1">Connect with clarity</p>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 py-8">
          <h2 className="text-2xl text-black font-semibold mb-6">Welcome back</h2>

          <form className="space-y-4">
            <div>
              <label className="block text-black  text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full border text-black  border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className=" text-sm text-black  font-medium mb-1 flex justify-between">
                <span>Password</span>
                <a href="#" className="text-indigo-500  text-sm">Forgot password?</a>
              </label>
              <input
                type="password"
                className="w-full border text-black  border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember"  className="text-sm text-black ">Remember me</label>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition"
            >
              Sign in
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don’t have an account? <a href="#" className="text-indigo-600" onClick={()=>{
                router.push("./signup")
            }} >Sign up</a>
          </p>
        </div>


      </div>
    </div>
    </>
)
}
export default page