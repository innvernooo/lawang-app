import { PostCreateOrder } from '@/api/transaction/postCreateOrder';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function usePostCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: PostCreateOrder,
    onSuccess: (_res, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['tickets', eventId] });
    },
  });
}
