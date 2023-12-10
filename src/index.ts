import Bot from "@/Bot";
import config from "@/config";

export const bot = new Bot();
(async () => {
	if (config.debug) {
		bot.client.on("debug", console.debug);
	}
	bot.client.login(config.discord.bot.token);
})();
process
	.on("unhandledRejection", (reason, p) => {
		console.error("Unhandled Rejection at: Promise ", p, " reason: ", reason);
	})
	.on("uncaughtException", (exception) => {
		console.error("Uncaught Exception ", exception);
	});
process.on("SIGTERM", async () => {
	bot.client.destroy();
	process.exit(0);
});
