import mongoose, { Document } from 'mongoose';

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
export type User = Document<string, object, {
	_id: string;
	balance: number;
	cooldowns: Map<string, number>;
	inventory: Map<string, number>;
	settings: Map<string, unknown>;
}> & {
	_id: string;
	balance: number;
	cooldowns: Map<string, number>;
	inventory: Map<string, number>;
	settings: Map<string, unknown>;
};

export function transfer(giver: User, receiver: User, amount: number) {
	giver.balance -= amount;
	receiver.balance += amount;

	return amount;
}