import { read } from "./db";
import { isStaff } from "./auth";

export async function publicState() {
  const db = await read();
  return {
    rooms: db.rooms,
    locked: db.locked,
    contact: db.contact,
    staff: await isStaff(),
    serverTime: Date.now(),
    bookings: db.bookings.map(({ code, ...booking }) => booking),
  };
}
