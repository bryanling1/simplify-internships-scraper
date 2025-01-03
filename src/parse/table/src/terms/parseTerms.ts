import { ElementHandle } from "puppeteer-core";

interface ITerm{
  term: string;
}
export const parseTerms = async (
  td?: ElementHandle<HTMLTableCellElement>,
): Promise<
  ITerm[]
  | undefined
> => {
  let terms = (await td?.evaluate((td) => td.innerText))?.split(", ");
  if (!terms || !terms.length) {
    return;
  }
  return terms.map(term => {
    const match = term.match(/([a-zA-Z]+) ([0-9]{4})/)
    const season = match?.[1];
    const year = match?.[2];
    if(!season || !year) {
      return undefined;
    }
    return {
      term,
    }
  }).filter((x)=>!!x)
};
