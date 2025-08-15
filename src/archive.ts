import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

const FILE_PATH = path.join(
    './storage/key_value_stores/default',
    'videos.json'
);
const DB_PATH = './storage/archive.db';

async function main() {
    const db = new Database(DB_PATH);
    db.exec(`
        CREATE TABLE IF NOT EXISTS videos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL UNIQUE,
            title TEXT,
            categories TEXT,
            tags TEXT
        )
    `);

    const content = fs.readFileSync(FILE_PATH, 'utf-8');
    let entries = JSON.parse(content);

    const insert = db.prepare(`
        INSERT OR IGNORE INTO videos (url, title, categories, tags)
        VALUES (@url, @title, @categories, @tags)
        `);

    for (const e of entries) {
        insert.run({
            url: e.url,
            title: e.title,
            categories: JSON.stringify(e.info?.categories || []),
            tags: JSON.stringify(e.info?.tags || [])
        });
    }

    console.log(`✅ Imported ${entries.length} entries into SQLite`);

    await db.close();
}

main().catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
