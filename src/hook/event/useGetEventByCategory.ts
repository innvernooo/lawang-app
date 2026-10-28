import { EventFilter, GetEventByCatgory } from '@/api/event/getEventByCategory';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export function useGetEventByCategory({ category, search, page }: EventFilter) {
  return useQuery({
    queryKey: ['event', 'category', category, search, page],
    queryFn: () => GetEventByCatgory({ category, search, page }),
    placeholderData: keepPreviousData,
  });
}
