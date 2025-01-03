export interface IParser<T> {
    regex: RegExp;
    parser: (groups: RegExpMatchArray) => T | undefined;
  }
  
export const parse = <T>(value: string = "", parsers: IParser<T>[]) => {
    for (const parser of parsers) {
            const match = value.match(parser.regex);
            if(!match){
                continue;
            }
            const out = parser.parser(match);
            if(!out){
                continue;
            }
            return out;
    }
    return undefined;
}