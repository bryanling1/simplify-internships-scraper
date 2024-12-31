import { IDescription } from "@internwave/scrapers-api";
import { Page } from "puppeteer-core";
import { Selectors } from "src/constants/Selectors";

export const parseSimplifyDescriptions = async (page: Page): Promise<IDescription[]> => {
    const out:IDescription[] = []
    try{
        await page.waitForSelector(Selectors.page.simplify.description.blocks);
        const blocks = await page.$$(Selectors.page.simplify.description.blocks);
        for(const block of blocks){
            const title = await block.$(Selectors.page.simplify.description.block.title);
            const text = await block.$(Selectors.page.simplify.description.block.text);
            const titleText = await page.evaluate(el=>el?.textContent, title);
            const textText = await page.evaluate(el=>el?.innerHTML, text);
            if(!titleText || !textText){
                continue;
            }
            out.push({
                title: titleText,
                content: textText,
                type: "Description"
            });
        }
    }finally{
        return out;
    }
}