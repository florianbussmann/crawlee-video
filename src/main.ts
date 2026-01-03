// For more information, see https://crawlee.dev/
import { Dataset, PlaywrightCrawler } from 'crawlee';

import { router } from './routes.js';

import 'dotenv/config';

const startUrl = process.env.CRAWL_TARGET;

const maxRequestsPerMinute = Number(process.env.MAX_REQUESTS_PER_MINUTE);

const crawler = new PlaywrightCrawler({
    requestHandler: router,
    maxRequestsPerCrawl: parseInt(process.env.MAX_REQUEST_PER_CRAWL || "24"),
    ...(Number.isFinite(maxRequestsPerMinute) && {
        maxRequestsPerMinute,
    }),
});

await crawler.run([startUrl!]);

// Export the entirety of the dataset to a single file in
// the default key-value store under the key "videos"
await Dataset.exportToJSON('videos');
