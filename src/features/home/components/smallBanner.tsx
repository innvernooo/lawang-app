'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';

export default function SmallBanner() {
  const banner = [1, 2, 3, 4];

  const [emblaRef] = useEmblaCarousel({
    align: 'center',
    slidesToScroll: 1,
    containScroll: false,
  });

  return (
    <>
      <div
        ref={emblaRef}
        className="mt-15 mx-auto w-full md:w-[90%] overflow-hidden cursor-grab active:cursor-grabbing"
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
    </>
  );
}
