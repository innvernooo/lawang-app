'use client';

import { useEffect, useState, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// true = hanya organizer yang sudah login yang bisa membuka dashboard
const PROTECT_ROUTE = false;

// Alamat halaman profil organizer. Sesuaikan dengan letak folder profile kamu.
const PROFILE_URL = '/profile/organizer';

type User = { name: string; role: string; avatarUrl: string | null };

// Dipakai kalau belum login (khusus saat PROTECT_ROUTE = false)
const demoUser: User = {
  name: 'Sinar Event Organizer',
  role: 'ORGANIZER',
  avatarUrl: null,
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Cek siapa yang sedang login
  useEffect(() => {
    let current: User | null = null;
    try {
      const saved = localStorage.getItem('currentUser');
      if (saved) current = JSON.parse(saved);
    } catch {
      // dianggap belum login
    }
    if (PROTECT_ROUTE && (!current || current.role !== 'ORGANIZER')) {
      router.replace('/login');
      return;
    }
    setUser(current ?? demoUser);
  }, [router]);

  function logout() {
    localStorage.removeItem('currentUser');
    router.push('/login');
  }

  if (!user) return <div className="min-h-screen bg-gray-50" />;

  return (
    <>
      <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
        {/* Navbar */}
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <Image 
              src="/lawang.svg" 
              alt="Lawang Logo" 
              width={120} 
               height={35} 
               className="h-8 w-auto object-contain"
                priority
              />
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100"
              >
                <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-indigo-600 text-sm font-bold text-white">
                  {user.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </span>
                <span className="hidden max-w-40 truncate text-sm font-medium md:block">
                  {user.name}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                  <Link
                    href={PROFILE_URL}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Profil Saya
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="block w-full border-t border-gray-100 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Isi halaman */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-5 text-xs text-gray-500 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
            <p>
              © {new Date().getFullYear()} Lawang.id platform penjualan
              ticketing event didirikan pada tahun 2026
            </p>
            <p>
              Bukti bayar diunggah maks. 15 menit setelah checkout. Semua harga
              dalam Rupiah (IDR).
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}