import { IScrapedJob, ProgressReporter } from "@internwave/scrapers-api";
import { ElementHandle, Page } from "puppeteer-core";
import { Links } from "src/constants/Links";
import { Selectors } from "src/constants/Selectors";
import { Collection } from "src/constants/types";
import { parseOffSeasonTableRow } from "src/parse/table/src/tableRow/parseOffSeasonTableRow";
import { parseTableRow } from "src/parse/table/src/tableRow/parseTableRow";

export const parseTableByCollection = async (
  page: Page,
  progressReporter: ProgressReporter,
  collection?: string
)=>{
  switch(collection){
    case Collection.OffSeason:
      return parseTable(page, progressReporter, parseOffSeasonTableRow, Links.offSeason, 5)
    case Collection.NewGrad:
      return parseTable(page, progressReporter, parseTableRow(Collection.NewGrad), Links.newGrad )
    default:
      return parseTable(page, progressReporter, parseTableRow(Collection.Summer), Links.summer)
  }
}

const parseTable = async (
  page: Page,
  progressReporter: ProgressReporter,
  parseTableRow: (
    row: ElementHandle<Element>,
    previousCompany: string,
  )=>Promise<IScrapedJob | undefined>,
  url: string,
  linksColumn: 4 | 5 = 4,
) => {
  const out: IScrapedJob[] = [];
  await page.goto(url);
  const table = await Promise.race([
    page.waitForSelector(Selectors.jobTable.table1).catch(),
    page.waitForSelector(Selectors.jobTable.table2).catch(),
  ]);
  if (!table) {
    throw "Could not locate table";
  }
  const rows = (await table.$$(Selectors.jobTable.rows(linksColumn)))
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
