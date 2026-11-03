const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200';

function StatCard({ label, value = '-' }: { label: string; value?: string }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 truncate text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-10 text-center text-sm text-gray-500">
        {text}
      </td>
    </tr>
  );
}

export default function PesertaContent() {
  return (
    <>
      <div className="space-y-6">
        <div>
          <button
            type="button"
            className="text-sm text-indigo-600 hover:underline"
          >
            &larr; Kembali ke Event Saya
          </button>
          <h1 className="mt-2 text-2xl font-bold text-gray-900 lg:text-3xl">
            Daftar Peserta
          </h1>
          <p className="mt-1 text-sm text-gray-500">Nama event · Tanggal</p>
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Jumlah Customer" />
          <StatCard label="Total Tiket" />
          <StatCard label="Total Pembayaran" />
        </section>

        <section className="rounded-xl bg-white p-4 shadow-sm">
          <input
            type="search"
            placeholder="Cari nama atau email peserta..."
            className={inputClass}
          />
        </section>

        <section className="rounded-xl bg-white shadow-sm">
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
                <EmptyRow colSpan={5} text="Belum ada peserta" />
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
