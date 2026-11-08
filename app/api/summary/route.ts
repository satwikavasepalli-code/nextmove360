
import { createClient } from "@supabase/supabase-js";


export async function GET() {
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!url || !key) {
      return Response.json(
        { error: "Missing Supabase credentials" },
        { status: 500 }
      );
    }

    const supabase = createClient(url, key);

    const { data, error } = await supabase
      .from("dashboard_metrics")
      .select("*")
      .eq("profile_id", 1)
      .single();

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json(data, {
      headers: { "Cache-Control": "no-store" }
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  }
}
