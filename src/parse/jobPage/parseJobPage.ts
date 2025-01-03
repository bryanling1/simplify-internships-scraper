import { IDescription, ICategorizations } from "@internwave/scrapers-api";
import { Page } from "puppeteer-core";
import { Selectors } from "src/constants/Selectors";
import { Strings } from "src/constants/Strings";
import { evaluateURL } from "src/lib/evaluateURL/evaluateURL";

export const parseJobPage = async(page: Page, url: string) => {
    return evaluateURL(
        page, 
        url,
        Selectors.page.simplify,
        Strings
    )((
        document, 
        selectors,
        Strings
    ) => {
        const descriptions:IDescription[] = []
        const blocks = document.querySelectorAll(selectors.description.blocks);
        for(const block of blocks){
            const title = block.querySelector(selectors.description.block.title);
            const text = block.querySelector(selectors.description.block.text);
            const titleText = title?.textContent;
            const textText = text?.innerHTML;
            if(!titleText || !textText){
                continue;
            }
            descriptions.push({
                title: titleText,
                content: textText,
                type: "Description"
            });
        }
        const specialRequirements = new Set<string>();
        const headings = document.querySelectorAll(selectors.headings);
        for(const heading of headings){
            const content = heading.textContent?.trim();
            if(!content){
                continue;
            }
            switch(content){
                case Strings.simplify.noSponsorship:
                    specialRequirements.add(Strings.noSponsorship.text);
                    break;
                case Strings.simplify.historicallySponsors:
                    specialRequirements.add(Strings.simplify.historicallySponsors);
                    break;
                case Strings.simplify.usCitizenshipRequired:
                    specialRequirements.add(Strings.usCitizenship.text);
                    break;
            }
        }
        const industries = new Set<string>();
        const industryPills = document.querySelectorAll(selectors.pills.industry);
        for(const pill of industryPills){
            const content = pill.textContent?.trim();
            if(!content){
                continue;
            }
            industries.add(content);
        } 
        const categories: ICategorizations = {
            specialRequirements: Array.from(specialRequirements),
            industries: Array.from(industries)
        }
        const salaryText = document.querySelector(selectors.compensation)?.textContent ?? undefined;
        return {
            descriptions,
            categories,
            salaryText
        }
    })
}