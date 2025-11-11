import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Das ist unser Browser-Client.
// Damit können wir in Client Components lesen/schreiben.
export const supabase = createClient(supabaseUrl, supabaseKey);
