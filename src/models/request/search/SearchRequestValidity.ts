import type { SearchRequest } from "./SearchRequest";

export interface SearchRequestValidity extends SearchRequest {
    validity: string[] | null;
}