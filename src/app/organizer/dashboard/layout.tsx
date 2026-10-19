"use client";

import { useEffect, useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Icon, { IconName } from "@/components/ui/icon";

// Ubah ke true kalau ingin halaman dashboard hanya bisa dibuka organizer yang sudah login.
// Sementara dibiarkan false supaya kamu bebas mengatur tampilan tanpa harus login dulu.
const PROTECT_ROUTE = false;

interface SessionUser {
  name: string;
  role: "CUSTOMER" | "ORGANIZER";
  avatarUrl: string | null;
}

// Dipakai kalau PROTECT_ROUTE = false dan belum ada yang login
const DEMO_USER: SessionUser = {
  name: "Sinar Event Organizer",
  role: "ORGANIZER",
  avatarUrl: null,
};

const MENU: { href: string; label: string; icon: IconName }[] = [
  { href: "/dashboard", label: "Ringkasan", icon: "home" },
  { href: "/dashboard/events", label: "Event Saya", icon: "calendar" },
  { href: "/dashboard/transactions", label: "Transaksi", icon: "card" },
  { href: "/dashboard/statistics", label: "Statistik", icon: "chart" },
  { href: "/profile", label: "Profil", icon: "user" },
];

function SidebarContent({
  user,
  pathname,
  onNavigate,
  onLogout,
}: {
  user: SessionUser;
  pathname: string;
  onNavigate: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-slate-900 text-slate-300">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center gap-3 px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-400 text-white">
          <Icon name="ticket" />
        </span>
        <span className="text-lg font-bold text-white">EventHub</span>
      </div>

      <p className="px-6 pb-2 pt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Menu Organizer
      </p>

      {/* Navigasi */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {MENU.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-indigo-600 text-white shadow"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon name={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Info user + keluar */}
      <div className="shrink-0 border-t border-slate-800 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-700 text-sm font-bold text-white">
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
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{user.name}</p>
            <p className="text-xs text-slate-400">Event Organizer</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800 hover:text-white"
        >
          <Icon name="logout" className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [open, setOpen] = useState(false); // drawer sidebar di HP & tablet

  // Cek siapa yang sedang login
  useEffect(() => {
    let current: SessionUser | null = null;
    try {
      const saved = localStorage.getItem("currentUser");
      if (saved) current = JSON.parse(saved);
    } catch {
      // abaikan, dianggap belum login
    }

    if (PROTECT_ROUTE && (!current || current.role !== "ORGANIZER")) {
      router.replace("/login");
      return;
    }
    setUser(current ?? DEMO_USER);
  }, [router]);

  // Tutup drawer dengan tombol Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handleLogout() {
    localStorage.removeItem("currentUser");
    router.push("/login");
  }

  if (!user) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  const sidebar = (
    <SidebarContent
      user={user}
      pathname={pathname}
      onNavigate={() => setOpen(false)}
      onLogout={handleLogout}
    />
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar desktop (tetap di kiri) */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-64">
        {sidebar}
      </aside>

      {/* Drawer HP & tablet */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebar}
      </aside>

      <div className="lg:pl-64">
        {/* Topbar HP & tablet */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-gray-200 bg-white px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Buka menu"
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
          >
            <Icon name="menu" />
          </button>
          <span className="flex items-center gap-2 font-bold text-gray-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-sky-400 text-white">
              <Icon name="ticket" className="h-4 w-4" />
            </span>
            EventHub
          </span>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}