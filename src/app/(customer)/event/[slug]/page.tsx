import CheckoutBox from '@/features/event/components/checkoutBox';
import EventBanner from '@/features/event/components/eventBanner';
import TermsAndConditions from '@/features/event/components/termsAndConditions';
import TicketBox from '@/features/event/components/ticketBox';
import IsLoading from '@/features/general/components/isLoadingImage';
import { Suspense } from 'react';

export default function DetailEventPage({
  params,
}: PageProps<'/event/[slug]'>) {
  return (
    <>
      <Suspense fallback={<IsLoading />}>
        <div>
          <div className="h-fit">
            <EventDetailContent params={params} />
            <TicketTypeContent params={params} />
            <TermsAndConditions />
            <div className="h-20 lg:hidden" />
          </div>
          <div className="px-3">
            {/* <CheckoutBoxContent params={params} /> */}
          </div>
        </div>
      </Suspense>
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
