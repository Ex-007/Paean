
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const supabaseUrl = 'https://opjxgfjfjvcexhizvyar.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wanhnZmpmanZjZXhoaXp2eWFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3ODMzMTUsImV4cCI6MjA0ODM1OTMxNX0.Vx5dbIopGNk2EU825CEPSVU5fIrlBp0d2yJi1fL_A80';

const supabase = createClient(supabaseUrl, supabaseKey);
