"use client"
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

const page = () => {
  const router = useRouter();
    const [loading, setLoading] = useState(false);
  const [loginData,setLoginData] = useState({
    email: "",
    password: ""
  })
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name,value} = e.target;
    setLoginData(prev =>  ({
      ...prev,
      [name]: value,
    }))
  }
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try{
      setLoading(true)
      if(!loginData.email || !loginData.password){
        console.log(loginData.email)
      toast.success("Please Enter Your Credits ")
      return
    }
    const res = await axios.post("/api/auth/login",loginData,{
      withCredentials: true
    })
    if(res.status === 200){
      toast.success("U are Loggedin")
      router.push("/dashboard")
      
    }
  }catch(err: any){
    const message = await err.response.data.message
    toast.error(message || "Something went wrong")
    console.log(message)
    if(err.status === 403){
      router.push("./profile")
      return
    }
  }finally{
    setLoading(false)
  }



  }

return (

    <>
       <Toaster position="bottom-right" />
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

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-black  text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                name = "email"
                value={loginData.email}
                required
                onChange={(e) => handleChange(e)}
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
                value={loginData.password}
                onChange={(e) => handleChange(e)}
                name="password"
                required
                className="w-full border text-black  border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember"  className="text-sm text-black ">Remember me</label>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition disabled:bg-gray-500"
              disabled={loading}
            >
              {loading ? 'loading...' :'login'}
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