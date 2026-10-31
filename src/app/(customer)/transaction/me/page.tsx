'use client';

import IsLoading from '@/features/general/components/isLoadingImage';
import { useGetCustomerTrans } from '@/hook/transaction/useGetCustomerTrans';
import { CgProfile } from 'react-icons/cg';
import { MdOutlineMail } from 'react-icons/md';
import { LiaMaskSolid } from 'react-icons/lia';
import { rupiah } from '@/utils/idr';
import { capitalize } from '@/utils/capitalize';
import { tanggal } from '@/utils/localDate';

export default function TransactionListPage() {
  const { data, isLoading } = useGetCustomerTrans();

  if (isLoading) return <IsLoading />;
  console.log(data);

  return (
    <>
      <div className="lg:px-20">
        <div className="w-full h-fit p-4 bg-brand-100 shadow-lg rounded-t-xl">
          <h1 className="font-bold text-xl md:text-2xl lg:text-3xl">
            Transaksi Saya
          </h1>
          <div className="mt-3 flex gap-2 items-center text-sm md:text-base lg:text-lg">
            <CgProfile />
            <h2>{data?.customer.name}</h2>
          </div>
          <div className="flex gap-2 items-center text-sm md:text-base lg:text-lg">
            <MdOutlineMail />
            <h2>{data?.customer.email}</h2>
          </div>
          <div className="flex gap-2 items-center text-sm md:text-base lg:text-lg">
            <LiaMaskSolid />
            <h2>{data?.customer.username}</h2>
          </div>
          <label className="label md:flex md:justify-end text-[10px] md:text-[11px] lg:text-sm text-red-400 italic">
            Klik pada <span className="underline">Waiting payment</span> untuk
            meyelesaikan pembayaran
          </label>
        </div>
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
              {data?.transaction.map((t: any, i: number) => (
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
