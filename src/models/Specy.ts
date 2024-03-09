export interface Specy {
    id: number;
    botanicalName: string;
    upovCode: string | null;
    englishCommonNames: string[];
    frenchCommonNames: string[];
    valid: string;
    owner: string;
}