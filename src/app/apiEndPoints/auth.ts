import { loginPayload } from "@/Interfaces/auth"
import axios, { AxiosError } from "axios"

const url = process.env.FRONTEND_URL

interface LoginResponse {
    message: string,
    status: Number
}

export const login = async (data: loginPayload): Promise<LoginResponse | AxiosError> => {
    try {
        const res = await axios.post(`/api/auth/login`, data, { withCredentials: true })
        const lol = { message: res.data, status: res.status }
        return lol
    } catch (err) {
        return err as AxiosError;
    }

}