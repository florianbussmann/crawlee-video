import { createPlaywrightRouter } from 'crawlee';

export const router = createPlaywrightRouter();

router.addDefaultHandler(async ({ enqueueLinks, request, log }) => {
    log.info(`Processing ${request.url}...`);

    log.info(`enqueueing new URLs`);
    await enqueueLinks({
        selector: '.list-videos > div > .item > a',
        label: 'detail',
    });
});

router.addHandler('detail', async ({ request, page, log, pushData }) => {
    log.info(`Processing ${request.url}...`);

    const title = await page.title();
    log.info(`${title}`, { url: request.loadedUrl });

    const info = await page.$$eval('div.info > div.item', (items) => {
        const result: { categories: string[]; tags: string[] } = {
            categories: [],
            tags: [],
        };

        items.forEach(item => {
            const label = item.childNodes[0].textContent?.trim().replace(':', '') || '';

            const links = Array.from(item.querySelectorAll('a')).map(a => a.textContent?.trim()).filter(Boolean);

            if (label.toLowerCase() === 'categories') {
                result.categories = links;
            } else if (label.toLowerCase() === 'tags') {
                result.tags = links;
            }
        });

        return result;
    });

    await pushData({
        url: request.loadedUrl,
        title,
        info,
    });
});
