'use client';

import CategoryButton from '@/features/event/components/categoryButton';
import IsLoading from '@/features/general/components/isLoadingImage';
import { useGetEventByCategory } from '@/hook/event/useGetEventByCategory';
import { tanggal } from '@/utils/localDate';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { IoMdPricetags, IoIosTime } from 'react-icons/io';
import { MdOutlineCategory } from 'react-icons/md';
import { useDebounce } from 'use-debounce';

export default function CategoryPage() {
  return (
    <Suspense fallback={''}>
      <CategoryPageContent />
    </Suspense>
  );
}

function CategoryPageContent() {
  const query = useSearchParams();
  const router = useRouter();
  const category = query.get('category');
  const page = Number(query.get('page')) || 1;
  const search = query.get('search') ?? '';

  const [text, setText] = useState(search);
  const [debounced] = useDebounce(text.trim(), 500);

  useEffect(() => {
    if (debounced === search) return;

    const params = new URLSearchParams(query.toString());
    if (debounced) params.set('search', debounced);
    else params.delete('search');
    params.set('page', '1');

    router.replace(`/event?${params.toString()}`);
  }, [debounced]);

  const { data, isLoading } = useGetEventByCategory({ category, search, page });

  const event = data?.data ?? [];
  const totalPage = data?.meta?.totalPage ?? 1;

  const goToPage = (p: number) => {
    const params = new URLSearchParams(query.toString());
    params.set('page', String(p));
    router.push(`/event?${params.toString()}`);
  };

  return (
    <>
      <div>
        <CategoryButton />
        <div className="mb-2 flex gap-2 items-center">
          <FaSearch />
          <h1 className='font-semibold'>Cari event seru favoritmu</h1>
        </div>
        <label>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Cari event, kota, atau venue"
            className="input w-full max-w-md bg-white border-black text-black"
          />
        </label>
        {isLoading ? (
          <IsLoading />
        ) : event.length === 0 ? (
          <p className="mt-10 text-center text-xl text-gray-500">
            Tidak ada event ditemukan
          </p>
        ) : (
          <>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {event.map((e: any) => (
                <div
                  key={e.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(`/event/${e.slug}`)}
                  className="group h-fit p-3 text-black cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500"
                >
                  <Image
                    src={e.imageUrl ?? '/download.jpg'}
                    alt="Event"
                    width={736}
                    height={368}
                    className="aspect-2/1 h-auto w-full object-cover rounded-lg transition-transform duration-300 ease-out group-hover:-translate-y-2 group-hover:shadow-lg group-hover:shadow-brand-200/30 group-focus-visible:-translate-y-2"
                  />
                  <h1 className="font-bold text-xl md:text-lg lg:text-xl tracking-wide line-clamp-1 mt-2 text-black transition-colors duration-300 group-hover:text-blue-700 group-focus-visible:text-blue-700">
                    {e.name}
                  </h1>
                  <p className="text-lg md:text-sm lg:text-lg">
                    Held by {e.organizer.organizerName}
                  </p>
                  <p className="flex items-center text-lg md:text-sm lg:text-lg gap-2 mt-4">
                    <MdOutlineCategory />
                    <span className="line-clamp-1">{e.category}</span>
                  </p>
                  <p className="flex items-center text-lg md:text-sm lg:text-lg gap-2">
                    <FaLocationDot />
                    <span className="line-clamp-1">
                      {e.city} | {e.venue}
                    </span>
                  </p>
                  <p className="flex items-center text-lg md:text-sm lg:text-lg gap-2 mb-4">
                    <IoIosTime />
                    <span>{tanggal.format(new Date(e.startDate))}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-5 text-lg md:text-sm lg:text-lg">
                    <IoMdPricetags />
                    <p className="font-semibold">{e.pricingType}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-7 mr-5 join flex justify-end">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="bg-brand-100 text-black join-item btn"
              >
                «
              </button>
              <button className="bg-brand-100 text-black join-item btn">
                {page >= totalPage ? 'Maximum' : `Page ${page}`}
              </button>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPage}
                className="bg-brand-100 text-black join-item btn"
              >
                »
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
