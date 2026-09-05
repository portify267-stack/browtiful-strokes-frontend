import { z } from 'zod';

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  phone: z
    .string()
    .trim()
    .min(7, 'Phone number must be at least 7 digits')
    .max(15, 'Phone number cannot exceed 155 digits')
    .regex(/^[0-9+\-() ]{7,15}$/, 'Please enter a valid phone number (7 to 15 digits/symbols)'),
  street: z
    .string()
    .trim()
    .min(5, 'Street address must be at least 5 characters')
    .max(200, 'Street address cannot exceed 200 characters'),
  city: z
    .string()
    .trim()
    .min(2, 'City must be at least 2 characters'),
  state: z
    .string()
    .trim()
    .min(2, 'State must be at least 2 characters'),
  zip: z
    .string()
    .trim()
    .min(4, 'ZIP/Postal code must be at least 4 digits')
    .max(10, 'ZIP/Postal code cannot exceed 10 characters'),
  country: z
    .string()
    .trim()
    .default('India'),
});
