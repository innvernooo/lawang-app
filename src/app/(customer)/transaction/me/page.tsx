'use client';

import IsLoading from '@/features/general/components/isLoadingImage';
import { useGetCustomerTrans } from '@/hook/transaction/useGetCustomerTrans';
import { rupiah } from '@/utils/idr';
import { capitalize } from '@/utils/capitalize';
import { tanggal } from '@/utils/localDate';
import TransactionHeader from '@/features/customer/components/transactionHeader';
import WithAuthGuard from '@/hoc/withAuthGuard';

function TransactionListPage() {
  const { data, isLoading } = useGetCustomerTrans();
  const transaction = data?.transaction;

  if (isLoading) return <IsLoading />;

  return (
    <>
      <div className="lg:px-20">
        <TransactionHeader />
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
              {transaction.map((t: any, i: number) => (
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
        </div>
      </div>
    </>
  );
}

export default WithAuthGuard(TransactionListPage, ['CUSTOMER']);
