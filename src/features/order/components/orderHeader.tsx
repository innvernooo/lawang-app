import { useGetEventBySlug } from '@/hook/event/useGetEventBySlug';
import Image from 'next/image';
import { tanggal } from '@/utils/localDate';
import { jam } from '@/utils/localTime';
import { IoLocationOutline } from 'react-icons/io5';
import { TbClockHour3 } from 'react-icons/tb';
import { MdDateRange } from 'react-icons/md';

export default function OrderHeader({ pair }: { pair: string }) {
  const { data: event = [] } = useGetEventBySlug(pair);
  
  return (
    <>
      <div className="flex flex-col-reverse items-start gap-4 px-5 py-6 md:flex-row md:items-center md:justify-between md:px-10 md:py-8 lg:gap-0 lg:px-17 w-full h-fit bg-linear-to-r from-brand-100 to-brand-300 glass rounded-t-2xl">
        <div className="text-base text-white md:text-xl">
          <h1 className="text-xl mb-2 font-semibold md:text-2xl">
            {event.name}
          </h1>
          <div className="flex gap-2 items-center">
            <IoLocationOutline />
            <h1>
              {event.city} | {event.venue}
            </h1>
          </div>
          <div className="flex gap-2 items-center">
            <MdDateRange />
            <h1 className="my-1">
              {tanggal.format(new Date(event.startDate))}
            </h1>
          </div>
          <div className="flex gap-2 items-center">
            <TbClockHour3 />
            <h1>{jam.format(new Date(event.startDate))} WIB</h1>
          </div>
        </div>
        <Image
          src={event.imageUrl ?? '/alternative.png'}
          alt=""
          width={300}
          height={100}
          className="w-full h-auto rounded-lg ring-2 ring-white md:w-60 lg:w-75"
        />
      </div>
    </>
  );
}
