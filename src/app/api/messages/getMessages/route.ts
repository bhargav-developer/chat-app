import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const {from,to} = await req.json();

    if(!from || !to){
        return NextResponse.json({message: "users Data not Found"},{status: 404})
    }



    


}