import { PermissionsBitField } from "discord.js";
import config from "./config";
import { allEventsClientPermissions } from "./events";

const clientId = tokenToClientId(config.discord.bot.token);

export function getBotInviteLink(guildId?: string): string {
	const allClientPermissions = new PermissionsBitField([allEventsClientPermissions]);

	const inviteLink = new URL("https://discord.com/oauth2/authorize");
	inviteLink.searchParams.set("client_id", clientId);
	inviteLink.searchParams.set("permissions", allClientPermissions.bitfield.toString());
	inviteLink.searchParams.set("scope", ["bot"].join(" "));

	if (guildId) {
		inviteLink.searchParams.set("guild_id", guildId);
	}

	return inviteLink.toString();
}
export function tokenToClientId(token: string): string {
	const [start] = token.split(".");
	if (!start) throw new Error("Invalid token");
	return Buffer.from(start, "base64").toString("utf-8");
}
