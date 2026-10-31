import { GetOrganizerEventDetail } from '@/api/event/getOrganizerEventDetail';
import { useQuery } from '@tanstack/react-query';

export function useGetOrganizerEventDetail(eventId: string) {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: () => GetOrganizerEventDetail(eventId),
  });
}
