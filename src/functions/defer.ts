import { BaseInteraction, InteractionResponse, Message } from 'discord.js';

export interface DeferProps {
  ephemeral?: boolean;
  buttonReply?: boolean;
  selectMenuReply?: boolean;
}

/**
 * An adaptable version of interaction.deferReply() to defer any interaction.
 * @param interaction The interaction to defer.
 * @param props The properties to defer the interaction with.
 * @param props.ephemeral Whether the interaction should be ephemeral.
 * @param props.buttonReply Whether the interaction is a button reply.
 * @param props.selectMenuReply Whether the interaction is a select menu reply.
 * @returns The deferred interaction.
 */
export default async (
  interaction: BaseInteraction,
  props?: DeferProps
): Promise<Message | InteractionResponse | undefined> => {
  const newProps = {
    ...props,
    fetchReply: true,
    ephemeral: props?.ephemeral ?? false,
  };

  if (interaction.isButton())
    return props?.buttonReply
      ? interaction.deferReply(newProps)
      : interaction.deferUpdate(newProps);

  if (
    interaction.isStringSelectMenu() ||
    interaction.isChannelSelectMenu() ||
    interaction.isRoleSelectMenu()
  )
    return props?.selectMenuReply
      ? interaction.deferReply(newProps)
      : interaction.deferUpdate(newProps);

  if (interaction.isChatInputCommand()) return interaction.deferReply(newProps);

  if (interaction.isModalSubmit()) return interaction.deferUpdate(newProps);

  return undefined;
};
