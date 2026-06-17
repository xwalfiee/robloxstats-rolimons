import type {
	ExecutionContext,
	ScheduledController,
} from "@cloudflare/workers-types";
import { config } from "./config";
import { syncUserDiscordWidget } from "./services/discord.service";
import { fetchProfileStatistics } from "./services/roblox.service";

async function initialize(): Promise<void> {
	console.log(`[INFO] [${new Date().toISOString()}] Starting sync.`);

	try {
		const statistics = await fetchProfileStatistics();
		await syncUserDiscordWidget(config.discordUserId, statistics);
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
		_env: unknown,
		ctx: ExecutionContext,
	): Promise<void> {
		ctx.waitUntil(initialize());
	},
};
