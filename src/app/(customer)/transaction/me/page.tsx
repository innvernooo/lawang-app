'use client';

import IsLoading from '@/features/general/components/isLoadingImage';
import { useGetCustomerTrans } from '@/hook/transaction/useGetCustomerTrans';
import { rupiah } from '@/utils/idr';
import { capitalize } from '@/utils/capitalize';
import { tanggal } from '@/utils/localDate';
import TransactionHeader from '@/features/customer/components/transactionHeader';
import WithAuthGuard from '@/hoc/withAuthGuard';
import { useRouter, useSearchParams } from 'next/navigation';

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
  console.log(totalPage)

  return (
    <>
      <div className="lg:px-20">
        <TransactionHeader customer={data?.customer} />
        <div className="overflow-x-auto rounded-b-xl border border-gray-400 bg-white shadow-lg">
          <table className="table table-xs md:table-sm lg:table-md table-pin-rows">
            <thead className="text-black border-b border-gray-500 text-xs">
              <tr>
                <th className="border-b border-gray-400 bg-white"></th>
                <th className="border-b border-gray-400 bg-white">Event</th>
                <th className="border-b border-gray-400 bg-white">Category</th>
                <th className="border-b border-gray-400 bg-white">
                  Pricing Type
                </th>
                <th className="border-b border-gray-400 bg-white">
                  Ticket Qty.
                </th>
                <th className="border-b border-gray-400 bg-white">
                  Total Price
                </th>
                <th className="border-b border-gray-400 bg-white">Date</th>
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
                  <td>{capitalize(t.event.pricingType)}</td>
                  <td>{t.quantity}</td>
                  <td>{rupiah.format(t.totalPrice)}</td>
                  <td>{tanggal.format(new Date(t.createdAt))}</td>
                  <td>
                    {t.status === 'WAITING_PAYMENT' ? (
                      <a
                        className="text-red-500 underline"
                        href={`/event/payment/${t.id}`}
                      >
                        {capitalize(t.status).replace('_', ' ')}
                      </a>
                    ) : t.status === 'DONE' ? (
                      <a className="text-green-500">
                        {capitalize(t.status).replace('_', ' ')}
                      </a>
                    ) : (
                      capitalize(t.status).replace('_', ' ')
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="w-full p-3 join flex justify-end">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="bg-blue-200 text-blue-950 join-item btn btn-sm"
            >
              «
            </button>
            <button className="bg-blue-200 text-blue-950 join-item btn btn-sm">
              {`Page ${page}`}
            </button>
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPage}
              className="bg-blue-200 text-blue-950 join-item btn btn-sm"
            >
              »
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default WithAuthGuard(TransactionListPage, ['CUSTOMER']);
