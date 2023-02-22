import { Document } from './Document';
import { isRef, isPositiveInteger, encodeValue } from './utils';
/** @private */
const operatorsMap = {
    '<': 'LESS_THAN',
    '<=': 'LESS_THAN_OR_EQUAL',
    '>': 'GREATER_THAN',
    '>=': 'GREATER_THAN_OR_EQUAL',
    '==': 'EQUAL',
    contains: 'ARRAY_CONTAINS',
    'contains-any': 'ARRAY_CONTAINS_ANY',
    in: 'IN'
};
/**
 * Checks if a value is a valid filter array.
 * @private
 */
function validateFilter(filter) {
    if (!Array.isArray(filter) || filter.length !== 3)
        throw Error('Filter missing arguments');
    const [fieldPath, op, value] = filter;
    if (typeof fieldPath !== 'string')
        throw Error('Invalid field path');
    if (!(op in operatorsMap))
        throw Error('Invalid operator');
    if ((value === null || Number.isNaN(value)) && filter[1] !== '==')
        throw Error('Null and NaN can only be used with the == operator');
    if (value === undefined)
        throw Error('Invalid comparative value');
}
/**
 * A map of functions used to encode each argument for a query.
 * Each function receives the Library arguments and returns an object
 * that will be converted to Json and sent to the Firestore REST API.
 * @private
 */
const encoders = {
    /**
     * Converts an option from the Query instance into a valid JSON
     * object to use with the Firestores REST API.
     */
    select(fieldsArray) {
        const fields = fieldsArray.map(fieldPath => ({ fieldPath }));
        return fields.length ? { fields } : undefined;
    },
    /** Converts a Query filter(array with three items), into an encoded filter */
    encodeFilter([fieldPath, op, value]) {
        if (Number.isNaN(value) || value === null) {
            return {
                unaryFilter: {
                    field: { fieldPath },
                    op: Number.isNaN(value) ? 'IS_NAN' : 'IS_NULL'
                }
            };
        }
        return {
            fieldFilter: {
                field: { fieldPath },
                op: operatorsMap[op],
                value: encodeValue(value)
            }
        };
    },
    /**
     * Converts an option from the Query instance into a valid JSON
     * object to use with the Firestore's REST API.
     */
    where(option) {
        if (option.length === 0)
            return;
        if (option.length === 1) {
            return this.encodeFilter(option[0]);
        }
        // If there are more than one filters then this is a composite filter.
        return {
            compositeFilter: {
                op: 'AND',
                filters: option.map(this.encodeFilter)
            }
        };
    },
    /**
     * When a startAt or endAt cursor is used,
     * It is necessary to add a __name__ order at the end
     * in order to make sure we start from the right spot.
     */
    orderBy(fields, options) {
        var _a, _b, _c;
        // Only add the __name__ order if a cursor was provided
        // and if its is not already present.
        if ((options.startAt || options.endAt) &&
            ((_a = fields[fields.length - 1]) === null || _a === void 0 ? void 0 : _a.field.fieldPath) !== '__name__')
            fields.push({
                field: { fieldPath: '__name__' },
                // Use the default order when there are no other fields,
                // And if there are fields, use the order of the last one.
                // This adheres to the spec at:
                // https://firebase.google.com/docs/firestore/reference/rest/v1beta1/StructuredQuery
                direction: (_c = (_b = fields[fields.length - 1]) === null || _b === void 0 ? void 0 : _b.direction) !== null && _c !== void 0 ? _c : 'ASCENDING'
            });
        return fields;
    },
    documentToCursor(doc, options) {
        const values = [];
        for (let order of options.orderBy) {
            if (order.field.fieldPath === '__name__') {
                values.push({ referenceValue: doc.__meta__.name });
                continue;
            }
            const value = doc[order.field.fieldPath];
            value && values.push(encodeValue(value));
        }
        return {
            values,
            before: true
        };
    },
    startAt(doc, options) {
        return this.documentToCursor(doc, options);
    },
    endAt(doc, options) {
        return this.startAt(doc, options);
    }
};
/** @private */
const queryOptions = [
    'select',
    'from',
    'where',
    'orderBy',
    'startAt',
    'endAt',
    'offset',
    'limit'
];
/**
 * Query class that represents a Firestore query.
 */
