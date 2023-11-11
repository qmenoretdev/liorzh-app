import type { SearchRequestVisibility } from "./SearchRequestVisibility";

export interface SearchSpecy extends SearchRequestVisibility {
  botanicalName: string | null;
  frenchCommonName: string | null;
  englishCommonName: string | null;
}