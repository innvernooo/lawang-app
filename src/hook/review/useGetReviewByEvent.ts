import { GetReviewByEvent } from '@/api/review/getReviewByEvent';
import { useQuery } from '@tanstack/react-query';

export function useGetReviewByEvent(eventId: string) {
  return useQuery({
    queryKey: ['review', eventId],
    queryFn: () => GetReviewByEvent(eventId),
  });
}
