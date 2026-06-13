import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lefpbjgwcreiwmynwltc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZnBiamd3Y3JlaXdteW53bHRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNjg0NDUsImV4cCI6MjA5NDk0NDQ0NX0.xjE2SvBThRXu2fZRJJ7MSNFTerI88Emv6hIpdBS1h8o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});