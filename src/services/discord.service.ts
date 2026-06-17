import axios from "axios";
import type { EnvironmentConfig } from "../config";
import type { DiscordWidgetPayload } from "../types/discord";
import type { NormalizedRobloxStats } from "../types/roblox";

export async function syncUserDiscordWidget(
	discordId: string,
	stats: NormalizedRobloxStats,
	config: EnvironmentConfig,
): Promise<void> {
	const dynamicData: DiscordWidgetPayload["data"]["dynamic"] = [
		{ type: 1, name: "username", value: `@${stats.username}` },
		{ type: 1, name: "display_name", value: stats.displayName },
		{ type: 3, name: "user_avatar", value: { url: stats.avatarUrl } },

		{ type: 1, name: "user_bio", value: stats.user_bio },

		{ type: 1, name: "user_friends", value: String(stats.user_friends) },
		{ type: 1, name: "user_followers", value: String(stats.user_followers) },
		{ type: 1, name: "user_following", value: String(stats.user_following) },

		{ type: 1, name: "user_status", value: stats.user_status },
		{ type: 1, name: "user_join_date", value: stats.user_join_date },
		{ type: 1, name: "user_presence", value: stats.user_presence },
	];

	const payload: DiscordWidgetPayload = {
		username: stats.username,
		data: {
			dynamic: dynamicData,
		},
	};

	console.log(
		`[INFO] [${new Date().toISOString()}] Updating Discord widget for ${discordId}`,
	);

	console.table({
		username: stats.username,
		display_name: stats.displayName,
		avatar: stats.avatarUrl,
		bio: stats.user_bio,
		friends: stats.user_friends,
		followers: stats.user_followers,
		following: stats.user_following,
		status: stats.user_status,
		join_date: stats.user_join_date,
		presence: stats.user_presence,
	});

	const url = `https://discord.com/api/v9/applications/${config.discordAppId}/users/${discordId}/identities/0/profile`;

	try {
		const response = await axios.patch(url, payload, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bot ${config.discordToken}`,
				"User-Agent":
					"DiscordBot (https://github.com/discord/discord-api-docs, 1.0.0)",
			},
		});

		if (![200, 201, 204].includes(response.status)) {
			throw new Error(JSON.stringify(response.data));
		}

		console.log(
			`[INFO] [${new Date().toISOString()}] Discord widget updated successfully for ${discordId}`,
		);
	} catch (error) {
		const details = axios.isAxiosError(error)
			? JSON.stringify(error.response?.data)
			: String(error);

		throw new Error(`DiscordWidgetMutationException: ${details}`);
	}
}
