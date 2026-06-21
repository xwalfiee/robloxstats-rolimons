/**
 * Application configuration interface definitions.
 */
export interface EnvironmentConfig {
	readonly discordToken: string;
	readonly discordAppId: string;
	readonly discordUserId: string;
	readonly robloxUserId: string;
}

/**
 * Initializes and validates runtime environment configurations.
 * @throws {Error} If mandatory environment configurations are absent or malformed.
 */
export function loadAndValidateConfig(env: unknown): EnvironmentConfig {
	const { DISCORD_TOKEN, DISCORD_APP_ID, DISCORD_USER_ID, ROBLOX_USER_ID } =
		env as Record<string, string | undefined>;

	if (
		!DISCORD_TOKEN ||
		!DISCORD_APP_ID ||
		!DISCORD_USER_ID ||
		!ROBLOX_USER_ID
	) {
		throw new Error(
			"ConfigurationInitializationException: Missing vital environment variables.",
		);
	}

	return {
		discordToken: DISCORD_TOKEN,
		discordAppId: DISCORD_APP_ID,
		discordUserId: DISCORD_USER_ID,
		robloxUserId: ROBLOX_USER_ID,
	};
}
