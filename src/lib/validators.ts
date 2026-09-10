import { z } from 'zod'

export const registrationSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name is too long'),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name is too long'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .max(30, 'Phone number is too long')
    .optional()
    .or(z.literal('')),
  organization: z
    .string()
    .min(1, 'Organisation is required')
    .max(200, 'Organisation name is too long'),
  sub_partner: z
    .string()
    .max(200, 'Sub-partner name is too long')
    .optional()
    .or(z.literal('')),
  role: z.string().min(1, 'Role is required'),
  dietary_requirements: z
    .string()
    .max(500, 'Too long')
    .optional()
    .or(z.literal('')),
  accessibility_needs: z
    .string()
    .max(500, 'Too long')
    .optional()
    .or(z.literal('')),
  travel_needs: z
    .string()
    .max(500, 'Too long')
    .optional()
    .or(z.literal('')),
  accommodation_needs: z
    .string()
    .max(500, 'Too long')
    .optional()
    .or(z.literal('')),
  consent_given: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must consent to data collection to register',
    }),
})

export type RegistrationInput = z.infer<typeof registrationSchema>

export const checkInSchema = z.object({
  qr_code_token: z
    .string()
    .min(1, 'QR code token is required'),
})

export type CheckInInput = z.infer<typeof checkInSchema>
