// For more information, see https://crawlee.dev/
import { PlaywrightCrawler } from 'crawlee';

import { router } from './routes.js';

import 'dotenv/config';

const startUrl = process.env.CRAWL_TARGET;

const crawler = new PlaywrightCrawler({
    requestHandler: router,
    maxRequestsPerCrawl: 4,
});

await crawler.run([startUrl!]);
