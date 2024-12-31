import { IScrapedJob, ProgressReporter } from "@internwave/scrapers-api";
import { Page } from "puppeteer-core";
import { parseSimplifyPage } from "src/parse/jobPage/src/simplifyPage/parseSimplifyPage";
import { LinkType } from "src/parse/table/src/links/parseLinks";

export const parseJobPages = async (jobs: IScrapedJob[], page: Page, progressReporter: ProgressReporter): Promise<IScrapedJob[]> => {
    progressReporter.nextStep("Scraping job pages", jobs.length);
    for (const [index, job] of jobs.entries()) {
        const simplifyLink = job?.links?.find(link=>link.title === LinkType.Simplify);
        if(!simplifyLink){
            continue;
        }
        const newJob = await parseSimplifyPage(page, job, simplifyLink.url);
        Object.assign(job, newJob);
        progressReporter.reportProgress(`Scraped job page ${index + 1} of ${jobs.length}`);
    }
    return jobs;
}