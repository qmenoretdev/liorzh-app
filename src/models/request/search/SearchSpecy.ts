import type { SearchRequestValidity } from "./SearchRequestValidity";

export interface SearchSpecy extends SearchRequestValidity {
  botanicalName: string | null;
  frenchCommonName: string | null;
  englishCommonName: string | null;
  owner: string | null;
}