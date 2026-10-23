'use client';

import { axiosInstance } from '@/lib/axiosInstance.lib';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import { IoIosTime } from 'react-icons/io';
import { MdDateRange } from 'react-icons/md';

export default function EventBanner() {
  return (
    <Suspense fallback={''}>
      <EventBox />
    </Suspense>
  );

  function EventBox() {
    const params = useParams<{ eventId: string }>();
    console.log(params);

    const {
      data: event,
      isLoading,
      isError,
    } = useQuery({
      queryKey: ['event-detail', params.eventId],
      queryFn: async () => {
        const res = await axiosInstance.get(
          `/events/eventDetail/${params.eventId}`,
        );

        return res?.data?.data;
      },
      retry: false,
    });

    if (isLoading) return <p>Memuat data</p>;
    return (
      <>
        <Image
          src={event?.imageUrl ?? '/download.jpg'}
          alt="Event"
          width={736}
          height={368}
          className="w-full h-120 rounded-2xl shadow-lg"
        />
        <h1 className="mt-5 text-2xl font-extrabold tracking-wide">
          {event?.name}
        </h1>
        <div className="mt-2 flex text-lg gap-2 items-center">
          <FaLocationDot />
          <h2 className="font-medium">
            {event?.city} | {event?.venue}
          </h2>
        </div>
        <div className="mt-2 flex text-lg gap-2 items-center">
          <MdDateRange />
          <h2 className="font-medium">
            {format(new Date(event?.startDate), 'dd MMMM yyyy')}
          </h2>
        </div>
        <div className="mt-2 flex text-lg gap-2 items-center">
          <IoIosTime />
          <h2 className="font-medium">
            {format(new Date(event?.startDate), 'HH:mm')} WIB
          </h2>
        </div>
        <div className="mt-8 text-lg">{event.description}</div>
      </>
    );
  }
}
