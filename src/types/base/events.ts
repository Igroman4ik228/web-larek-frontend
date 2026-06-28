export interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}

export type EventName = string | RegExp;
export type Subscriber = (data: unknown) => void;
export type EmitterEvent = {
	eventName: string;
	data: unknown;
};
