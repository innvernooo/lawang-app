'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { categories } from '@/features/organizer/components/categories';
import { capitalize } from '@/utils/capitalize';

export default function CategoryButton() {
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

  const base =
    'px-5 py-2 text-white glass rounded-full cursor-pointer transition-transform duration-200 ease-out hover:scale-110';

  return (
    <>
      <div className="my-8 w-full flex justify-center">
        <div className="w-250 flex justify-around">
          <button
            onClick={() => goToCategory(null)}
            aria-pressed={!active}
            className={`${base} ${!active ? 'bg-brand-300' : 'bg-brand-200'}`}
          >
            Semua
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => goToCategory(c)}
              aria-pressed={c === active}
              className={`${base} ${c === active ? 'bg-brand-300' : 'bg-brand-200'}`}
            >
              {capitalize(c)}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
