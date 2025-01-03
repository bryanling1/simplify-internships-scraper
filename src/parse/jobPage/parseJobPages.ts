import { IScrapedJob, ProgressReporter } from "@internwave/scrapers-api";
import { Page } from "puppeteer-core";
import { mergeCategories } from "src/lib/mergeCategories/mergeCategories";
import { parseJobPage } from "src/parse/jobPage/parseJobPage";
import { parseSimplifyCompensation } from "src/parse/jobPage/src/parseSimplifyCompensation";
import { LinkType } from "src/parse/table/src/links/parseLinks";

export const parseJobPages = async (jobs: IScrapedJob[], page: Page, progressReporter: ProgressReporter): Promise<IScrapedJob[]> => {
    progressReporter.nextStep("Scraping job pages", jobs.length);
    for (const [index, job] of jobs.entries()) {
        try{
            const simplifyLink = job?.links?.find(link=>link.title === LinkType.Simplify);
            if(!simplifyLink){
                throw("No Simplify link found");
            }
            const {
                descriptions,
                categories,
                salaryText
            } = await parseJobPage(page, simplifyLink.url);
            job.descriptions = descriptions;
            job.categorizations = mergeCategories(job.categorizations, categories);
            job.salaries = parseSimplifyCompensation(salaryText)
        }catch{}finally{
            progressReporter.reportProgress(`Scraped job page ${index + 1} of ${jobs.length}`);
        }
        
    }
    return jobs;
}