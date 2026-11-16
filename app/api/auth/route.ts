import { NextResponse } from "next/server";
import { checkPassword, makeToken } from "@/lib/auth";

const fails = new Map<string, { n: number; t: number }>();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  const f = fails.get(ip);
  const recent = !!f && Date.now() - f.t < 600000;
  if (f && recent && f.n >= 5) return NextResponse.json({ error: "Terlalu banyak percobaan. Coba lagi dalam 10 menit." }, { status: 429 });
  const { password } = await req.json().catch(() => ({}));
  if (!checkPassword(String(password || ""))) {
    fails.set(ip, { n: (recent ? f!.n : 0) + 1, t: Date.now() });
    return NextResponse.json({ error: "Kata sandi salah." }, { status: 401 });
  }
  fails.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set("staff", makeToken(), { httpOnly: true, sameSite: "lax", secure: process.env.COOKIE_SECURE === "true", path: "/", maxAge: 8 * 3600 });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("staff");
  return res;
}
