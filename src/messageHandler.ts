import { Message } from "discord.js";
import Container, { Service } from "typedi";
import { getAllEmoteFromString, isContainingDiscordEmote } from "./utils";
import { WebhookHandler } from "./utils/webhook";

const prefixs = ["||mongmeo||", "||monihorny||"];

@Service()
export class MessageHandler {
  public async sendPadoru(message: Message): Promise<void> {
    /* Required to DI here */
    const webhookHandler = Container.get(WebhookHandler);

    /* Sanitizing combination */
    if (!message) return;
    if (!message.content) return;

    /* Check for bot */
    if (message.author.bot) return;

    let msg = message.content;

    /* Not containing emote -> skip */
    if (!isContainingDiscordEmote(msg)) return;

    /* Check for prefix message: legal message to send emoji */
    for (const prefix of prefixs) {
      if (message.content.startsWith(prefix)) {
        msg = message.content.substr(prefix.length, message.content.length);
        await webhookHandler.sendMessageWebhook(message, msg);
        return;
      }
    }

    /* Get all emote */
    const args = getAllEmoteFromString(msg);

    /* Process */
    while (args.length > 0) {
      /* Get and remove */
      const emoji = args.shift();

      /* Check if it is a padoru version */
      const emojiName = emoji.split(":")[1];
      if (
        !(
          emojiName.endsWith("oru") ||
          emojiName.toLowerCase().includes("padoru")
        )
      ) {
        /* Split message to change that emoji to OUR emoji */
        const partOne = msg.substr(0, msg.indexOf(emoji) - 1);
        const partTwo = msg.substr(msg.indexOf(emoji) + emoji.length, msg.length);
        msg = `${partOne}${process.env.EMOJI}${partTwo}`;
      }
    }

    /* Send message with a webhook */
    await webhookHandler.sendMessageWebhook(message, msg);
  }
}
