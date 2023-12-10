import { PermissionsBitField, IntentsBitField } from "discord.js";
import type { ClientEvents, PermissionResolvable, BitFieldResolvable, GatewayIntentsString } from "discord.js";

interface EventOptions<E extends keyof ClientEvents> {
	name: E;
	isOnce: boolean;
	handler: (...args: ClientEvents[E]) => void | Promise<void>;
	clientIntents?: BitFieldResolvable<GatewayIntentsString, number>[];
	clientPermissions?: PermissionResolvable[];
}

export class Event<E extends keyof ClientEvents> {
	name: E;
	isOnce: boolean;
	handler: (...args: ClientEvents[E]) => void | Promise<void>;
	clientPermissions: PermissionsBitField;
	clientIntents: IntentsBitField;

	constructor({ name, handler, isOnce = false, clientIntents, clientPermissions }: EventOptions<E>) {
		this.name = name;
		this.handler = handler;
		this.clientIntents = new IntentsBitField(clientIntents ?? 0);
		this.clientPermissions = new PermissionsBitField(clientPermissions ?? 0n);
		this.isOnce = isOnce;
	}
}
export default Event;
