import { CreateOrderOutput } from '@/features/order/validation/createOrderSchema';
import { axiosInstance } from '@/lib/axiosInstance.lib';

export async function PostCreateOrder({
  eventId,
  data,
}: {
  eventId: string;
  data: CreateOrderOutput;
}) {
  const res = await axiosInstance.post(`/transactions/${eventId}`, data);

  return res?.data?.data;
}
