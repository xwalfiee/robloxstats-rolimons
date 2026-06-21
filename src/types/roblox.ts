export interface RobloxUserResponse {
	readonly id: number;
	readonly name: string;
	readonly displayName: string;
	readonly hasVerifiedBadge: boolean;
}

export interface RobloxPresenceResponse {
	readonly userPresenceType: number;
	readonly lastLocation: string;
	readonly lastOnline: string;
}

export interface NormalizedRobloxStats {
	readonly username: string;
	readonly displayName: string;
	readonly avatarUrl: string;

	readonly user_bio: string;

	readonly user_friends: number;
	readonly user_followers: number;
	readonly user_following: number;

	readonly user_status: "In Game" | "Online" | "Offline" | "In Studio";
	readonly user_join_date: string;
	readonly rolimons_rap: number;

	readonly hasVerifiedBadge: boolean;
	readonly badgeIconUrl: string;
}
