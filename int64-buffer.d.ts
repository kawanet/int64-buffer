// TypeScript type definitions
declare abstract class Int64 
{
	constructor(value?: number);
	constructor(high: number, low: number);
	constructor(value: string, radix?: number);
	constructor(array: Uint8Array);
	constructor(array: ArrayBuffer);
	constructor(array: number[]);
	constructor(buf: Buffer, offset?: number, value?: number);
	constructor(buf: Buffer, offset: number, high: number, low: number);
	constructor(buf: Buffer, offset: number, value: string, radix?: number);
	toNumber(): number;
	toJSON(): number;
	toString(radix?: number): string;
	toBuffer(raw?: boolean): Buffer;
	toArrayBuffer(raw?: boolean): ArrayBuffer;
	toArray(raw?: boolean): number[];
}
export declare class Int64BE extends Int64 
{
	static isInt64BE(obj: any): obj is Int64BE;
}
export declare class Uint64BE extends Int64 
{
	static isUint64BE(obj: any): obj is Uint64BE;
}
