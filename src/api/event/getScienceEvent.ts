import { axiosInstance } from '@/lib/axiosInstance.lib';

export async function GetScienceEvent() {
  const res = await axiosInstance.get('/events/science');

  return res?.data?.data;
}