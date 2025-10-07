import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2"

Deno.serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { journals } = await req.json();

    if (!journals || !Array.isArray(journals)) {
      return new Response(
        JSON.stringify({ error: "Invalid journals payload" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 🧠 Optional: Prevent duplicate inserts based on ID
    // Only insert journals that don't already exist
    const { data: existing } = await supabaseClient
      .from("journals")
      .select("id")
      .in("id", journals.map((j) => j.id));

    const existingIds = existing?.map((e) => e.id) || [];
    // const newJournals = journals.filter((j) => !existingIds.includes(j.id));
    const newJournals = journals.filter(j => !existingIds.includes(j.id)).map(j => ({
      id: j.id,
      user_id: j.user_id,
      title: j.title,
      description: j.description,
      photos: j.photos,
      date: j.date,       // <- important!
      location: j.location,
      tags: j.tags,
      synced: true,
    }));
    

    if (newJournals.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "All journals already exist" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await supabaseClient
      .from("journals")
      .insert(newJournals);

    if (error) throw error;

    return new Response(
      JSON.stringify({
        success: true,
        insertedCount: data?.length || 0,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Bulk insert failed:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
