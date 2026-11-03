import { GetEventForTicket } from '@/api/event/getEventForTicket';
import { useQuery } from '@tanstack/react-query';

export function useGetEventForTicket({ page }: { page: number }) {
  return useQuery({
    queryKey: ['event', 'ticket', 'voucher', page],
    queryFn: () => GetEventForTicket({ page }),
  });
}
