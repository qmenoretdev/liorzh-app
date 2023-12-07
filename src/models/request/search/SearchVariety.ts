import type { SearchRequestVisibility } from "./SearchRequestVisibility";
import type { SearchSpecy } from "./SearchSpecy";

export interface SearchVariety extends SearchRequestVisibility {
    name: string | null;
    searchSpecy: SearchSpecy;
}