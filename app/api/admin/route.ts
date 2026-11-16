import { NextResponse } from "next/server";
import { tx } from "@/lib/db";
import { isStaff } from "@/lib/auth";
import type { Room } from "@/lib/rooms";

export async function POST(req: Request) {
  if (!(await isStaff())) return NextResponse.json({ error: "Silakan masuk sebagai petugas." }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  try {
    await tx((db) => {
      if (b.action === "toggleLock") {
        db.locked = db.locked.includes(b.roomId) ? db.locked.filter((x) => x !== b.roomId) : [...db.locked, b.roomId];
      } else if (b.action === "saveRoom") {
        const r = b.room as Room;
        const name = String(r.name || "").trim().slice(0, 40);
        if (!name) throw new Error("Nama ruang wajib diisi.");
        const room: Room = { id: r.id || "r" + crypto.randomUUID().slice(0, 6), name, floor: Math.max(1, Number(r.floor) || 1), type: r.type === "Kelas" ? "Kelas" : "Diskusi", cap: Math.max(1, Number(r.cap) || 1), facilities: (r.facilities || []).map(String).slice(0, 10) };
        const i = db.rooms.findIndex((x) => x.id === room.id);
        if (i < 0) db.rooms.push(room); else db.rooms[i] = room;
      } else if (b.action === "deleteRoom") {
        db.rooms = db.rooms.filter((x) => x.id !== b.id);
        db.bookings = db.bookings.filter((x) => x.roomId !== b.id);
        db.regularClasses = db.regularClasses.filter((x) => x.roomId !== b.id);
        db.locked = db.locked.filter((x) => x !== b.id);
      } else if (b.action === "saveContact") {
        const c = b.contact || {};
        db.contact = { name: String(c.name || "").slice(0, 60), wa: String(c.wa || "").replace(/\D/g, ""), hours: String(c.hours || "").slice(0, 60) };
      } else throw new Error("Aksi tidak dikenal.");
    });
    return NextResponse.json({ ok: true });
  } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 400 }); }
}
