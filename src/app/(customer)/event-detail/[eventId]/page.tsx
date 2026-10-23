import EventBanner from '@/features/event-detail/components/eventBanner';
import TermsAndConditions from '@/features/event-detail/components/termsAndConditions';
import TicketBox from '@/features/event-detail/components/ticketBox';
import { Suspense } from 'react';

export default function DetailEventPage({
  params,
}: PageProps<'/event-detail/[eventId]'>) {

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
        <div className=""></div>
      </div>
    </>
  );

  async function EventDetailContent({
    params,
  }: {
    params: Promise<{ eventId: string }>;
  }) {
    const { eventId } = await params;
    return <EventBanner eventId={eventId} />;
  }

  async function TicketTypeContent({
    params,
  }: {
    params: Promise<{ eventId: string }>;
  }) {
    const { eventId } = await params;
    return <TicketBox eventId={eventId} />;
  }
}
