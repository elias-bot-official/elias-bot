import { model, Schema } from 'mongoose';

const ReminderSchema = new Schema({
	_id: String,
	expiration: Number
});

const UserSchema = new Schema({
	_id: {
		type: String,
		required: true
	},
	afk_status: String,
	balance: {
		type: Number,
		default: 0
	},
	cooldowns: {
		type: Map,
		of: Number,
		default: new Map()
	},
	inventory: {
		type: Map,
		of: Number,
		default: new Map()
	},
	reminders: [ReminderSchema],
	settings: {
		type: Map,
		of: Object,
		default: new Map()
	}
}, { versionKey: false });

export const UserModel = model<UserDocument>('User', UserSchema);

export interface UserDocument {
	_id: string;
	afk_status: string;
	balance: number;
	cooldowns: Map<string, number>;
	inventory: Map<string, number>;
	reminders: { _id: string, expiration: number }[];
	settings: Map<string, unknown>;
}

export function transfer(giver: UserDocument, receiver: UserDocument, amount: number) {
	giver.balance -= amount;
	receiver.balance += amount;

	return amount;
}