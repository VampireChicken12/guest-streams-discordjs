import { Event } from "@/structures";

export const voiceStateUpdateEvent = new Event({
	name: "voiceStateUpdate",
	handler: async (oldVoiceState, newVoiceState) => {
		if (oldVoiceState.channelId === null && newVoiceState.channelId !== null) {
			const { channel, client, member } = newVoiceState;
			if (!channel || !client || !member) return;
			// Check if the bot should operate in this channel
			if (!channel.permissionOverwrites.cache.has(client.user.id)) return;
			const permissions = channel.permissionOverwrites.cache.get(member.id);
			if (!permissions) return;
			// Check if the member already has the permission to view this channel
			if (permissions.allow.has("ViewChannel")) return;
			// Add temporary permissions to view and start streams
			await channel.permissionOverwrites.edit(member, {
				ViewChannel: true,
				Stream: true
			});
		} else if (oldVoiceState.channelId !== null && newVoiceState.channelId === null) {
			const { channel, client, member } = oldVoiceState;
			if (!channel || !client || !member) return;
			// Check if the bot should operate in this channel
			if (!channel.permissionOverwrites.cache.has(client.user.id)) return;
			// Check if member does not have temporary permissions
			if (!channel.permissionOverwrites.cache.has(member.id)) return;
			// Remove temporary permissions when a member leaves the channel
			await channel.permissionOverwrites.delete(member.id);
		}
	},
	isOnce: false,
	clientPermissions: ["ManageChannels", "ViewChannel"],
	clientIntents: ["GuildMembers", "GuildVoiceStates"]
});
