import Link from "next/link";

// Daftar pilihan role. Mau tambah/ubah teks cukup di sini.
const roles = [
  {
    title: "Customer",
    desc: "Cari event, beli tiket, dan dapatkan poin serta kupon dari referral.",
    href: "/register/customer", // alamat halaman register customer
    button: "Daftar sebagai Customer",
    color: "bg-green-600 hover:bg-green-700",
    badge: "bg-green-100 text-green-700",
  },
  {
    title: "Event Organizer",
    desc: "Buat dan promosikan event, kelola transaksi, dan pantau statistik.",
    href: "/register/organizer", // alamat halaman register organizer
    button: "Daftar sebagai Event Organizer",
    color: "bg-purple-600 hover:bg-purple-700",
    badge: "bg-purple-100 text-purple-700",
  },
];

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-3xl">
        {/* Judul */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Buat Akun Baru</h1>
          <p className="mt-2 text-sm text-gray-600">Pilih jenis akun yang ingin kamu buat.</p>
        </div>

        {/* Dua kartu pilihan */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6">
          {roles.map((role) => (
            <Link
              key={role.title}
              href={role.href}
              className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${role.badge}`}>
                {role.title}
              </span>
              <p className="mt-3 flex-1 text-sm text-gray-600">{role.desc}</p>
              <span className={`mt-6 rounded-lg py-2 text-center text-sm font-semibold text-white ${role.color}`}>
                {role.button}
              </span>
            </Link>
          ))}
        </div>

        {/* Tautan ke login */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </main>
  );
}