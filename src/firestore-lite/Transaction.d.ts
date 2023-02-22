import { Ref } from './utils';
import { Reference, CrudOptions } from './Reference';
import { Database } from './Database';
export declare class Transaction {
    private db;
    writes: any[];
    preconditions: any;
    constructor(db: Database);
    /**
     * Creates a write instruction and adds it into the
     * transaction writes array.
     * @private
     */
    private write;
    /**
     * Wraps batch get with additional functionality needed in transactions.
     * Transactions need to be atomic. So in order to know that the document
     * wasn't changed concurrently then we save the updateTime of each document.
     *
     * Later we tell the database to use that as a precondition for the write.
     * In other words, if the update time of a document changed, then abort
     * the transaction. However, if a document didn't exist, then we use that
     * as a precondition, telling the database that if it was created concurrently
     * then it should abort the operation.
     */
    get(refs: Array<Reference | string>): Promise<any>;
    add(ref: string | Reference, data: any, options?: CrudOptions): Reference;
    set(ref: Ref, data: any, options?: CrudOptions): void;
    update(ref: Ref, data: any, options?: CrudOptions): void;
    /**
     * Adds a delete operation to the transaction.
     */
    delete(ref: Ref, options?: CrudOptions): void;
    /**
     * Commits the transaction.
     * Will throw if the transaction failed.
     */
    commit(): Promise<undefined>;
}
