
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance: ReturnType<typeof createClient> | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase Environment Variables - Client disabled');
} else {
    try {
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    } catch (e) {
        console.error('Failed to initialize Supabase client:', e);
    }
}

// Export a safe proxy that warns but doesn't crash on property access
export const supabase = supabaseInstance || new Proxy({} as any, {
    get: (target, prop) => {
        // Allow checking 'auth' or 'from' without crashing immediately, return a dummy function or object
        console.warn(`Attempted to access Supabase property '${String(prop)}' but client is not initialized.`);
        return () => ({ data: null, error: { message: "Supabase not initialized (Missing Env Vars)" } });
    }
});
