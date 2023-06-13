import {
  APIActionRowComponent,
  APIMessageActionRowComponent,
  ActionRowBuilder,
  AttachmentBuilder,
  BaseInteraction,
  EmbedBuilder,
  InteractionResponse,
  Message,
} from 'discord.js';

export interface RespondProps {
  content?: string;
  embeds?: EmbedBuilder[];
  components?: ActionRowBuilder[];
  files?: AttachmentBuilder[];
  ephemeral?: boolean;
  messageUpdate?: boolean;
  buttonUpdate?: boolean;
  selectMenuUpdate?: boolean;
  modalUpdate?: boolean;
  deleteAfter?: number;
}

export type RespondType = (
  interaction: BaseInteraction | Message,
  props: RespondProps
) => Promise<Message | InteractionResponse | undefined>;

/**
 * An adaptable version of interaction.reply() to respond to any interaction.
 * @param interaction The interaction to respond to.
 * @param props The properties to respond to the interaction with.
 * @returns The responded interaction.
 */
export default async (
  interaction: BaseInteraction | Message,
  props: RespondProps
): Promise<Message | InteractionResponse | undefined> => {
  const newProps = {
    content: props.content ?? '',
    embeds: props.embeds ?? [],
    components:
      (props.components as unknown as
        | APIActionRowComponent<APIMessageActionRowComponent>[]
        | undefined) ?? [],
    files: props.files ?? [],
    ephemeral: props.ephemeral ?? false,
  };

  // Message edit
  if (interaction instanceof Message && props.messageUpdate)
    return interaction.edit({ ...newProps });

  // Message reply
  if (interaction instanceof Message)
    return interaction.reply({
      ...newProps,
      allowedMentions: { users: [], roles: [] },
    });

  // Button or select menu update
  if (
    (props.buttonUpdate && interaction.isButton()) ||
    (props.selectMenuUpdate &&
      (interaction.isStringSelectMenu() ||
        interaction.isChannelSelectMenu() ||
        interaction.isRoleSelectMenu()))
  )
    return interaction.update({
      ...newProps,
      fetchReply: true,
    });

  // Modal update
  if (props.modalUpdate && interaction.isModalSubmit())
    return interaction.editReply(newProps);

  // Slash command, button, context command, modal, or select menu reply
  if (
    interaction.isChatInputCommand() ||
    interaction.isButton() ||
    interaction.isContextMenuCommand() ||
    interaction.isModalSubmit() ||
    interaction.isStringSelectMenu() ||
    interaction.isChannelSelectMenu() ||
    interaction.isRoleSelectMenu()
  )
    return interaction.reply({
      ...newProps,
      fetchReply: true,
    });

  return undefined;
};
