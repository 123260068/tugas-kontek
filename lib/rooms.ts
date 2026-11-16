export type Room = { id: string; name: string; floor: number; type: "Kelas" | "Diskusi"; cap: number; facilities: string[] };
export type Booking = { id: string; roomId: string; date: string; start: string; end: string; name: string; purpose: string; regular?: boolean };
export type RegularClass = { id: string; roomId: string; weekday: number; start: string; end: string; name: string; purpose: string };
export type Contact = { name: string; wa: string; hours: string };

export const DEFAULT_ROOMS: Room[] = [
  { id: "p1a", name: "Patt 1 · 1A", floor: 1, type: "Kelas", cap: 40, facilities: ["Proyektor", "AC", "Papan tulis"] },
  { id: "p1b", name: "Patt 1 · 1B", floor: 1, type: "Kelas", cap: 40, facilities: ["Proyektor", "AC", "Papan tulis"] },
  { id: "p1c", name: "Patt 1 · 1C", floor: 1, type: "Kelas", cap: 40, facilities: ["Proyektor", "AC", "Papan tulis"] },
  { id: "p1d", name: "Patt 1 · 1D", floor: 1, type: "Kelas", cap: 40, facilities: ["Proyektor", "AC", "Papan tulis"] },
  { id: "p2a", name: "Patt 2 · 2A", floor: 2, type: "Kelas", cap: 40, facilities: ["Proyektor", "AC", "Papan tulis"] },
  { id: "p2b", name: "Patt 2 · 2B", floor: 2, type: "Kelas", cap: 40, facilities: ["Proyektor", "AC", "Papan tulis"] },
  { id: "p2c", name: "Patt 2 · 2C", floor: 2, type: "Kelas", cap: 40, facilities: ["Proyektor", "AC", "Papan tulis"] },
  { id: "p2d", name: "Patt 2 · 2D", floor: 2, type: "Kelas", cap: 40, facilities: ["Proyektor", "AC", "Papan tulis"] },
  { id: "seminar", name: "Ruang Seminar", floor: 1, type: "Kelas", cap: 80, facilities: ["Proyektor", "AC", "Sound system"] },
];
// Bisa diubah dari halaman /petugas.
export const DEFAULT_CONTACT: Contact = { name: "Petugas Gedung Pattimura", wa: "6281234567890", hours: "Senin–Jumat, 07.00–16.00" };

export const DEFAULT_REGULAR_CLASSES: RegularClass[] = [
  { id: "reg-1a", roomId: "p1a", weekday: 1, start: "08:00", end: "10:00", name: "Matematika Dasar", purpose: "Kelas reguler" },
  { id: "reg-1b", roomId: "p1b", weekday: 1, start: "10:00", end: "12:00", name: "Bahasa Indonesia", purpose: "Kelas reguler" },
  { id: "reg-1c", roomId: "p1c", weekday: 2, start: "08:00", end: "10:00", name: "Pemrograman Dasar", purpose: "Kelas reguler" },
  { id: "reg-1d", roomId: "p1d", weekday: 2, start: "10:00", end: "12:00", name: "Statistika", purpose: "Kelas reguler" },
  { id: "reg-2a", roomId: "p2a", weekday: 3, start: "08:00", end: "10:00", name: "Manajemen", purpose: "Kelas reguler" },
  { id: "reg-2b", roomId: "p2b", weekday: 3, start: "10:00", end: "12:00", name: "Akuntansi", purpose: "Kelas reguler" },
  { id: "reg-2c", roomId: "p2c", weekday: 4, start: "08:00", end: "10:00", name: "Kewirausahaan", purpose: "Kelas reguler" },
  { id: "reg-2d", roomId: "p2d", weekday: 4, start: "10:00", end: "12:00", name: "Metodologi Penelitian", purpose: "Kelas reguler" },
  { id: "reg-seminar", roomId: "seminar", weekday: 5, start: "13:00", end: "15:00", name: "Seminar Rutin Fakultas", purpose: "Kelas reguler" },
  { id: "reg-1a-2", roomId: "p1a", weekday: 3, start: "13:00", end: "15:00", name: "Sistem Operasi", purpose: "Kelas reguler" },
  { id: "reg-1a-3", roomId: "p1a", weekday: 5, start: "08:00", end: "10:00", name: "Pendidikan Pancasila", purpose: "Kelas reguler" },
  { id: "reg-1b-2", roomId: "p1b", weekday: 2, start: "13:00", end: "15:00", name: "Komunikasi Bisnis", purpose: "Kelas reguler" },
  { id: "reg-1b-3", roomId: "p1b", weekday: 4, start: "13:00", end: "15:00", name: "Ekonomi Mikro", purpose: "Kelas reguler" },
  { id: "reg-1c-2", roomId: "p1c", weekday: 1, start: "13:00", end: "15:00", name: "Basis Data", purpose: "Kelas reguler" },
  { id: "reg-1c-3", roomId: "p1c", weekday: 5, start: "10:00", end: "12:00", name: "Kewarganegaraan", purpose: "Kelas reguler" },
  { id: "reg-1d-2", roomId: "p1d", weekday: 3, start: "08:00", end: "10:00", name: "Jaringan Komputer", purpose: "Kelas reguler" },
  { id: "reg-1d-3", roomId: "p1d", weekday: 5, start: "13:00", end: "15:00", name: "Etika Profesi", purpose: "Kelas reguler" },
  { id: "reg-2a-2", roomId: "p2a", weekday: 1, start: "13:00", end: "15:00", name: "Manajemen Proyek", purpose: "Kelas reguler" },
  { id: "reg-2a-3", roomId: "p2a", weekday: 4, start: "08:00", end: "10:00", name: "Statistika Lanjutan", purpose: "Kelas reguler" },
  { id: "reg-2b-2", roomId: "p2b", weekday: 2, start: "11:30", end: "13:30", name: "Akuntansi Keuangan", purpose: "Kelas reguler" },
  { id: "reg-2b-3", roomId: "p2b", weekday: 5, start: "10:00", end: "12:00", name: "Perilaku Organisasi", purpose: "Kelas reguler" },
  { id: "reg-2c-2", roomId: "p2c", weekday: 1, start: "10:00", end: "12:00", name: "Desain Interaksi", purpose: "Kelas reguler" },
  { id: "reg-2c-3", roomId: "p2c", weekday: 3, start: "13:00", end: "15:00", name: "Sistem Informasi", purpose: "Kelas reguler" },
  { id: "reg-2d-2", roomId: "p2d", weekday: 2, start: "08:00", end: "10:00", name: "Metode Kuantitatif", purpose: "Kelas reguler" },
  { id: "reg-2d-3", roomId: "p2d", weekday: 4, start: "13:00", end: "15:00", name: "Pengantar Bisnis", purpose: "Kelas reguler" },
  { id: "reg-seminar-2", roomId: "seminar", weekday: 2, start: "13:00", end: "15:00", name: "Seminar Akademik", purpose: "Kelas reguler" },
  { id: "reg-seminar-3", roomId: "seminar", weekday: 4, start: "10:00", end: "12:00", name: "Workshop Kewirausahaan", purpose: "Kelas reguler" },
];

