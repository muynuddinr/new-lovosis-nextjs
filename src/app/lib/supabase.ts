import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Only create client if we have credentials
let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// Types for database tables
export interface AdminUser {
  id: string;
  username: string;
  password_hash: string;
  name: string;
  created_at: string;
}

export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: 'pending' | 'resolved' | 'archived';
  created_at: string;
}

export interface NewsletterEnquiry {
  id: string;
  email: string;
  subscribed_at: string;
  status: 'active' | 'unsubscribed';
}

// Function to check database connection
export async function checkDatabaseConnection(): Promise<boolean> {
  if (!supabase) {
    return false;
  }
  try {
    const { error } = await supabase.from('admin_users').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
}

// Function to check storage connection
export async function checkStorageConnection(): Promise<boolean> {
  if (!supabase) {
    return false;
  }
  try {
    const { data, error } = await supabase.storage.listBuckets();
    return !error && data !== null;
  } catch {
    return false;
  }
}


