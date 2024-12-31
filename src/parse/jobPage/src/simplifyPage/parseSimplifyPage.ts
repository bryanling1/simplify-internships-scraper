import { IScrapedJob } from "@internwave/scrapers-api";
import { Page } from "puppeteer-core";
import { parseSimplifyCategories } from "src/parse/jobPage/src/simplifyPage/src/parseSimplifyCategories";
import { parseSimplifyCompensation } from "src/parse/jobPage/src/simplifyPage/src/parseSimplifyCompensation";
import { parseSimplifyDescriptions } from "src/parse/jobPage/src/simplifyPage/src/parseSimplifyDescription";

export const parseSimplifyPage = async (page: Page, job: IScrapedJob, url: string): Promise<IScrapedJob> => {
    await page.goto(url);
    const [
        descriptions,
        categories,
        salaries
    ] = await Promise.all([
        parseSimplifyDescriptions(page),
        parseSimplifyCategories(page, job.categorizations),
        parseSimplifyCompensation(page)
    ]);
    return Object.assign(job, {
        descriptions: descriptions.length ? descriptions : undefined,
        categorizations: categories,
        salaries
    });
}