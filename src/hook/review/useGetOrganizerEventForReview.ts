import { GetOragnizerEventForReview } from '@/api/review/getOrganizerEventForReview';
import { useQuery } from '@tanstack/react-query';

export function useGetOrganizerEventForReview() {
  return useQuery({
    queryKey: ['organizer-event', 'review'],
    queryFn: GetOragnizerEventForReview,
  });
}
