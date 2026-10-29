import { GetTicketByEventId } from '@/api/ticket/getTicketByEventId';
import { useQuery } from '@tanstack/react-query';

export function useGetTicketByEventId(eventId: string) {
  return useQuery({
    queryKey: ['ticket', eventId],
    queryFn: () => GetTicketByEventId(eventId),
  });
}
