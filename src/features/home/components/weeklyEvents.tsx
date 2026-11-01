'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import { useGetWeeklyEvent } from '@/hook/event/useGetWeeklyEvent';
import { format } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function WeeklyEvents() {
  const router = useRouter();
  const { data: event = [] } = useGetWeeklyEvent();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: 'y',
    align: 'start',
    slidesToScroll: 1,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  const nav =
    'grid h-10 w-full place-items-center rounded-full bg-gray-100 text-blue-700 cursor-pointer transition-colors duration-200 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-gray-100';

  return (
    <>
      <div className="mt-10 lg:flex items-center gap-10">
        <div>
          <Image
            src={'/event2go.svg'}
            alt="Event2Go"
            width={500}
            height={100}
            className="rounded-2xl"
          />
        </div>
        <div className="w-220 max-w-full">
          <button
            type="button"
            aria-label="Event sebelumnya"
            onClick={scrollPrev}
            disabled={!canPrev}
            className={`${nav} mb-2 mt-5`}
          >
            <FaChevronUp />
          </button>
          <div
            ref={emblaRef}
            className="h-100 overflow-hidden rounded-2xl md:h-130 lg:h-170"
          >
            <div className="-mt-3 flex h-full flex-col md:-mt-5 lg:-mt-7">
              {event.map((e: any) => (
                <div
                  key={e.id}
                  className="min-h-0 flex-[0_0_33.3333%] pt-3 md:pt-5 lg:pt-7"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => router.push(`/event/${e.slug}`)}
                    onKeyDown={(ev) => {
                      if (ev.key === 'Enter') router.push(`/event/${e.slug}`);
                    }}
                    className="group flex h-full cursor-pointer flex-col justify-between rounded-xl px-2 focus-visible:outline-2 focus-visible:outline-blue-500 md:px-5 lg:px-7"
                  >
                    <div className="flex flex-1 items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3 md:gap-5">
                        <div className="w-14 h-fit shrink-0 p-1 bg-gray-100 rounded-lg text-xs md:w-20 md:p-1.5 md:text-base">
                          <h1 className="flex justify-center bg-white font-semibold rounded items-center">
                            {format(e.startDate, 'MMM').toUpperCase()}
                          </h1>
                          <h1 className="my-1 text-lg font-bold flex justify-center md:my-1.5 md:text-2xl">
                            {format(e.startDate, 'd').toUpperCase()}
                          </h1>
                          <h1 className="flex font-semibold justify-center">
                            {format(e.startDate, 'iii').toUpperCase()}
                          </h1>
                        </div>
                        <div className="min-w-0">
                          <h1 className="line-clamp-2 text-base font-semibold leading-snug transition-colors duration-300 group-hover:text-blue-700 group-focus-visible:text-blue-700 md:text-xl lg:line-clamp-none lg:text-2xl lg:leading-normal">
                            {e.name}
                          </h1>
                          <h2 className="my-1 text-sm md:my-2 md:text-base lg:text-lg">
                            {e.category.replace('_', ' ')}
                          </h2>
                          <h3 className="line-clamp-1 text-sm md:text-base lg:line-clamp-none lg:text-lg">
                            {e.city} | {e.venue}
                          </h3>
                        </div>
                      </div>
                      <div className="relative hidden h-20 w-28 shrink-0 overflow-hidden rounded-lg transition-transform duration-300 ease-out group-hover:-translate-y-2 group-hover:shadow-lg group-hover:shadow-brand-200 group-focus-visible:-translate-y-2 sm:block md:h-28 md:w-44 lg:h-40 lg:w-64">
                        <Image
                          src={e.imageUrl ?? '/alternative.png'}
                          alt={e.name}
                          fill
                          sizes="256px"
                          draggable={false}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <p className="line-clamp-1 overflow-hidden text-xs md:text-base">
                      _________________________________________________________________________________________________________________________________
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            aria-label="Event berikutnya"
            onClick={scrollNext}
            disabled={!canNext}
            className={`${nav} mt-2`}
          >
            <FaChevronDown />
          </button>
        </div>
      </div>
    </>
  );
}
