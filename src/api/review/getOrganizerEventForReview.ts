import { axiosInstance } from '@/lib/axiosInstance.lib';

export async function GetOragnizerEventForReview() {
  const res = await axiosInstance.get('/reviews/organizer-event/me');

  return res?.data?.data;
}
