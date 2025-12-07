// src/supabase/supabaseClient.ts

import * as dotenv from "dotenv";
dotenv.config(); // 👈 garante carregamento local (ts-node)

// Supabase
import { createClient } from "@supabase/supabase-js";

// ENV
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;

if (!SUPABASE_URL) {
  throw new Error("❌ Missing SUPABASE_URL in environment variables.");
}

if (!SUPABASE_SERVICE_ROLE) {
  throw new Error("❌ Missing SUPABASE_SERVICE_ROLE in environment variables.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: { persistSession: false },
});

export default supabase;
