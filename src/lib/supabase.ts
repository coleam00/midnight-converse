import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gewcfncoqvxnkrbpfonk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdld2NmbmNvcXZ4bmtyYnBmb25rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxODIzMTAsImV4cCI6MjA1MTc1ODMxMH0.EF4gWxkxRLiw6V6H4gXTPGXiGDF5OEgfJIHySm73cTU';

export const supabase = createClient(supabaseUrl, supabaseKey);