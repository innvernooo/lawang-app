import { axiosInstance } from '@/lib/axiosInstance.lib';

export async function GetOrganizerEventDetail(eventId: string) {
  const res = await axiosInstance.get(`/events/organizerEvents/${eventId}`);

  return res?.data?.data;
}
