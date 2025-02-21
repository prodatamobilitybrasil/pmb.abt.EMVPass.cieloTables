export class InitializationVersion {
    private static cuurentVersion: number = 0;
    private static versionInProcess: number = 0;

    static get(): number {
        return InitializationVersion.cuurentVersion;
    }

    static set(version: number): void {
        InitializationVersion.cuurentVersion = version;
    }

    static getInProcess(): number {
        return InitializationVersion.versionInProcess;
    }

    static setInProcess(version: number): void {
        InitializationVersion.versionInProcess = version;
    }
}
