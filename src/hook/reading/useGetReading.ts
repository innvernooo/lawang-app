import { GetReading } from '@/api/reading/getReading';
import { useQuery } from '@tanstack/react-query';

export function useGetReading() {
  return useQuery({
    queryKey: ['event', 'reading'],
    queryFn: GetReading,
  });
}
