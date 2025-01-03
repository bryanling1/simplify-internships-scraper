import { IScrapedJobSalaries } from "@internwave/scrapers-api";
import { Regex } from "src/constants/Regex";
import { IParser, parse } from "src/lib/parse/parse";

const compensationParsers: IParser<IScrapedJobSalaries>[] = [
    {
      regex: Regex.page.simplify.compensation.hourlyRange,
      parser: (match: RegExpMatchArray) => {
        const min = match[1];
        const max = match[2];
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
      },
    },
    {
        regex: Regex.page.simplify.compensation.hourlyCurrency,
        parser: (match: RegExpMatchArray) => {
          let currency = match[1];
          const amountStr = match[2];
          if(!amountStr){
              return undefined;
          }
          if(currency === "CA"){
            currency = "CAD";
          }
          const amount = parseFloat(amountStr);
          if(isNaN(amount)){
              return undefined;
          }
          return {
              salary: {
                  amount: amountStr,
                  currency,
                  period: "hourly"
              },
          }
        },
    }
]
export const parseSimplifyCompensation = (salary?: string): IScrapedJobSalaries | undefined => {
    return parse(salary, compensationParsers);
}