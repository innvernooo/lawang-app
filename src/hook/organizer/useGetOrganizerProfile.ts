import { GetOrganizerProfile } from '@/api/organizer/getOrganizerProfile';
import { useQuery } from '@tanstack/react-query';

export function usegetOrganizerProfile() {
  return useQuery({
    queryKey: ['organizer'],
    queryFn: GetOrganizerProfile,
  });
}
