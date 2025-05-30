import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import User from "@/Models/user";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

  const {formData} = await req.json(); // if you're sending raw fields


    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
   const user = await User.findByIdAndUpdate(decoded.userId, formData, { new: true });

   console.log(user)

    user?.save()

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    }

    return NextResponse.json(user, { status: 200 });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }
}
