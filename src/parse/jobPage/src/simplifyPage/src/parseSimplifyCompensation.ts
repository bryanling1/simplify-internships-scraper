import { IScrapedJobSalaries } from "@internwave/scrapers-api";
import { Page } from "puppeteer-core";
import { Regex } from "src/constants/Regex";
import { Selectors } from "src/constants/Selectors";

export const parseSimplifyCompensation = async (page: Page): Promise<IScrapedJobSalaries | undefined> => {
    try{
        const salary = await page.$eval(Selectors.page.simplify.compensation, el=>el.textContent);
        if(!salary) return undefined;
        const match = Regex.page.simplify.compensation.hourlyRange.exec(salary);
        const min = match?.[1];
        const max = match?.[2];
        if(!min || !max ){
            return undefined;
        }
        const minVal = parseFloat(min);
        const maxVal = parseFloat(max);
        if(isNaN(minVal) || isNaN(maxVal)){
            return undefined;
        }
        return {
            salaryMin: {
                amount: min,
                currency: "USD",
                period: "hourly"
            },
            salaryMax: {
                amount: max,
                currency: "USD",
                period: "hourly"
            }
        }
    }catch(e){
        return undefined;
    }
}