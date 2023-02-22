import { Document, FirebaseDocument } from './Document';
import { Reference } from './Reference';
interface FirebaseList {
    documents: FirebaseDocument[];
    nextPageToken: string;
}
export interface FirebaseListOptions {
    pageSize?: number;
    pageToken?: string;
    orderBy?: string;
    showMissing?: boolean;
}
/**
 * Represents a collection list response, with functionality
 * for getting the next page when available.
 * @param {Object} rawList The response "raw" list object.
 * @param {Reference} ref A reference to the collection.
 * @param {Object} options Any options that were passed at first to the get request.
 */
export declare class List {
    ref: Reference;
    options: any;
    documents: Document[];
    constructor(rawList: FirebaseList, ref: Reference, options?: FirebaseListOptions);
    /** Fetches the next page in the query */
    getNextPage(): Promise<List>;
    [Symbol.iterator](): {
        next: () => {
            value: Document;
            done: boolean;
        } | {
            done: boolean;
            value?: undefined;
        };
    };
}
export {};
