import { Client, Message } from "discord.js";
import { Service } from "typedi";
import { v4 } from "uuid";

@Service()
export class DiscordBot {
  listeners = [];
  private client: Client;

  public initDiscordBot(client) {
    /* Set client */
    this.client = client;

    /* Login */
    this.login();

    /* Register ready */
    this.onReady();
  }

  private login(): void {
    this.client
      .login(process.env.BOT_TOKEN)
      .then((response) => {
        console.log(`Bot login: ${response}`);
      })
      .catch(console.error);
  }

  private onReady(): void {
    this.client.once("ready", () => {
      console.log("Bot ready!");
    });
  }

  /**
   * @param callback: (message: Message) => void
   * @returns () => void
   * @description add messageHandler for client
   */
  public onMessageHandler(
    callback: (message: Message) => void | Promise<void>
  ): () => void {
    /* Assign event */
    this.client.on("message", callback);

    /* Get UUID */
    const uuid = v4();

    /* Register into array */
    this.listeners[uuid] = () => {
      this.client.off("message", callback);
    };

    return () => this.listeners[uuid]();
  }
}
