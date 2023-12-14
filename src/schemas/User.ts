import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			required: true,
		},
		balance: {
			type: Number,
			default: 0,
		},
		cooldowns: {
			type: Map,
			of: Number,
			default: new Map()
		},
		inventory: {
			type: Map,
			of: Number,
			default: new Map(),
		},
		settings: {
			type: Map,
			of: Object,
			default: new Map()
		}
	}
);

export const User = mongoose.model('User', UserSchema);