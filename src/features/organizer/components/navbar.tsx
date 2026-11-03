'use client';

import Image from 'next/image';
import { FaPlus } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { useAuthStore } from '@/stores/useAuthStore';
import { LuMessageCircleQuestion } from 'react-icons/lu';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axiosInstance.lib';
import { GiTalk } from 'react-icons/gi';
import { useRouter } from 'next/navigation';

export default function OrganizerNavbar() {
  const { name, role, clearAuth } = useAuthStore();
  const router = useRouter();
  const handleLogout = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post('/auth/logout');

      return res?.data;
    },
    onSuccess: () => {
      clearAuth();
      router.push('/login');
    },
  });

  return (
    <>
      <div className="navbar bg-white shadow-sm sticky z-50 top-0">
        <div className="navbar-start">
          <a href={'/organizer/dashboard'}>
            <Image
              src={'/lawang.svg'}
              alt="Logo Lawang"
              width={100}
              height={100}
              className="md:w-33 lg:w-30"
            />
          </a>
        </div>
        <div
          className={`navbar-center ${role === 'CUSTOMER' ? 'hidden' : 'hidden md:flex'}`}
        >
          <ul className="menu menu-horizontal px-1 font-semibold text-brand-200">
            <li>
              <div className="hover:text-yellow-600">
                <FaPlus />
                <a href="/organizer/dashboard/create-event">Event</a>
              </div>
            </li>
            <li>
              <div className="hover:text-yellow-600">
                <FaPlus />
                <a href="/organizer/dashboard/create-ticket">Tiket</a>
              </div>
            </li>
            <li>
              <div className="hover:text-yellow-600">
                <FaPlus />
                <a href="/organizer/dashboard/create-voucher">Voucher</a>
              </div>
            </li>
            <li>
              <div className="hover:text-yellow-600">
                <GiTalk />
                <a href="/organizer/dashboard/review">Ulasan</a>
              </div>
            </li>
          </ul>
        </div>
        <div
          className={`navbar-end ${role === 'CUSTOMER' ? 'hidden' : 'flex'}`}
        >
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
                <a href="/profile/organizer/me" className="flex items-center">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img alt={name} src="/eo.svg" />
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
                  href="/organizer/dashboard"
                  className="mt-2 btn w-full bg-blue-200 text-blue-700"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/organizer/dashboard/review"
                  className="my-2 btn w-full bg-blue-200 text-blue-700"
                >
                  Ulasan Event
                </a>
              </li>
              <li className="md:hidden">
                <a
                  href="/organizer/dashboard/create-event"
                  className="mb-2 btn w-full bg-blue-200 text-blue-700"
                >
                  Buat Event
                </a>
              </li>
              <li className="md:hidden">
                <a
                  href="/organizer/dashboard/create-ticket"
                  className="mb-2 btn w-full bg-blue-200 text-blue-700"
                >
                  Buat Tiket
                </a>
              </li>
              <li className="md:hidden">
                <a
                  href="/organizer/dashboard/create-voucher"
                  className="mb-2 btn w-full bg-blue-200 text-blue-700"
                >
                  Buat Voucher
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
      </div>
    </>
  );
}
