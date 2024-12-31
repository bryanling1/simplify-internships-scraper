import { ElementHandle } from "puppeteer-core";
import { Strings } from "src/constants/Strings";

export const parseJobTitle = async (
  td?: ElementHandle<HTMLTableCellElement>,
): Promise<
  | {
      jobTitle: string;
      specialRequirements: string[];
    }
  | undefined
> => {
  let jobTitle = await td?.evaluate((td) => td.innerText);
  if (!jobTitle) {
    return;
  }
  const specialRequirements: string[] = [];
  if (jobTitle.includes(Strings.noSponsorship.icon)) {
    specialRequirements.push(Strings.noSponsorship.text);
  }
  if (jobTitle.includes(Strings.usCitizenship.icon)) {
    specialRequirements.push(Strings.usCitizenship.text);
  }
  jobTitle = jobTitle.replace(/🛂|🇺🇸/g, "").trim();
  return {
    jobTitle,
    specialRequirements,
  };
};
