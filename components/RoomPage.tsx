"use client";
import Link from "next/link";
import { useState } from "react";
import { CLOSE, MAX_MIN, OPEN, RULES, statusOf, toMin, today, validate } from "@/lib/rooms";
import { useStore } from "@/lib/useStore";

const LABEL = { kosong: "Kosong", terpakai: "Terpakai", terkunci: "Terkunci", tutup: "Tutup" } as const;
const SPAN = toMin(CLOSE) - toMin(OPEN);

export default function RoomPage({ id }: { id: string }) {
  const st = useStore();
  const room = st.rooms.find((r) => r.id === id);
  const [date, setDate] = useState(today());
  const [f, setF] = useState({ start: "", end: "", name: "", purpose: "Kerja kelompok" });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const staff = st.staff;

  if (!st.ready) return <main className="wrap"><p className="muted">Memuat…</p></main>;
  if (!room) return <main className="wrap"><p>Ruang tidak ditemukan. <Link href="/">Kembali ke daftar ruang</Link></p></main>;

  const s = statusOf(room.id, st.bookings, st.locked, st.now);
  const list = st.bookings.filter((b) => b.roomId === room.id && b.date === date).sort((a, b) => toMin(a.start) - toMin(b.start));
  const url = typeof window !== "undefined" ? `${location.origin}/ruang/${room.id}` : "";

  const cancel = async (bid: string) => {
    const code = staff ? "" : prompt("Masukkan kode pembatalan 4 digit:");
    if (code === null) return;
    try { await st.cancel(bid, code); } catch (x) { alert((x as Error).message); }
  };

  const submit = async (e: React.MouseEvent) => {
    e.preventDefault();
    const b = { id: crypto.randomUUID(), roomId: room.id, date, ...f, name: f.name.trim() };
    const err = validate(b, st.bookings, st.now);
    if (err) return setMsg({ ok: false, text: err });
    try {
      const { code } = await st.book(b);
      setMsg({ ok: true, text: `Ruang ${room.name} dipesan ${b.start}–${b.end}. Kode pembatalan: ${code} (simpan kode ini).` });
      setF({ ...f, start: "", end: "" });
    } catch (x) { setMsg({ ok: false, text: (x as Error).message }); }
  };

  return (
    <main className="wrap">
      <Link href="/" className="back noprint">← Semua ruang</Link>

      <header className={`plate big ${s.state}`}>
        <span className="lamp" aria-hidden />
        <div>
          <h1>{room.name}</h1>
          <p className="muted">Lantai {room.floor} · {room.type === "Kelas" ? "Ruang kelas" : "Ruang diskusi"} · kapasitas {room.cap} orang</p>
          <p className="state"><b>{LABEL[s.state]}</b>{s.until ? ` sampai ${s.until}` : ""}{s.by ? ` · ${s.by}` : ""}</p>
          <p className="tags">{room.facilities.map((x) => <span key={x}>{x}</span>)}</p>
        </div>
      </header>

      <section>
        <div className="row">
          <h2>Jadwal harian</h2>
          <input className="noprint" type="date" min={today()} value={date} onChange={(e) => setDate(e.target.value || today())} aria-label="Pilih tanggal" />
        </div>
        <div className="bar" role="img" aria-label="Garis waktu pemakaian ruang">
          {list.map((b) => <i key={b.id} style={{ left: `${((toMin(b.start) - toMin(OPEN)) / SPAN) * 100}%`, width: `${((toMin(b.end) - toMin(b.start)) / SPAN) * 100}%` }} />)}
          <span>{OPEN}</span><span>{CLOSE}</span>
        </div>
        {list.length === 0 ? <p className="muted">Belum ada pemesanan. Ruang bebas dipakai sepanjang hari.</p> : (
          <ul className="slots">
            {list.map((b) => (
              <li key={b.id}><b>{b.start}–{b.end}</b> {b.name} <span className="muted">· {b.purpose}</span>
                {b.regular ? <span className="schedule-badge">Jadwal tetap</span> : <button className="link noprint" onClick={() => cancel(b.id)}>Batalkan</button>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="noprint">
        <h2>Pesan ruang ini</h2>
        <form className="form">
          <label>Jam mulai<input type="time" min={OPEN} max={CLOSE} value={f.start} onChange={(e) => setF({ ...f, start: e.target.value })} /></label>
          <label>Jam selesai<input type="time" min={OPEN} max={CLOSE} value={f.end} onChange={(e) => setF({ ...f, end: e.target.value })} /></label>
          <label>Nama / kelompok<input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="mis. Kelompok 7" /></label>
          <label>Keperluan
            <select value={f.purpose} onChange={(e) => setF({ ...f, purpose: e.target.value })}>
              {["Kerja kelompok", "Belajar mandiri", "Latihan presentasi", "Rapat organisasi", "Kuliah pengganti / bimbingan"].map((p) => <option key={p}>{p}</option>)}
            </select>
          </label>
          <button className="btn" onClick={submit}>Pesan ruang</button>
        </form>
        {msg && <p role="status" className={msg.ok ? "ok" : "err"}>{msg.text}</p>}
        <p className="muted">Maksimal {MAX_MIN / 60} jam per pemesanan.</p>
        <p className="booking-note"><b>Pemesanan online 24 jam.</b> Penggunaan ruang tersedia pukul {OPEN}–{CLOSE} WIB.</p>
      </section>

      <section className="two">
        <div>
          <h2>Aturan pemakaian</h2>
          <ul>{RULES.map((r) => <li key={r}>{r}</li>)}</ul>
          <p><b>Kontak petugas:</b> {st.contact.name}, {st.contact.hours}. <a href={`https://wa.me/${st.contact.wa}`}>Chat WhatsApp</a></p>
        </div>
        <div className="qr">
          {/* QR code memakai layanan api.qrserver.com; untuk produksi, buat QR sendiri agar tidak bergantung pihak ketiga. */}
          {url && <img alt={`QR code ${room.name}`} width={140} height={140} src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(url)}`} />}
          <p className="muted">Pindai untuk melihat status dan memesan {room.name}.</p>
          <button className="btn alt noprint" onClick={() => window.print()}>Cetak lembar pintu</button>
        </div>
      </section>

      <p className="noprint petugas">{staff
        ? <button className="link" onClick={() => st.admin("toggleLock", { roomId: room.id })}>{st.locked.includes(room.id) ? "Buka kunci ruang" : "Tandai ruang terkunci"}</button>
        : <Link href="/petugas">Masuk petugas</Link>}</p>
    </main>
  );
}
