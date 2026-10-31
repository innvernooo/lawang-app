import { GetEventByCustomer } from '@/api/event/getEventByCustomer';
import { useQuery } from '@tanstack/react-query';

export function useGetEventByCustomer() {
  return useQuery({
    queryKey: ['event', 'me'],
    queryFn: GetEventByCustomer,
  });
}
