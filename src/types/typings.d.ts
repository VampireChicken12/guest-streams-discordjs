declare module "*.json";
declare global {
	interface ObjectConstructor {
		keys<T>(o: T): (keyof T)[];
		entries<T>(o: { [K in keyof T]: T[K] }): [keyof T, T[keyof T]][];
	}
}
export {};
