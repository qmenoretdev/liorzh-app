import type { SearchRequestValidity } from "./SearchRequestValidity";
import type { SearchSpecy } from "./SearchSpecy";

export interface SearchVariety extends SearchRequestValidity {
    name: string | null;
    searchSpecy: SearchSpecy;
    owner: string | null;
}