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

// Baris kosong untuk tabel
function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-10 text-center text-sm text-gray-500">
        {text}
      </td>
    </tr>
  );
}

export default function StatistikContent() {
  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
            Statistik Penjualan
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Pantau pendapatan dan tiket terjual per tahun, bulan, atau hari.
          </p>
        </div>

        {/* Pilihan periode */}
        <section className="flex flex-wrap items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
          <div className="flex overflow-hidden rounded-lg border border-gray-300">
            {['Hari', 'Bulan', 'Tahun'].map((label) => (
              <button
                key={label}
                type="button"
                className="bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {label}
              </button>
            ))}
          </div>

          <select className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900">
            <option>Tahun</option>
          </select>
          <select className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900">
            <option>Bulan</option>
          </select>

          <button
            type="button"
            className="ml-auto rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-40"
          >
            Unduh Laporan (CSV)
          </button>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Pendapatan" />
          <StatCard label="Tiket Terjual" />
          <StatCard label="Periode Terbaik" />
          <StatCard label="Rata-rata per Periode" />
        </section>

        {/* Grafik */}
        <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Laporan Penjualan
          </h2>
          <div className="mt-4">
            <ChartPlaceholder />
          </div>
        </section>

        {/* Tabel laporan */}
        <section className="rounded-xl bg-white shadow-sm">
          <div className="p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Laporan Penjualan
            </h2>
            <p className="text-sm text-gray-500">
              Rincian pendapatan dan tiket terjual untuk setiap periode.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-y border-gray-100 bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3">Periode</th>
                  <th className="px-4 py-3 text-right">Tiket Terjual</th>
                  <th className="px-4 py-3 text-right">Pendapatan</th>
                  <th className="px-6 py-3 text-right">Kontribusi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <EmptyRow
                  colSpan={4}
                  text="Belum ada penjualan pada periode ini"
                />
              </tbody>
              <tfoot className="border-t border-gray-200 bg-gray-50 font-semibold text-gray-900">
                <tr>
                  <td className="px-6 py-3">Total</td>
                  <td className="px-4 py-3 text-right">-</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">-</td>
                  <td className="px-6 py-3 text-right">-</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
