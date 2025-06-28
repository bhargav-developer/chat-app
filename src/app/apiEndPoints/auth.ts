import { loginPayload, signupPayload } from "@/Interfaces/auth"
import axios, { AxiosError } from "axios"

interface Response {
    message: string,
    status: Number
}

export const login = async (data: loginPayload): Promise<Response | Error> => {
    try {
        const req = await axios.post(`/api/auth/login`, data, { withCredentials: true })
        const res = { message: req.data, status: req.status }
        return res
    } catch (err) {
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