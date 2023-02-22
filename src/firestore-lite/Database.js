import { Reference } from './Reference';
import { Document } from './Document';
import { restrictTo } from './utils';
import { Transaction } from './Transaction';
import { Query } from './Query';
/** @private */
async function handleApiResponse(res) {
    if (!res.ok) {
        const data = await res.json();
        if (Array.isArray(data))
            throw data.length === 1
                ? Object.assign(new Error(), data[0].error)
                : data;
        throw Object.assign(new Error(), data.error);
    }
    return res.json();
}
/** Database Instance */
export class Database {
    constructor({ projectId, auth, name = '(default)', host = 'firestore.googleapis.com', ssl = true }) {
        if (projectId === undefined)
            throw Error('Database constructor expected the "config" argument to have a valid "projectId" property');
        this.name = name;
        this.auth = auth;
        this.rootPath = `projects/${projectId}/databases/${name}/documents`;
        this.endpoint = `http${ssl ? 's' : ''}://${host}/v1/${this.rootPath}`;
    }
    /**
     * For internal use only.
     * Uses native fetch, but adds authorization headers
     * if the Reference was instantiated with an auth instance.
     * The API is exactly the same as native fetch.
     * @private
     */
    fetch(input, init) {
        if (this.auth && this.auth.authorizedRequest)
            return this.auth.authorizedRequest(input, init).then(handleApiResponse);
        return fetch(input, init).then(handleApiResponse);
    }
    /**
     * Returns a reference to a document or a collection.
     * @param {(string|Document)} path Path to the collection or document.
     * @returns {Reference} instance of a reference.
     */
    ref(path) {
        if (path instanceof Document)
            path = path.__meta__.path;
        return new Reference(path, this);
    }
    async batchGet(refs) {
        const response = await this.fetch(this.endpoint + ':batchGet', {
            method: 'POST',
            body: JSON.stringify({
                documents: refs.map(ref => {
                    const path = restrictTo('doc', ref);
                    return `${this.rootPath}/${path}`;
                })
            })
        });
        return response.map((entry) => entry.found
            ? new Document(entry.found, this)
            : Object.defineProperty({}, '__missing__', { value: entry.missing }));
    }
    /** Returns a new transaction instance */
    transaction() {
        return new Transaction(this);
    }
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
    async runTransaction(fn, attempts = 5) {
        const tx = new Transaction(this);
        while (attempts > 0) {
            await fn(tx);
            // Only retry on transaction errors.
            try {
                await tx.commit();
                break; // Stop trying if it succeeded.
            }
            catch (e) {
                // Only throw if the error is not related to the transaction, or it is the last attempt.
                if (attempts === 0 ||
                    (e.status !== 'NOT_FOUND' && e.status !== 'FAILED_PRECONDITION'))
                    throw Error(e);
            }
            attempts--;
        }
    }
    /**
     * Query all all collections that match the given name that
     * also are descendants of a given document (or root by default).
     */
    collectionGroup(collectionId, options = {}) {
        return new Query(this.ref('parent' in options ? options.parent : ''), {
            from: {
                collectionId,
                allDescendants: true
            },
            ...options
        });
    }
}
