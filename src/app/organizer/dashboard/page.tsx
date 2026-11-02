"use client";

import { useEffect, useState } from "react";

// ===== 1. Tipe dan data contoh (nanti diganti data dari backend) =====
type Row = { label: string; full: string; revenue: number };
type Period = "day" | "month" | "year";

import Link from "next/link";
import ConfirmationPage from "@/features/organizer/components/confirmation";
import ViewTransactionsPage from "@/features/organizer/components/confirmation";
// Alamat halaman Buat Event milik rekanmu. Samakan dengan nama foldernya.
const CREATE_EVENT_URL = "/organizer/dashboard/create-event";

const events = [
  { id: "evt-001", name: "Jakarta Music Fest 2026", location: "Jakarta", date: "25 Okt 2026", price: 350000, seats: 500, sold: 420, buyers: 10 },
  { id: "evt-002", name: "Workshop UI/UX untuk Pemula", location: "Bandung", date: "2 Nov 2026", price: 150000, seats: 60, sold: 56, buyers: 6 },
  { id: "evt-003", name: "Startup Pitch Night", location: "Surabaya", date: "14 Nov 2026", price: 0, seats: 200, sold: 95, buyers: 8 },
  { id: "evt-004", name: "Festival Kuliner Nusantara", location: "Yogyakarta", date: "28 Nov 2026", price: 75000, seats: 800, sold: 310, buyers: 7 },
  { id: "evt-005", name: "Konser Amal Akustik", location: "Semarang", date: "5 Des 2026", price: 200000, seats: 250, sold: 0, buyers: 0 },
  { id: "evt-006", name: "Pameran Seni Rupa Kontemporer", location: "Yogyakarta", date: "20 Okt 2026", price: 40000, seats: 400, sold: 180, buyers: 9 },
];

const PENDING = 6; // jumlah transaksi yang menunggu konfirmasi (data contoh)
const AVG_PRICE = 175000; // harga rata-rata tiket, untuk menghitung jumlah tiket di statistik

const monthShort = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const monthLong = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const years = [2024, 2025, 2026];

// Pendapatan per bulan
const monthlyRevenue: Record<number, number[]> = {
  2024: [7200000, 8500000, 9800000, 10900000, 12100000, 13400000, 14600000, 15800000, 16900000, 17500000, 12300000, 12800000],
  2025: [10200000, 11500000, 13100000, 14800000, 16200000, 17900000, 19400000, 20100000, 21300000, 22600000, 15800000, 15500000],
  2026: [12500000, 15200000, 18900000, 21400000, 24800000, 28300000, 31600000, 29700000, 33200000, 18400000, 0, 0],
};
const oldYears = [
  { year: 2022, revenue: 48500000 },
  { year: 2023, revenue: 96200000 },
];

// Data pembeli untuk daftar peserta
const names = [
  "Andi Pratama", "Siti Rahmawati", "Rizky Maulana", "Dewi Lestari", "Fajar Nugroho",
  "Maya Putri", "Dimas Saputra", "Nadia Safitri", "Bagus Wicaksono", "Laras Ayu",
];
const quantities = [2, 1, 3, 1, 2, 4, 1, 2, 1, 3];

const tabs = [
  { key: "ringkasan", label: "Ringkasan" },
  { key: "event", label: "Event Saya" },
  { key: "statistik", label: "Statistik" },
  { key: "transaksi", label: "Transaksi" },
];

// ===== 2. Fungsi bantu =====
const sum = (list: number[]) => list.reduce((a, b) => a + b, 0);
const rupiah = (n: number) => (n === 0 ? "Gratis" : "Rp " + n.toLocaleString("id-ID"));
const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";

// Menunda nilai pencarian sampai user berhenti mengetik (debounce, sesuai PRD)
function useDebounce(value: string, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // batalkan timer lama kalau user masih mengetik
  }, [value, delay]);
  return debounced;
}

// Menyiapkan data statistik: satu "baris" untuk setiap batang grafik
function getRows(period: Period, year: number, month: number): Row[] {
  if (period === "year") {
    const rows: Row[] = oldYears.map((o) => ({ label: String(o.year), full: "Tahun " + o.year, revenue: o.revenue }));
    years.forEach((y) => rows.push({ label: String(y), full: "Tahun " + y, revenue: sum(monthlyRevenue[y]) }));
    return rows;
  }
  if (period === "month") {
    return monthlyRevenue[year].map((revenue, i) => ({
      label: monthShort[i],
      full: monthLong[i] + " " + year,
      revenue,
    }));
  }
  // Per hari: total bulan itu dibagi ke tiap tanggal dengan bobot berbeda-beda
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weights: number[] = [];
  for (let d = 1; d <= daysInMonth; d++) weights.push(((d * 37) % 10) + 5);
  const total = monthlyRevenue[year][month];
  return weights.map((w, i) => ({
    label: String(i + 1),
    full: `${i + 1} ${monthLong[month]} ${year}`,
    revenue: Math.round((total * w) / sum(weights) / 1000) * 1000,
  }));
}

