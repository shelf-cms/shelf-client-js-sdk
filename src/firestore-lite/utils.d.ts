import { Reference, CrudOptions } from './Reference';
import Transform from './Transform';
import { FirebaseDocument, FirebaseMap } from './Document';
import { Database } from './Database';
import { Document } from './Document';
export declare type Ref = Reference | Document | string;
/** @private */
declare type RefType = 'doc' | 'col';
/**
 * Trims spaces and slashes from a path
 * @private
 */
export declare function trimPath(path: string): string;
/**
 * Returns true if a variable is a path that points to a collection
 * @private
 */
export declare function isPath(type: RefType, s: any): boolean;
/**
 * Checks if a value is a Reference to a Document
 * @private
 */
export declare function isRef(type: RefType, val: any): boolean;
/** @private */
export declare function isRefType(ref: any): boolean;
/** @private */
export declare function getPathFromRef(ref: Ref): string;
/** @private */
export declare function restrictTo(type: RefType, ref: Ref): string;
/**
 * Checks if a value is a number that is not negative and is an integer
 * @private
 */
export declare function isPositiveInteger(val: any): boolean;
/**
 * Converts an Object to a URI query String
 * @private
 */
export declare function objectToQuery(obj?: any, parentProp?: string): string;
/**
 * Returns an array of keyPaths of an object but skips over array's values
 * @private
 */
export declare function getKeyPaths(object: any, parentPath?: string): string[];
/**
 * Compile options object into firebase valid api arguments object
 * @private
 */
export declare function compileOptions(options: CrudOptions, obj?: any): any;
/**
 * Decodes a Firebase map into a JS object
 * @private
 */
export declare function decode(map: FirebaseMap | FirebaseDocument, db: Database): any;
/**
 * Encodes a JS variable into a Firebase Value
 * @private
 */
export declare function encodeValue(value: any, transforms?: Transform[], parentPath?: string): any;
/**
 * Converts a Javascript object into a write instruction
 * @private
 */
export declare function encode(object: any, transforms?: Transform[], parentPath?: string): FirebaseMap;
/**
 * Generates 22 chars long random alphanumerics unique identifiers
 * @private
 */
export declare function fid(): string;
export {};
