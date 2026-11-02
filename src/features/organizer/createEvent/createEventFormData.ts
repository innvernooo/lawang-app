import { axiosInstance } from '@/lib/axiosInstance.lib';
import { CreateEventOutput } from '../validation/createEventSchema';

export async function CreateEventFormData(data: CreateEventOutput) {
  const formData = new FormData();

  formData.append('name', data.name);
  formData.append('description', data.description);
  formData.append('category', data.category);
  formData.append('city', data.city);
  formData.append('venue', data.venue);
  formData.append('pricingType', data.pricingType);
  formData.append('startDate', data.startDate.toISOString());
  formData.append('endDate', data.endDate.toISOString());
  formData.append('totalSeats', String(data.totalSeats));
  if (data.imageUrl?.[0]) formData.append('profilePicture', data.imageUrl[0]);
  const res = await axiosInstance.post('/events/create/me', formData);

  return res?.data?.data;
}
