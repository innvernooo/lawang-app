'use client';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';

import { FaLocationDot } from 'react-icons/fa6';
import { IoMdPricetags } from 'react-icons/io';

const events = [
  {
    lokasi: 'Tangerang Selatan',
    waktu: '11 Agustus 2026',
    nama: 'YOUTH WEEK',
    organisasi: 'RSC',
    harga: 'IDR 500.000',
  },
  {
    lokasi: 'Jakarta Selatan',
    waktu: '20 Agustus 2026',
    nama: 'TECH INNOVATION SUMMIT',
    organisasi: 'TechConnect',
    harga: 'IDR 350.000',
  },
  {
    lokasi: 'Bandung',
    waktu: '5 September 2026',
    nama: 'CREATIVE FESTIVAL',
    organisasi: 'CreativeHub',
    harga: 'IDR 250.000',
  },
  {
    lokasi: 'Yogyakarta',
    waktu: '12 September 2026',
    nama: 'NATIONAL STUDENT EXPO',
    organisasi: 'EduNation',
    harga: 'IDR 150.000',
  },
  {
    lokasi: 'Surabaya',
    waktu: '19 September 2026',
    nama: 'STARTUP FOUNDERS DAY',
    organisasi: 'StartupCircle',
    harga: 'IDR 400.000',
  },
  {
    lokasi: 'Bekasi',
    waktu: '3 Oktober 2026',
    nama: 'MUSIC & ART FEST',
    organisasi: 'UrbanVibes',
    harga: 'IDR 200.000',
  },
];

export default function BasicCarousel() {
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 3 },
      '(min-width: 1024px)': { slidesToScroll: 4 },
    },
  });

  return (
    // pt/pb: ruang agar kartu yang naik & bayangannya tidak terpotong overflow-hidden
    <div className="overflow-hidden pt-2 pb-4" ref={emblaRef}>
      <div className="flex -ml-4">
        {events.map((item, index) => (
          <div
            key={index}
            className="min-w-0 flex-[0_0_100%] md:flex-[0_0_33.3333%] lg:flex-[0_0_25%] pl-4"
          >
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                // TODO: arahkan ke halaman detail event, mis. router.push(`/events/${slug}`)
              }}
              className="group h-fit p-3 bg-white rounded-2xl text-black cursor-pointer transition duration-300 ease-out hover:-translate-y-2 hover:shadow-xl focus-visible:-translate-y-2 focus-visible:shadow-xl focus-visible:outline-2 focus-visible:outline-blue-500"
            >
              <Image
                src={'/download.jpg'}
                alt="Event 1"
                width={736}
                height={368}
                className="w-full rounded-lg"
              />
              <p className="flex items-center text-lg md:text-sm lg:text-lg gap-2 mt-4 h-10">
                <FaLocationDot />
                <span>
                  {item?.lokasi} | {item?.waktu}
                </span>
              </p>
              <h1 className="font-bold text-xl md:text-lg lg:text-2xl tracking-wide line-clamp-1 mt-2 text-brand-300 transition-colors duration-300 group-hover:text-blue-500 group-focus-visible:text-blue-500">
                {item?.nama}
              </h1>
              <p className="text-lg md:text-sm lg:text-lg">
                Held by {item?.organisasi}
              </p>
              <div className="flex items-center gap-2 mt-5 text-lg md:text-sm lg:text-lg">
                <IoMdPricetags />
                <p>
                  Mulai dari{' '}
                  <span className="font-semibold">{item?.harga}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
