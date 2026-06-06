export const convertUTCToLocal = (utcString: string) => {
    const date = new Date(utcString);
    const localDate = date.toLocaleString();
    return localDate;
}