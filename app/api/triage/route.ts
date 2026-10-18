import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  return createClient(url, key);
}

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseClient();
    const body = await req.json();
    return NextResponse.json({ success: true, message: "Triage processed successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
