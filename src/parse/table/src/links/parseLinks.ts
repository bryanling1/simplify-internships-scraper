import { ElementHandle } from "puppeteer-core";

export enum LinkType {
  Apply = "Apply",
  Simplify = "Simplify listing",
}
interface ILink {
  url: string;
  title: LinkType
}
export const parseLinks = async (
  td?: ElementHandle<HTMLTableCellElement>,
): Promise<ILink[] | undefined> => {
  const out: ILink[] = []
  if(!td){
    return
  }
  const urls = await td.evaluate((td) => {
    const out: string[] = [];
    td.querySelectorAll("a")?.forEach((a) => {
      out.push(a.href);
    });
    return out;
  });
  const applyURL = urls[0];
  const simplifyURL = urls[1];
  if(applyURL){
    out.push({url: applyURL, title: LinkType.Apply});
  }
  if(simplifyURL){
    out.push({url: simplifyURL, title: LinkType.Simplify});
  }
  return out.length ? out : undefined;
};
