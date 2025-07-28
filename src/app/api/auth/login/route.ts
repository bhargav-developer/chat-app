import User from "@/Models/user";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from '@/lib/mongodb'; 
import jwt from 'jsonwebtoken';
import { loginPayload } from "@/Interfaces/auth";
import userInterface from "@/Interfaces/user";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const data: loginPayload = await req.json();

    if (!data.email || !data.password) {
      return NextResponse.json({ message: "Please provide email and password." }, { status: 400 });
    }

    const user: userInterface | null = await User.findOne({ email: data.email });
    console.log(data,user)

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
    }

    const SECRET_KEY = process.env.JWT_SECRET!;
    const token = jwt.sign(
      { userId: user._id },
      SECRET_KEY,
      { expiresIn: '1d' }
    );

    if(!user.avatar){
    const res = NextResponse.json({ message: "complete Your profile" }, { status: 403 });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return res;
    }

    const res = NextResponse.json({ message: "Login successful." }, { status: 200 });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });


    return res;

  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