export class Query {
    constructor(parent, init = {}) {
        this.parent = parent;
        this.options = {
            select: [],
            where: [],
            orderBy: []
        };
        if (!isRef('doc', parent))
            throw Error('Expected parent to be a reference to a document');
        // Loop through all the valid options, validate them and then save them.
        for (const option of queryOptions) {
            const optionValue = init[option];
            if (option in init) {
                // If the option is "where" or "orderBy", and is also an array,
                // then it might be a compound value, so we want to pass it one
                // by one to its method.
                //
                // "where" is always an array, because every individual filter
                // is represented by an array, so check to see if its first child
                // is also an array. if it is, then it might be a compound value.
                if ((option === 'where' && Array.isArray(optionValue[0])) ||
                    (option === 'orderBy' && Array.isArray(optionValue))) {
                    optionValue.forEach((val, i) => {
                        // Use try/catch in order to provide context for the error.
                        try {
                            // Try to save the value.
                            this[option](val);
                        }
                        catch (e) {
                            throw Error(`Invalid argument "${option}[${i}]": ${e.message}`);
                        }
                    });
                    continue;
                }
                // If the argument is not an array, then just save it directly.
                // Again, we use try/catch to catch the error and add context to it.
                try {
                    this[option](optionValue);
                }
                catch (e) {
                    throw Error(`Invalid argument "${option}": ${e.message}`);
                }
            }
        }
    }
    select(fields) {
        if (!Array.isArray(fields))
            throw Error('Expected argument to be an array of field paths');
        fields.forEach((field, i) => {
            if (typeof field !== 'string')
                throw Error(`Field path at index [${i}] is not a string`);
            this.options.select.push(field);
        });
    }
    /**
     * Adds a collection to query.
     */
    from(from) {
        let { collectionId = from, allDescendants } = from;
        if (typeof collectionId !== 'string')
            throw Error('Expected "collectionId" to be a string');
        if (allDescendants !== undefined && typeof allDescendants !== 'boolean')
            throw Error('Expected the "allDescendants" to be a boolean');
        this.options.from = {
            collectionId,
            allDescendants
        };
        return this;
    }
    where(fieldPath) {
        const filter = Array.isArray(fieldPath) ? fieldPath : arguments;
        validateFilter(filter);
        this.options.where.push(filter);
        return this;
    }
    orderBy(order, dir = 'asc') {
        const dirMap = {
            asc: 'ASCENDING',
            desc: 'DESCENDING'
        };
        let { field: fieldPath = order, direction = dir } = order;
        direction = dirMap[direction];
        if (typeof fieldPath !== 'string')
            throw Error('"field" property needs to be a string');
        if (direction === undefined)
            throw Error('"direction" property can only be "asc" or "desc"');
        this.options.orderBy.push({ field: { fieldPath }, direction });
        return this;
    }
    startAt(doc) {
        if (!(doc instanceof Document))
            throw Error('Expected a Document instance');
        this.options.startAt = doc;
        return this;
    }
    endAt(doc) {
        if (!(doc instanceof Document))
            throw Error('Expected a Document instance');
        this.options.endAt = doc;
        return this;
    }
    offset(number) {
        if (!isPositiveInteger(number))
            throw Error('Expected an integer that is greater than 0');
        this.options.offset = number;
        return this;
    }
    limit(number) {
        if (!isPositiveInteger(number))
            throw Error('Expected an integer that is greater than 0');
        this.options.limit = number;
        return this;
    }
    async run() {
        var _a;
        let results = await this.parent.db.fetch(this.parent.endpoint + ':runQuery', {
            method: 'POST',
            body: JSON.stringify(this)
        });
        ((_a = results[0]) === null || _a === void 0 ? void 0 : _a.document) || results.splice(0, 1);
        return results.map((result) => new Document(result.document, this.parent.db));
    }
    toJSON() {
        const encoded = {};
        for (const option in this.options) {
            const optionValue = this.options[option];
            if (option in encoders) {
                encoded[option] = encoders[option](optionValue, this.options);
                continue;
            }
            encoded[option] = optionValue;
        }
        return {
            structuredQuery: encoded
        };
    }
}
