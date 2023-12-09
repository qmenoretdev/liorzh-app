import type SelectOption from "@/models/form/SelectOption";

export const VALIDITY = {
    TRUE: { name: 'Oui', value: 'y' } as SelectOption,
    FALSE: { name: 'Non', value: 'n' } as SelectOption,
    ND: { name: 'Non déterminé', value: 'nd' } as SelectOption,
}

export const validityOptions = [VALIDITY.TRUE, VALIDITY.FALSE, VALIDITY.ND];

export function getValidity(validityValues: SelectOption[] | null): string[] {
    if (validityValues === null || validityValues.length === 0) return []
    const validity = [] as string[]
    validityValues.forEach((validityValue: SelectOption) => {
        validity.push(validityValue.value);
    });
    return validity;
}