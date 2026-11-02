'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';
import { categories } from '@/utils/categories';
import { useRouter } from 'next/navigation';
import { capitalize } from '@/utils/capitalize';

export default function Navbar() {
  const { id, username, imageUrl, clearAuth } = useAuthStore();
  const router = useRouter();

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
        <div className="flex gap-2">
          <ul className="menu menu-horizontal bg-white rounded-box">
            {/* <li>
              <details>
                <summary>Categories</summary>
                <ul className="p-2 bg-brand-100 w-40 z-1">
                  {categories.map((c, i) => (
                    <li key={i}>
                      <button
                        onClick={() => {
                          router.push(`/event?category=${c.cat}&page=1`);
                        }}
                      >
                        {capitalize(c.cat)}
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            </li> */}
            <li>
              <a href="/event">Cari Event</a>
            </li>
          </ul>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-600">
                  {username ? username[0].toUpperCase() : '?'}
                </div>
              </div>
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-brand-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                {id ? (
                  <a
                    href={`/profile/customer/${id}`}
                    className="justify-between"
                  >
                    Profile
                  </a>
                ) : (
                  <a href={`/login`} className="justify-between">
                    Login
                  </a>
                )}
              </li>
              <li>
                <a onClick={clearAuth} href="/">
                  My Transaction
                </a>
              </li>
              <li>
                <a onClick={clearAuth} href="/">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
