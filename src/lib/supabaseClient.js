import { createClient } from '@supabase/supabase-js';

// Inserisci i valori del tuo progetto Supabase
const SUPABASE_URL = "https://qkkxavsjtbzhnsrxxnen.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Hboz00Iq2THzP8v-l4c6mA_YuqZHhWW";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


