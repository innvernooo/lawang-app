import { GetTransactionById } from '@/api/event/getTransactionById';
import { useQuery } from '@tanstack/react-query';

export function useGetTransactionById(eventId: string) {
  return useQuery({
    queryKey: ['transaction', eventId],
    queryFn: () => GetTransactionById(eventId),
  });
}
