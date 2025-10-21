import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ExchangeRate {
  id: string;
  currency_code: string;
  currency_name: string;
  rate_to_mmk: number;
  flag_emoji: string;
  last_updated: string;
}

export interface GoldPrice {
  id: string;
  price_type: string;
  price: number;
  currency: string;
  unit: string;
  last_updated: string;
}
