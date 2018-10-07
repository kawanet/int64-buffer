// TypeScript type definitions

/**
 * The current version of TypeScript 3.1 does not support BigInt.
 * TypeScript 3.2 (November 2018) will support it.
 * The reference directives <reference lib="esnext.bigint"/> will work then.
 *
 * @see https://github.com/Microsoft/TypeScript/wiki/Roadmap#32-november-2018
 * @see https://github.com/Microsoft/TypeScript/issues/15096#issuecomment-419654748
 * @see https://github.com/Microsoft/TypeScript/pull/25886
 */

type ArrayType = Uint8Array | ArrayBuffer | number[];

declare abstract class Int64 {
    constructor(value?: number);
	// constructor(value?: BigInt);
    constructor(high: number, low: number);
    constructor(value: string, radix?: number);
    constructor(buf: Buffer);
    constructor(buf: Buffer, offset: number, value?: number);
	// constructor(buf: Buffer, offset: number, value?: BigInt);
    constructor(buf: Buffer, offset: number, high: number, low: number);
    constructor(buf: Buffer, offset: number, value: string, radix?: number);
    constructor(array: ArrayType);
    constructor(array: ArrayType, offset: number, value?: number);
	// constructor(array: ArrayType, offset: number, value?: BigInt);
    constructor(array: ArrayType, offset: number, high: number, low: number);
    constructor(array: ArrayType, offset: number, value: string, radix?: number);

    toNumber(): number;

	// toBigInt(): BigInt;

    toJSON(): number;

    toString(radix?: number): string;

    toBuffer(raw?: boolean): Buffer;

    toArrayBuffer(raw?: boolean): ArrayBuffer;

    toArray(raw?: boolean): number[];
}

export declare class Int64BE extends Int64 {
    static isInt64BE(obj: any): obj is Int64BE;
}

export declare class Uint64BE extends Int64 {
    static isUint64BE(obj: any): obj is Uint64BE;
}

export declare class Int64LE extends Int64 {
    static isInt64LE(obj: any): obj is Int64LE;
}

export declare class Uint64LE extends Int64 {
    static isUint64LE(obj: any): obj is Uint64LE;
}
