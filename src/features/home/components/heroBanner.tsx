'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'motion/react';
import Image from 'next/image';

type Section = {
  number: string;
  title: string;
  subtitle: string;
  image: string;
};

const sections: Section[] = [
  {
    number: '01',
    title: 'MUSIK',
    subtitle: 'Rasakan setiap dentuman musiknya secara langsung',
    image: '/hero-banner/Sec2.svg',
  },
  {
    number: '02',
    title: 'KOMEDI',
    subtitle: 'Tertawa lepas bareng komika favoritmu',
    image: '/hero-banner/Sec4.svg',
  },
  {
    number: '03',
    title: 'SENI',
    subtitle: 'Tempat kreativitas jadi nyata',
    image: '/hero-banner/Sec5.svg',
  },
  {
    number: '04',
    title: 'OLAHRAGA',
    subtitle: 'Rasakan serunya setiap pertandingan',
    image: '/hero-banner/Sec1.svg',
  },
  {
    number: '05',
    title: 'WORKSHOP',
    subtitle: 'Belajar keterampilan baru, langsung praktik',
    image: '/hero-banner/Sec3.svg',
  },
  {
    number: '06',
    title: 'GAMES',
    subtitle: 'Main, bertanding, dan menang bersama',
    image: '/hero-banner/Sec6.svg',
  },
  {
    number: '07',
    title: 'SPIRITUALITAS',
    subtitle: 'Temukan ketenangan, rawat jiwamu',
    image: '/hero-banner/Sec7.svg',
  },
  {
    number: '08',
    title: 'ALAM TERBUKA',
    subtitle: 'Keluar sejenak, nikmati alam bebas',
    image: '/hero-banner/Sec8.svg',
  },
  {
    number: '09',
    title: 'SAINS',
    subtitle: 'Tetap penasaran, temukan hal baru',
    image: '/hero-banner/Sec9.svg',
  },
  {
    number: '10',
    title: 'PENDIDIKAN',
    subtitle: 'Belajar hari ini, berkembang untuk esok',
    image: '/hero-banner/Sec10.svg',
  },
  {
    number: '11',
    title: 'BUDAYA',
    subtitle: 'Rayakan tradisi, kenali warisan budaya',
    image: '/hero-banner/Sec11.svg',
  },
  {
    number: '12',
    title: 'KELUARGA',
    subtitle: 'Ciptakan momen seru bersama keluarga',
    image: '/hero-banner/Sec12.svg',
  },
  {
    number: '13',
    title: 'K-POP',
    subtitle: 'Bersorak lebih kencang bareng sesama fans',
    image: '/hero-banner/Sec13.svg',
  },
  {
    number: '14',
    title: 'KESEHATAN',
    subtitle: 'Bergerak aktif, hidup lebih sehat',
    image: '/hero-banner/Sec14.svg',
  },
  {
    number: '15',
    title: 'OTOMOTIF',
    subtitle: 'Rasakan kecepatan, bagikan keseruannya',
    image: '/hero-banner/Sec15.svg',
  },
];

export default function HeroBanner() {
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    loop: true,
  });

  return (
    <>
      <div
        className="-mx-3 -mt-3 overflow-hidden pb-4 md:-mx-15 md:-mt-15"
        ref={emblaRef}
      >
        <div className="flex">
          {sections.map((item, index) => (
            <div
              key={item.number}
              className="relative h-35 min-w-0 flex-[0_0_100%] sm:h-60 md:h-60 lg:h-120 xl:h-144 2xl:h-120"
            >
              <Image
                src={item.image}
                alt={`Banner ${item.title}`}
                fill
                sizes="100vw"
                priority={index === 0}
                className="object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                <p className="text-white text-xs md:text-base mb-2">
                  {item.number} / {sections.length}
                </p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.6 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="text-2xl font-bold tracking-widest text-white sm:text-4xl md:text-5xl lg:text-6xl"
                >
                  {item.title}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.6 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="mt-2 text-xs tracking-wide text-white md:mt-3 md:text-lg lg:text-xl"
                >
                  {item.subtitle}
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
