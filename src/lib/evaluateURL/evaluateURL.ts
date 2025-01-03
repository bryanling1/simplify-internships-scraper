import { Page } from "puppeteer-core";

type EvaluateFn<T, Args extends unknown[]> = (document: Document, ...args: Args) => T;
/**
 * Supplied function shouldn't have async calls or imported modules
 * otherwise it will not be serialized.
 */
export const evaluateURL = <Args extends unknown[]> (page: Page, url:string, ...args: Args) => async <T>(fn: EvaluateFn<T, Args>): Promise<T> => {
    const currentUrl = new URL(page.url());
    const target = new URL(url);
    if (currentUrl.hostname !== target.hostname) {
        await page.goto(url);
    }
    return new Promise<T>((resolve, reject) => {
        const serializedFn = fn.toString();
        const result = page.evaluate(  
            (url: string, serializedFn: string, ...args: unknown[]) => {
                return fetch(url)
                .then(response => {
                    return response.text().then(webpage => {
                        const fn = new Function('document', '...args', `return (${serializedFn})(document, ...args)`);
                        const parser = new DOMParser();
                        const document = parser.parseFromString(webpage, 'text/html');
                        return fn(document, ...args as Args);
                    });
                })
            },
            url,
            serializedFn,
            ...args
        );
        result.then(resolve).catch(reject);
    });
};