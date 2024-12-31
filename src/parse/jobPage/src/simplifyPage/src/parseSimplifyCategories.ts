import { ICategorizations } from "@internwave/scrapers-api";
import { Page } from "puppeteer-core";
import { Selectors } from "src/constants/Selectors";
import { Strings } from "src/constants/Strings";

export const parseSimplifyCategories = async (page: Page, currrentCategories?: ICategorizations): Promise<ICategorizations | undefined> => {
    const out = currrentCategories ?? {};
    try{
        await page.waitForSelector(Selectors.page.simplify.headings);
        const headings = await page.$$(Selectors.page.simplify.headings);
        for(const heading of headings){
            const content = (await page.evaluate(el=>el.textContent, heading))?.trim();
            if(!content){
                continue;
            }
            switch(content){
                case Strings.simplify.noSponsorship:
                    addCategoryIfNotPresent(Strings.noSponsorship.text, out, "specialRequirements");
                    break;
                case Strings.simplify.historicallySponsors:
                    addCategoryIfNotPresent(Strings.simplify.historicallySponsors, out, "specialRequirements");
                    break;
                case Strings.simplify.usCitizenshipRequired:
                    addCategoryIfNotPresent(Strings.usCitizenship.text, out, "specialRequirements");
                    break;
            }
        }
        const industries = await page.$$(Selectors.page.simplify.pills.industry);
        for(const industry of industries){
            const content = (await page.evaluate(el=>el.textContent, industry))?.trim();
            if(!content){
                continue;
            }
            addCategoryIfNotPresent(content, out, "industries");
        }
    }finally{
        return out && Object.keys(out).length ? out : undefined;
    }
}

const addCategoryIfNotPresent = (value: string, categories: ICategorizations, key: keyof ICategorizations):void => {
    if(categories[key]?.includes(value)){
        return;
    }
    categories[key] = categories[key] ? [...categories[key], value] : [value];
}