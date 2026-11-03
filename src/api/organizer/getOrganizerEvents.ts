import { axiosInstance } from '@/lib/axiosInstance.lib';

export async function GetOrganizerEvents({ page }: { page: number }) {
  const res = await axiosInstance.get('/events/organizerEvents', {
    params: { page },
  });

  return res?.data;
}
