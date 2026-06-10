import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ success: true, message: "Cookies cleared!" });
  
  // Clear up to 50 chunks for both secure and non-secure cookies
  for (let i = 0; i < 50; i++) {
    response.cookies.set(`authjs.session-token.${i}`, "", { maxAge: 0, path: "/" });
    response.cookies.set(`__Secure-authjs.session-token.${i}`, "", { maxAge: 0, path: "/" });
  }
  
  // Clear the base session tokens
  response.cookies.set("authjs.session-token", "", { maxAge: 0, path: "/" });
  response.cookies.set("__Secure-authjs.session-token", "", { maxAge: 0, path: "/" });
  
  // Clear OAuth state cookies just in case
  response.cookies.set("authjs.state", "", { maxAge: 0, path: "/" });
  response.cookies.set("__Secure-authjs.state", "", { maxAge: 0, path: "/" });
  
  return response;
}
