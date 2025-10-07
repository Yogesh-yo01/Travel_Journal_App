import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const SUPABASE_URL = 'https://yanraenkstnpmvuxbrwg.supabase.co'; // replace
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhbnJhZW5rc3RucG12dXhicndnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTI5MTcsImV4cCI6MjA3NDk4ODkxN30.QFS_dfVmx01etm3DZxnLgWVcLHxUVD57DK61LZY3pLU'; // replace
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Supabase URL or ANON KEY is missing!');
}
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    realtime: { enabled: false },
});
