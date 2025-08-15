# crawlee-video

[Crawlee](https://crawlee.dev) + PlaywrightCrawler + TypeScript example project using template for developing with `PlaywrightCrawler`. Use this to bootstrap your projects using the most up-to-date code.

For subsequent runs use `npx crawlee run --no-purge`. Videos detected from crawl will be listed under `storage/key_value_stores/default/videos.json`.

Crawl results can be archived to sqlite3 database (storage/archive.db) using `npm run archive`.

If you're looking for other examples or want to learn more visit:

- [Documentation](https://crawlee.dev/js/api/playwright-crawler/class/PlaywrightCrawler)
- [Examples](https://crawlee.dev/js/docs/examples/playwright-crawler)
