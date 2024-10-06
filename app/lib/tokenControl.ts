import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function tokenControl(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return new NextResponse("Forbidden", { status: 403 });
  }
}
