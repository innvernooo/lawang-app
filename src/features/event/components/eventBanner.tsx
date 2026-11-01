import { getEventBySlug } from '@/api/event/getEventBySlug';
import { GetTicketByEventId } from '@/api/ticket/getTicketByEventId';
import { rupiah } from '@/utils/idr';
import { tanggal } from '@/utils/localDate';
import { jam } from '@/utils/localTime';
import Image from 'next/image';
import Link from 'next/link';
import RevealOnScroll from './revealOnScroll';
import { IoLocationOutline } from 'react-icons/io5';
import { TbClockHour3 } from 'react-icons/tb';
import { MdDateRange, MdOutlineCategory } from 'react-icons/md';

export default async function EventBanner({ slug }: { slug: string }) {
  const event = await getEventBySlug(slug);

  const ticket = await GetTicketByEventId(event.id);

  return (
    <>
      <div
        id="event-hero"
        className={`lg:grid grid-cols-[60%_40%] text-white -mx-3 -mt-3 px-4 pt-1 pb-5 md:-mx-15 md:-mt-15 md:px-10 md:pt-5 lg:pb-0 bg-linear-to-r from-brand-100 to-brand-300 glass`}
      >
        <div>
          <h1 className="mt-5 text-xl font-extrabold tracking-wide md:text-2xl">
            {event?.name}
          </h1>
          <div className="mt-3 flex text-base gap-2 items-center md:text-xl">
            <IoLocationOutline className="shrink-0" />
            <h2>
              {event?.city} | {event?.venue}
            </h2>
          </div>
          <div className="my-3 flex text-base gap-2 items-center md:text-xl">
            <MdDateRange className="shrink-0" />
            <h2>{tanggal.format(new Date(event?.startDate))}</h2>
          </div>
          <div className="flex text-base gap-2 items-center md:text-xl">
            <TbClockHour3 className="shrink-0" />
            <h2>{jam.format(new Date(event?.startDate))} WIB</h2>
          </div>
          <div className="my-3 flex text-base gap-2 items-center md:text-xl">
            <MdOutlineCategory className="shrink-0" />
            <h2>{event?.category.replace('_', ' ')}</h2>
          </div>
          <div className="mt-4 mb-4 flex items-center gap-2 lg:hidden">
            <div className="avatar">
              <div className="w-8 rounded-full">
                <img
                  alt="Organizer logo"
                  src={event?.organizer?.profilePictureUrl ?? '/eo.svg'}
                  className="h-full w-full scale-125 object-center"
                />
              </div>
            </div>
            <p className="text-sm">
              Diselenggarakan oleh{' '}
              <span className="font-semibold">
                {event?.organizer?.organizerName}
              </span>
            </p>
          </div>
        </div>
        <div>
          <Image
            src={event?.imageUrl ?? '/alternative.png'}
            alt="Event"
            width={500}
            height={368}
            className="aspect-2/1 h-auto w-full rounded-2xl object-cover md:max-w-xl lg:aspect-auto lg:h-65 lg:w-125 lg:max-w-full lg:rounded-b-none lg:rounded-t-2xl lg:object-fill"
          />
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-300 bg-white lg:sticky lg:inset-x-auto lg:bottom-auto lg:top-16 lg:grid lg:grid-cols-[59.5%_40%] lg:h-13 lg:-mx-15 lg:border lg:border-gray-400">
        <RevealOnScroll
          targetId="event-hero"
          className="mx-5 h-13 hidden lg:flex justify-around font-semibold items-center"
        >
          <p>{event.name}</p>
          <div className="flex gap-1 items-center">
            <IoLocationOutline />
            <p>
              {event.city} | {event.venue}
            </p>
          </div>
          <div className="flex gap-1 items-center">
            <MdOutlineCategory />
            <p>{event.category.replace('_', ' ')}</p>
          </div>
        </RevealOnScroll>
        {ticket.length > 0 ? (
          <div className="bg-white w-full px-4 py-3 md:px-15 lg:px-2.5 lg:py-0 lg:w-125 lg:h-fit lg:rounded-b-xl lg:shadow-lg">
            <div className="flex justify-between items-center lg:items-stretch lg:mt-2">
              <div>
                <p className="text-sm text-gray-500">Harga mulai dari</p>
                <h2 className="text-xl font-bold">
                  {ticket.length > 0
                    ? rupiah.format(ticket[0].price)
                    : rupiah.format(0)}
                </h2>
              </div>
              <Link
                href={`/event/${slug}/order`}
                className="btn bg-brand-400 text-black"
              >
                Beli Tiket
              </Link>
            </div>
            <div className="hidden lg:flex w-full h-25">
              <div className="mt-7 flex justify-end-safe gap-2 items-center">
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Organizer logo"
                      src={event?.organizer?.profilePictureUrl ?? '/eo.svg'}
                      className="h-full w-full scale-125 object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm">Diselenggarakan oleh</p>
                  <h2 className="text-base font-semibold">
                    {event?.organizer?.organizerName}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white w-full px-4 py-3 md:px-15 lg:px-2.5 lg:py-0 lg:w-125 lg:h-30 lg:rounded-b-xl lg:shadow-lg font-semibold text-sm md:text-base flex justify-center items-center">
            <h1>Event Organizer belum membuat tiket untuk event ini</h1>
          </div>
        )}
      </div>
    </>
  );
}
