import { IScrapedJob } from "@internwave/scrapers-api";
import { ElementHandle } from "puppeteer-core";
import { parseCompany } from "src/parse/table/src/company/parseCompany";
import { parseDatePosted } from "src/parse/table/src/datePosted/parseDatePosted";
import { parseJobTitle } from "src/parse/table/src/jobTitle/parseJobTitle";
import { parseLocationFromTd } from "src/parse/table/src/location/parseLocation";
import { parseLinks } from "src/parse/table/src/links/parseLinks";
import { Collection } from "src/constants/types";

export const parseTableRow = (type: Collection) => async (
  row: ElementHandle<Element>,
  previousCompany: string,
): Promise<IScrapedJob | undefined> => {
  const tds = await row.$$("td");
  const [
    company,
    jobTitleProps,
    location,
    links,
    postedAt,
  ] = await Promise.all([
    parseCompany(previousCompany, tds[0]),
    parseJobTitle(tds[1]),
    parseLocationFromTd(tds[2]),
    parseLinks(tds[3]),
    parseDatePosted(tds[4])
  ]);
  const applyURL = links?.[0]?.url
  if (!applyURL ||!company || !jobTitleProps) {
    return;
  }
  const { jobTitle, specialRequirements } = jobTitleProps;
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
    jobType: type === Collection.NewGrad ? ["New grad"] : ["Internship"],
  };

  return job;
};
