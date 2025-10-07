import axios from "axios";
import { getOfflineJournals, updateJournalSync } from "./database";
import { SUPABASE_ANON_KEY } from "./supabaseClient";
import Toast from "react-native-simple-toast";

export const syncJournals = async (userId) => {
    try {
        const journals = await getOfflineJournals();
        if (!journals || journals.length === 0) {
            Toast.show("No journals found to sync");
            return;
        }

        const unsynced = journals.filter((j) => !j.synced);
        if (unsynced.length === 0) {
            Toast.show("All journals already synced");
            return;
        }

        console.log(`🔄 Syncing ${unsynced.length} journals...:`, unsynced);

        // Bulk insert to Supabase
        const response = await axios.post(
            "https://yanraenkstnpmvuxbrwg.supabase.co/functions/v1/bulk-insert-journals",
            {
                journals: unsynced
                    .filter(j => j.user_id) // Only keep journals with a valid user_id
                    .map((j) => ({
                        id: j.id,
                        user_id: j.user_id,
                        title: j.title,
                        description: j.description,
                        photos: j.photos,
                        date: new Date(j.date).toISOString(),
                        location: j.location,
                        tags: j.tags,
                        synced: true,
                    })),
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                },
            }
        );


        console.log("✅ Synced successfully:", response.data);
        Toast.show("Journals synced successfully");

        // Update local SQLite as synced
        for (const j of unsynced) {
            await updateJournalSync(j.id);
        }
    } catch (err) {
        console.error("❌ Sync error:", err.response?.data || err.message);
        Toast.show("Error syncing journals");
    }
};
