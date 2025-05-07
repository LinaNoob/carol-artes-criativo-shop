
import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks for local development
const supabaseUrl = 'https://muidbacwbwwucsqyhdmx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11aWRiYWN3Ynd3dWNzcXloZG14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MTM5MjgsImV4cCI6MjA2MjE4OTkyOH0.cEYcpLE14tZXwkL_H-5x41aAL26fwKxzPYLuKL40mJc';

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
