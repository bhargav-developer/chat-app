import dbConnect from "@/lib/mongodb";
import User from "@/Models/user";
import { NextRequest, NextResponse } from "next/server";

dbConnect()
export async function POST(req: NextRequest){
    try{

        const {query} = await req.json();
      const word = new RegExp(query, 'i')

        const Users = await User.find({
            $or: [ 
        { firstName: word },
        { email: word },
        { phone: word },
      ],
        }).limit(3).select("email avatar firstName ")

        console.log(Users)
        
        return NextResponse.json({message:"Hello",Users},{status: 200})
    }catch(err){
        console.log(err)
    }
}