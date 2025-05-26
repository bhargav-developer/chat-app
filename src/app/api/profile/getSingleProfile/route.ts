import dbConnect from "@/lib/mongodb";
import User from "@/Models/user";
import { NextRequest, NextResponse } from "next/server";
dbConnect()
export async function POST(req: NextRequest){
    try{

        const {userId} = await req.json();

        const Users = await User.findOne({_id: userId}).select("email avatar firstName lastName")


        
        return NextResponse.json({message:"Hello",Users},{status: 200})
    }catch(err: any){
        console.log(err)
        return NextResponse.json({message:err?.message},{status: 400})

    }
}