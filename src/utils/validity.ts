import type SelectOption from "@/models/form/SelectOption";

export const VALIDITY = {
    TRUE: { name: 'Oui', value: 'y' } as SelectOption,
    FALSE: { name: 'Non', value: 'n' } as SelectOption,
    ND: { name: 'Non déterminé', value: 'nd' } as SelectOption,
}

export const validityOptions = [VALIDITY.TRUE, VALIDITY.FALSE, VALIDITY.ND];

export function selectOptionsToValidity(validityValues: SelectOption[] | null): string[] {
    if (validityValues === null || validityValues.length === 0) return []
    const validity = [] as string[]
    validityValues.forEach((validityValue: SelectOption) => {
        validity.push(validityValue.value);
    });
    return validity;
}

export function showValidity(validityValue: string): string {
    if (validityValue === VALIDITY.TRUE.value) return VALIDITY.TRUE.name;
    if (validityValue === VALIDITY.FALSE.value) return VALIDITY.FALSE.name;
    if (validityValue === VALIDITY.ND.value) return VALIDITY.ND.name;
    return '';
}