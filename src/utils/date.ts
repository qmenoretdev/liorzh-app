export function toDateTime(strDate: string | undefined) {
    const date = strDate === undefined || strDate === '' ? undefined : new Date(strDate);
    return date === undefined ? undefined : date.toISOString().slice(0, -5) + "Z"
}

export function toStrDate(strDateTime: string) {
    if (strDateTime === undefined || strDateTime === '') return strDateTime;
    const date = new Date(strDateTime);
    return new Intl.DateTimeFormat('default', {dateStyle: 'short'}).format(date);
}

export function toInputDate(strDateTime: string) {
    if (strDateTime === undefined || strDateTime === '') return strDateTime;
    return strDateTime.slice(0, 10);
}