import { Event } from "@/structures";
import { getBotInviteLink } from "@/utils";

export const readyEvent = new Event({
	name: "ready",
	handler: async (client) => {
		console.log(`Client ready as ${client.user?.tag} Invite: ${getBotInviteLink()}`);
	},
	isOnce: true,
	clientPermissions: [],
	clientIntents: []
});
