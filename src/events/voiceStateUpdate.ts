import { VoiceBasedChannel, GuildMember } from "discord.js";
import { Event } from "@/structures";
async function removeTemporaryPermissions({ channel, member }: { channel: VoiceBasedChannel; member: GuildMember }) {
	// Check if member does not have temporary permissions
	if (!channel.permissionOverwrites.cache.has(member.id)) return;
	// Remove temporary permissions when a member leaves the channel
	await channel.permissionOverwrites.delete(member.id);
}
export const voiceStateUpdateEvent = new Event({
	name: "voiceStateUpdate",
	handler: async (oldVoiceState, newVoiceState) => {
		if (oldVoiceState.channelId !== null && newVoiceState.channelId === null) {
			const { channel: oldChannel, client, member } = oldVoiceState;
			if (!oldChannel || !client || !member) return;
			// Check if the bot should operate in this channel
			if (!oldChannel.permissionOverwrites.cache.has(client.user.id)) return;
			await removeTemporaryPermissions({ channel: oldChannel, member });
		} else if (oldVoiceState.channelId !== null && newVoiceState.channelId !== null && oldVoiceState.channelId !== newVoiceState.channelId) {
			const { channel: newChannel, client, member } = newVoiceState;
			if (!newChannel || !client || !member) return;
			// Check if the bot should operate in this channel
			if (!newChannel.permissionOverwrites.cache.has(client.user.id)) {
				const { channel, client, member } = oldVoiceState;
				if (!channel || !client || !member) return;
				await removeTemporaryPermissions({ channel, member });
			} else {
				const { channel: oldChannel } = oldVoiceState;
				if (!oldChannel || !client || !member) return;
				// Check if member has temporary permissions
				if (oldChannel.permissionOverwrites.cache.has(member.id)) {
					// Remove temporary permissions when a member leaves the channel
					await oldChannel.permissionOverwrites.delete(member.id);
				}
				// Add temporary permissions to view and start streams
				await newChannel.permissionOverwrites.edit(member, {
					ViewChannel: true,
					Stream: true,
					Connect: true
				});
			}
		}
	},
	isOnce: false,
	clientPermissions: ["ManageChannels", "ViewChannel"],
	clientIntents: ["GuildVoiceStates", "Guilds"]
});
