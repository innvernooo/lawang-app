import { axiosInstance } from '@/lib/axiosInstance.lib';
import { CustomerRegisterOutput } from '../validation/customerSchema';

export async function CustomerFormData(data: CustomerRegisterOutput) {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('username', data.username);
  formData.append('email', data.email);
  formData.append('password', data.password);
  if (data.nik) formData.append('nik', data.nik);
  if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
  if (data.referralCode) formData.append('referralCode', data.referralCode);
  if (data.profilePicture?.length)
    formData.append('profilePicture', data.profilePicture[0]);

  const res = await axiosInstance.post('/customers/register', formData);
  return res?.data;
}
