import { z } from 'zod'

const envSchema = z.object({
  VITE_APP_NAME: z.string().min(1),
  VITE_APP_ENV: z.enum(['development', 'test', 'production']).default('development'),
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().optional(),
})

export const env = envSchema.parse({
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME ?? 'Primordial Task',
  VITE_APP_ENV: import.meta.env.VITE_APP_ENV ?? 'development',
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
})