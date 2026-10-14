import HeroBanner from '@/components/home/heroBanner';
import { Libre_Baskerville, Sansita } from 'next/font/google';
import { HiSpeakerphone } from 'react-icons/hi';
import ScrollTextBanner from '@/components/home/scrollTextBanner';
import BasicCarousel from '@/components/home/tierSevents';

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
      <ScrollTextBanner />
      <div className='mt-5 flex gap-2 items-center'>
        <HiSpeakerphone className='text-black text-3xl animate-bounce'/>
        <h1 className={`text-black text-4xl ${sansita.className}`}>
          <b className="text-brand-300">Tier S</b> Events Untukmu
        </h1>
      </div>
      <BasicCarousel />
    </>
  );
}
