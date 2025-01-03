import { ICategorizations } from "@internwave/scrapers-api";

export const mergeCategories = (x?: ICategorizations, y?: ICategorizations): ICategorizations | undefined => {
    if(!x){
        return y;
    }
    if(!y){
        return x;
    }
    const map: {[key in keyof ICategorizations]: Set<string>} = {}
    for(const key of Object.keys(x) as (keyof ICategorizations)[]){
        map[key] = new Set(x[key])
    }
    for(const key of Object.keys(y) as (keyof ICategorizations)[]){
        if(!map[key]){
            map[key] = new Set(y[key])
        } else {
            if(!y[key]){
                continue;
            }
            for(const value of y[key]){
                map[key].add(value)
            }
        }
    }
    const out: ICategorizations = {}
    for(const [key, value] of Object.entries(map)){
        out[key as keyof ICategorizations] = Array.from(value)
    }
    return out;
} 