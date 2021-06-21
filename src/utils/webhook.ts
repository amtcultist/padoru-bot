import { Message, NewsChannel, TextChannel, Webhook } from "discord.js";
import { Service } from "typedi";

@Service()
export class WebhookHandler {
  /**
   * @param channel: TextChannel | NewsChannel
   * @returns Promise<Webhook>
   * @description Create a new webhook
   */
  private async createWebhookByChannel(
    channel: TextChannel | NewsChannel
  ): Promise<void | Webhook> {
    channel.createWebhook("DegeneratoruWebhook", {}).catch(console.error);
  }

  /**
   * @params message: Message
   * @params msg: string
   * @return void
   * @description send a message with provided webhook
   */
  public async sendMessageWebhook(message: Message, msg: string) {
    /* Polymorphing */
    const channel: TextChannel | NewsChannel = message.channel as
      | TextChannel
      | NewsChannel;

    /* Sanitizing */
    if (!channel) return;

    /* Get webhooks */
    const webhooks = await channel.fetchWebhooks();

    /* If no webhooks existed -> create one */
    if (!webhooks.first()) await this.createWebhookByChannel(channel);

    /* Send the fake message */
    await webhooks
      .first()
      .send(msg, {
        username: message.author.username,
        avatarURL: message.author.avatarURL(),
      })
      .catch(console.error);

    /* Delete old message */
    await message.delete();
  }
}
