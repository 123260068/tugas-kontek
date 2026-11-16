import { NextResponse } from "next/server";
import { publicState } from "@/lib/state";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await publicState());
}
