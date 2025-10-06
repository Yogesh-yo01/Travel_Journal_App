import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

let db;

export const initDB = async () => {
    db = await SQLite.openDatabase({ name: 'travel_journal.db', location: 'default' });

    await db.executeSql(`
    CREATE TABLE IF NOT EXISTS journals (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT,
      title TEXT,
      description TEXT,
      photos TEXT,
      date TEXT,
      location TEXT,
      tags TEXT,
      synced INTEGER
    );
  `);
    // ✅ Check if 'user_id' column exists, add if missing
    const result = await db.executeSql(`PRAGMA table_info(journals);`);
    const columns = result[0].rows.raw().map((col) => col.name);

    if (!columns.includes('user_id')) {
        console.log('Adding missing column: user_id');
        await db.executeSql(`ALTER TABLE journals ADD COLUMN user_id TEXT;`);
    }

    return db;
};

export const insertJournal = async (journal) => {
    const { id, user_id, title, description, photos, date, location, tags, synced } = journal;
    await db.executeSql(
        `INSERT INTO journals (id, user_id, title, description, photos, date, location, tags, synced) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, user_id, title, description, JSON.stringify(photos), date, location, JSON.stringify(tags), synced ? 1 : 0]
    );
};

export const getOfflineJournals = async () => {
    const results = await db.executeSql(`SELECT * FROM journals ORDER BY date DESC`);
    const journals = [];
    results.forEach(result => {
        for (let i = 0; i < result.rows.length; i++) {
            const row = result.rows.item(i);
            journals.push({
                ...row,
                photos: JSON.parse(row.photos),
                tags: JSON.parse(row.tags),
                synced: row.synced === 1
            });
        }
    });
    return journals;
};
export const getOfflineJournalsByUser = async (user_id) => {
    const results = await db.executeSql(`SELECT * FROM journals WHERE user_id = ? ORDER BY date DESC`, [user_id]);
    const journals = [];
    results.forEach(result => {
        for (let i = 0; i < result.rows.length; i++) {
            const row = result.rows.item(i);
            journals.push({
                ...row,
                photos: JSON.parse(row.photos),
                tags: JSON.parse(row.tags),
                synced: row.synced === 1
            });
        }
    });
    return journals;
};

export const updateJournalSync = async (id) => {
    await db.executeSql(`UPDATE journals SET synced = 1 WHERE id = ?`, [id]);
};
export const updateJournal = async (journalData) => {
    const { id, title, description, photos, date, location, tags, synced } = journalData;
    const photosJson = JSON.stringify(photos);
    const tagsJson = JSON.stringify(tags);
    const dateStr = date instanceof Date ? date.getTime() : date;

    await db.executeSql(
        `UPDATE journals SET title = ?, description = ?, photos = ?, date = ?, location = ?, tags = ?, synced = ? WHERE id = ?`,
        [title, description, photosJson, dateStr, location, tagsJson, synced ? 1 : 0, id]
    );
};
  
export const deleteJournal = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM journals WHERE id = ?',
                [id],
                (_, result) => resolve(result),
                (_, error) => reject(error)
            );
        });
    });
  };
