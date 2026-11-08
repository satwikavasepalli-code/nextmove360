
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

    // Retrieve the 8 dashboard metrics
    const dashboard = await supabase
      .from("dashboard_metrics")
      .select("*")
      .eq("profile_id", 1)
      .single();

    // Retrieve the 3 health indicators
    const health = await supabase
      .from("health_metrics")
      .select("*")
      .eq("profile_id", 1)
      .single();

    if (dashboard.error) {
      throw new Error(dashboard.error.message);
    }

    if (health.error) {
      throw new Error(health.error.message);
    }

    // Combine the dashboard and health data
    return Response.json(
      {
        ...dashboard.data,
        health: health.data
      },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );

  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Database connection failed";

    console.error("API error:", message);

    return Response.json(
      { error: message },
      { status: 500 }
    );
  }
}
