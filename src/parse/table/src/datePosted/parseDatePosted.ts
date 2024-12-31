import moment from "moment";
import { ElementHandle } from "puppeteer-core";

export const parseDatePosted = async (
  td?: ElementHandle<HTMLTableCellElement>,
): Promise<number | undefined> => {
  const datePosted = await td?.evaluate((td) => td.innerText);
  if (!datePosted) {
    return;
  }
  const out = moment(datePosted, ["MMM DD"]).unix();
  return isNaN(out) ? undefined : out;
};
