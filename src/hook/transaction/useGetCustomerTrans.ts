import { GetCustomerTrans } from '@/api/transaction/getCustomerTrans';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export function useGetCustomerTrans({ page }: { page: number }) {
  return useQuery({
    queryKey: ['transcation', 'customer', page],
    queryFn: () => GetCustomerTrans({ page }),
    placeholderData: keepPreviousData,
  });
}
