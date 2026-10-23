import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ SUPABASE_URL অথবা SUPABASE_KEY পাওয়া যায়নি! অনুগ্রহ করে .env চেক করুন।");
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');
console.log("✅ Supabase Client Initialized!");