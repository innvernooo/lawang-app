'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { rupiah } from '@/utils/idr';
import { tanggal } from '@/utils/localDate';
import { BsClockHistory } from 'react-icons/bs';
import { PiNotePencil } from 'react-icons/pi';
import { CiBellOn } from 'react-icons/ci';
import { jam } from '@/utils/localTime';
import { useCallback, useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';

export default function TicketOption({ tickets }: { tickets: any[] }) {
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
      <div className="p-2 md:p-5">
        <button
          type="button"
          aria-label="Tiket sebelumnya"
          onClick={scrollPrev}
          disabled={!canPrev}
          className={`${nav} mb-2 mt-5`}
        >
          <FaChevronUp />
        </button>
        <div ref={emblaRef} className="h-130 overflow-hidden">
          <div className="-mt-4 flex h-full flex-col">
          {tickets.map((t: any, index: any) => (
            <div key={index} className="min-h-0 flex-[0_0_50%] px-1 pt-4 pb-1">
            <div className="h-full overflow-hidden p-4 w-full bg-white rounded-xl shadow-md lg:w-140">
              <h1 className="text-xl font-semibold">{t.name}</h1>
              <div className="flex mt-2 text-sm gap-2 items-center md:text-lg">
                <PiNotePencil className="shrink-0" />
                <p className="">Harga belum termasuk pajak dan biaya lainnya</p>
              </div>
              <div className="flex text-sm gap-2 items-center text-blue-700 md:text-lg">
                <BsClockHistory className="shrink-0" />
                <p>
                  {t.endSale === null
                    ? `Tidak ada batas akhir`
                    : `Penjualan berakhir pada ${tanggal.format(new Date(t.endSale))} • Jam ${jam.format(new Date(t.endSale))} WIB`}
                </p>
              </div>
              <div className="flex text-sm gap-2 text-red-500 items-center md:text-lg">
                <CiBellOn className="shrink-0" />
                <p>{`Tiket tersisa ${t.available}`}</p>
              </div>
              <p className="mt-2 line-clamp-1">
                _____________________________________________________________________________________________________________________________________________________
              </p>
              <div className="mt-2 text-xl flex items-center justify-between">
                <h1 className=" font-semibold">{rupiah.format(t.price)}</h1>
              </div>
            </div>
            </div>
          ))}
          </div>
        </div>
        <button
          type="button"
          aria-label="Tiket berikutnya"
          onClick={scrollNext}
          disabled={!canNext}
          className={`${nav} mt-2`}
        >
          <FaChevronDown />
        </button>
      </div>
    </>
  );
}
