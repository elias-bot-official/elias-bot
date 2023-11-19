export interface DiscordEvent {

   once?: boolean;
   execute(...params: any): void;

}