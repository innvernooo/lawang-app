import { getEventBySlug } from '@/api/event/getEventBySlug';
import { GetTicketByFetch } from '@/api/ticket/getTicketByFetch';
import { rupiah } from '@/utils/idr';
import { tanggal } from '@/utils/localDate';
import { jam } from '@/utils/localTime';
import { LuTicket } from 'react-icons/lu';

export default async function TicketBox({ slug }: { slug: string }) {
  const event = await getEventBySlug(slug);

  const ticket = await GetTicketByFetch(event.id);
  
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
          <p className="line-clamp-1">
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
                <label className="label">
                  {item?.endSale &&
                    `Penjualan berakhir pada ${tanggal.format(new Date(item.endSale))} • Jam ${jam.format(new Date(item.endSale))} WIB`}
                </label>
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
