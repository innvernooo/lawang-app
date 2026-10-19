import { FieldPath } from 'react-hook-form';
import { OrganizerRegisterInput } from '../validation/organizerSchema';

export const stepFields: FieldPath<OrganizerRegisterInput>[][] = [
  ['profilePicture', 'email', 'username', 'password', 'confirmPassword'],
  [
    'organizerName',
    'organizerType',
    'legalName',
    'organizerBio',
    'websiteUrl',
    'instagramUrl',
    'npwp',
    'nib',
  ],
  [
    'picName',
    'picPhoneNumber',
    'picNik',
    'officeAddress',
    'city',
    'province',
    'postalCode',
  ],
  ['bankName', 'bankAccountNumber', 'bankAccountHolder', 'agree'],
];
