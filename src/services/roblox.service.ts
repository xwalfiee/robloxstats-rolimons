import axios from "axios";
import type { EnvironmentConfig } from "../config";
import type { NormalizedRobloxStats } from "../types/roblox";

const USERS_BASE_URL = "https://users.roblox.com/v1";
const THUMB_BASE_URL = "https://thumbnails.roblox.com/v1";
const PRESENCE_BASE_URL = "https://presence.roblox.com/v1";
const FRIENDS_BASE_URL = "https://friends.roblox.com/v1";
const BADGE_BASE_URL =
	"https://raw.githubusercontent.com/xwalfiee/robloxstats-rolimons/main/assets/badges";
const ROLIMONS_BASE_URL = "https://api.rolimons.com/players/v1/playerinfo";

/**
 * Fetches Roblox profile + presence + social stats.
 */
export async function fetchProfileStatistics(
	config: EnvironmentConfig,
): Promise<NormalizedRobloxStats> {
	try {
		const userId = config.robloxUserId;

		// shared client
		const roblox = axios.create({
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		// user info
		const userRes = await roblox.get(`${USERS_BASE_URL}/users/${userId}`);

		const user = userRes.data;

		// avatar
		const avatarRes = await roblox.get(`${THUMB_BASE_URL}/users/avatar`, {
			params: {
				userIds: userId,
				size: "720x720",
				format: "Png",
				isCircular: false,
			},
		});

		const avatarUrl = avatarRes.data.data?.[0]?.imageUrl ?? "";

		// friends count
		const friendsRes = await roblox.get(
			`${FRIENDS_BASE_URL}/users/${userId}/friends/count`,
		);

		// followers
		const followersRes = await roblox.get(
			`${FRIENDS_BASE_URL}/users/${userId}/followers/count`,
		);

		// following
		const followingRes = await roblox.get(
			`${FRIENDS_BASE_URL}/users/${userId}/followings/count`,
		);

		// presence
		const presenceRes = await roblox.post(
			`${PRESENCE_BASE_URL}/presence/users`,
			{
				userIds: [userId],
			},
		);

		const presence = presenceRes.data.userPresences?.[0];

		let rolimonsRAP = 0;
		try {
			const rolimonsRes = await axios.get(`${ROLIMONS_BASE_URL}/${userId}`);
			rolimonsRAP = rolimonsRes.data?.rap ?? 0;
		} catch {
			rolimonsRAP = 0;
		}

		return {
			username: user.name,
			displayName: user.displayName,
			avatarUrl,

			user_bio: user.description ?? "No bio",

			user_friends: friendsRes.data.count ?? 0,
			user_followers: followersRes.data.count ?? 0,
			user_following: followingRes.data.count ?? 0,

			user_status:
				presence?.userPresenceType === 2
					? "In Game"
					: presence?.userPresenceType === 1
						? "Online"
						: "Offline",

			user_join_date: new Date(user.created).toLocaleDateString("en-GB", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			}),

			rolimons_rap: rolimonsRAP,

			hasVerifiedBadge: user.hasVerifiedBadge ?? false,
			badgeIconUrl: user.hasVerifiedBadge
				? `${BADGE_BASE_URL}/verified_badge.png`
				: `${BADGE_BASE_URL}/roblox_icon.png`,
		};
	} catch (error) {
		const details =
			axios.isAxiosError(error) && error.response?.data
				? JSON.stringify(error.response.data)
				: error instanceof Error
					? error.message
					: String(error);

		throw new Error(`RobloxDataRetrievalException: ${details}`);
	}
}
