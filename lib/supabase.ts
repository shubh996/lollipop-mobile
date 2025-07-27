import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'


const SUPABASE_URL = 'https://hpoornsnjpjjjvurwjle.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwb29ybnNuanBqamp2dXJ3amxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5ODIyNTksImV4cCI6MjA2NTU1ODI1OX0.Qs_YtGb-lHjPH_eZ2KPCkq8tpxwI6jvIz6QFHNBzu3c';


export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})  