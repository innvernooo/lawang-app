import { GetCustomerData } from '@/api/customer/getCustomerData';
import { useQuery } from '@tanstack/react-query';

export function useGetCustomerData() {
  return useQuery({
    queryKey: ['customer', 'me'],
    queryFn: GetCustomerData,
  });
}
