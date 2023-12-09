import mongoose from 'mongoose';

export interface Warn {
	user_id: string;
	reason?: string;
}

export interface Level {
	level: number,
	xp: number
}

const GuildSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			required: true,
		},
		warns: {
			type: Array<Warn>,
			default: [],
		},
		xp: {
			type: Map<string, number>,
			default: new Map()
		},
		plugins: {
			type: Map<string, boolean>,
			default: new Map()
		}
	}
);

export const Guild = mongoose.model('Guild', GuildSchema);

export function getLevel(xp: number) {
	for (let i = 0;; i++) {
		if (xp < getXP(i + 1)) return i;
	}
}

export function getXP(level: number) {
	if (level == 0) return 0;
	return level * 100 + getXP(level - 1);
}