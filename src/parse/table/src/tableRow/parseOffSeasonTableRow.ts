import { IScrapedJob } from "@internwave/scrapers-api";
import { ElementHandle } from "puppeteer-core";
import { parseCompany } from "src/parse/table/src/company/parseCompany";
import { parseDatePosted } from "src/parse/table/src/datePosted/parseDatePosted";
import { parseJobTitle } from "src/parse/table/src/jobTitle/parseJobTitle";
import { parseLocationFromTd } from "src/parse/table/src/location/parseLocation";
import { parseLinks } from "src/parse/table/src/links/parseLinks";
import { parseTerms } from "src/parse/table/src/terms/parseTerms";

export const parseOffSeasonTableRow = async (
  row: ElementHandle<Element>,
  previousCompany: string,
): Promise<IScrapedJob | undefined> => {
  const tds = await row.$$("td");
  const [
    company,
    jobTitleProps,
    location,
    terms,
    links,
    postedAt,
  ]  = await Promise.all([
    parseCompany(previousCompany, tds[0]),
    parseJobTitle(tds[1]),
    parseLocationFromTd(tds[2]),
    parseTerms(tds[3]),
    parseLinks(tds[4]),
    parseDatePosted(tds[5])
  ]
  )
  const applyURL = links?.[0]?.url
  if (!applyURL || !company || !jobTitleProps) {
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
    jobType: ["Internship"],
    descriptions: terms?.length ? [{
      title: "Available terms",
      content: terms.map(term => term.term).join(", "),
      type: "Description"
    }] : undefined,
  };

  return job;
};
