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
    const title = await page.title();
    log.info(`${title}`, { url: request.loadedUrl });

    await pushData({
        url: request.loadedUrl,
        title,
    });
});
