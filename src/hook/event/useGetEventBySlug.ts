import { getEventBySlug } from '@/api/event/getEventBySlug';
import { useQuery } from '@tanstack/react-query';

export function useGetEventBySlug(slug: string) {
  return useQuery({
    queryKey: ['event', 'slug'],
    queryFn: () => getEventBySlug(slug),
  });
}
