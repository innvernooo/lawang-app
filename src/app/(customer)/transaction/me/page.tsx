'use client';

import IsLoading from '@/features/general/components/isLoadingImage';
import { useGetCustomerTrans } from '@/hook/transaction/useGetCustomerTrans';
import { rupiah } from '@/utils/idr';
import { tanggal } from '@/utils/localDate';
import TransactionHeader from '@/features/customer/components/transactionHeader';
import WithAuthGuard from '@/hoc/withAuthGuard';
import { useRouter, useSearchParams } from 'next/navigation';

const STATUS_LABEL: Record<string, string> = {
  WAITING_PAYMENT: 'Menunggu Pembayaran',
  WAITING_CONFIRMATION: 'Menunggu Konfirmasi',
  DONE: 'Selesai',
  REJECTED: 'Ditolak',
  EXPIRED: 'Kedaluwarsa',
  CANCELED: 'Dibatalkan',
};

function TransactionListPage() {
  const router = useRouter();
  const query = useSearchParams();
  const page = Number(query.get('page')) || 1;
  const { data, isLoading } = useGetCustomerTrans({ page });
  const transaction = data?.transaction;
  const totalPage = data?.meta ?? 1;

  const goToPage = (p: number) => {
    const params = new URLSearchParams(query.toString());
    params.set('page', String(p));
    router.push(`/transaction/me?${params.toString()}`);
  };

  if (isLoading) return <IsLoading />;

  return (
    <>
      <div className="lg:px-20">
        <TransactionHeader customer={data?.customer} />
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
                <th className="border-b border-gray-400 bg-white">Event</th>
                <th className="border-b border-gray-400 bg-white">Kategori</th>
                <th className="border-b border-gray-400 bg-white">
                  Jenis Harga
                </th>
                <th className="border-b border-gray-400 bg-white">
                  Jumlah Tiket
                </th>
                <th className="border-b border-gray-400 bg-white">
                  Total Harga
                </th>
                <th className="border-b border-gray-400 bg-white">Tanggal</th>
                <th className="border-b border-gray-400 bg-white">Status</th>
              </tr>
            </thead>
            <tbody>
              {transaction?.map((t: any, i: number) => (
                <tr key={i}>
                  <th className="bg-white">{i + 1}</th>
                  <td className="line-clamp-2 md:line-clamp-none">
                    {t.event.name}
                  </td>
                  <td>{t.event.category.replace('_', ' ')}</td>
                  <td>
                    {t.event.pricingType === 'FREE' ? 'Gratis' : 'Berbayar'}
                  </td>
                  <td>{t.quantity}</td>
                  <td>{rupiah.format(t.totalPrice)}</td>
                  <td>{tanggal.format(new Date(t.createdAt))}</td>
                  <td>
                    {t.status === 'WAITING_PAYMENT' ? (
                      <a
                        className="text-red-500 underline"
                        href={`/event/payment/${t.id}`}
                      >
                        {STATUS_LABEL[t.status] ?? t.status}
                      </a>
                    ) : t.status === 'DONE' ? (
                      <a className="text-green-500">
                        {STATUS_LABEL[t.status] ?? t.status}
                      </a>
                    ) : (
                      (STATUS_LABEL[t.status] ?? t.status)
                    )}
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

export default WithAuthGuard(TransactionListPage, ['CUSTOMER']);
