import Footer from '@/components/footer';
import Navbar from '@/components/navbar';

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen p-3 md:p-5 bg-brand-100">{children}</div>
      <Footer />
    </>
  );
};
