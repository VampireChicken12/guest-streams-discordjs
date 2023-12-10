import { IntentsBitField, PermissionsBitField } from "discord.js";
import { voiceStateUpdateEvent } from "./voiceStateUpdate";
import { readyEvent } from "./ready";

export const allEvents = [voiceStateUpdateEvent, readyEvent] as const;
export const allEventsClientIntents = allEvents.reduce((acc, event) => {
	if (event.clientIntents) {
		return acc.add(event.clientIntents);
	}
	return acc;
}, new IntentsBitField());
export const allEventsClientPermissions = allEvents.reduce((acc, event) => {
	if (event.clientPermissions) {
		return acc.add(event.clientPermissions);
	}
	return acc;
}, new PermissionsBitField());
