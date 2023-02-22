import { Document } from './Document';
import { Reference } from './Reference';
interface FromOption {
    /** Reference to the collection */
    collectionId: string;
    /** Whether to make a compound query or not */
    allDescendants?: boolean;
}
declare type FilterOption = [
/** Property name */
string, 
/** Operator */
'<' | '<=' | '>' | '>=' | '==' | 'contains' | 'contains-any' | 'in', 
/** The value to compare against */
any];
interface OrderOption {
    /** The field path to use while ordering */
    field: string;
    /** The direction to order by */
    direction?: 'asc' | 'desc';
}
export interface QueryOptions {
    [key: string]: any;
    /** The fields to return, leave empty to return the whole doc. */
    select?: string[];
    /** The collection to query, Should be set automatically if you are using `ref.query()` */
    from?: FromOption;
    /** Filter used to select matching documents */
    where?: FilterOption[];
    /** The field to use while ordering the results and direction */
    orderBy?: string | OrderOption | Array<string | OrderOption>;
    /** Reference to a document from which to start the query */
    startAt?: Document;
    /** Reference to a document at which to end the query */
    endAt?: Document;
    /** The number of results to skip */
    offset?: number;
    /** The max amount of documents to return */
    limit?: number;
}
/**
 * Query class that represents a Firestore query.
 */
export declare class Query {
    parent: Reference;
    [key: string]: any;
    readonly options: any;
    constructor(parent: Reference, init?: QueryOptions);
    select(fields: QueryOptions['select']): void;
    /**
     * Adds a collection to query.
     */
    from(from: FromOption): this;
    where(fieldPath: QueryOptions['where']): this;
    orderBy(order: QueryOptions['orderBy'], dir?: OrderOption['direction']): this;
    startAt(doc: Document): this;
    endAt(doc: Document): this;
    offset(number: number): this;
    limit(number: number): this;
    run(): Promise<any>;
    toJSON(): {
        structuredQuery: any;
    };
}
export {};
