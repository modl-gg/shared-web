import { z } from 'zod';

export const registrationSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  serverName: z.string()
    .min(3, { message: 'Server name must be at least 3 characters long.' })
    .max(30, { message: 'Server name cannot be longer than 30 characters.' })
    .regex(/^[a-zA-Z0-9_.-]+$/, { message: 'Server name contains invalid characters.' }),
  customDomain: z.string()
    .min(3, { message: 'Subdomain must be at least 3 characters long.' })
    .max(30, { message: 'Subdomain cannot be longer than 30 characters.' })
    .regex(/^[a-z0-9-]+$/, { message: 'Only lowercase letters, numbers, and hyphens are allowed.' }),
  plan: z.enum(['free', 'premium']),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions.',
  }),
});

export type RegistrationSchema = z.infer<typeof registrationSchema>; 