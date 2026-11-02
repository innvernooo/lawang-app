import { GetWeeklyEvent } from '@/api/event/getWeeklyEvent';
import { useQuery } from '@tanstack/react-query';

export function useGetWeeklyEvent() {
  return useQuery({
    queryKey: ['event', 'weekly'],
    queryFn: GetWeeklyEvent,
  });
}
