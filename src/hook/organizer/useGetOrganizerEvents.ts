import { GetOrganizerEvents } from '@/api/organizer/getOrganizerEvents';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export function useGetOrganizerEvents({ page }: { page: number }) {
  return useQuery({
    queryKey: ['organizer-events', page],
    queryFn: () => GetOrganizerEvents({ page }),
    placeholderData: keepPreviousData,
  });
}
