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
    image: '/hero-banner/Sec2.svg',
  },
  {
    number: '02',
    title: 'COMEDY',
    subtitle: 'Laugh out loud, live on stage',
    image: '/hero-banner/Sec4.svg',
  },
  {
    number: '03',
    title: 'ARTS',
    subtitle: 'Where creativity comes alive',
    image: '/hero-banner/Sec5.svg',
  },
  {
    number: '04',
    title: 'SPORTS',
    subtitle: 'Feel the thrill of every game',
    image: '/hero-banner/Sec1.svg',
  },
  {
    number: '05',
    title: 'WORKSHOP',
    subtitle: 'Learn new skills, hands on',
    image: '/hero-banner/Sec3.svg',
  },
  {
    number: '06',
    title: 'GAMES',
    subtitle: 'Play, compete, and win together',
    image: '/hero-banner/Sec6.svg',
  },
  {
    number: '07',
    title: 'SPIRITUALITY',
    subtitle: 'Find your peace, nurture your soul',
    image: '/hero-banner/Sec7.svg',
  },
  {
    number: '08',
    title: 'NATURE',
    subtitle: 'Step outside, embrace the wild',
    image: '/hero-banner/Sec8.svg',
  },
  {
    number: '09',
    title: 'SCIENCE',
    subtitle: 'Stay curious, discover more',
    image: '/hero-banner/Sec9.svg',
  },
  {
    number: '10',
    title: 'EDUCATION',
    subtitle: 'Learn today, grow for tomorrow',
    image: '/hero-banner/Sec10.svg',
  },
  {
    number: '11',
    title: 'CULTURE',
    subtitle: 'Celebrate traditions, experience heritage',
    image: '/hero-banner/Sec11.svg',
  },
  {
    number: '12',
    title: 'FAMILY',
    subtitle: 'Make memories worth repeating',
    image: '/hero-banner/Sec12.svg',
  },
  {
    number: '13',
    title: 'K-POP',
    subtitle: 'Cheer louder, fan together',
    image: '/hero-banner/Sec13.svg',
  },
  {
    number: '14',
    title: 'HEALTH',
    subtitle: 'Move well, live better',
    image: '/hero-banner/Sec14.svg',
  },
  {
    number: '15',
    title: 'AUTOMOTIVE',
    subtitle: 'Feel the speed, share the thrill',
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
                <p className="text-white mb-2">
                  {item.number} / {sections.length}
                </p>
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
