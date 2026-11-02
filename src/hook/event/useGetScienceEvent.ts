import { GetScienceEvent } from '@/api/event/getScienceEvent';
import { useQuery } from '@tanstack/react-query';

export function useGetScienceEvent() {
  return useQuery({
    queryKey: ['event', 'science'],
    queryFn: GetScienceEvent,
  });
}
