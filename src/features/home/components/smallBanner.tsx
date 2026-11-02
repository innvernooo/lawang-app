'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';

export default function SmallBanner() {
  const banner = [1, 2, 3, 4];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { watchDrag: false },
    },
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
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  return (
    <>
      <div className="mt-15 flex items-center justify-between">
        <button
          type="button"
          aria-label="Banner sebelumnya"
          onClick={scrollPrev}
          disabled={!canPrev}
          className="hidden md:flex bg-brand-300 text-xs md:text-base lg:text-xl rounded-full md:p-1 text-white cursor-pointer"
        >
          <IoIosArrowBack />
        </button>
        <div
          ref={emblaRef}
          className="mx-auto w-full md:w-[90%] overflow-hidden cursor-grab md:cursor-default"
        >
          <div className="flex">
            {banner.map((b) => (
              <div key={b} className="min-w-0 flex-[0_0_100%]">
                <Image
                  src={`/small-banner/${b}.svg`}
                  alt=""
                  width={1500}
                  height={100}
                  draggable={false}
                  className="h-auto w-full rounded-2xl select-none"
                />
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          aria-label="Banner berikutnya"
          onClick={scrollNext}
          disabled={!canNext}
          className="hidden md:flex bg-brand-300 text-xs md:text-base lg:text-xl rounded-full md:p-1 text-white cursor-pointer"
        >
          <IoIosArrowForward />
        </button>
      </div>
    </>
  );
}
