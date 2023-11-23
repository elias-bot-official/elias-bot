<div align="center">
   <img src="https://cdn.discordapp.com/attachments/971206934826991657/1177319240773148723/elias_bot_banner.png?ex=657212fc&is=655f9dfc&hm=c6456737436b7747ef0d75408ac3c524c82c20c9d85465eb3f2be532c2ebb16d&"/>
</div>

Elias bot is a discord bot made for the purpose of being robust, easy-to-use, and fun! It features moderation commands, minigames, and a currency system. Other features include a joke command, and a would you rather command.
## Installation

Run the following command to clone the repository.

```shell
git clone https://github.com/eliasciur/elias-bot
```

Then install the needed dependencies.

```shell
npm install
```
## Environment Variables

To use this bot you must first define some environment variables. First create a `.env` file and set the following environment variables.

|Variable| Description                                                     |
|:-------| :---------------------------------------------------------------|
|`token` | Your discord bot's token.                                       |
|`guild` | The id of the server you want the bot to post guild commands to.|
|`db`    | The MongoDB connection string for your database.                |

## Run Locally

To run the bot locally use the following `npm` command.

```
npm run dev
```