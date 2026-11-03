import HeroBanner from '@/features/home/components/heroBanner';
import { Sansita } from 'next/font/google';
import { HiSpeakerphone } from 'react-icons/hi';
import { GiSouthKorea, GiMaterialsScience } from 'react-icons/gi';
import { SlBookOpen } from 'react-icons/sl';
import { PiMicrophoneStage } from 'react-icons/pi';
import UpcomingEvents from '@/features/home/components/upcomingEvents';
import KpopEvents from '@/features/home/components/kpopEvents';
import { Suspense } from 'react';
import WeeklyEvents from '@/features/home/components/weeklyEvents';
import SmallBanner from '@/features/home/components/smallBanner';
import CategoryButton from '@/features/event/components/categoryButton';
import MusicEvents from '@/features/home/components/musicEvents';
import ScienceEvents from '@/features/home/components/scienceEvents';
import BacaanSeru from '@/features/home/components/bacaanSeru';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  description:
    'Temukan dan beli tiket konser, K-Pop, sains, dan event seru lainnya.',
};

const sansita = Sansita({
  weight: '700',
  subsets: ['latin'],
});

export default function homePage() {
  return (
    <>
      <HeroBanner />
      <div className="my-5 flex gap-2 items-center">
        <HiSpeakerphone className="text-black text-2xl lg:text-3xl animate-bounce" />
        <h1
          className={`text-blue-700 text-2xl md:text-xl lg:text-4xl ${sansita.className}`}
        >
          Events Seru Untukmu
        </h1>
      </div>
      <UpcomingEvents />
      <div className="mt-10 mb-5 flex gap-2 items-center">
        <GiSouthKorea className="text-black text-2xl lg:text-3xl animate-bounce" />
        <h1
          className={`text-blue-700 text-2xl md:text-xl lg:text-4xl ${sansita.className}`}
        >
          Lagi Hype K-Pop
        </h1>
      </div>
      <KpopEvents />
      <WeeklyEvents />
      <SmallBanner />
      <Suspense fallback={<div className="my-8 h-32" />}>
        <CategoryButton />
      </Suspense>
      <div className="my-5 flex gap-2 items-center">
        <PiMicrophoneStage className="text-black text-2xl lg:text-3xl animate-bounce" />
        <h1
          className={`text-blue-700 text-2xl md:text-xl lg:text-4xl ${sansita.className}`}
        >
          Buat Yang Suka Konser
        </h1>
      </div>
      <MusicEvents />
      <div className="my-5 flex gap-2 items-center">
        <GiMaterialsScience className="text-black text-2xl lg:text-3xl animate-bounce" />
        <h1
          className={`text-blue-700 text-2xl md:text-xl lg:text-4xl ${sansita.className}`}
        >
          Sains Yang Bikin Penasaran
        </h1>
      </div>
      <ScienceEvents />
      <div className="my-5 flex gap-2 items-center">
        <SlBookOpen className="text-black text-2xl lg:text-3xl animate-bounce" />
        <h1
          className={`text-blue-700 text-2xl md:text-xl lg:text-4xl ${sansita.className}`}
        >
          Bacaan Seru!
        </h1>
      </div>
      <BacaanSeru />
    </>
  );
}
