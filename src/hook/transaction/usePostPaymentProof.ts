import { PostPaymentProof } from '@/api/transaction/postPaymentProof';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function usePostPaymentProof() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: PostPaymentProof,
    onSuccess: (_data, { transId }) => {
      queryClient.invalidateQueries({ queryKey: ['transaction', transId] });
    },
  });
}
