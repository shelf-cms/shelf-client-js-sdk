import { Query } from './Query';
import { Document } from './Document';
import { List } from './List';
import { trimPath, isPath, objectToQuery, restrictTo, compileOptions } from './utils';
export class Reference {
    constructor(path, db) {
        var _a;
        this.db = db;
        if (typeof path !== 'string')
            throw Error('The "path" argument should be a string');
        // Normalize the path by removing slashes from
        // the beginning or the end and trimming spaces.
        path = trimPath(path);
        this.id = (_a = path.split('/').pop()) !== null && _a !== void 0 ? _a : '';
        this.path = path;
        this.name = `${db.rootPath}/${path}`;
        this.endpoint = `${db.endpoint}/${path}`;
        this.isRoot = path === '';
    }
    /** Returns a reference to the parent document/collection */
    get parent() {
        if (this.isRoot)
            throw Error("Can't get the parent of root");
        return new Reference(this.path.replace(/\/?([^/]+)\/?$/, ''), this.db);
    }
    /** Returns a reference to the parent collection */
    get parentCollection() {
        if (this.isRoot)
            throw Error("Can't get parent of a root collection");
        if (this.isCollection)
            return new Reference(this.path.replace(/(\/([^/]+)\/?){2}$|^([^/]+)$/, ''), this.db);
        return this.parent;
    }
    /** Returns true if this reference is a collection */
    get isCollection() {
        return isPath('col', this.path);
    }
    /** Returns a reference to the specified child path */
    child(path) {
        // Remove starting forward slash
        path = path.replace(/^\/?/, '');
        // Return a newly created document with the new sub path.
        return new Reference(`${this.path}/${path}`, this.db);
    }
    async transact(method, obj, options = {}) {
        const tx = this.db.transaction();
        const res = tx[method](this, obj, options);
        return await tx.commit().then(() => res);
    }
    /** Returns all documents in the collection */
    async list(options = {}) {
        restrictTo('col', this);
        return new List(await this.db.fetch(this.endpoint + objectToQuery(compileOptions(options))), this, options);
    }
    /** Returns the document of this reference. */
    async get(options = {}) {
        restrictTo('doc', this);
        return new Document(await this.db.fetch(this.endpoint + objectToQuery(compileOptions(options))), this.db);
    }
    /** Create a new document with a randomly generated id */
    async add(obj, options = {}) {
        restrictTo('col', this);
        return this.transact('add', obj, options);
    }
    /** Create a new document or overwrites an existing one matching this reference. */
    async set(obj, options = {}) {
        restrictTo('doc', this);
        return this.transact('set', obj, options);
    }
    /** Updates a document while ignoring all missing fields in the provided object. */
    async update(obj, options = {}) {
        restrictTo('doc', this);
        return this.transact('update', obj, options);
    }
    /** Deletes the referenced document from the database. */
    async delete(options = {}) {
        restrictTo('doc', this);
        return this.transact('delete', options);
    }
    /** Queries the child documents/collections of this reference. */
    query(options = {}) {
        restrictTo('col', this);
        return new Query(this.parent, {
            from: {
                collectionId: this.id
            },
            ...options
        });
    }
    toJSON() {
        return {
            referenceValue: this.name
        };
    }
}
