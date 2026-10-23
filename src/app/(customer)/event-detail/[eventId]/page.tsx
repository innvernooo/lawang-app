import EventBanner from '@/features/event-detail/components/eventBanner';
import TermsAndConditions from '@/features/event-detail/components/termsAndConditions';
import TicketBox from '@/features/event-detail/components/ticketBox';

export default function DetailEventPage() {
  return (
    <>
      <div className="grid grid-cols-[70%_30%]">
        <div className="h-fit">
          <EventBanner />
          <TicketBox />
          <TermsAndConditions />
        </div>
        <div className=""></div>
      </div>
    </>
  );
}
