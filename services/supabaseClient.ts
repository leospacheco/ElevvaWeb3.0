import { createClient } from '@supabase/supabase-js';

// These variables are expected to be set in your deployment environment (e.g., Vercel)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // This provides a clear error message during development if the .env file is missing
  // or if the variables are not set in the deployment environment.
  throw new Error('Supabase URL and Anon Key must be provided in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
