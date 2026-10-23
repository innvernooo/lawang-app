import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Navbar />
      <div className={`min-h-screen p-3 md:p-5 bg-white ${geistSans.className}`}>{children}</div>
      <Footer />
    </>
  );
};
