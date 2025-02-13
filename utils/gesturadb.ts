import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qutjxqklxkovjncqtmbv.supabase.co";
const supabaseAnonKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dGp4cWtseGtvdmpuY3F0bWJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODI0MTk2MiwiZXhwIjoyMDUzODE3OTYyfQ.glRiXJhP9m5dLYRpfqyg9hmm4vSAqdP-dVX4je1ELME';

export const supabase = createClient( supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
    },
})