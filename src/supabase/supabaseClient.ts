import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";

const http = require("http");

const agent = new http.Agent({
  keepAlive: false,
});

globalThis.fetch = (url: any, opts: any = {}) => {
  return fetch(url, { agent, ...opts });
};

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false },
  }
);
