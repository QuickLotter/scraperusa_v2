// src/supabase/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "", // SERVICE ROLE REQUIRED!
  {
    auth: { persistSession: false },
  }
);

if (!process.env.SUPABASE_URL) {
  console.error("❌ ERRO: SUPABASE_URL não está definido no .env");
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ ERRO: SUPABASE_SERVICE_ROLE_KEY não está definido no .env");
}
