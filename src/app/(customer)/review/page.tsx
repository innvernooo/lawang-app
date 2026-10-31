'use client';

import { CgProfile } from 'react-icons/cg';
import { MdOutlineMail } from 'react-icons/md';
import { LiaMaskSolid } from 'react-icons/lia';
import IsLoading from '@/features/general/components/isLoadingImage';
import { tanggal } from '@/utils/localDate';
import { useGetEventByCustomer } from '@/hook/event/useGetEventByCustomer';

export default function ReviewPage() {
  const { data, isLoading } = useGetEventByCustomer();

  if (isLoading) return <IsLoading />;
  console.log(data);

  return (
    <>
      <div className="lg:px-20">
        <div className="w-full h-fit p-4 bg-brand-100 shadow-lg rounded-t-xl">
          <h1 className="font-bold text-xl md:text-2xl lg:text-3xl">
            Event Yang Saya Hadiri
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
            Klik pada <span className="underline">Beri rating</span> untuk
            memberikan penilaian
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
                  Start Date
                </th>
                <th className="border-b border-gray-400 bg-white">End Date</th>
                <th className="border-b border-gray-400 bg-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((e: any, i: number) => (
                <tr key={i}>
                  <th className="bg-white">{i + 1}</th>
                  <td className="line-clamp-2 md:line-clamp-none">
                    {e.event.name}
                  </td>
                  <td>{e.event.category.replace('_', ' ')}</td>
                  <td>{tanggal.format(new Date(e.event.startDate))}</td>
                  <td>{tanggal.format(new Date(e.event.endDate))}</td>
                  <td>
                    {new Date(e.event.endDate) < new Date() ? (
                      <a href={`/review/${e.event.slug}`}>Beri rating</a>
                    ) : (
                      'Event Belum Selesai'
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
