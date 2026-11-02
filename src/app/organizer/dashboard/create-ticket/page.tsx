'use client';

import IsLoading from '@/features/general/components/isLoadingImage';
import { useGetEventForTicket } from '@/hook/event/useGetEventForTicket';
import { usegetOrganizerProfile } from '@/hook/organizer/useGetOrganizerProfile';
import { tanggal } from '@/utils/localDate';
import { CgProfile } from 'react-icons/cg';
import { MdOutlineMail } from 'react-icons/md';
import { LiaMaskSolid } from 'react-icons/lia';

export default function TicketPage() {
  const { data: event, isLoading } = useGetEventForTicket();
  const { data: organizer = [] } = usegetOrganizerProfile();

  if (isLoading) return <IsLoading />;

  return (
    <>
      <div className="m-2 lg:mx-25 lg:my-10">
        <div className="w-full h-fit p-4 bg-linear-to-r from-brand-100 to-brand-300 glass text-white shadow-lg rounded-t-xl">
          <h1 className="font-bold text-xl md:text-2xl lg:text-3xl">
            Event Berbayar Saya
          </h1>
          <div className="mt-3 flex gap-2 items-center text-sm md:text-base lg:text-lg">
            <CgProfile />
            <h2>{organizer.organizerName}</h2>
          </div>
          <div className="flex gap-2 items-center text-sm md:text-base lg:text-lg">
            <MdOutlineMail />
            <h2>{organizer.email}</h2>
          </div>
          <div className="flex gap-2 items-center text-sm md:text-base lg:text-lg">
            <LiaMaskSolid />
            <h2>{organizer.username}</h2>
          </div>
        </div>
        <div className="overflow-x-auto rounded-b-xl border border-gray-400 bg-white shadow-lg">
          <table className="table table-xs md:table-sm lg:table-md table-pin-rows">
            <thead className="text-black border-b border-gray-500 text-xs">
              <tr>
                <th className="border-b border-gray-400 bg-white"></th>
                <th className="border-b border-gray-400 bg-white">Name</th>
                <th className="border-b border-gray-400 bg-white">Category</th>
                <th className="border-b border-gray-400 bg-white">City</th>
                <th className="border-b border-gray-400 bg-white">
                  Start Date
                </th>
                <th className="border-b border-gray-400 bg-white">
                  Ticket Made
                </th>
                <th className="border-b border-gray-400 bg-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {event.map((e: any, i: number) => (
                <tr key={i}>
                  <th>{i + 1}</th>
                  <td>{e.name}</td>
                  <td>{e.category}</td>
                  <td>{e.city}</td>
                  <td>{tanggal.format(new Date(e.startDate))}</td>
                  <td>{e.ticketTypes.length}</td>
                  <td>
                    <a
                      className="px-2 py-1.5 bg-green-400 text-black glass text-xs font-medium rounded-full"
                      href={`/organizer/dashboard/create-ticket/${e.id}`}
                    >
                      Create
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
