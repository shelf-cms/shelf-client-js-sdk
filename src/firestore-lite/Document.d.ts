import { Database } from './Database';
export interface FirebaseMap {
    /** The map's fields */
    name?: string;
    fields?: {
        [key: string]: any;
    };
}
export interface FirebaseDocument extends FirebaseMap {
    /** The full resource name of the document */
    name: string;
    /** A timestamp in RFC3339 UTC "Zulu" format, accurate to nanoseconds */
    createTime: string;
    /** A timestamp in RFC3339 UTC "Zulu" format, accurate to nanoseconds */
    updateTime: string;
}
export interface Meta {
    /** The database instance used to create this document */
    db: Database;
    /** The ID of the document inside the collection */
    id: string;
    /** The path to the document relative to the database root */
    path: string;
    /** The full resource name of the document */
    name: string;
    /** A timestamp in RFC3339 UTC "Zulu" format, accurate to nanoseconds */
    createTime: string;
    /** A timestamp in RFC3339 UTC "Zulu" format, accurate to nanoseconds */
    updateTime: string;
}
/**
 * Wrapper around a fetched objects that represent a Firestore document.
 * It is supposed to be used as a regular JS object but has a hidden
 * property that holds the meta data of the document.
 *
 * That property is called `__meta__`, it should not be modified, and is non-enumerable.
 * It is used internally to identify the document when writing the
 * data to the database.
 */
export declare class Document {
    [key: string]: any;
    __meta__: Meta;
    constructor(rawDoc: FirebaseDocument, db: Database);
}
