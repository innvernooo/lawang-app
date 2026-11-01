import { GetTransDetail } from '@/api/transaction/getTransDetail';
import { useQuery } from '@tanstack/react-query';

export function useTransDetail(transId: string) {
  return useQuery({
    queryKey: ['transaction', transId],
    queryFn: () => GetTransDetail(transId),
    retry: false,
    enabled: !!transId,
  });
}
