import Image from 'next/image';
import { Geist } from 'next/font/google';
import {
  FaInstagram,
  FaFacebookSquare,
  FaLinkedin,
  FaYoutube,
} from 'react-icons/fa';
import { AiFillTikTok } from 'react-icons/ai';
import { FaSquareXTwitter } from 'react-icons/fa6';
import Link from 'next/link';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const payment = [
  '/payment/1.svg',
  '/payment/2.svg',
  '/payment/3.svg',
  '/payment/4.svg',
  '/payment/5.svg',
  '/payment/6.svg',
  '/payment/7.svg',
  '/payment/8.svg',
  '/payment/9.svg',
  '/payment/10.svg',
  '/payment/11.svg',
  '/payment/12.svg',
  '/payment/13.svg',
  '/payment/14.svg',
  '/payment/15.svg',
];

export default function Footer() {
  return (
    <>
      <footer
        className={`footer sm:footer-horizontal bg-neutral-50 text-black-content p-10 ${geistSans.className}`}
      >
        <aside>
          <Image
            src={'/lawang.svg'}
            alt="Logo Lawang"
            width={100}
            height={100}
            className="md:w-33 lg:w-30"
          />
          <p className="font-semibold">
            Lawang | Platform Tiket Event
            <br />
            Sejak 2026
          </p>
          <p>
            Dari konser sampai festival dan pertandingan olahraga,
            <br />
            pesan tiketnya lebih mudah bersama Lawang.
            <br /> #PASTIBISA dapat tiket event idaman!
          </p>
        </aside>
        <nav>
          <p className="font-semibold">Tentang Lawang</p>
          <a href="/about-us" className="hover:underline">
            Tentang kami
          </a>
          <a href="/blog" className="hover:underline">
            Blog
          </a>
          <p className="mt-4 font-semibold">
            Yuk, Ikuti Kami untuk Info Seru Lainnya
          </p>
          <div className="text-black grid grid-flow-col gap-4 text-lg lg:text-2xl">
            <Link
              href={
                'https://www.instagram.com/lawang.web?exln=c3AxdnB0M21zN2xr'
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </Link>
            <Link
              href={'https://www.tiktok.com/@lawang7331?_r=1&_t=ZS-9B43cmYVhYa'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <AiFillTikTok />
            </Link>
            <a>
              <FaSquareXTwitter />
            </a>
            <a>
              <FaFacebookSquare />
            </a>
            <a>
              <FaYoutube />
            </a>
            <a>
              <FaLinkedin />
            </a>
          </div>
        </nav>
        <nav>
          <p className="font-semibold">Pilihan Pembayaran</p>
          <div className="text-black grid grid-cols-6 gap-2 text-lg lg:text-2xl">
            {payment.map((p: string, i: number) => (
              <img
                key={i}
                src={p}
                className="rounded-lg ring-1 ring-brand-300"
              />
            ))}
          </div>
        </nav>
      </footer>
    </>
  );
}
