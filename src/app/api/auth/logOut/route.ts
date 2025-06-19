
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Clear the cookie by setting it to expire
  const res = NextResponse.json({ message: 'Logged out successfully' },{status: 200});
  res.cookies.set("token","");
  return res

}
