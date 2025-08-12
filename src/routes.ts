import { createPlaywrightRouter } from 'crawlee';

export const router = createPlaywrightRouter();

router.addDefaultHandler(async ({ enqueueLinks, page, request, log }) => {
    log.info(`Processing ${request.url}...`);

    const itemSelector = '.list-videos > div > .item > a';
    const loadMoreBtnSelector = 'div.load-more > a[data-action="ajax"]';
    const maxPages = 5;
    let clicks = 0;

    while (clicks < maxPages) {
        const loadMoreBtn = await page.$(loadMoreBtnSelector);
        if (!loadMoreBtn) {
            log.info('No more Load More button found, finished loading all items.');
            break;
        }

        const prevCount = await page.$$eval(itemSelector, els => els.length);

        log.info(prevCount.toString());
        await loadMoreBtn.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1500);
        await page.evaluate((btnSelector) => {
            const btn: HTMLElement = document.querySelector(btnSelector)!;
            btn?.click();
        }, loadMoreBtnSelector);

        await page.waitForFunction(
            ({ selector, prev }) => document.querySelectorAll(selector).length > prev,
            {
                selector: itemSelector,
                prev: prevCount,
            }
        );

        clicks++;
    }

    log.info(`enqueueing new URLs`);
    await enqueueLinks({
        selector: itemSelector,
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

            const links = Array.from(item.querySelectorAll('a')).map(a => a.textContent?.trim()).filter((t): t is string => !!t);

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
