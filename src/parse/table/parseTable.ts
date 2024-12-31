import { IScrapedJob, ProgressReporter } from "@internwave/scrapers-api";
import { Page } from "puppeteer-core";
import { parseTableRow } from "src/parse/table/src/tableRow/parseTableRow";

const BASE_URL = "https://github.com/SimplifyJobs/Summer2025-Internships";

export const parseTable = async (
  page: Page,
  progressReporter: ProgressReporter,
) => {
  const out: IScrapedJob[] = [];
  await page.goto(BASE_URL);
  const table = await Promise.race([
    page.waitForSelector("markdown-accessiblity-table").catch(),
    page.waitForSelector("markdown-accessibility-table").catch(),
  ]);
  if (!table) {
    throw "Could not locate table";
  }
  const rows = (await table.$$("table tbody tr:has(td:nth-child(4) a[href])")).slice(0, 20);
  progressReporter.nextStep("Scraping table", rows.length);
  let prevCompany: string = "";
  for (const [i, row] of rows.entries()) {
    try {
      const job = await parseTableRow(row, prevCompany);
      if (job) {
        out.push(job);
        prevCompany = job.company.name;
      }
    } finally {
      progressReporter.reportProgress(
        `Scraping table job ${i+1} of ${rows.length}`,
      );
    }
  }
  return out;
};
