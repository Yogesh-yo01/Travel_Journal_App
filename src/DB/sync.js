import axios from "axios";
import { getOfflineJournals, updateJournalSync } from "./database";
import { supabase, SUPABASE_ANON_KEY } from "./supabaseClient";

import Toast from 'react-native-simple-toast'

export const syncJournals = async (userId) => {
    const journals = await getOfflineJournals();
    if (journals.length === 0) return;

    const unsynced = journals.filter(j => !j.synced);

    if (unsynced.length === 0) {
        console.log('No unsynced journals');
        Toast.show('Journals already synced');
        return;
    }
    for (const j of unsynced) {
        const payload = {
            id: j.id,
            user_id: userId,
            title: j.title,
            description: j.description,
            photos: j.photos,
            date: j.date,
            location: j.location,
            tags: j.tags,
            created_at: j.createdAt,
        };

        try {
            await axios.post(
                'https://yanraenkstnpmvuxbrwg.supabase.co/functions/v1/bulk-insert-journals',
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                    },
                }
            );
        } catch (err) {
            console.error('Failed to sync journal:', err.response?.data || err.message);
            Toast.show('Some journals failed to sync.');
            return;
        }
    }
};
