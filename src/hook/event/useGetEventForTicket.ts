import { GetEventForTicket } from '@/api/event/getEventForTicket';
import { useQuery } from '@tanstack/react-query';

export function useGetEventForTicket() {
  return useQuery({
    queryKey: ['event', 'ticket'],
    queryFn: GetEventForTicket,
  });
}
