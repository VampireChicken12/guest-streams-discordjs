import { readFileSync } from "fs";
import path from "path";
import Bourne from "@hapi/bourne";
import dotenv from "dotenv";
import JoiBase from "joi";

// Parse arrays and objects
const Joi: typeof JoiBase = JoiBase.extend(
	{
		type: "object",
		base: JoiBase.object(),
		coerce: {
			from: "string",
			method(value) {
				if (value[0] !== "{" && !/^\s*\{/.test(value)) {
					return { value: undefined };
				}
				try {
					return { value: Bourne.parse(value) };
				} catch (ignoreErr) {
					return { value: undefined };
				}
			}
		}
	},
	{
		type: "array",
		base: JoiBase.array(),
		coerce: {
			from: "string",
			method(value) {
				if (typeof value !== "string" || (value[0] !== "[" && !/^\s*\[/.test(value))) {
					return { value: undefined };
				}
				try {
					return { value: Bourne.parse(value) };
				} catch (ignoreErr) {
					return { value: undefined };
				}
			}
		}
	}
);

dotenv.config({ path: path.join(__dirname, "../.env") });

const env = readFileSync(path.join(__dirname, "../.env")).toString().trim();
const envLines = env
	.split("\n")
	.filter((i) => !i.startsWith("#"))
	.filter(Boolean)
	.filter((i) => (i.split("").filter((el) => el === " ").length > 0 ? false : true));
const envKeys = envLines.map((i) => i.split("=")[0]).filter(Boolean);
interface envVarSchema {
	DEBUG: boolean;
	NODE_ENV: "production" | "development";
	DISCORD_BOT_TOKEN: string;
}
const envVarsSchema = Joi.object<envVarSchema>().keys({
	DEBUG: Joi.boolean().optional().default(false).description("Debug mode"),
	NODE_ENV: Joi.string().allow("production", "development").default("production"),
	DISCORD_BOT_TOKEN: Joi.string().required().description("The bot token")
});
const { value: envVars, error } = envVarsSchema
	.prefs({ errors: { label: "key" } })
	.validate(Object.fromEntries(Object.entries(process.env).filter(([key]) => envKeys.includes(key as string))));
if (error) {
	// eslint-disable-next-line no-console
	console.log(error);
	throw new Error(`Config validation error: ${error.message}`);
}

export default {
	debug: envVars.DEBUG,
	node: { env: envVars.NODE_ENV },
	discord: {
		bot: {
			token: envVars.DISCORD_BOT_TOKEN
		}
	}
};
