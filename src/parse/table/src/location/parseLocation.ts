import { ILocation } from "@internwave/scrapers-api";
import { ElementHandle } from "puppeteer-core";
import { IParser, parse } from "src/lib/parse/parse";

const locationParsers: IParser<ILocation>[] = [
  {
    regex: /^(san [a-zA-Z]+)$/i,
    parser: (groups: RegExpMatchArray) => {
      return {
        city: groups[1],
        country: "United States",
      };
    },
  },
  {
    regex: /^Remote$/,
    parser: (_groups: RegExpMatchArray) => {
      return {
        type: "Remote",
      };
    },
  },
  {
    regex: /^NYC$/m,
    parser: () => {
      return {
        city: "New York City",
        state: "NY",
        country: "United States",
      };
    },
  },
  {
    regex: /^([A-Z]+)$/m,
    parser: (groups: RegExpMatchArray) => {
      if (groups[1] === "UK") {
        return {
          country: "United Kingdom",
        };
      }
      if (groups[1] === "US" || groups[1] === "USA") {
        return {
          country: "United States",
        };
      }
      return {
        state: groups[1],
        country: "United States",
      };
    },
  },
  {
    regex: /^(united states of america|united states|america)$/i,
    parser: (_groups: RegExpMatchArray) => {
      return {
        country: "United States",
      };
    },
  },
  {
    regex: /^([A-Za-z]+)$/m,
    parser: (groups: RegExpMatchArray) => {
      if (groups[1] === "Canada" || groups[1] === "America") {
        return {
          country: groups[1],
        };
      }
      return {
        state: groups[1],
        country: "United States",
      };
    },
  },
  {
    regex: /^Remote in ([a-zA-Z \.]+)$/m,
    parser: (groups: RegExpMatchArray) => {
      if (groups[1] === "USA" || groups[1] === "US") {
        return {
          country: "United States",
          type: "Remote",
        };
      } else if (groups[1] === "UK") {
        return {
          country: "United Kingdom",
          type: "Remote",
        };
      }
      return {
        country: groups[1],
        type: "Remote",
      };
    },
  },
  {
    regex: /^([a-zA-Z \.]+)(?: |, )([A-Z \.]+)$/m,
    parser: (groups: RegExpMatchArray) => {
      if (groups[2] === "UK") {
        return {
          city: groups[1],
          country: "United Kingdom",
        };
      }
      return {
        city: groups[1],
        state: groups[2]?.replace(/\./g, ""),
        country: "United States",
      };
    },
  },
  {
    regex: /^([a-zA-Z \.]+)(?: |, )([a-zA-Z \.]+)$/m,
    parser: (groups: RegExpMatchArray) => {
      if (groups[2] === "Canada" || groups[2] === "United States") {
        return {
          state: groups[1],
          country: groups[2],
        };
      }
      return {
        city: groups[1],
        state: groups[2],
        country: "United States",
      };
    },
  },
  {
    regex: /^([a-zA-Z \.]+)(?: |, )([a-zA-Z \.]+)(?: |, )([a-zA-Z \.]+)$/m,
    parser: (groups: RegExpMatchArray) => {
      if (groups[3] === "USA" || groups[3] === "US") {
        return {
          city: groups[1],
          state: groups[2],
          country: "United States",
        };
      }
      return {
        city: groups[1],
        state: groups[2],
        country: groups[3],
      };
    },
  },

  {
    regex: /(United States|USA|US|America)/,
    parser: () => {
      return {
        country: "United States",
      };
    },
  },
];

export const parseLocation = async (
  text?: string,
) => {
  return parse(text, locationParsers);
};


export const parseLocationFromTd = async (
  td?: ElementHandle<HTMLTableCellElement>,
): Promise<ILocation | undefined> => {
  const text = (
    await td?.evaluate((td) => {
      return /[0-9]+ locations/.test(td.innerText.trim().toLowerCase())
        ? td
            .querySelector("details")
            ?.innerHTML.split("</summary>")[1]
            ?.replace(/<br>/g, "\n")
        : td.innerText.trim();
    })
  )?.trim();
  if (!text) {
    return undefined;
  }
  return parseLocation(text);
};


