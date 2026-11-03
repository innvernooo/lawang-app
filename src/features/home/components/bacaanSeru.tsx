'use client';

import { useGetReading } from '@/hook/reading/useGetReading';
import { tanggal } from '@/utils/localDate';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function BacaanSeru() {
  const { data: reading = [], isLoading } = useGetReading();
  const router = useRouter();

  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
  });

  return (
    <div className="overflow-hidden pt-2 pb-4" ref={emblaRef}>
      <div className="flex -ml-4">
        {reading.map((b: any, i: number) => (
          <div
            role="button"
            onClick={() => router.push(`/blog/${b.slug}`)}
            key={i}
            className="min-w-0 flex-[0_0_100%] md:flex-[0_0_33.3333%] pl-4"
          >
            <article className="group h-full cursor-pointer p-3 text-black">
              <div className="relative aspect-2/1 w-full overflow-hidden rounded-lg transition-transform duration-300 ease-out group-hover:-translate-y-2 group-hover:shadow-lg group-hover:shadow-brand-200/50">
                <Image
                  src={b.imageUrl ?? '/download.jpg'}
                  alt={b.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  draggable={false}
                  className="object-cover"
                />
              </div>
              <p className="mt-3 text-sm text-gray-500">
                {tanggal.format(new Date(b.createdAt))}
              </p>
              <h2 className="mt-1 line-clamp-2 text-xl font-bold transition-colors duration-300 group-hover:text-blue-700">
                {b.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-base text-gray-700">
                {b.excerpt}
              </p>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
}
