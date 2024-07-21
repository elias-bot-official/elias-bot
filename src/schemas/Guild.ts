import mongoose, { Document } from 'mongoose';

export interface Warn {
	user_id: string;
	reason?: string;
}

const GuildSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			required: true,
		},
		warns: [Object],
		xp: {
			type: Map,
			of: Number,
			default: new Map()
		},
		plugins: {
			type: Map,
			of: Boolean,
			default: new Map()
		},
		settings: {
			type: Map,
			of: Object,
			default: new Map()
		}
	},
);

export const Guild = mongoose.model('Guild', GuildSchema);

export type Guild = Document<string, object, {
	_id: string;
	xp: Map<string, number>;
	warns: Warn[];
	plugins: Map<string, boolean>;
	settings: Map<string, object>;
}> & {
	xp: Map<string, number>;
	_id: string;
	warns: Warn[];
	plugins: Map<string, boolean>;
	settings: Map<string, object>;
};

export function getLevel(xp: number) {
	for (let i = 0;; i++) {
		if (xp < getXP(i + 1)) return i;
	}
}

export function getXP(level: number) {
	if (level == 0) return 0;
	return level * 100 + getXP(level - 1);
}