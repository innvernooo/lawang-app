import { axiosInstance } from '@/lib/axiosInstance.lib';
import { OrganizerRegisterOutput } from '../validation/organizerSchema';

export async function RegisterOrganizer(data: OrganizerRegisterOutput) {
  const formData = new FormData();
  formData.append('email', data.email);
  formData.append('username', data.username);
  formData.append('password', data.password);
  if (data.profilePicture?.length)
    formData.append('profilePicture', data.profilePicture[0]);
  formData.append('organizerName', data.organizerName);
  formData.append('organizerType', data.organizerType);
  formData.append('legalName', data.legalName);
  if (data.organizerBio) formData.append('organizerBio', data.organizerBio);
  if (data.websiteUrl) formData.append('websiteUrl', data.websiteUrl);
  if (data.instagramUrl) formData.append('instagramUrl', data.instagramUrl);
  formData.append('npwp', data.npwp);
  if (data.nib) formData.append('nib', data.nib);
  formData.append('picName', data.picName);
  formData.append('picNik', data.picNik);
  formData.append('picPhoneNumber', data.picPhoneNumber);
  formData.append('officeAddress', data.officeAddress);
  formData.append('city', data.city);
  formData.append('province', data.province);
  formData.append('postalCode', data.postalCode);
  formData.append('bankName', data.bankName);
  formData.append('bankAccountNumber', data.bankAccountNumber);
  formData.append('bankAccountHolder', data.bankAccountHolder);
  const res = await axiosInstance.post('/organizers/register', formData);

  return res?.data;
}
