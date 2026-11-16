"use client";
import { useCallback, useEffect, useState } from "react";
import { Booking, Contact, DEFAULT_CONTACT, Room } from "./rooms";

type S = { rooms: Room[]; bookings: Booking[]; locked: string[]; contact: Contact; staff: boolean; serverTime: number };

async function call(url: string, method: string, body?: unknown) {
  const r = await fetch(url, { method, cache: "no-store", headers: { "content-type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || "Terjadi kesalahan. Coba lagi.");
  return j;
}

// Data diambil dari server dan disegarkan tiap 15 detik, sehingga semua mahasiswa melihat status yang sama.
export function useStore() {
  const [s, setS] = useState<S | null>(null);
  const [off, setOff] = useState(0);
  const [, tick] = useState(0);

  const apply = useCallback((j: S) => {
    setOff(j.serverTime - Date.now());
    setS(j);
  }, []);

  const refresh = useCallback(async () => {
    try { apply(await call("/api/state", "GET") as S); } catch {}
  }, [apply]);

  useEffect(() => {
    refresh();
    const stream = new EventSource("/api/state/stream");
    stream.onmessage = (event) => {
      try { apply(JSON.parse(event.data) as S); } catch { void refresh(); }
    };
    const fallback = setInterval(refresh, 15000);
    const clock = setInterval(() => tick((n) => n + 1), 1000);
    const v = () => document.visibilityState === "visible" && refresh();
    document.addEventListener("visibilitychange", v);
    return () => {
      stream.close();
      clearInterval(fallback);
      clearInterval(clock);
      document.removeEventListener("visibilitychange", v);
    };
  }, [apply, refresh]);

  const act = async (url: string, method: string, body?: unknown) => { const j = await call(url, method, body); await refresh(); return j; };

  return {
    ready: !!s, rooms: s?.rooms ?? [], bookings: s?.bookings ?? [], locked: s?.locked ?? [],
    contact: s?.contact ?? DEFAULT_CONTACT, staff: !!s?.staff, now: new Date(Date.now() + off),
    book: (b: Booking) => act("/api/bookings", "POST", b) as Promise<{ code: string }>,
    cancel: (id: string, code?: string | null) => act("/api/bookings", "DELETE", { id, code }),
    login: (password: string) => act("/api/auth", "POST", { password }),
    logout: () => act("/api/auth", "DELETE"),
    admin: (action: string, payload: object = {}) => act("/api/admin", "POST", { action, ...payload }),
  };
}
