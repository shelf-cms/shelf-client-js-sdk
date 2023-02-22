import { Database } from './Database';
import { Query, QueryOptions } from './Query';
import { Document } from './Document';
import { List } from './List';
export interface CrudOptions {
    [key: string]: any;
    /**
     * When set to true, the update will only patch the given
     * object properties instead of overwriting the whole document.
     */
    updateMask?: boolean;
    /** An array of the key paths to return back after the operation */
    mask?: string[];
    /**
     * When set to true, the target document must exist.
     * When set to false, the target document must not exist.
     * When undefined, it doesn't matter.
     */
    exists?: boolean;
    /**
     * When set, the target document must exist and have been last updated at that time.
     * A timestamp in RFC3339 UTC "Zulu" format, accurate to nanoseconds.
     */
    updateTime?: string;
}
export declare class Reference {
    readonly db: Database;
    /** The ID of the document inside the collection */
    id: string;
    /** The path to the document relative to the database root */
    path: string;
    /** Whether or not this reference points to the root of the database */
    isRoot: boolean;
    readonly name: string;
    readonly endpoint: string;
    constructor(path: string, db: Database);
    /** Returns a reference to the parent document/collection */
    get parent(): Reference;
    /** Returns a reference to the parent collection */
    get parentCollection(): Reference;
    /** Returns true if this reference is a collection */
    get isCollection(): boolean;
    /** Returns a reference to the specified child path */
    child(path: string): Reference;
    private transact;
    /** Returns all documents in the collection */
    list(options?: any): Promise<List>;
    /** Returns the document of this reference. */
    get(options?: CrudOptions): Promise<Document>;
    /** Create a new document with a randomly generated id */
    add(obj: object, options?: CrudOptions): Promise<void | Reference>;
    /** Create a new document or overwrites an existing one matching this reference. */
    set(obj: object, options?: CrudOptions): Promise<void | Reference>;
    /** Updates a document while ignoring all missing fields in the provided object. */
    update(obj: object, options?: CrudOptions): Promise<void | Reference>;
    /** Deletes the referenced document from the database. */
    delete(options?: CrudOptions): Promise<void | Reference>;
    /** Queries the child documents/collections of this reference. */
    query(options?: QueryOptions): Query;
    toJSON(): {
        referenceValue: string;
    };
}
