/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
export interface DiscordEvent {
	once?: boolean;
	execute(...params: any): void;
}