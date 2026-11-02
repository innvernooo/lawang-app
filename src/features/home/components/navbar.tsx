'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import Image from 'next/image';
import { CgProfile } from 'react-icons/cg';
import { LuMessageCircleQuestion } from 'react-icons/lu';
import { FaSearch } from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axiosInstance.lib';

export default function Navbar() {
  const { id, name, role, clearAuth } = useAuthStore();
  const handleLogout = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post('/auth/logout');

      return res?.data;
    }, onSuccess: () => {
      clearAuth()
    }
  });

  return (
    <>
      <div className="navbar flex justify-between bg-white shadow-sm top-0 sticky z-50">
        <a href={'/'}>
          <Image
            src={'/lawang.svg'}
            alt="Lawang logo"
            width={100}
            height={100}
            className="md:w-33 lg:w-30"
          />
        </a>
        {id ? (
          <div className={role === 'CUSTOMER' ? 'flex' : 'hidden'}>
            <ul className="menu menu-horizontal bg-white rounded-box">
              <li>
                <a
                  href="/event"
                  className="flex items-center text-brand-200 font-semibold hover:text-yellow-500"
                >
                  <FaSearch />
                  <p>Cari Event</p>
                </a>
              </li>
            </ul>
            <div className="dropdown dropdown-end lg:mr-5">
              <div
                tabIndex={0}
                role="button"
                className="btn m-1 rounded-full text-white hover:text-yellow-500 bg-brand-200"
              >
                <CgProfile />
                <h1>Akun</h1>
              </div>
              <ul
                tabIndex={-1}
                className="dropdown-content menu bg-white rounded-box w-50 p-2"
              >
                <li>
                  <a
                    href={`/profile/customer/${id}`}
                    className="flex items-center"
                  >
                    <div className="avatar">
                      <div className="w-10 rounded-full">
                        <img alt={name} src="/cus.svg" />
                      </div>
                    </div>
                    <div>
                      <h2 className="line-clamp-1">{name}</h2>
                      <label className="label text-xs">Lihat profil</label>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href="/transaction/me"
                    className="mt-2 btn w-full bg-blue-200 text-blue-700"
                  >
                    Transaksi Saya
                  </a>
                </li>
                <li>
                  <a
                    href="/review"
                    className="my-2 btn w-full bg-blue-200 text-blue-700"
                  >
                    Review Event
                  </a>
                </li>
                <li>
                  <a
                    className="btn btn-error w-full text-white"
                    onClick={() => handleLogout.mutate()}
                  >
                    Keluar
                  </a>
                </li>
                <li>
                  <div className="mt-2 flex gap-2 items-center text-base">
                    <LuMessageCircleQuestion />
                    <h2>Pusat Bantuan</h2>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="dropdown dropdown-end lg:mr-5">
            <div
              tabIndex={0}
              role="button"
              className="btn m-1 rounded-full text-white bg-brand-200"
            >
              <CgProfile />
              <h1>Akun</h1>
            </div>
            <ul
              tabIndex={-1}
              className="dropdown-content menu bg-white rounded-box w-40 md:w-50 p-2"
            >
              <li>
                <a
                  href="/register"
                  className="mt-3 btn w-full bg-blue-200 text-black"
                >
                  Daftar
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="my-3 btn w-full bg-blue-700 text-white"
                >
                  Masuk
                </a>
              </li>
              <li>
                <div className="flex gap-2 items-center text-base">
                  <LuMessageCircleQuestion />
                  <h2>Pusat Bantuan</h2>
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
