import { encodeValue } from './utils';
/** @private */
function isNumber(v) {
    return typeof v === 'number' && !isNaN(v - v);
}
/** @private */
const transformsMap = {
    serverTimestamp: ['setToServerValue'],
    increment: ['increment', isNumber],
    max: ['maximum', isNumber],
    min: ['minimum', isNumber],
    appendToArray: ['appendMissingElements', Array.isArray],
    removeFromArray: ['removeAllFromArray', Array.isArray]
};
/**
 * Represents a value that is the result of an operation
 * made by the Firebase server. For example `serverTimestamp`
 * can't be known in the client, as it evaluates in the server.
 */
export default class Transform {
    /**
     * @param value when applicable, the value will be used.
     * for example when using `increment` the value will be the number to increment by.
     */
    constructor(name, value) {
        if (!(name in transformsMap))
            throw Error(`Invalid transform name: "${name}"`);
        const [transformName, validator] = transformsMap[name];
        if (validator && !validator(value))
            throw Error(`The value for the transform "${name}" needs to be a${validator === isNumber ? ' number' : 'n array'}.`);
        if (validator === Array.isArray)
            this[transformName] = encodeValue(value).arrayValue;
        else
            this[transformName] =
                name === 'serverTimestamp' ? 'REQUEST_TIME' : encodeValue(value);
    }
}
