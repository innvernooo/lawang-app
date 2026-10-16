import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen p-3 md:p-5 bg-brand-100">{children}</div>
      <Footer />
    </>
  );
};
