import { promises as fs } from "node:fs";
import path from "node:path";
import { Booking, Contact, DEFAULT_CONTACT, DEFAULT_REGULAR_CLASSES, DEFAULT_ROOMS, regularBookings, Room, RegularClass, today } from "./rooms";

// Penyimpanan berupa satu file JSON (data/db.json, atau $DATA_DIR/db.json). Cocok untuk satu server/VPS/Docker.
export type DB = { rooms: Room[]; bookings: (Booking & { code: string })[]; regularClasses: RegularClass[]; locked: string[]; contact: Contact };
const FILE = path.join(process.env.DATA_DIR || path.join(process.cwd(), "data"), "db.json");
let queue: Promise<unknown> = Promise.resolve();

async function load(): Promise<DB> {
  try {
    const db = JSON.parse(await fs.readFile(FILE, "utf8")) as Partial<DB>;
    return { rooms: db.rooms ?? DEFAULT_ROOMS, bookings: db.bookings ?? [], regularClasses: db.regularClasses ?? DEFAULT_REGULAR_CLASSES, locked: db.locked ?? [], contact: db.contact ?? DEFAULT_CONTACT };
  } catch { return { rooms: DEFAULT_ROOMS, bookings: [], regularClasses: DEFAULT_REGULAR_CLASSES, locked: [], contact: DEFAULT_CONTACT }; }
}
async function save(db: DB) {
  const cutoff = new Date(Date.now() - 30 * 864e5); // buang pemesanan lebih dari 30 hari lalu
  db.bookings = db.bookings.filter((b) => b.date >= today(cutoff));
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  const tmp = FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(db, null, 2));
  await fs.rename(tmp, FILE);
}
export const read = () => queue.then(async () => {
  const db = await load();
  return { ...db, bookings: [...db.bookings, ...regularBookings(db.regularClasses, today())] };
});
// Semua perubahan lewat antrean agar tidak saling menimpa. Jika fn melempar error, data tidak disimpan.
export function tx<T>(fn: (db: DB) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => { const db = await load(); const r = await fn(db); await save(db); return r; });
  queue = run.catch(() => {});
  return run;
}
