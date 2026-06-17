import type {
	ExecutionContext,
	ScheduledController,
} from "@cloudflare/workers-types";
import { loadAndValidateConfig } from "./config";
import { syncUserDiscordWidget } from "./services/discord.service";
import { fetchProfileStatistics } from "./services/roblox.service";

async function initialize(env: unknown): Promise<void> {
	console.log(`[INFO] [${new Date().toISOString()}] Starting sync.`);

	try {
		const config = loadAndValidateConfig(env);
		const statistics = await fetchProfileStatistics(config);
		await syncUserDiscordWidget(config.discordUserId, statistics, config);
		console.log(`[INFO] [${new Date().toISOString()}] Initial sync completed.`);
	} catch (error) {
		console.error(
			`[ERROR] [${new Date().toISOString()}] Failed to complete initial sync: ${error}`,
		);
	}
}

export default {
	async scheduled(
		_event: ScheduledController,
		env: unknown,
		ctx: ExecutionContext,
	): Promise<void> {
		ctx.waitUntil(initialize(env));
	},
};
