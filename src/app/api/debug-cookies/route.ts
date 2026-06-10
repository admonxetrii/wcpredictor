import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const result = allCookies.map(c => ({ name: c.name, size: c.value.length }));
  return NextResponse.json(result);
}
