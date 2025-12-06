// src/env.ts
import dotenv from "dotenv";

dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE) {
  console.error("❌ ERRO: Variáveis do Supabase ausentes no .env");
  console.error("SUPABASE_URL:", process.env.SUPABASE_URL);
  console.error("SUPABASE_SERVICE_ROLE:", process.env.SUPABASE_SERVICE_ROLE);
  throw new Error("Env inválido");
}

export const ENV = {
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE!,
};
