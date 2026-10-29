import { GetMusicEvent } from '@/api/event/getMusicEvent';
import { useQuery } from '@tanstack/react-query';

export function useGetMusicEvent() {
  return useQuery({
    queryKey: ['event', 'music'],
    queryFn: GetMusicEvent,
  });
}
