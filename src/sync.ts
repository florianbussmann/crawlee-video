import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';

import { Dataset } from 'crawlee';

const VideoSchema = new Schema(
    {
        info: {
            type: Schema.Types.Mixed,
            required: true,
        },
        url: { type: String, index: true, unique: true },
        title: { type: String },
    },
    {
        timestamps: true,
    }
);

export const VideoModel = model('Video', VideoSchema);

async function sync(): Promise<void> {
    await mongoose.connect('mongodb://mongodb:27017/crawlee');
    console.log("Connected to MongoDB");

    const dataset = await Dataset.open();
    const data = await dataset.getData();

    await VideoModel.bulkWrite(
        data.items.map(item => ({
            updateOne: {
                filter: { url: item.url },
                update: {
                    $set: item,
                },
                upsert: true,
            },
        }))
    );

    await mongoose.disconnect();
}

sync().catch(err => console.error("Sync failed:", err));
