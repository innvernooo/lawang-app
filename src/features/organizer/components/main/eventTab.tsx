'use client';

import IsLoading from '@/features/general/components/isLoadingImage';
import { useGetOrganizerEvents } from '@/hook/organizer/useGetOrganizerEvents';
import { tanggal } from '@/utils/localDate';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-10 text-center text-sm text-gray-500">
        {text}
      </td>
    </tr>
  );
}

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200';

export default function EventTabContent() {
  const query = useSearchParams();
  const page = Number(query.get('page')) || 1;

  const { data: event, isLoading } = useGetOrganizerEvents({ page });

  if (isLoading) return <IsLoading />;

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
              Event Saya
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Daftar semua event yang kamu buat sebagai Event Organizer.
            </p>
          </div>
          <Link
            href="/organizer/dashboard/create-event"
            className="rounded-lg bg-brand-300 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-200"
          >
            + Buat Event
          </Link>
        </div>

        <section className="rounded-xl bg-white p-4 shadow-sm">
          <input
            type="search"
            placeholder="Cari nama event atau lokasi..."
            className={inputClass}
          />
        </section>

        <section className="rounded-xl bg-white h-fit shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-100 bg-gray-50 uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3">Event</th>
                  <th className="px-4 py-3">Tanggal Mulai</th>
                  <th className="px-4 py-3">Kota</th>
                  <th className="px-4 py-3">Lokasi</th>
                  <th className="px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {event?.data?.length > 0 ? (
                  event.data.map((e: any, i: number) => (
                    <tr key={i}>
                      <td>{e.name}</td>
                      <td>{tanggal.format(new Date(e.startDate))}</td>
                      <td>{e.city}</td>
                      <td>{e.venue}</td>
                      <td>
                        <a className='text-brand-200'>Peserta</a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <EmptyRow colSpan={5} text="Belum ada event" />
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
