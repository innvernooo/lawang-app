import CheckoutBox from '@/features/event/components/checkoutBox';
import EventBanner from '@/features/event/components/eventBanner';
import TermsAndConditions from '@/features/event/components/termsAndConditions';
import TicketBox from '@/features/event/components/ticketBox';
import { Suspense } from 'react';

export default function DetailEventPage({
  params,
}: PageProps<'/event/[slug]'>) {
  return (
    <>
      <div className="grid grid-cols-[70%_30%]">
        <div className="h-fit">
          <Suspense fallback={<p>Memuat data</p>}>
            <EventDetailContent params={params} />
            <TicketTypeContent params={params} />
          </Suspense>
          <TermsAndConditions />
        </div>
        <div className="px-3">
          <Suspense fallback={<p>Memuat data</p>}>
            <CheckoutBoxContent params={params} />
          </Suspense>
        </div>
      </div>
    </>
  );

  async function EventDetailContent({
    params,
  }: {
    params: Promise<{ slug: string }>;
  }) {
    const { slug } = await params;
    return <EventBanner slug={slug} />;
  }

  async function TicketTypeContent({
    params,
  }: {
    params: Promise<{ slug: string }>;
  }) {
    const { slug } = await params;
    return <TicketBox slug={slug} />;
  }

  async function CheckoutBoxContent({
    params,
  }: {
    params: Promise<{ slug: string }>;
  }) {
    const { slug } = await params;
    return <CheckoutBox slug={slug} />;
  }
}
