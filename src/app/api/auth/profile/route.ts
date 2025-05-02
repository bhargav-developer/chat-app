import dbConnect from "@/lib/mongodb";
import User from "@/Models/user";
import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const token = req.cookies.get("token")?.value;
    const secret = process.env.JWT_SECRET;

    if (!token || !secret) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = verify(token, secret);
    const userId = decoded?.userId;

    if (!userId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      new: true,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found or update failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Profile updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
