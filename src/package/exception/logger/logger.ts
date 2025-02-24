export function Log(context: string, message: string): void {
    console.log(`${new Date().toISOString()} - ${context} | ${message}`);
}