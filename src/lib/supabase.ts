import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'Your Supabase URL';
const supabaseKey = 'Your Supabase Public Key';

export const supabase = createClient(supabaseUrl, supabaseKey);
