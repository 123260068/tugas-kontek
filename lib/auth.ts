import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const sign = (v: string) => createHmac("sha256", process.env.AUTH_SECRET || "ganti-rahasia-ini").update(v).digest("hex");
const same = (a: string, b: string) => { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); };

export const checkPassword = (p: string) => same(sign("pw:" + p), sign("pw:" + (process.env.STAFF_PASSWORD || "petugas123")));
export const makeToken = () => { const exp = String(Date.now() + 8 * 3600e3); return exp + "." + sign(exp); };
export async function isStaff() {
  const t = (await cookies()).get("staff")?.value;
  if (!t) return false;
  const [exp, sig] = t.split(".");
  return !!exp && !!sig && Number(exp) > Date.now() && same(sig, sign(exp));
}
