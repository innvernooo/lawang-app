'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

import { IoLocationOutline } from "react-icons/io5";
import { IoMdPricetags, IoIosTime } from 'react-icons/io';
import { MdOutlineCategory } from 'react-icons/md';
import { TbClockHour3 } from "react-icons/tb";
import { capitalize } from '@/utils/capitalize';
import { useGetMusicEvent } from '@/hook/event/useGetMusicEvent';

export default function MusicEvents() {
  const router = useRouter();
  const { data: event = [] } = useGetMusicEvent();

  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 3 },
      '(min-width: 1024px)': { slidesToScroll: 2 },
    },
  });

  return (
    <div className="overflow-hidden pt-2 pb-4" ref={emblaRef}>
      <div className="flex -ml-4">
        {event.map((item: any, index: any) => (
          <div
            key={index}
            className="min-w-0 flex-[0_0_100%] md:flex-[0_0_33.3333%] lg:flex-[0_0_25%] pl-4"
          >
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                router.push(`/event/${item.slug}`);
              }}
              className="group h-fit p-3 text-black cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500"
            >
              <Image
                src={item.imageUrl ?? '/download.jpg'}
                alt="Event"
                width={736}
                height={368}
                className="aspect-2/1 h-auto w-full object-cover rounded-lg transition-transform duration-300 ease-out group-hover:-translate-y-2 group-hover:shadow-lg group-hover:shadow-brand-200/30 group-focus-visible:-translate-y-2"
              />

              <h1 className="font-bold text-xl md:text-lg lg:text-xl tracking-wide line-clamp-1 mt-2 text-black transition-colors duration-300 group-hover:text-blue-700 group-focus-visible:text-blue-700">
                {item?.name}
              </h1>
              <p className="text-lg md:text-sm lg:text-lg">
                Held by {item?.organizer?.organizerName}
              </p>
              <p className="flex items-center text-lg md:text-sm lg:text-lg gap-2 mt-4">
                <MdOutlineCategory />
                <span>{item?.category.replace('_', ' ')}</span>
              </p>
              <p className="flex items-center text-lg md:text-sm lg:text-lg gap-2">
                <IoLocationOutline />
                <span className="line-clamp-1">
                  {item?.city} | {item.venue}
                </span>
              </p>
              <p className="flex items-center text-lg md:text-sm lg:text-lg gap-2">
                <TbClockHour3 />
                <span>{format(new Date(item?.startDate), 'dd MMMM yyyy')}</span>
              </p>
              <p className="line-clamp-1">
                _________________________________________________________________________________________________________________________________
              </p>
              <div className="flex items-center gap-2 mt-5 text-lg md:text-sm lg:text-lg">
                <IoMdPricetags />
                <p className="font-semibold">{item?.pricingType}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
