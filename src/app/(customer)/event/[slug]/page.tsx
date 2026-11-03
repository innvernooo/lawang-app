import EventBanner from '@/features/event/components/eventBanner';
import TermsAndConditions from '@/features/event/components/termsAndConditions';
import TicketBox from '@/features/event/components/ticketBox';
import type { Metadata } from 'next';
import IsLoading from '@/features/general/components/isLoadingImage';
import { Suspense } from 'react';
import { getEventBySlug } from '@/api/event/getEventBySlug';

export async function generateMetadata({
  params,
}: PageProps<'/event/[slug]'>): Promise<Metadata> {
  const { slug } = await params;

  const event = await getEventBySlug(slug);

  return {
    title: event.name,
    description: event.description,
  };
}

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
          <div className="px-3"></div>
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
}
