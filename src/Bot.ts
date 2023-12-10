import { Client } from "discord.js";
import { apiVersion } from "@/discordRest";
import { allEvents, allEventsClientIntents } from "@/events";

export default class Bot {
	client: Client;
	constructor() {
		this.client = new Client({
			rest: { version: apiVersion },
			intents: allEventsClientIntents.bitfield
		});

		this.setupEvents();
	}

	setupEvents() {
		allEvents.forEach(({ name, handler, isOnce }) => {
			console.debug(`Setting up event ${name} - event is ${isOnce ? "once" : "on"}`);
			if (isOnce) {
				// @ts-expect-error - this is fine
				this.client.once(name, handler);
			} else {
				// @ts-expect-error  - this is fine
				this.client.on(name, handler);
			}
		});
	}
}
