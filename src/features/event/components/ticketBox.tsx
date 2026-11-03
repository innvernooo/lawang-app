import { getEventBySlug } from '@/api/event/getEventBySlug';
import { GetTicketByEventId } from '@/api/ticket/getTicketByEventId';
import { rupiah } from '@/utils/idr';
import { tanggal } from '@/utils/localDate';
import { jam } from '@/utils/localTime';
import { LuTicket } from 'react-icons/lu';
import { FaAudioDescription } from 'react-icons/fa';

export default async function TicketBox({ slug }: { slug: string }) {
  const event = await getEventBySlug(slug);

  const ticket = await GetTicketByEventId(event.id);

  return (
    <>
      <div className="mt-7 flex gap-2 items-center text-xl font-bold md:text-2xl">
        <FaAudioDescription />
        <h1 className="tracking-wide">Deskripsi</h1>
      </div>
      <div className="mt-2 w-full lg:w-200">
        <p>{event.description}</p>
      </div>
      <div className="mt-7 flex gap-2 items-center text-xl font-bold md:text-2xl">
        <LuTicket />
        <h1 className="tracking-wide">Tiket</h1>
      </div>
      <div className="mt-2 w-full lg:w-200 collapse bg-white border shadow-md">
        <input type="checkbox" />
        <div className="collapse-title font-semiboldrounded-md">
          <h1 className="font-bold text-xl md:text-2xl">Penjualan Online</h1>
          <h3 className="text-gray-500 font-medium">
            {`Pilih tiket sesuai daftar di bawah ini`}
          </h3>
        </div>
        <div className="collapse-content text-sm">
          <p className="line-clamp-1">
            _________________________________________________________________________________________________________________________________
          </p>
          {ticket.map((item: any, index: any) => (
            <div
              key={index}
              className="mt-5 grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 md:grid-cols-[1fr_1fr_auto] md:gap-4"
            >
              <div className="order-3 text-lg font-semibold md:order-0 md:text-xl md:font-normal">
                <h1>{rupiah.format(item?.price)}</h1>
              </div>
              <div className="order-1 min-w-0 md:order-0 lg:min-w-auto">
                <h2 className="text-lg font-medium md:text-xl">{item?.name}</h2>
                <label className="label whitespace-normal lg:whitespace-nowrap">
                  {item?.endSale &&
                    `Penjualan berakhir pada ${tanggal.format(new Date(item.endSale))} • Jam ${jam.format(new Date(item.endSale))} WIB`}
                </label>
              </div>
              <p
                className={`order-2 self-start md:order-0 md:self-auto px-3 py-0.5 rounded-full glass text-white ${
                  item?.available <= 0 ? 'bg-red-500' : 'bg-green-500'
                }`}
              >
                {item?.available <= 0 ? 'Habis' : 'Tersedia'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
