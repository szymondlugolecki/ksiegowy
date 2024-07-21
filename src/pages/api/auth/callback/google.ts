import createClient from "@/lib/supabase/api";
import type { NextApiRequest, NextApiResponse } from "next";
// The client you created from the Server-Side Auth instructions

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).end("Method not allowed");
    return;
  }
  if (!req.url) {
    res.status(400).end("No url provided");
    return;
  }

  const { searchParams, origin } = new URL(
    req.url,
    process.env.NEXT_PUBLIC_BASE_URL
  );
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createClient(req, res);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    console.error("error", error);
    if (!error) {
      return res.redirect(`${origin}${next}`);
    }
  }

  // return the user to an error page with instructions
  return res.redirect(`${origin}/auth/auth-code-error`);
}
