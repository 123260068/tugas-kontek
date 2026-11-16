"use client";
import Link from "next/link";
import { useState } from "react";
import { Contact, Room, today } from "@/lib/rooms";
import { useStore } from "@/lib/useStore";

const blank: Room = { id: "", name: "", floor: 1, type: "Diskusi", cap: 8, facilities: [] };

export default function Admin() {
  const st = useStore();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [e, setE] = useState<Room | null>(null);
  const [fac, setFac] = useState("");
  const [c, setC] = useState<Contact | null>(null);
  const [note, setNote] = useState("");
  const run = async (fn: () => Promise<unknown>, ok = "") => { setErr(""); setNote(""); try { await fn(); setNote(ok); } catch (x) { setErr((x as Error).message); } };
  const ct = c ?? st.contact;

  if (!st.ready) return <main className="wrap"><p className="muted">Memuat…</p></main>;
  if (!st.staff) return (
    <main className="wrap">
      <Link href="/" className="back">← Semua ruang</Link>
      <h1>Masuk petugas</h1>
      <form className="form login" onSubmit={(ev) => { ev.preventDefault(); run(() => st.login(pw)); }}>
        <label>Kata sandi<input type="password" autoComplete="current-password" value={pw} onChange={(x) => setPw(x.target.value)} /></label>
        <button className="btn">Masuk</button>
      </form>
      {err && <p role="alert" className="err">{err}</p>}
    </main>
  );

  const name = (id: string) => st.rooms.find((r) => r.id === id)?.name ?? id;
  const upcoming = st.bookings.filter((b) => b.date >= today(st.now)).sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
  const edit = (r: Room) => { setE(r); setFac(r.facilities.join(", ")); };

  return (
    <main className="wrap">
      <div className="row"><h1>Panel petugas</h1>
        <span><Link href="/">Lihat situs</Link> <button className="link" onClick={() => run(st.logout)}>Keluar</button></span></div>
      {err && <p role="alert" className="err">{err}</p>}{note && <p role="status" className="ok">{note}</p>}

      <section>
        <div className="row"><h2>Ruang</h2><button className="btn alt" onClick={() => edit(blank)}>Tambah ruang</button></div>
        <table className="tbl"><tbody>
          {st.rooms.map((r) => (
            <tr key={r.id}><td><b>{r.name}</b><br /><span className="muted">Lt. {r.floor} · {r.type} · {r.cap} orang</span></td>
              <td>{st.locked.includes(r.id) ? "Terkunci" : "Terbuka"}</td>
              <td><button className="link" onClick={() => run(() => st.admin("toggleLock", { roomId: r.id }))}>{st.locked.includes(r.id) ? "Buka kunci" : "Kunci"}</button>
                <button className="link" onClick={() => edit(r)}>Ubah</button>
                <button className="link" onClick={() => confirm(`Hapus ${r.name} beserta pemesanannya?`) && run(() => st.admin("deleteRoom", { id: r.id }))}>Hapus</button></td></tr>
          ))}
        </tbody></table>
        {e && (
          <form className="form panel" onSubmit={(ev) => { ev.preventDefault(); run(async () => { await st.admin("saveRoom", { room: { ...e, facilities: fac.split(",").map((x) => x.trim()).filter(Boolean) } }); setE(null); }, "Ruang disimpan."); }}>
            <label>Nama ruang<input value={e.name} onChange={(x) => setE({ ...e, name: x.target.value })} /></label>
            <label>Lantai<input type="number" min={1} value={e.floor} onChange={(x) => setE({ ...e, floor: +x.target.value })} /></label>
            <label>Jenis<select value={e.type} onChange={(x) => setE({ ...e, type: x.target.value as Room["type"] })}><option value="Kelas">Ruang kelas</option><option value="Diskusi">Ruang diskusi</option></select></label>
            <label>Kapasitas<input type="number" min={1} value={e.cap} onChange={(x) => setE({ ...e, cap: +x.target.value })} /></label>
            <label>Fasilitas (pisahkan koma)<input value={fac} onChange={(x) => setFac(x.target.value)} /></label>
            <button className="btn">Simpan</button>
          </form>
        )}
      </section>

      <section>
        <h2>Kontak petugas</h2>
        <form className="form" onSubmit={(ev) => { ev.preventDefault(); run(() => st.admin("saveContact", { contact: ct }), "Kontak disimpan."); }}>
          <label>Nama<input value={ct.name} onChange={(x) => setC({ ...ct, name: x.target.value })} /></label>
          <label>WhatsApp (628…)<input value={ct.wa} onChange={(x) => setC({ ...ct, wa: x.target.value })} /></label>
          <label>Jam layanan<input value={ct.hours} onChange={(x) => setC({ ...ct, hours: x.target.value })} /></label>
          <button className="btn">Simpan kontak</button>
        </form>
      </section>

      <section>
        <h2>Pemesanan mendatang ({upcoming.length})</h2>
        {upcoming.length === 0 ? <p className="muted">Belum ada pemesanan.</p> : (
          <table className="tbl"><tbody>
            {upcoming.map((b) => (
              <tr key={b.id}><td>{b.date}</td><td>{b.start}–{b.end}</td><td>{name(b.roomId)}</td><td>{b.name}<br /><span className="muted">{b.purpose}</span></td>
                <td>{b.regular ? <span className="schedule-badge">Jadwal tetap</span> : <button className="link" onClick={() => run(() => st.cancel(b.id), "Pemesanan dibatalkan.")}>Batalkan</button>}</td></tr>
            ))}
          </tbody></table>
        )}
      </section>
    </main>
  );
}
