import HeroBanner from '@/features/home/components/heroBanner';
import { Libre_Baskerville, Sansita } from 'next/font/google';
import { HiSpeakerphone } from 'react-icons/hi';
import BasicCarousel from '@/features/home/components/upcomingEvents';

const libre = Libre_Baskerville({
  weight: '700',
  subsets: ['latin'],
});

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
          className={`text-brand-200 text-2xl md:text-xl lg:text-4xl ${sansita.className}`}
        >
          Upcoming Events Terdekat
        </h1>
      </div>
      <BasicCarousel />
    </>
  );
}
