import { GetKpopEvent } from '@/api/event/getKpopEvent';
import { useQuery } from '@tanstack/react-query';

export function useGetKpopEvent() {
  return useQuery({
    queryKey: ['event', 'kpop'],
    queryFn: GetKpopEvent,
  });
}
