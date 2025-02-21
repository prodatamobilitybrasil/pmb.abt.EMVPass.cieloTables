export interface IGateway<T> {
    execute(): Promise<T | undefined>;
};