// Grafik batang sederhana (dipakai di Ringkasan dan Statistik)
function BarChart({ rows, wide }: { rows: Row[]; wide?: boolean }) {
  const max = Math.max(...rows.map((r) => r.revenue));
  return (
    <div className="overflow-x-auto pb-2">
      <div className={wide ? "min-w-160" : "min-w-75"}>
        <div className="flex h-56 items-end gap-1 border-b border-gray-200 sm:gap-2">
          {rows.map((r) => (
            <div key={r.full} className="flex h-full flex-1 flex-col justify-end">
              <div
                title={`${r.full}: Rp ${r.revenue.toLocaleString("id-ID")}`}
                className="w-full rounded-t bg-indigo-500 hover:bg-indigo-700"
                // tinggi batang = persentase dari batang tertinggi
                style={{ height: r.revenue > 0 ? `${Math.max((r.revenue / max) * 100, 2)}%` : "0%" }}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-1 sm:gap-2">
          {rows.map((r) => (
            <span key={r.full} className="flex-1 text-center text-[10px] text-gray-500 sm:text-xs">
              {r.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== 3. Tab RINGKASAN =====
function Ringkasan({ goTo }: { goTo: (tab: string) => void }) {
  const [name, setName] = useState("Organizer");

  // Ambil nama organizer yang sedang login
  useEffect(() => {
    try {
      const saved = localStorage.getItem("currentUser");
      if (saved) {
        const user = JSON.parse(saved);
        setName(user.organizerName || user.organizationName || user.name || "Organizer");
      }
    } catch {
      // pakai nama bawaan
    }
  }, []);

  const cards = [
    { label: "Pendapatan 2026", value: "Rp " + sum(monthlyRevenue[2026]).toLocaleString("id-ID") },
    { label: "Tiket Terjual", value: sum(events.map((e) => e.sold)).toLocaleString("id-ID") },
    { label: "Event Aktif", value: String(events.length) },
    { label: "Perlu Konfirmasi", value: String(PENDING) },
  ];

  return (
    <div className="space-y-6">
      {/* Sambutan */}
      <section className="rounded-xl bg-indigo-600 p-6 text-white shadow">
        <h1 className="text-2xl font-bold sm:text-3xl">Halo, {name}!</h1>
        <p className="mt-1 text-sm text-indigo-100">
          Pantau penjualan tiket dan kelola semua event kamu dalam satu tempat.
        </p>
      </section>

      {/* Pengingat transaksi */}
      {PENDING > 0 && (
        <section className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-amber-900">{PENDING} transaksi menunggu konfirmasi kamu</p>
            <p className="text-sm text-amber-800">
              Segera terima atau tolak. Jika lewat 15 menit, transaksi dibatalkan otomatis.
            </p>
          </div>
          <button
            type="button"
            onClick={() => goTo("transaksi")}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
          >
            Tinjau Sekarang
          </button>
        </section>
      )}

      {/* Kartu statistik */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="mt-1 truncate text-xl font-bold text-gray-900">{c.value}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Grafik bulanan */}
        <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900">Pendapatan per Bulan (2026)</h2>
          <div className="mt-4">
            <BarChart rows={getRows("month", 2026, 0)} />
          </div>
        </section>

        {/* Event mendatang */}
        <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900">Event Mendatang</h2>
          <ul className="mt-4 space-y-4">
            {events.slice(0, 4).map((e) => {
              const percent = Math.round((e.sold / e.seats) * 100);
              return (
                <li key={e.id}>
                  <p className="truncate text-sm font-semibold text-gray-900">{e.name}</p>
                  <p className="text-xs text-gray-500">{e.date} · {e.location}</p>
                  <div className="mt-2 h-2 rounded-full bg-gray-100">
                    <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${percent}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{e.sold}/{e.seats} kursi terisi ({percent}%)</p>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}

// ===== 4. Tab EVENT SAYA (daftar event + daftar peserta) =====
function EventTab() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [selectedId, setSelectedId] = useState<string | null>(null); // event yang pesertanya dilihat

  const selected = events.find((e) => e.id === selectedId);
  if (selected) return <Peserta event={selected} onBack={() => setSelectedId(null)} />;

  const keyword = debouncedSearch.trim().toLowerCase();
  const shown = events.filter(
    (e) => e.name.toLowerCase().includes(keyword) || e.location.toLowerCase().includes(keyword)
  );

  return (
    <div className="space-y-6">
     <div className="flex flex-wrap items-start justify-between gap-3">
  <div>
    <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">Event Saya</h1>
    <p className="mt-1 text-sm text-gray-500">Daftar semua event yang kamu buat sebagai organizer.</p>
  </div>
  <Link
    href={CREATE_EVENT_URL}
    className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
  >
    + Buat Event
  </Link>
</div>

      <section className="rounded-xl bg-white p-4 shadow-sm">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama event atau lokasi..."
          className={inputClass}
        />
        <p className="mt-2 text-xs text-gray-500">
          {search !== debouncedSearch ? "Mencari..." : `Menampilkan ${shown.length} dari ${events.length} event`}
        </p>
      </section>

      <section className="rounded-xl bg-white shadow-sm">
        {shown.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-semibold text-gray-900">Tidak ada event yang cocok</p>
            <p className="mt-1 text-sm text-gray-500">Coba kata kunci yang lain.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3">Event</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Harga</th>
                  <th className="px-4 py-3">Kursi Terisi</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {shown.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <p className="font-medium text-gray-900">{e.name}</p>
                      <p className="text-xs text-gray-500">{e.location}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">{e.date}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">{rupiah(e.price)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">{e.sold}/{e.seats}</td>
                    <td className="px-6 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedId(e.id)}
                        className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
                      >
                        Lihat Peserta
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

// Daftar peserta satu event (nama, jumlah tiket, total bayar)
function Peserta({ event, onBack }: { event: (typeof events)[number]; onBack: () => void }) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  // Buat daftar peserta dari data contoh
  const attendees = names.slice(0, event.buyers).map((name, i) => ({
    name,
    email: name.toLowerCase().replace(" ", ".") + "@email.com",
    qty: quantities[i],
    total: quantities[i] * event.price,
  }));

  const keyword = debouncedSearch.trim().toLowerCase();
  const shown = attendees.filter((a) => a.name.toLowerCase().includes(keyword) || a.email.includes(keyword));

  return (
    <div className="space-y-6">
      <div>
        <button type="button" onClick={onBack} className="text-sm text-indigo-600 hover:underline">
          &larr; Kembali ke Event Saya
        </button>
        <h1 className="mt-2 text-2xl font-bold text-gray-900 lg:text-3xl">Daftar Peserta</h1>
        <p className="mt-1 text-sm text-gray-500">{event.name} · {event.date}</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Jumlah Pembeli", value: attendees.length },
          { label: "Total Tiket", value: sum(attendees.map((a) => a.qty)) },
          { label: "Total Pembayaran", value: rupiah(sum(attendees.map((a) => a.total))) },
        ].map((c) => (
          <div key={c.label} className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{c.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl bg-white p-4 shadow-sm">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama atau email peserta..."
          className={inputClass}
        />
      </section>

      <section className="rounded-xl bg-white shadow-sm">
        {attendees.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-semibold text-gray-900">Belum ada peserta</p>
            <p className="mt-1 text-sm text-gray-500">Peserta akan muncul setelah ada tiket yang terjual.</p>
          </div>
        ) : shown.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-semibold text-gray-900">Tidak ada peserta yang cocok</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3">No</th>
                  <th className="px-4 py-3">Nama</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Email</th>
                  <th className="px-4 py-3 text-center">Jumlah Tiket</th>
                  <th className="px-6 py-3 text-right">Total Dibayar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {shown.map((a, i) => (
                  <tr key={a.email} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{a.name}</td>
                    <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">{a.email}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{a.qty}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-right font-medium text-gray-900">{rupiah(a.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

// ===== 5. Tab STATISTIK (per tahun, bulan, hari) =====
function Statistik() {
  const [period, setPeriod] = useState<Period>("month");
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(9); // 0 = Januari, 9 = Oktober

  const rows = getRows(period, year, month);
  const total = sum(rows.map((r) => r.revenue));
  const maxRevenue = Math.max(...rows.map((r) => r.revenue));
  const best = rows.find((r) => r.revenue === maxRevenue);
  const totalTickets = Math.round(total / AVG_PRICE);

  let title = "Laporan per Tahun";
  if (period === "month") title = `Laporan per Bulan · Tahun ${year}`;
  if (period === "day") title = `Laporan per Hari · ${monthLong[month]} ${year}`;
  const firstColumn = period === "year" ? "Tahun" : period === "month" ? "Bulan" : "Tanggal";

  // Unduh laporan sebagai file CSV (bisa dibuka di Excel)
  function downloadCsv() {
    const lines = ["Periode,Tiket Terjual,Pendapatan"];
    rows.forEach((r) => lines.push(`${r.full},${Math.round(r.revenue / AVG_PRICE)},${r.revenue}`));
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "laporan-penjualan.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  const cards = [
    { label: "Total Pendapatan", value: "Rp " + total.toLocaleString("id-ID") },
    { label: "Tiket Terjual", value: totalTickets.toLocaleString("id-ID") },
    { label: "Periode Terbaik", value: total > 0 && best ? best.full : "-" },
    { label: "Rata-rata per Periode", value: "Rp " + Math.round(total / rows.length).toLocaleString("id-ID") },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">Statistik Penjualan</h1>
        <p className="mt-1 text-sm text-gray-500">Pantau pendapatan dan tiket terjual per tahun, bulan, atau hari.</p>
      </div>

      {/* Pilihan periode */}
      <section className="flex flex-wrap items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
        <div className="flex overflow-hidden rounded-lg border border-gray-300">
          {[
            { key: "day", label: "Hari" },
            { key: "month", label: "Bulan" },
            { key: "year", label: "Tahun" },
          ].map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPeriod(p.key as Period)}
              className={`px-4 py-2 text-sm font-medium ${
                period === p.key ? "bg-indigo-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {period !== "year" && (
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900">
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        )}
        {period === "day" && (
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900">
            {monthLong.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>
        )}

        <button
          type="button"
          onClick={downloadCsv}
          disabled={total === 0}
          className="ml-auto rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-40"
        >
          Unduh Laporan (CSV)
        </button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="mt-1 truncate text-xl font-bold text-gray-900">{c.value}</p>
          </div>
        ))}
      </section>

      {/* Grafik */}
      <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {total === 0 ? (
          <p className="mt-4 rounded-lg bg-gray-50 p-8 text-center text-sm text-gray-500">
            Belum ada penjualan pada periode ini.
          </p>
        ) : (
          <div className="mt-4">
            <BarChart rows={rows} wide={period === "day"} />
          </div>
        )}
      </section>

      {/* Tabel laporan */}
      <section className="rounded-xl bg-white shadow-sm">
        <div className="p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">Rincian pendapatan dan tiket terjual untuk setiap periode.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-y border-gray-100 bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3">{firstColumn}</th>
                <th className="px-4 py-3 text-right">Tiket Terjual</th>
                <th className="px-4 py-3 text-right">Pendapatan</th>
                <th className="px-6 py-3 text-right">Kontribusi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r) => (
                <tr key={r.full} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-gray-900">{r.full}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{Math.round(r.revenue / AVG_PRICE).toLocaleString("id-ID")}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-gray-900">Rp {r.revenue.toLocaleString("id-ID")}</td>
                  <td className="px-6 py-3 text-right text-gray-500">{total > 0 ? ((r.revenue / total) * 100).toFixed(1) + "%" : "-"}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-gray-200 bg-gray-50 font-semibold text-gray-900">
              <tr>
                <td className="px-6 py-3">Total</td>
                <td className="px-4 py-3 text-right">{totalTickets.toLocaleString("id-ID")}</td>
                <td className="whitespace-nowrap px-4 py-3 text-right">Rp {total.toLocaleString("id-ID")}</td>
                <td className="px-6 py-3 text-right">{total > 0 ? "100%" : "-"}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}

// ===== 6. Tab TRANSAKSI  =====
function Transaksi() {
  return (
    <ViewTransactionsPage />
  );
}

// ===== 7. Halaman utama: tab + isi tab =====
export default function DashboardPage() {
  const [tab, setTab] = useState("ringkasan");

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Menu tab */}
      <nav className="flex overflow-x-auto border-b border-gray-200 bg-white px-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`whitespace-nowrap px-5 py-3 text-sm font-semibold ${
              tab === t.key ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {t.label}
            {t.key === "transaksi" && PENDING > 0 && (
              <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">{PENDING}</span>
            )}
          </button>
        ))}
      </nav>

      {tab === "ringkasan" && <Ringkasan goTo={setTab} />}
      {tab === "event" && <EventTab />}
      {tab === "statistik" && <Statistik />}
      {tab === "transaksi" && <Transaksi />}
    </div>
  );
}