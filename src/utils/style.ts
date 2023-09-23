export const cssClass = {
    input: {
        default: "p-2 border-1 border-solid border-round outline-none focus:border-primary w-full",
    },
    container: {
        default: "mt-2 p-3 container"
    }
}
//input: "text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full",

export function getInputClass(error: string): string {
    return cssClass.input.default + (error !== "" ? " input-invalid" : "");
}