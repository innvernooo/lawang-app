import { useAuthStore } from '@/stores/useAuthStore';

function StatCard({ label, value = '-' }: { label: string; value?: string }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 truncate text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

// Tempat grafik
function ChartPlaceholder() {
  return (
    <div className="flex h-56 items-center justify-center rounded-lg border border-dashed border-gray-200 text-sm text-gray-400">
      Grafik
    </div>
  );
}

export default function RingkasanContent() {
  const { name } = useAuthStore();

  return (
    <>
      <div className="space-y-6">
        {/* Sambutan */}
        <section className="rounded-xl bg-brand-200 p-6 text-white shadow">
          <h1 className="text-2xl font-bold sm:text-3xl">Halo, {name}!</h1>
          <p className="mt-1 text-sm text-indigo-100">
            Pantau penjualan tiket dan kelola semua event kamu dalam satu
            tempat.
          </p>
        </section>

        {/* Pengingat transaksi */}
        <section className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-amber-900">
              - transaksi menunggu konfirmasi kamu
            </p>
            <p className="text-sm text-amber-800">
              Segera terima atau tolak. Jika lewat 15 menit, transaksi
              dibatalkan otomatis.
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
          >
            Tinjau Sekarang
          </button>
        </section>

        {/* Kartu statistik */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Pendapatan" />
          <StatCard label="Tiket Terjual" />
          <StatCard label="Event Aktif" />
          <StatCard label="Perlu Konfirmasi" />
        </section>

        <div className="grid gap-6 xl:grid-cols-3">
          {/* Grafik bulanan */}
          <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Pendapatan per Bulan
            </h2>
            <div className="mt-4">
              <ChartPlaceholder />
            </div>
          </section>

          {/* Event mendatang */}
          <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Event Mendatang
            </h2>
            <ul className="mt-4 space-y-4">
              <li>
                <p className="truncate text-sm font-semibold text-gray-900">
                  Nama event
                </p>
                <p className="text-xs text-gray-500">Tanggal · Lokasi</p>
                <div className="mt-2 h-2 rounded-full bg-gray-100">
                  <div className="h-2 w-0 rounded-full bg-indigo-500" />
                </div>
                <p className="mt-1 text-xs text-gray-500">-/- kursi terisi</p>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
