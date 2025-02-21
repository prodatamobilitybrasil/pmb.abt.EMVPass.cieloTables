import { ObjectId } from "mongodb";

export interface INoSQLRepository<T> {
    insert(data: T | T[]): Promise<ObjectId | number | undefined>;
    find(data: T): Promise<T | T[] | null | undefined>;
    update(id: ObjectId, toUpdate: T): Promise<number | undefined>;
    delete(id: ObjectId): Promise<number | undefined>;
}
