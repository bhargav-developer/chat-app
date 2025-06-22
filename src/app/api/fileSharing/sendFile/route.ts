import { NextRequest, NextResponse } from "next/server"
import { io } from "socket.io-client"

const socketRoute = process.env.SOCKET_SERVER

const socket = io(socketRoute)
export async function POST(req: NextRequest){
    const files = await req.json();
    console.log(files)
    return NextResponse.json({message: "ok"})
}