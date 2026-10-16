import { createClient } from "@supabase/supabase-js";

// Server-only client — uses service role to bypass RLS.
// Never import this in client components.
export function createServiceClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key, { auth: { persistSession: false } });
}

// Browser / server-component client — uses anon key, respects RLS.
export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!url || !key) throw new Error("Missing Supabase public env vars");
  return createClient(url, key);
}
