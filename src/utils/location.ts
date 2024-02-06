import type SelectOption from "@/models/form/SelectOption";

export const LOCATION = {
    OUTSIDE: { name: 'location.locationOptions.outside', value: 'outside' } as SelectOption,
    INSIDE: { name: 'location.locationOptions.inside', value: 'inside' } as SelectOption,
    GREENHOUSE: { name: 'location.locationOptions.greenhouse', value: 'greenhouse' } as SelectOption,
    TUNNEL: { name: 'location.locationOptions.tunnel', value: 'tunnel' } as SelectOption,
    OTHER: { name: 'location.locationOptions.other', value: 'other' } as SelectOption,
}

export const locationOptions = [LOCATION.OUTSIDE, LOCATION.INSIDE, LOCATION.GREENHOUSE, LOCATION.TUNNEL, LOCATION.OTHER];

export function selectOptionsToLocation(locationValues: SelectOption[] | null): string[] {
    if (locationValues === null || locationValues.length === 0) return []
    const location = [] as string[]
    locationValues.forEach((validityValue: SelectOption) => {
        location.push(validityValue.value);
    });
    return location;
}

export function showLocation(locationValue: string): string {
    if (locationValue === LOCATION.OUTSIDE.value) return LOCATION.OUTSIDE.name;
    if (locationValue === LOCATION.INSIDE.value) return LOCATION.INSIDE.name;
    if (locationValue === LOCATION.GREENHOUSE.value) return LOCATION.GREENHOUSE.name;
    if (locationValue === LOCATION.TUNNEL.value) return LOCATION.TUNNEL.name;
    if (locationValue === LOCATION.OTHER.value) return LOCATION.OTHER.name;
    return '';
}