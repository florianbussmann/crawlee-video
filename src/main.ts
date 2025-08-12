// For more information, see https://crawlee.dev/
import { Dataset, PlaywrightCrawler } from 'crawlee';

import { router } from './routes.js';

import 'dotenv/config';

const startUrl = process.env.CRAWL_TARGET;

const crawler = new PlaywrightCrawler({
    requestHandler: router,
    maxRequestsPerCrawl: 16,
});

await crawler.run([startUrl!]);

// Export the entirety of the dataset to a single file in
// the default key-value store under the key "videos"
await Dataset.exportToJSON('videos');
