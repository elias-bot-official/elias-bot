declare global {
	namespace NodeJS {
		interface ProcessEnv {
			token: string;
			db: string;
			id: string;
			WEATHER_API_KEY: string
			NODE_ENV: string;
		}
	}
}

export {};