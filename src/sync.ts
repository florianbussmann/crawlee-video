import { Configuration } from 'crawlee';

const config = new Configuration({
    purgeOnStart: false,
});

import { Dataset } from 'crawlee';
import { MongoClient } from 'mongodb';

async function sync(): Promise<void> {
    const client = new MongoClient('mongodb://mongodb:27017');
    await client.connect();

    const db = client.db('crawlee');
    const resultsCollection = db.collection('video');

    console.log("Connected to MongoDB");

    await resultsCollection.createIndex({ url: 1 }, { unique: true });

    const dataset = await Dataset.open();
    const data = await dataset.getData();

    await resultsCollection.insertMany(data.items);

    client.close();
}

sync().catch(err => console.error("Sync failed:", err));
