/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
export interface Listener {
	once?: boolean;
	execute(...params: any): Promise<void>;
}