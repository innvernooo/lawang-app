'use client';

import IsLoading from '@/features/general/components/isLoadingImage';
import Image from 'next/image';
import { Suspense } from 'react';
import { IoLocationOutline } from 'react-icons/io5';
import { TbClockHour3 } from 'react-icons/tb';
import { MdDateRange } from 'react-icons/md';
import { PiMaskHappy } from 'react-icons/pi';
import { tanggal } from '@/utils/localDate';
import { useParams } from 'next/navigation';
import { useGetEventBySlug } from '@/hook/event/useGetEventBySlug';
import { stars } from '@/features/review/stars';

export default function PostReviewPage() {
  return (
    <Suspense fallback={<IsLoading />}>
      <PostReviewContent />
    </Suspense>
  );
}

function PostReviewContent() {
  const { slug } = useParams<{ slug: string }>();
  const { data: event, isLoading } = useGetEventBySlug(slug);

  if (isLoading || !event) return <IsLoading />;

  return (
    <>
      <div className="w-full min-h-screen lg:px-25">
        <div className="flex flex-col-reverse items-start gap-4 px-5 py-6 md:flex-row md:items-center md:justify-between md:px-10 md:py-8 lg:gap-0 lg:px-17 w-full h-fit bg-linear-to-r from-brand-200 to-brand-300 glass rounded-t-2xl">
          <div className="text-base text-white md:text-xl">
            <h1 className="text-xl mb-2 font-semibold md:text-2xl">
              {event.name}
            </h1>
            <div className="flex gap-2 items-center">
              <TbClockHour3 />
              <h1>{event.category.replace('_', ' ')}</h1>
            </div>
            <div className="flex gap-2 items-center">
              <IoLocationOutline />
              <h1>
                {event.city} | {event.venue}
              </h1>
            </div>
            <div className="flex gap-2 items-center">
              <MdDateRange />
              <h1 className="my-1">
                {tanggal.format(new Date(event.startDate))}
              </h1>
            </div>
          </div>
          <Image
            src={event.imageUrl ?? '/download.jpg'}
            alt=""
            width={300}
            height={100}
            className="w-full h-auto rounded-lg ring-2 ring-white md:w-60 lg:w-75"
          />
        </div>
        <div className="w-full h-fit bg-white rounded-b-2xl py-5 lg:px-17 shadow-lg">
          <div className="flex gap-2 justify-center items-center lg:text-[27px] font-semibold">
            <PiMaskHappy />
            <h1>Kasih penilaianmu buat event ini</h1>
          </div>
          <div className="mt-7 grid grid-cols-2">
            <div>
              <h1 className="lg:mt-3 mb-1 lg:text-xl font-semibold">
                Beri rating bintang
              </h1>
              <div className="rating">
                {stars.map((s, i) => (
                  <input
                    key={i}
                    type="radio"
                    name="rating-1"
                    className="mask mask-star bg-yellow-500 size-9"
                    aria-label={s.aria}
                    value={s.value}
                  />
                ))}
              </div>
            </div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-black lg:text-xl">
                Berikan komentarmu
              </legend>
              <textarea
                className="textarea textarea-neutral h-50 w-full bg-white"
                placeholder="Type here..."
              ></textarea>
              <div className="label">Optional</div>
            </fieldset>
          </div>
          <div className="mt-7 -mx-10 flex justify-end">
            <button className="btn bg-blue-700 w-25 text-base">Nilai</button>
          </div>
        </div>
      </div>
    </>
  );
}
