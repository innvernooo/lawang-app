import { GetCustomerTrans } from '@/api/transaction/getCustomerTrans';
import { useQuery } from '@tanstack/react-query';

export function useGetCustomerTrans() {
  return useQuery({
    queryKey: ['transcation', 'customer'],
    queryFn: GetCustomerTrans,
  });
}
