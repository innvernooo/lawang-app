'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import Image from 'next/image';

export default function Navbar() {
  const { id } = useAuthStore();

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
          <input
            type="text"
            placeholder="Search"
            className="input w-24 md:w-auto bg-white border-black text-black"
          />
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-white rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a href={`/profile/customer/${id}`} className="justify-between">
                  Profile
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
