import { NextResponse } from "next/server";
import { randomInt } from "node:crypto";
import { tx } from "@/lib/db";
import { isStaff } from "@/lib/auth";
import { Booking, regularBookings, validate } from "@/lib/rooms";

const fail = (e: unknown, status = 400) => NextResponse.json({ error: (e as Error).message }, { status });

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  try {
    const out = await tx((db) => {
      const room = db.rooms.find((r) => r.id === b.roomId);
      if (!room) throw new Error("Ruang tidak ditemukan.");
      const bk: Booking = { id: crypto.randomUUID(), roomId: room.id, date: String(b.date), start: String(b.start), end: String(b.end), name: String(b.name || "").trim().slice(0, 40), purpose: String(b.purpose || "").slice(0, 40) };
      const err = validate(bk, [...db.bookings, ...regularBookings(db.regularClasses, bk.date)], new Date());
      if (err) throw new Error(err);
      const code = String(randomInt(1000, 10000));
      db.bookings.push({ ...bk, code });
      return { code };
    });
    return NextResponse.json(out);
  } catch (e) { return fail(e); }
}

export async function DELETE(req: Request) {
  const { id, code } = await req.json().catch(() => ({}));
  const staff = await isStaff();
  try {
    await tx((db) => {
      const b = db.bookings.find((x) => x.id === id);
      if (!b) throw new Error("Pemesanan tidak ditemukan.");
      if (!staff && String(code) !== b.code) throw new Error("Kode pembatalan salah.");
      db.bookings = db.bookings.filter((x) => x.id !== id);
    });
    return NextResponse.json({ ok: true });
  } catch (e) { return fail(e, 403); }
}
