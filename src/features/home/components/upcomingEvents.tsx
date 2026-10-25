'use client';
import { axiosInstance } from '@/lib/axiosInstance.lib';
import { useQuery } from '@tanstack/react-query';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

import { FaLocationDot } from 'react-icons/fa6';
import { IoMdPricetags, IoIosTime } from 'react-icons/io';
import { rupiah } from '@/utils/idr';

export default function BasicCarousel() {
  const router = useRouter();
  const {
    data: event = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['event'],
    queryFn: async () => {
      const res = await axiosInstance.get('/events/upcomingEvents');
      console.log(res);

      return res?.data?.data ?? [];
    },
  });
  console.log(event);
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 3 },
      '(min-width: 1024px)': { slidesToScroll: 4 },
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
                router.push(`/event/${item.id}`);
              }}
              className="group h-fit p-3 rounded-2xl text-black cursor-pointer transition duration-300 ease-out hover:-translate-y-2 hover:shadow-xl focus-visible:-translate-y-2 focus-visible:shadow-xl focus-visible:outline-2 focus-visible:outline-blue-500"
            >
              <Image
                src={item.imageUrl ?? '/download.jpg'}
                alt="Event"
                width={736}
                height={368}
                className="h-45 rounded-lg"
              />
              <h1 className="font-bold text-xl md:text-lg lg:text-xl tracking-wide line-clamp-1 mt-2 text-black transition-colors duration-300 group-hover:text-brand-300 group-focus-visible:text-brand-300">
                {item?.name}
              </h1>
              <p className="text-lg md:text-sm lg:text-lg">
                Held by {item?.organizer?.organizerName}
              </p>
              <p className="flex items-center text-lg md:text-sm lg:text-lg gap-2 mt-4">
                <FaLocationDot />
                <span>{item?.city}</span>
              </p>
              <p className="flex items-center text-lg md:text-sm lg:text-lg gap-2 mb-4">
                <IoIosTime />
                <span>{format(new Date(item?.startDate), 'dd MMMM yyyy')}</span>
              </p>
              <div className="flex items-center gap-2 mt-5 text-lg md:text-sm lg:text-lg">
                <IoMdPricetags />
                <p>
                  Cost{' '}
                  <span className="font-semibold">
                    {item?.price ? rupiah.format(item?.price) : 'Free'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
