declare global {
	namespace NodeJS {
		interface ProcessEnv {
			token: string;
			db: string;
			id: string;
			NODE_ENV: string;
		}
	}
}

export {};