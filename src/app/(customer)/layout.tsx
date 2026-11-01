import Footer from '@/features/home/components/footer';
import Navbar from '@/features/home/components/navbar';
import { Geist } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Navbar />
      <div className={`min-h-screen p-3 md:p-15 bg-white ${geistSans.className}`}>{children}</div>
      <Footer />
    </>
  );
};
