import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export type Category = {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Sale = {
  id: string;
  date: string;
  customer_name: string;
  customer_place?: string;
  customer_phone?: string;
  total_amount: number;
  amount_paid: number;
  balance: number;
  material_types: string[]; // Array of category IDs
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type Payment = {
  id: string;
  sale_id: string;
  amount: number;
  payment_date: string;
  comments?: string;
  created_at: string;
};

export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  place: string;
  description: string;
  attended: boolean;
  created_at: string;
  updated_at: string;
};

export type PushSubscription = {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  device_name?: string;
  is_active: boolean;
  created_at: string;
};
