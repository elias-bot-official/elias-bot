<div align="center">
  <img src="https://i.imgur.com/xrLW6HE.png"/>
</div>

Elias bot is a discord but made to be robust and easy-to-use. Here are a few of elias bot's plugins.

###  Economy

Elias bot comes with a full-fledged economy system! Compete with your friends to see who can make the most money. You can work, beg, dig, search, gamble, rob, and so much more. Ounce you have earned enough money head to the shop to buy some items.

### Moderation

With this elias bot plugin you can easily moderate members, channels, and messages in your server. Easily moderate members in your server with the help of our warn system. The Moderation plugin also allows you to lock and unlock channels, as well as purge messages, and so much more.

## Installation

Run the following command to clone the repository.

```shell
git clone https://github.com/exceptionee/elias-bot
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
|`db`    | The MongoDB connection string for your database.                |

## Run Locally

To run the bot locally use the following command.

```
npm run dev
```