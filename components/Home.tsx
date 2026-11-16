"use client";
import Link from "next/link";
import { useState } from "react";
import { statusOf } from "@/lib/rooms";
import { useStore } from "@/lib/useStore";

const LABEL = { kosong: "Kosong", terpakai: "Terpakai", terkunci: "Terkunci", tutup: "Tutup" } as const;

export default function Home() {
  const st = useStore();
  const [type, setType] = useState<"Semua" | "Kelas" | "Diskusi">("Semua");
  const [onlyFree, setOnlyFree] = useState(false);

  const ROOMS = st.rooms;
  const CONTACT = st.contact;
  const rows = ROOMS.map((r) => ({ r, s: statusOf(r.id, st.bookings, st.locked, st.now) }))
    .filter(({ r, s }) => (type === "Semua" || r.type === type) && (!onlyFree || s.state === "kosong"));
  const free = ROOMS.filter((r) => statusOf(r.id, st.bookings, st.locked, st.now).state === "kosong").length;

  return (
    <main className="wrap">
      <header className="top">
        <div className="eyebrow"><span className="eyebrow-dot" aria-hidden /> Ruang belajar bersama</div>
        <p className="muted">Gedung Pattimura · UPN “Veteran” Yogyakarta</p>
        <div className="hero-copy">
          <div>
            <h1>{st.ready ? <>{free} dari {ROOMS.length} ruang kosong sekarang</> : "Memuat status ruang…"}</h1>
            <p className="hero-desc">Temukan ruang yang sesuai, cek jadwalnya, dan pesan dalam beberapa langkah.</p>
          </div>
          <div className="hero-stat" aria-label={`${free} ruang tersedia dari ${ROOMS.length} ruang`}>
            <strong>{st.ready ? free : "—"}</strong>
            <span>tersedia</span>
          </div>
        </div>
        <div className="meter" aria-label={`${free} dari ${ROOMS.length} ruang tersedia`} role="progressbar" aria-valuenow={free} aria-valuemin={0} aria-valuemax={ROOMS.length}>
          <i style={{ width: `${ROOMS.length ? (free / ROOMS.length) * 100 : 0}%` }} />
        </div>
        <p className="muted update-note"><span className="live-dot" aria-hidden /> Status realtime · tersinkron otomatis</p>
      </header>

      <div className="filters noprint" role="group" aria-label="Filter ruang">
        {(["Semua", "Kelas", "Diskusi"] as const).map((t) => (
          <button key={t} className={type === t ? "chip on" : "chip"} onClick={() => setType(t)}>{t === "Diskusi" ? "Ruang diskusi" : t === "Kelas" ? "Ruang kelas" : t}</button>
        ))}
        <label className="chk"><input type="checkbox" checked={onlyFree} onChange={(e) => setOnlyFree(e.target.checked)} /> Hanya yang kosong</label>
      </div>

      <section className="grid" aria-live="polite">
        {!st.ready && Array.from({ length: 6 }).map((_, i) => <div key={i} className="plate skel" />)}
        {st.ready && rows.map(({ r, s }) => (
          <Link key={r.id} href={`/ruang/${r.id}`} className={`plate ${s.state}`}>
            <span className="lamp" aria-hidden />
            <div>
              <h2>{r.name}</h2>
              <p className="muted">Lantai {r.floor} · {r.type === "Kelas" ? "Ruang kelas" : "Ruang diskusi"} · {r.cap} orang</p>
              <p className="tags">{r.facilities.slice(0, 3).map((x) => <span key={x}>{x}</span>)}</p>
              <p className="state"><b>{LABEL[s.state]}</b>
                {s.state === "kosong" && (s.until ? ` sampai ${s.until}` : " sepanjang hari")}
                {s.state === "terpakai" && ` sampai ${s.until} · ${s.by}`}
                {s.state === "terkunci" && " — hubungi petugas"}
              </p>
            </div>
          </Link>
        ))}
        {st.ready && rows.length === 0 && (
          <div className="empty">
            <span className="empty-icon" aria-hidden>⌕</span>
            <h2>Tidak ada ruang yang cocok</h2>
            <p className="muted">Coba ubah jenis ruang atau matikan filter “Hanya yang kosong”.</p>
          </div>
        )}
      </section>

      <footer className="foot">
        <p><b>Butuh bantuan?</b> {CONTACT.name} · {CONTACT.hours} · <a href={`https://wa.me/${CONTACT.wa}`}>WhatsApp</a></p>
      <p className="muted"><Link href="/petugas">Masuk petugas</Link></p></footer>
    </main>
  );
}
