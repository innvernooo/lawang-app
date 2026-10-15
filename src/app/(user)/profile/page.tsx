"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

 

  function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("File harus berupa gambar.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setMessage("Ukuran foto maksimal 2 MB.");
      return;
    }
    setMessage("");
    setAvatarPreview(URL.createObjectURL(file)); // hanya preview lokal
  }

  // Submit form hanya membuka popup konfirmasi
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !email.includes("@")) {
      setMessage("Nama dan email wajib diisi dengan benar.");
      return;
    }
    setMessage("");
    setShowConfirm(true);
  }

  // Penyimpanan sebenarnya terjadi setelah user menekan "Ya"
  async function handleConfirm() {
    setIsSaving(true);
    setIsSaving(false);
    setShowConfirm(false);
    setMessage("Profil berhasil diperbarui.");
  }

  async function handleCopy() {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Tampilan loading (skeleton sederhana)
  

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-4 sm:p-8">
      <h1 className="text-2xl font-bold text-black">Profil Saya</h1>

      {/* Kartu kode referral */}
      <section className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm text-gray-600">Kode referral kamu</p>
        <div className="mt-1 flex items-center justify-between gap-3">
          <span className="text-xl font-bold tracking-widest text-blue-700">
          </span>
          <button
            onClick={handleCopy}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {copied ? "Tersalin!" : "Salin"}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Kode ini permanen dan tidak bisa diubah.
        </p>
      </section>

      {/* Form edit profil */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl bg-white p-6 shadow-md"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-2xl font-bold text-gray-500">
            {avatarPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarPreview}
                alt="Foto profil"
                className="h-full w-full object-cover"
              />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </div>
          <label className="cursor-pointer rounded-lg border border-blue-700 px-3 py-2 text-sm hover:bg-blue-500">
            Ganti foto
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            Nama
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-blue-500 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {message && (
          <p className="rounded-lg bg-gray-100 p-3 text-sm text-gray-700">
            {message}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto sm:px-6"
        >
          Simpan Perubahan
        </button>
      </form>

    </main>
  );
}