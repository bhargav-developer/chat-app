import { signupPayload } from "@/Interfaces/auth";
import User from "@/Models/user";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from '@/lib/mongodb.js'; 
import jwt from 'jsonwebtoken';


export async function POST(req: NextRequest) {
   await dbConnect()
    try{
        const data:signupPayload = await req.json();
        if(!data.email || !data.password){
        return NextResponse.json({message: "please provide email and password"},{status: 400})
        }
        console.log(data)
        const createUser = await User.create(data);
        if(!createUser){
            return NextResponse.json({message: "Error while creating account"},{status: 400})
        }
        const SECRET_KEY = process.env.JWT_SECRET!;

        const token = jwt.sign(
            { userId: createUser._id },
            SECRET_KEY,
            { expiresIn: '1d' }
          );
        const res = NextResponse.json({message: "user created"},{status: 201})
        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24,
            path: "/",
          });
      
          return res;

    }catch(err: any){
        if(err.code === 11000){
            return NextResponse.json(
                { message: `User already exist` },
                { status: 409 } 
              );
        }
        console.log(err)
        return NextResponse.json({message: err},{status: 500})
    }
}