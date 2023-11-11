import type { SearchRequest } from "./SearchRequest";

export interface SearchRequestVisibility extends SearchRequest {
    visibility: string;
}