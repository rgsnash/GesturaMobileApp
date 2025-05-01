import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qutjxqklxkovjncqtmbv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dGp4cWtseGtvdmpuY3F0bWJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyNDE5NjIsImV4cCI6MjA1MzgxNzk2Mn0.HndNvcUzNIwtWwnGJoSWTb2f2ztRVEKcxL7h3nWfmOY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});