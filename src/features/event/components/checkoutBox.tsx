import { getEventBySlug } from '@/api/event/getEventBySlug';
import { GetTicketByFetch } from '@/api/ticket/getTicketByFetch';
import { rupiah } from '@/utils/idr';
import { tanggal } from '@/utils/localDate';
import { jam } from '@/utils/localTime';
import Link from 'next/link';
import { FaLocationDot } from 'react-icons/fa6';
import { IoIosTime } from 'react-icons/io';
import { MdDateRange } from 'react-icons/md';

export default async function CheckoutBox({ slug }: { slug: string }) {
  const event = await getEventBySlug(slug);

  const ticket = await GetTicketByFetch(event.id);
  
  const lowestPrice = ticket?.length
    ? Math.min(...ticket.map((t: any) => t.price))
    : 0;
  return (
    <>
      <div className="w-full h-fit p-4.5 sticky top-20 bg-brand-100 shadow-lg rounded-3xl">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500">Harga mulai dari</p>
            <h3 className="text-[21px] font-bold">
              {event.pricingType === 'PAID' ? rupiah.format(lowestPrice) : 0}
            </h3>
          </div>
          <Link
            href={`/event/${slug}/order`}
            className="btn bg-blue-700 w-30 h-12 text-lg"
          >
            Beli Tiket
          </Link>
        </div>
        <h1 className="mt-15 text-[25px] font-bold text-brand-200">
          {event?.name}
        </h1>
        <div className="mt-2 flex text-lg gap-2 items-center">
          <FaLocationDot />
          <h2>
            {event?.city} | {event?.venue}
          </h2>
        </div>
        <div className="mt-2 flex text-lg gap-2 items-center">
          <MdDateRange />
          <h2>{tanggal.format(new Date(event?.startDate))}</h2>
        </div>
        <div className="mt-2 flex text-lg gap-2 items-center">
          <IoIosTime />
          <h2>{jam.format(new Date(event?.startDate))} WIB</h2>
        </div>
        <div className="mt-7 flex gap-2 items-center">
          <div className="avatar">
            <div className="w-15 rounded-full">
              <img
                alt="Organizer logo"
                src={event?.organizer?.profilePictureUrl ?? '/download.jpg'}
              />
            </div>
          </div>
          <div>
            <p>Diselenggarakan oleh</p>
            <h2 className="text-xl font-semibold">
              {event?.organizer?.organizerName}
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}
