import { rupiah } from '@/utils/idr';
import { tanggal } from '@/utils/localDate';
import { jam } from '@/utils/localTime';
import { FaLocationDot } from 'react-icons/fa6';
import { IoIosTime } from 'react-icons/io';
import { MdDateRange } from 'react-icons/md';

export default async function CheckoutBox({ eventId }: { eventId: string }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/eventDetail/${eventId}`,
  );

  const event = (await res.json()).data;

  const res2 = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/tickets/${eventId}`,
  );

  const ticket = (await res2.json()).data;
  return (
    <>
      <div className="w-full h-fit p-4.5 sticky top-20 bg-white shadow-lg rounded-3xl">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500">Harga mulai dari</p>
            <h3 className="text-[21px] font-bold">
              {rupiah.format(ticket[0].price)}
            </h3>
          </div>
          <button className="btn bg-blue-700 w-30 h-12 text-lg">
            Beli Tiket
          </button>
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
