import { loginPayload, signupPayload } from "@/Interfaces/auth"
import axios, { AxiosError } from "axios"
import toast from "react-hot-toast"

interface Response {
    status: number,
    message: string,
}

export const login = async (data: loginPayload): Promise<Response | Error> => {
    try {
        const req = await axios.post(`/api/auth/login`, data, { withCredentials: true })
        const res = {message: req.data, status: req.status }
        return res
    } catch (err) {
          const error = err as AxiosError<Response>;
        const message = error.response?.data?.message || "Login failed";
        toast.error(message);
        return err as Error;
    }

}

export const signUp = async (data: signupPayload): Promise<Response | Error> => {
    try {
        const req = await axios.post(`/api/auth/signup`, data, { withCredentials: true })
        const res = { message: req.data, status: req.status }
        return res
    } catch (err) {
        return err as Error;
    }

}