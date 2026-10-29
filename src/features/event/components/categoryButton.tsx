'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { categories } from '@/utils/categories';
import { capitalize } from '@/utils/capitalize';
import useEmblaCarousel from 'embla-carousel-react';

const items = [{ number: 0, cat: null as string | null }, ...categories];

export default function CategoryButton() {
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    dragFree: true,
  });

  const router = useRouter();
  const query = useSearchParams();

  const active = query.get('category');

  const goToCategory = (c: string | null) => {
    const params = new URLSearchParams(query.toString());
    if (c && c !== active) params.set('category', c);
    else params.delete('category');
    params.set('page', '1');
    router.push(`/event?${params.toString()}`);
  };

  return (
    <div ref={emblaRef} className="my-8 w-full overflow-hidden px-4 py-3">
      <div className="flex gap-6">
        {items.map(({ number, cat }) => {
          const selected = cat === null ? !active : cat === active;
          const label = cat === null ? 'Semua' : capitalize(cat).replace('_', ' ');

          return (
            <div
              key={number}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              onClick={() => goToCategory(cat)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') goToCategory(cat);
              }}
              className="group flex w-24 shrink-0 cursor-pointer select-none flex-col items-center focus-visible:outline-2 focus-visible:outline-blue-500"
            >
              <div
                className={`relative h-16 w-16 overflow-hidden rounded-xl transition-transform duration-300 ease-out group-hover:-translate-y-2 group-hover:shadow-lg group-hover:shadow-brand-200 group-focus-visible:-translate-y-2 ${
                  selected ? 'ring-4 ring-brand-100' : ''
                }`}
              >
                <Image
                  src={`/category/${number}.svg`}
                  alt={label}
                  fill
                  sizes="64px"
                  draggable={false}
                  className="object-cover"
                />
              </div>
              <p
                className={`mt-3 text-center text-sm font-semibold leading-tight transition-colors duration-300 group-hover:text-blue-700 group-focus-visible:text-blue-700 ${
                  selected ? 'text-blue-700' : 'text-black'
                }`}
              >
                {label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
