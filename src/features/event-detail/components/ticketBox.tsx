'use client';

import { rupiah } from '@/components/idr';
import { axiosInstance } from '@/lib/axiosInstance.lib';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import { LuTicket } from 'react-icons/lu';

export default function TicketBox() {
  return (
    <Suspense fallback={''}>
      <TicketForm />
    </Suspense>
  );

  function TicketForm() {
    const params = useParams<{ eventId: string }>();
    const { data: ticket = [], isLoading } = useQuery({
      queryKey: ['ticket'],
      queryFn: async () => {
        const res = await axiosInstance.get(`/tickets/${params.eventId}`);

        return res?.data?.data;
      },
      retry: false,
    });

    if (isLoading) return <p>Menunggu data</p>;
    return (
      <>
        <div className="mt-10 flex gap-2 items-center text-2xl font-bold">
          <LuTicket />
          <h1 className="tracking-wide">Ticket</h1>
        </div>
        <div className="mt-2 collapse bg-white border shadow-lg">
          <input type="checkbox" />
          <div className="collapse-title font-semiboldrounded-md">
            <h1 className="font-bold text-2xl">Online Sales</h1>
            <h3 className="text-gray-500 font-medium">
              {`Choose your ticket based on the list below`}
            </h3>
          </div>
          <div className="collapse-content text-sm">
            <p>
              _________________________________________________________________________________________________________________________________
            </p>
            {ticket.map((item: any, index: any) => (
              <div
                key={index}
                className="mt-5 grid grid-cols-[1fr_1fr_auto] items-center gap-4"
              >
                <div className="text-xl">
                  <h1>{rupiah.format(item?.price)}</h1>
                </div>
                <div>
                  <h2 className="text-xl font-medium">{item?.name}</h2>
                </div>
                <p
                  className={`px-3 py-0.5 rounded-full glass text-white ${
                    item?.available <= 0 ? 'bg-red-500' : 'bg-green-500'
                  }`}
                >
                  {item?.available <= 0 ? 'Sold out' : 'Available'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
}
