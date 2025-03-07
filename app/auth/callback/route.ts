// app/auth/callback/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.getUser(
    request.nextUrl.searchParams.get("code") || ""
  );

  if (error || !data.user) {
    return NextResponse.redirect(
      new URL("/sign-in?error=Auth%20failed", request.url)
    );
  }

  return NextResponse.redirect(new URL("/protected/panel", request.url));
}
