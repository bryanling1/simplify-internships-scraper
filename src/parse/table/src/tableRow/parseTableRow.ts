import { IScrapedJob } from "@internwave/scrapers-api";
import { ElementHandle } from "puppeteer-core";
import { parseCompany } from "src/parse/table/src/company/parseCompany";
import { parseDatePosted } from "src/parse/table/src/datePosted/parseDatePosted";
import { parseJobTitle } from "src/parse/table/src/jobTitle/parseJobTitle";
import { parseLocation } from "src/parse/table/src/location/parseLocation";
import { parseLinks } from "src/parse/table/src/links/parseLinks";

export const parseTableRow = async (
  row: ElementHandle<Element>,
  previousCompany: string,
): Promise<IScrapedJob | undefined> => {
  const tds = await row.$$("td");
  const company = await parseCompany(previousCompany, tds[0]);
  if (!company) {
    return;
  }
  const jobTitleProps = await parseJobTitle(tds[1]);
  if (!jobTitleProps) {
    return;
  }
  const { jobTitle, specialRequirements } = jobTitleProps;
  const links = await parseLinks(tds[3]);
  const applyURL = links?.[0]?.url
  if (!applyURL) {
    return;
  }
  const postedAt = await parseDatePosted(tds[4]);
  const location = await parseLocation(tds[2]);
  const job: IScrapedJob = {
    id: applyURL,
    company: {
      name: company,
    },
    dates: {
      postedAt,
    },
    categorizations: {
      specialRequirements: specialRequirements.length
        ? specialRequirements
        : undefined,
    },
    location,
    jobTitle,
    links: links.length ? links : undefined,
  };

  return job;
};
