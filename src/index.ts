import { API } from "@internwave/scrapers-api";
import puppeteer from "puppeteer-core";
import { parseJobPages } from "src/parse/jobPage/parseJobPages";
import { parseTable } from "src/parse/table/parseTable";

API.onStartScraping(2)(async (_args, progressReporter) => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
  });
  const page = await browser.newPage();
  const jobs = await parseTable(page, progressReporter);
  return parseJobPages(jobs, page, progressReporter)
});
