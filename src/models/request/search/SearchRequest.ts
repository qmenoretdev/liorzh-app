import type { Pagination } from "./Pagination";

export interface SearchRequest {
    exactSearch: boolean;
    pagination: Pagination;
}