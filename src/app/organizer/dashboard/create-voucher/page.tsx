'use client';

import IsLoading from '@/features/general/components/isLoadingImage';
import { useGetEventForTicket } from '@/hook/event/useGetEventForTicket';
import { usegetOrganizerProfile } from '@/hook/organizer/useGetOrganizerProfile';
import { tanggal } from '@/utils/localDate';
import TicketAndVoucherHeader from '@/features/organizer/components/ticketAndVoucher/ticketAndVoucherHeader';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthGuard from '@/hoc/authGuard';

export default function VoucherPage() {
  return (
    <AuthGuard allowedRole={['ORGANIZER']}>
      <Suspense fallback={<IsLoading />}>
        <VoucherPageContent />
      </Suspense>
    </AuthGuard>
  );

  function VoucherPageContent() {
    const query = useSearchParams();
    const page = Number(query.get('page')) || 1;
    const { data, isLoading } = useGetEventForTicket({ page });
    const { data: organizer = [] } = usegetOrganizerProfile();
    const totalPage = data?.totalPage;
    const router = useRouter();

    const goToPage = (p: number) => {
      const params = new URLSearchParams(query.toString());
      params.set('page', String(p));
      router.push(`/organizer/dashboard/create-voucher?${params.toString()}`);
    };
    if (isLoading) return <IsLoading />;

    return (
      <>
        <div className="m-2 lg:mx-25 lg:my-10">
          <TicketAndVoucherHeader
            title="Buat Voucher Untuk Event Saya"
            organizer={organizer}
          />
          <div className="flex items-center justify-between w-full h-fit p-2 md:p-3 bg-brand-400 border-x">
            <h2 className="text-xs md:text-base font-semibold">{`Halaman ${page} dari ${totalPage}`}</h2>
            <div className="join flex">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="bg-blue-200 text-blue-950 join-item btn btn-xs md:btn-sm"
              >
                «
              </button>
              <button className="bg-blue-200 text-blue-950 join-item btn btn-xs md:btn-sm">
                {`Hal. ${page}`}
              </button>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPage}
                className="bg-blue-200 text-blue-950 join-item btn btn-xs md:btn-sm"
              >
                »
              </button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-b-xl border border-gray-400 bg-white shadow-lg">
            <table className="table table-xs md:table-sm lg:table-md table-pin-rows">
              <thead className="text-black border-b border-gray-500 text-xs">
                <tr>
                  <th className="border-b border-gray-400 bg-white"></th>
                  <th className="border-b border-gray-400 bg-white">Nama</th>
                  <th className="border-b border-gray-400 bg-white">
                    Kategori
                  </th>
                  <th className="border-b border-gray-400 bg-white">Kota</th>
                  <th className="border-b border-gray-400 bg-white">
                    Tanggal Mulai
                  </th>
                  <th className="border-b border-gray-400 bg-white">
                    Voucher Dibuat
                  </th>
                  <th className="border-b border-gray-400 bg-white">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((e: any, i: number) => (
                  <tr key={i}>
                    <th>{i + 1}</th>
                    <td>{e.name}</td>
                    <td>{e.category.replace('_', ' ')}</td>
                    <td>{e.city}</td>
                    <td>{tanggal.format(new Date(e.startDate))}</td>
                    <td>{e.vouchers.length}</td>
                    <td>
                      <a
                        className="px-2 py-1.5 bg-brand-400 text-brand-200 text-xs font-medium rounded-lg"
                        href={`/organizer/dashboard/create-voucher/${e.id}`}
                      >
                        Buat
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}
