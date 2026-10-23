import DashboardFooter from '@/features/organizer/components/footer';
import DashboardNavbar from '@/features/organizer/components/navbar';

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <DashboardNavbar />
      <div className="min-h-screen p-3 md:p-5 bg-brand-100">{children}</div>
      <DashboardFooter />
    </>
  );
}
