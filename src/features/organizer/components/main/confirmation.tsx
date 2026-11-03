'use client';

import IsLoading from '@/features/general/components/isLoadingImage';
import { useGetOrganizerEvents } from '@/hook/organizer/useGetOrganizerEvents';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ViewTransactionsPage() {
  const query = useSearchParams();
  const page = Number(query.get('page')) || 1;
  const { data, isLoading } = useGetOrganizerEvents({ page });
  const event = data?.data;
  const totalPage = data?.totalPage ?? 1;
  const router = useRouter();

  const goToPage = (p: number) => {
    const params = new URLSearchParams(query.toString());
    params.set('page', String(p));
    router.push(`/organizer/dashboard?${params.toString()}`);
  };

  if (isLoading) return <IsLoading />;

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-brand-200 lg:text-3xl">
          Konfirmasi Transaksi
        </h1>
        <div className="mt-5 flex items-center justify-between w-full h-fit p-2 md:p-3 bg-brand-300 rounded-t-xl">
          <h2 className="text-xs md:text-base font-semibold text-white">{`Halaman ${page} dari ${totalPage}`}</h2>
          <div className="join flex">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="bg-blue-200 text-brand-200 join-item btn btn-xs md:btn-sm"
            >
              «
            </button>
            <button className="bg-blue-200 text-brand-200 join-item btn btn-xs md:btn-sm">
              {`Hal. ${page}`}
            </button>
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPage}
              className="bg-blue-200 text-brand-200 join-item btn btn-xs md:btn-sm"
            >
              »
            </button>
          </div>
        </div>
        <section className="bg-white text-center shadow-sm">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-brand-400 text-black">
                <tr>
                  <th className="border-b border-gray-500"></th>
                  <th className="border-b border-gray-500">Nama</th>
                  <th className="border-b border-gray-500">Kategori</th>
                  <th className="border-b border-gray-500">Kota</th>
                  <th className="border-b border-gray-500">Transaksi</th>
                </tr>
              </thead>
              <tbody>
                {event.map((e: any, i: number) => (
                  <tr key={i}>
                    <th>{i + 1}</th>
                    <td>{e.name}</td>
                    <td>{e.category.replace('_', ' ')}</td>
                    <td>{e.city}</td>
                    <td>
                      <div className="indicator">
                        <a
                          className="px-2 py-1.5 bg-brand-300 text-xs text-white font-medium rounded-lg"
                          href={`/organizer/dashboard/confirmation/${e.id}`}
                        >
                          Lihat Detail
                        </a>
                        <span className="badge badge-xs indicator-item bg-red-500">
                          {e.transactions.length ?? 0}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
