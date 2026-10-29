import { axiosInstance } from '@/lib/axiosInstance.lib';

export async function GetReading() {
  const res = await axiosInstance.get('/readings');

  return res?.data?.data;
}
