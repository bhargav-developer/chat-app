import { loginPayload, signupPayload } from "@/Interfaces/auth"
import axios, { AxiosError, AxiosResponse } from "axios"

export const login = async (data: loginPayload): Promise<AxiosResponse | Error> => {
    try {
        const req = await axios.post(`/api/auth/login`, data, { withCredentials: true })
        return req
    } catch (err) {
        throw err as Error;
    }

}

export const signUp = async (data: signupPayload): Promise<AxiosResponse | Error> => {
    try {
        const req = await axios.post(`/api/auth/signup`, data, { withCredentials: true })
        return req;
    } catch (err) {
        throw err as Error
    }

}

 export const logout = async <AxiosResponse,Error>() => {
    try {
        const res = await axios.get("/api/auth/logOut");
        return res;
    } catch (error) {
        throw error as Error 
    }
  }