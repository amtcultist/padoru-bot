const emoteRegex = /<a:.+?:\d+>|<:.+?:\d+>/g;

/**
 * @param message string
 * @returns boolean
 * @description return whether string isContainingDiscordEmote(s)
 */
export function isContainingDiscordEmote(message: string): boolean {
  return !!message.match(emoteRegex);
}

/**
 * @param message string
 * @returns RegExpMatchArray
 * @description get all discord emote from string
 */
export function getAllEmoteFromString(message: string): RegExpMatchArray {
  return message.match(emoteRegex);
}
