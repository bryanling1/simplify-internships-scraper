import { ElementHandle } from "puppeteer-core";

export const parseCompany = async (
  prevCompany: string,
  td?: ElementHandle<HTMLTableCellElement>,
): Promise<string | undefined> => {
  if (!td) {
    return;
  }
  let company = await td.evaluate((td) => td.innerText);
  if (company === "↳") {
    return prevCompany;
  }
  return company;
};
