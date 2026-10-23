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
    title: 'MUSIC',
    subtitle: 'Feel every beat, live',
    image: '/Sec2.svg',
  },
  {
    number: '02',
    title: 'COMEDY',
    subtitle: 'Laugh out loud, live on stage',
    image: '/Sec4.svg',
  },
  {
    number: '03',
    title: 'ARTS',
    subtitle: 'Where creativity comes alive',
    image: '/Sec5.svg',
  },
  {
    number: '04',
    title: 'SPORTS',
    subtitle: 'Feel the thrill of every game',
    image: '/Sec1.svg',
  },
  {
    number: '05',
    title: 'WORKSHOP',
    subtitle: 'Learn new skills, hands on',
    image: '/Sec3.svg',
  },
  {
    number: '06',
    title: 'GAMES',
    subtitle: 'Play, compete, and win together',
    image: '/Sec6.svg',
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
        className="-mx-3 -mt-3 overflow-hidden pb-4 md:-mx-5 md:-mt-5"
        ref={emblaRef}
      >
        <div className="flex">
          {sections.map((item, index) => (
            <div
              key={item.number}
              className="relative h-44 min-w-0 flex-[0_0_100%] sm:h-60 md:h-80 lg:h-120 xl:h-144 2xl:h-120"
            >
              <Image
                src={item.image}
                alt={`${item.title} banner`}
                fill
                sizes="100vw"
                priority={index === 0}
                className="object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                <p className="text-white mb-2">{item.number} / 06</p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.6 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="text-3xl font-bold tracking-widest text-white sm:text-4xl md:text-5xl lg:text-6xl"
                >
                  {item.title}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.6 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="mt-2 text-sm tracking-wide text-white sm:text-base md:mt-3 md:text-lg lg:text-xl"
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
