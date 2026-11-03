import OrganizerFooter from '@/features/organizer/components/footer';
import OrganizerNavbar from '@/features/organizer/components/navbar';
import { Geist } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export default function DashboardLayout({
  children,
}: LayoutProps<'/organizer/dashboard'>) {
  return (
    <>
      <OrganizerNavbar />
      <main
        className={`min-h-screen px-10 bg-white ${geistSans.className}`}
      >
        {children}
      </main>
      <OrganizerFooter />
    </>
  );
}
