import { axiosInstance } from '@/lib/axiosInstance.lib';

export async function GetReviewByEvent(eventId: string) {
  const res = await axiosInstance.get(`/reviews/${eventId}`);

  return res?.data?.data;
}
