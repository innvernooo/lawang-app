import { GetUpcomingEvents } from '@/api/event/getUpcomingEvent';
import { useQuery } from '@tanstack/react-query';

export function useUpcomingEvent() {
  return useQuery({
    queryKey: ['event', 'upcoming'],
    queryFn: GetUpcomingEvents,
  });
}
