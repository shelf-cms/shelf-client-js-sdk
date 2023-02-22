import { Reference } from './Reference';
import { Document } from './Document';
import { Transaction } from './Transaction';
import { Query, QueryOptions } from './Query';
interface Auth {
    authorizedRequest(input: RequestInfo, init?: RequestInit): Promise<Response>;
}
export interface DatabaseOptions {
    /** Firebase's project ID */
    projectId: string;
    /** The name to use for this database instance */
    name?: string;
    /** Auth instance */
    auth?: Auth;
    /**
     * Host to use as the firebase endpoint, intended for use with emulators.
     * Don't include trailing slashes.
     */
    host?: String;
    /** Whether to use the HTTPS protocol or not. Set to false for emulators.*/
    ssl?: boolean;
}
interface UpdateFunction {
    (tx: Transaction): Promise<void> | void;
}
/** Database Instance */
export declare class Database {
    name: string;
    rootPath: string;
    endpoint: string;
    auth?: Auth;
    constructor({ projectId, auth, name, host, ssl }: DatabaseOptions);
    /**
     * For internal use only.
     * Uses native fetch, but adds authorization headers
     * if the Reference was instantiated with an auth instance.
     * The API is exactly the same as native fetch.
     * @private
     */
    fetch(input: RequestInfo, init?: RequestInit): Promise<any>;
    /**
     * Returns a reference to a document or a collection.
     * @param {(string|Document)} path Path to the collection or document.
     * @returns {Reference} instance of a reference.
     */
    ref(path: string | Document): Reference;
    batchGet(refs: Array<Reference | string>): Promise<any>;
    /** Returns a new transaction instance */
    transaction(): Transaction;
    /**
     * Executes the given `updateFunction` and attempts to commit
     * the changes applied within it as a Transaction. If any document
     * read within the transaction has changed, Cloud Firestore retries
     * the updateFunction. If it fails to commit after 5 attempts, the
     * transaction fails and throws.
     *
     * Will not re-attempt if an error is thrown inside the `updateFunction`
     * or if any error that is not related to the transaction is received
     * like a network error etc.
     */
    runTransaction(fn: UpdateFunction, attempts?: number): Promise<void>;
    /**
     * Query all all collections that match the given name that
     * also are descendants of a given document (or root by default).
     */
    collectionGroup(collectionId: string, options?: QueryOptions): Query;
}
export {};
