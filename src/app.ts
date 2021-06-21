import { Client } from "discord.js";
import { config } from "dotenv";
import "reflect-metadata";
import Container from "typedi";
import { MessageHandler } from "./messageHandler";
import { DiscordBot } from "./utils/client";

/* Setup dotenv */
config();
/* DI the bot */
const bot = Container.get(DiscordBot);

/* DI the handler */
const handler = Container.get(MessageHandler);

/* DI the client */
const client = new Client();

/* Init the bot with the client */
bot.initDiscordBot(client);

/* Register handler into bot */
bot.onMessageHandler(handler.sendPadoru);