export const OPEN = "07:00";
export const CLOSE = "18:00";
export const MAX_MIN = 120;
export const RULES = [
  "Peminjaman maksimal 2 jam per sesi.",
  "Pemesanan online tersedia 24 jam. Penggunaan ruang pukul 07.00–18.00 WIB.",
  "Datang maksimal 15 menit setelah jam mulai, jika tidak ruang dilepas.",
  "Jaga kebersihan dan matikan AC/lampu setelah selesai.",
  "Pemesanan kuliah tetap didahulukan dari kegiatan lain.",
];

export const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const dateFromParts = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};
const dateString = (date: Date) => date.toISOString().slice(0, 10);
const addDays = (date: Date, days: number) => new Date(date.getTime() + days * 864e5);

export function regularBookings(classes: RegularClass[], from: string, days = 90): (Booking & { code: string })[] {
  const start = dateFromParts(from);
  const result: (Booking & { code: string })[] = [];
  for (let offset = 0; offset < days; offset += 1) {
    const date = addDays(start, offset);
    const dateValue = dateString(date);
    const weekday = date.getUTCDay();
    classes.filter((c) => c.weekday === weekday).forEach((c) => {
      result.push({
        id: `${c.id}-${dateValue}`,
        roomId: c.roomId,
        date: dateValue,
        start: c.start,
        end: c.end,
        name: c.name,
        purpose: c.purpose,
        regular: true,
        code: "regular",
      });
    });
  }
  return result;
}
// Semua perhitungan waktu memakai WIB, di server maupun di browser.
export const wib = (d: Date) => {
  const p = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(d);
  return { date: p.slice(0, 10), min: toMin(p.slice(11, 16)) };
};
export const today = (d = new Date()) => wib(d).date;

export type Status = { state: "kosong" | "terpakai" | "terkunci" | "tutup"; until?: string; by?: string };

export function statusOf(roomId: string, bookings: Booking[], locked: string[], now: Date): Status {
  if (locked.includes(roomId)) return { state: "terkunci" };
  const { date, min: m } = wib(now);
  if (m < toMin(OPEN) || m >= toMin(CLOSE)) return { state: "tutup" };
  const list = bookings.filter((b) => b.roomId === roomId && b.date === date).sort((a, b) => toMin(a.start) - toMin(b.start));
  const cur = list.find((b) => toMin(b.start) <= m && m < toMin(b.end));
  if (cur) return { state: "terpakai", until: cur.end, by: cur.name };
  return { state: "kosong", until: list.find((b) => toMin(b.start) > m)?.start };
}

export function validate(b: Booking, all: Booking[], now: Date): string | null {
  if (!b.name.trim()) return "Isi nama atau nama kelompok.";
  if (!/^\d{2}:\d{2}$/.test(b.start || "") || !/^\d{2}:\d{2}$/.test(b.end || "")) return "Pilih jam mulai dan selesai.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(b.date || "")) return "Tanggal tidak valid.";
  const s = toMin(b.start), e = toMin(b.end), w = wib(now);
  if (e <= s) return "Jam selesai harus setelah jam mulai.";
  if (s < toMin(OPEN) || e > toMin(CLOSE)) return `Ruang hanya bisa dipesan pukul ${OPEN}–${CLOSE}.`;
  if (e - s > MAX_MIN) return "Durasi maksimal 2 jam per pemesanan.";
  if (b.date < w.date) return "Tanggal sudah lewat.";
  if (b.date === w.date && e <= w.min) return "Jam tersebut sudah lewat.";
  const clash = all.find((x) => x.roomId === b.roomId && x.date === b.date && s < toMin(x.end) && toMin(x.start) < e);
  if (clash) return `Bentrok dengan jadwal ${clash.start}–${clash.end} (${clash.name}).`;
  return null;
}
